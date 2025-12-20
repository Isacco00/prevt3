package it.prevt.backend.restservice;

import it.prevt.backend.entity.UserEntity;
import it.prevt.backend.repository.UserRepository;
import it.prevt.backend.request.bean.LoginRequestBean;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping(RestServicePath.AUTH)
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthController(UserRepository users,
                          PasswordEncoder encoder,
                          JwtService jwt) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginRequestBean req) {
        UserEntity user = users.findByEmail(req.getEmail());

        if (user == null || !user.isActive() || !encoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }

        return Map.of("token", jwt.generateToken(user.getId()));
    }
}
