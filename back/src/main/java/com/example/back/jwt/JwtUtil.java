package com.example.back.jwt;

import java.util.Date;
import java.security.Key;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
    private static final String SECRET = "SecretKey123456SecretKey123456SecretKey123456"; // 32byte 이상
    private static final Key SECRET_KEY = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Access Token: 2시간
    private static final long ACCESS_TOKEN_EXP = 1000 * 60 * 60 * 2;
    // Refresh Token: 2주
    private static final long REFRESH_TOKEN_EXP = 1000L * 60 * 60 * 24 * 14;

    // JWT 생성
    public String createAccessToken(String userId) {
        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXP))
            .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
            .compact();
    }
    
    // Refresh Token 생성
    public String createRefreshToken(String userId) {
        return Jwts.builder()
            .setSubject(userId)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXP))
            .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
            .compact();
    }

    // JWT에서 userId 추출
    public String getUserId(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(SECRET_KEY)
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    // JWT 유효성 검사
    public String validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token);

            return "VALID";

        } catch (ExpiredJwtException e) {
            throw new RuntimeException("토큰이 만료되었습니다.");

        } catch (io.jsonwebtoken.security.SecurityException e) {
            throw new RuntimeException("토큰 서명 오류입니다.");

        } catch (MalformedJwtException e) {
            throw new RuntimeException("잘못된 토큰 형식입니다.");

        } catch (Exception e) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }
    }

    // Refresh Token 검증
    public void validateRefreshToken(String refreshToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(refreshToken);

        } catch (ExpiredJwtException e) {
            // Refresh Token 만료
            throw new RuntimeException("리프레시 토큰이 만료되었습니다.");

        } catch (io.jsonwebtoken.security.SecurityException e) {
            // 서명 위조 또는 변조
            throw new RuntimeException("리프레시 토큰 서명 오류입니다.");

        } catch (MalformedJwtException e) {
            // 형식 오류
            throw new RuntimeException("잘못된 리프레시 토큰 형식입니다.");

        } catch (Exception e) {
            // 기타 모든 오류
            throw new RuntimeException("유효하지 않은 리프레시 토큰입니다.");
        }
    }

}
