package it.prevt.backend.manager;

public interface ResetPasswordManager {

  void createResetToken(String email);

  void confirmReset(String tokenValue, String newPassword);

}
