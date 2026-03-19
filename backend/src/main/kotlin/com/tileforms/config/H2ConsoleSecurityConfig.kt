package com.tileforms.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@Profile("local")
class H2ConsoleSecurityConfig {
    @Bean
    @Order(1)
    fun h2ConsoleSecurityFilterChain(http: HttpSecurity): SecurityFilterChain =
        http
            .securityMatcher("/h2-console/**")
            .authorizeHttpRequests { it.anyRequest().permitAll() }
            // CSRF must be disabled for the H2 console (its own forms are not CSRF-protected).
            // This filter chain is only active for the local profile and never applies in production.
            .csrf { it.disable() }
            .headers { it.frameOptions { fo -> fo.sameOrigin() } }
            .build()
}
