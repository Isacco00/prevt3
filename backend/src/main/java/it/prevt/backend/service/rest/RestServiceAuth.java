package it.prevt.backend.service.rest;

import it.prevt.backend.bean.UserBean;
import it.prevt.backend.request.bean.LoginRequestBean;
import it.prevt.backend.request.bean.ResetPasswordConfirmRequestBean;
import it.prevt.backend.request.bean.ResetPasswordRequestBean;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(RestServicePath.AUTH)
public interface RestServiceAuth {
  @PostMapping("/login")
  UserBean login(@RequestBody LoginRequestBean req, HttpServletResponse response);

  @PostMapping("/logout")
  void logout(HttpServletResponse response);

  @PostMapping("/resetPassword")
  void resetPassword(@RequestBody ResetPasswordRequestBean request);

  @PostMapping("/resetPasswordConfirm")
  void confirmResetPassword(@RequestBody ResetPasswordConfirmRequestBean request);

}
