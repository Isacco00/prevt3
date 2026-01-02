package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.UserBean;
import it.prevt.backend.manager.UserManager;
import it.prevt.backend.service.rest.RestServiceProfile;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class RestServiceProfileImpl implements RestServiceProfile {

  private final UserManager manager;

  @Override
  public UserBean getProfile(Authentication auth) {
    return manager.getProfile(auth);
  }

  @Override
  public UserBean saveProfile(UserBean dto) {
    return manager.saveProfile(dto);
  }

  @Override
  public void saveAvatar(MultipartFile file, Authentication auth) {
    manager.saveAvatar(file, auth);
  }

  @Override
  public ResponseEntity<Resource> getAvatar(Authentication auth) {
    return manager.getAvatar(auth);
  }
}
