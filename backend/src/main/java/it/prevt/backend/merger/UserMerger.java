package it.prevt.backend.merger;

import it.prevt.backend.bean.UserBean;
import it.prevt.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMerger extends AbstractMerger<UserBean, User> {

  @Override
  protected void doMerge(UserBean bean, User entity) {
    entity.setFirstName(bean.getFirstName());
    entity.setLastName(bean.getLastName());
  }

}
