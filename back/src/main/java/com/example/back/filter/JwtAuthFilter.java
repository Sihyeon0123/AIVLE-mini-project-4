package com.example.back.filter;

import com.example.back.jwt.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.filter.OncePerRequestFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    @SuppressWarnings("null")
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
                
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().write("{\"status\":\"error\",\"message\":\"JWT 토큰이 없습니다.\"}");
            return;
        }

        String token = authHeader.substring(7);

        try {
            jwtUtil.validateToken(token); // 토큰 유효성 검사

            String userId = jwtUtil.getUserId(token);
            log.info("[JwtAuthFilter] 추출된 userId={}", userId);

            request.setAttribute("userId", userId);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json; charset=UTF-8");
            response.getWriter().write("{\"status\":\"error\",\"message\":\"유효하지 않은 토큰입니다.\"}");
            return;
        }

        log.info("필터에서 JWT검사 완료");
        // 정상 요청이면 다음 필터/컨트롤러로 진행  
        filterChain.doFilter(request, response);
    }
}
