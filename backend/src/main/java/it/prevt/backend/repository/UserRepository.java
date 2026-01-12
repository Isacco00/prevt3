package it.prevt.backend.repository;

import it.prevt.backend.entity.User;
import it.prevt.backend.request.bean.UserRequestBean;
import java.util.List;

public interface UserRepository extends AbstractRepository {

  User findByEmail(String email);

  List<User> getUserList(UserRequestBean request);
}
