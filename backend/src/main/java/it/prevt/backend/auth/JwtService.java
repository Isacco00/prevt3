package it.prevt.backend.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtService {

  @Value("${jwt.secret}")
  private String secret;

  private SecretKey key;

  @PostConstruct
  void init() {
    // ✅ HS256 → almeno 32 byte
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
  }

  public String generateToken(UUID userId) {
    return Jwts.builder().subject(userId.toString()).issuedAt(new Date())
        .expiration(Date.from(Instant.now().plus(1, ChronoUnit.DAYS)))
        .signWith(key)   // algoritmo dedotto dalla key
        .compact();
  }

  public UUID extractUserId(String token) {

    Claims claims = Jwts.parser().verifyWith(key)        // ✅ NUOVO MODO (0.13)
        .build().parseSignedClaims(token).getPayload();

    return UUID.fromString(claims.getSubject());
  }
}
