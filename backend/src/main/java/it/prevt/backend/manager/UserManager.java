package it.prevt.backend.manager;

import it.prevt.backend.bean.UserBean;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

public interface UserManager {

  UserBean getProfile(Authentication auth);

  UserBean saveProfile(UserBean bean);

  void saveAvatar(MultipartFile file, Authentication auth);

  ResponseEntity<Resource> getAvatar(Authentication auth);
}
