package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.UserBean;
import it.prevt.backend.entity.User;
import it.prevt.backend.manager.UserManager;
import it.prevt.backend.mapper.UserMapper;
import it.prevt.backend.merger.UserMerger;
import it.prevt.backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserManagerImpl implements UserManager {

  private static final Path ROOT = Paths.get("/data/avatars");
  private final UserRepository repository;
  private final UserMapper mapper;
  private final UserMerger merger;

  @Override
  public UserBean getProfile(Authentication auth) {
    User user = repository.find(User.class, UUID.fromString(auth.getName()));
    if (user == null) {
      throw new UsernameNotFoundException("error.user.notfound");
    }
    return mapper.mapEntityToBean(user);
  }

  @Override
  public UserBean saveProfile(UserBean bean) {
    User entity;
    if (bean.getId() == null) {
      entity = merger.mapNew(bean, User.class);
    } else {
      entity = repository.find(User.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      merger.merge(bean, entity);
    }
    entity.setFirstName(bean.getFirstName());
    this.repository.save(entity);
    return mapper.mapEntityToBean(entity);
  }

  @Override
  public void saveAvatar(MultipartFile file, Authentication auth) {
    UUID userId = UUID.fromString(auth.getName());

    User user = repository.find(User.class, userId);
    if (user == null) {
      throw new UsernameNotFoundException("error.user.notfound");
    }

    try {
      Path userDir = ROOT.resolve(userId.toString());
      Files.createDirectories(userDir);
      String avatarKey = "avatar.png";
      Path avatarPath = userDir.resolve(avatarKey);
      Files.write(avatarPath, file.getBytes(), StandardOpenOption.CREATE,
          StandardOpenOption.TRUNCATE_EXISTING);
      user.setAvatarUrl(userId + "/" + avatarKey);
      repository.save(user);
    } catch (IOException e) {
      throw new RuntimeException("Avatar upload failed", e);
    }
  }

  @Override
  public ResponseEntity<Resource> getAvatar(Authentication auth) {
    UUID userId = UUID.fromString(auth.getName());
    Path path = ROOT.resolve(userId.toString()).resolve("avatar.png");

    if (!Files.exists(path)) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok()
        .contentType(MediaType.IMAGE_PNG)
        .body(new FileSystemResource(path));
  }

}

