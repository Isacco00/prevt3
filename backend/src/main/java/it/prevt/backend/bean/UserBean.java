package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class UserBean {
  private UUID id;
  private String email;
  private String firstName;
  private String lastName;
  private String avatarUrl;
}
