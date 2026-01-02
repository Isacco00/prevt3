package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.UserBean;
import it.prevt.backend.entity.User;
import it.prevt.backend.mapper.UserMapper;
import it.prevt.backend.repository.UserRepository;
import it.prevt.backend.request.bean.LoginRequestBean;
import it.prevt.backend.auth.JwtService;
import it.prevt.backend.service.rest.RestServiceAuth;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;


@Service
@RequiredArgsConstructor
public class RestServiceAuthImpl implements RestServiceAuth {

  private final UserRepository users;
  private final PasswordEncoder encoder;
  private final JwtService jwt;
  private final UserMapper userMapper;

  @Override
  public UserBean login(@RequestBody LoginRequestBean req, HttpServletResponse response) {
    User user = users.findByEmail(req.getEmail());

    if (user == null || !user.isActive() || !encoder.matches(req.getPassword(),
        user.getPasswordHash())) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
    }
    String token = jwt.generateToken(user.getId());
    ResponseCookie cookie =
        ResponseCookie.from("access_token", token).httpOnly(true).secure(true).sameSite("Lax")
            .path("/").maxAge(Duration.ofHours(8)).build();

    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    return userMapper.mapEntityToBean(user);
  }

  @Override
  public void logout(HttpServletResponse response) {
    ResponseCookie cookie =
        ResponseCookie.from("access_token", "").httpOnly(true).secure(true).sameSite("Lax")
            .path("/").maxAge(0).build();
    response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
  }
}
