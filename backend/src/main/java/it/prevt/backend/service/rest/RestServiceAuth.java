package it.prevt.backend.service.rest;

import it.prevt.backend.bean.UserBean;
import it.prevt.backend.request.bean.LoginRequestBean;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(RestServicePath.AUTH)
public interface RestServiceAuth {
  @PostMapping("/login")
  UserBean login(@RequestBody LoginRequestBean req, HttpServletResponse response);

  @PostMapping("/logout")
  void logout(HttpServletResponse response);

}
