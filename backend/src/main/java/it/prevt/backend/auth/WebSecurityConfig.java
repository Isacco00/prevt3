package it.prevt.backend.auth;

import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final JwtAuthenticationFilter jwtAuthenticationFilter;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
        // ❌ niente CSRF per API
        .csrf(AbstractHttpConfigurer::disable)

        // ✅ CORS (necessario anche in DEV con proxy)
        .cors(Customizer.withDefaults())

        // ✅ autorizzazioni
        .authorizeHttpRequests(auth -> auth
            // preflight
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            // login / public
            .requestMatchers("/api/auth/**").permitAll().requestMatchers("/actuator/**").permitAll()

            // tutto il resto autenticato
            .anyRequest().authenticated())

        // ✅ JWT prima di UsernamePasswordAuthenticationFilter
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)

        // ❌ disabilitiamo tutto il resto
        .httpBasic(AbstractHttpConfigurer::disable).formLogin(AbstractHttpConfigurer::disable);

    return http.build();
  }

  // ✅ CORS CONFIG
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();

    config.setAllowedOriginPatterns(List.of("*"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
    config.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);

    return source;
  }
}
