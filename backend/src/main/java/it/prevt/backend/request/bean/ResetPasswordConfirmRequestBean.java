package it.prevt.backend.request.bean;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ResetPasswordConfirmRequestBean {

  private String token;
  private String password;

}
