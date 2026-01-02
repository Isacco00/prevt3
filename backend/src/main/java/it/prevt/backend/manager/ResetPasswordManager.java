package it.prevt.backend.manager;

import it.prevt.backend.bean.UserBean;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

public interface ResetPasswordManager {

  void createResetToken(String email);

  void confirmReset(String tokenValue, String newPassword);

  void sendPasswordResetEmail(String mail, String isacco, String url);
}
