package it.prevt.backend.mapper;

import it.prevt.backend.bean.UserBean;
import it.prevt.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper extends AbstractMapper<User, UserBean> {

  protected UserBean doMapping(User entity) {
    return doMapping(new UserBean(), entity);
  }

  protected UserBean doMapping(UserBean bean, User entity) {
    bean.setId(entity.getId());
    bean.setFirstName(entity.getFirstName());
    bean.setLastName(entity.getLastName());
    bean.setEmail(entity.getEmail());
    bean.setAvatarUrl(entity.getAvatarUrl());
    return bean;
  }
}
