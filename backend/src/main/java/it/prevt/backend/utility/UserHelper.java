package it.prevt.backend.utility;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserHelper {

  public String getCurrentUserId() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    assert auth != null;
    return auth.getName(); // oppure cast a UserDetails
  }

}
