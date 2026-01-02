package it.prevt.backend.service.rest;

import it.prevt.backend.bean.UserBean;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(RestServicePath.PROFILE)
@PreAuthorize("isAuthenticated()")
public interface RestServiceProfile {

  @GetMapping("/getProfile")
  UserBean getProfile(Authentication auth);

  @PostMapping("/saveProfile")
  UserBean saveProfile(@RequestBody UserBean dto);

  @PostMapping("/saveAvatar")
  void saveAvatar(@RequestParam("file") MultipartFile file, Authentication auth);

  @GetMapping("/getAvatar")
  ResponseEntity<Resource> getAvatar(Authentication auth);
}
