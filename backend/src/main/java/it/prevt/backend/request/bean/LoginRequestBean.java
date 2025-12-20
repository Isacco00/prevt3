package it.prevt.backend.request.bean;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequestBean {

    private String email;
    private String password;

}
