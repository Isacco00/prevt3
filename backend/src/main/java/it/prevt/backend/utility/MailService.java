package it.prevt.backend.utility;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
public class MailService {

  private final TemplateEngine templateEngine;
  private final JavaMailSender mailSender;

  @Value("${app.mail.from}")
  private String from;

  @PostConstruct
  public void debug() {
    var impl = (org.springframework.mail.javamail.JavaMailSenderImpl) mailSender;
    System.out.println("MAIL HOST = " + impl.getHost());
    System.out.println("MAIL PORT = " + impl.getPort());
  }

  public void sendPasswordResetEmail(String email, String name, String link) {
    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

      Context context = new Context();
      context.setVariable("name", name);
      context.setVariable("link", link);

      String html = templateEngine.process("password-reset", context);

      helper.setFrom(from);
      helper.setTo(email);
      helper.setSubject("Reset della password");
      helper.setText(html, true);

      mailSender.send(message);

    } catch (MessagingException e) {
      throw new IllegalStateException("Errore invio email reset password", e);
    }
  }
}
