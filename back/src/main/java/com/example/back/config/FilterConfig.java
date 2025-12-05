package com.example.back.config;

import com.example.back.filter.JwtAuthFilter;
import com.example.back.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class FilterConfig {

    private final JwtUtil jwtUtil;

    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtAuthFilter() {
        FilterRegistrationBean<JwtAuthFilter> registrationBean =
                new FilterRegistrationBean<>();

        registrationBean.setFilter(new JwtAuthFilter(jwtUtil));

        registrationBean.setOrder(1);

        // JWT유효 검사를 진행할 URL
        String[] protectedUrls = {
            "/api/auth/logout",
            "/api/auth/update",
            "/api/auth/delete"
        };

        registrationBean.addUrlPatterns(protectedUrls);

        return registrationBean;
    }
}
