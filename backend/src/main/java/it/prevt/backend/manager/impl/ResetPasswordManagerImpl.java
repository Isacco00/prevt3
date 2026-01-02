package it.prevt.backend.manager.impl;

import it.prevt.backend.entity.PasswordResetTokens;
import it.prevt.backend.entity.User;
import it.prevt.backend.manager.ResetPasswordManager;
import it.prevt.backend.repository.UserRepository;
import it.prevt.backend.utility.MailService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ResetPasswordManagerImpl implements ResetPasswordManager {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final MailService mailService;

  private static final Duration TOKEN_TTL = Duration.ofMinutes(15);

  @Value("${frontend-url}")
  private String frontendUrl;

  @Override
  public void createResetToken(String email) {

    User user = userRepository.findByEmail(email);
    if (user == null) {
      throw new EntityNotFoundException("user.error.email.notfound");
    }
    PasswordResetTokens token = new PasswordResetTokens();
    token.setUser(user);
    token.setExpiresAt(Instant.now().plus(TOKEN_TTL));
    token.setUsed(false);
    userRepository.save(token);

    String link = frontendUrl + "/reset-password?token=" + token.getId();

    mailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), link);
  }

  @Override
  public void confirmReset(String tokenValue, String newPassword) {
    PasswordResetTokens token =
        userRepository.find(PasswordResetTokens.class, UUID.fromString(tokenValue));

    if (token.isUsed()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token già utilizzato");
    }

    if (token.getExpiresAt().isBefore(Instant.now())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token scaduto");
    }

    User user = token.getUser();
    user.setPasswordHash(passwordEncoder.encode(newPassword));
    userRepository.save(user);

    token.setUsed(true);
    userRepository.save(token);
  }

}
