package it.prevt.backend.repository.impl;

import it.prevt.backend.entity.ListinoAccessoriEspositori;
import it.prevt.backend.entity.User;
import it.prevt.backend.repository.UserRepository;
import it.prevt.backend.request.bean.UserRequestBean;
import jakarta.persistence.TypedQuery;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;

@Repository
public class UserRepositoryImpl extends AbstractRepositoryImpl implements UserRepository {

  @Override
  public User findByEmail(String email) {
    Class<User> clazz = User.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom =
        new StringBuilder(" SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (email != null) {
      strQueryWhere.append(" AND u.email = :email ");
      parameters.put("email", email);
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<User> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultSingle(query);
  }

  @Override
  public List<User> getUserList(UserRequestBean searchRequest) {
    Class<User> clazz = User.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom =
        new StringBuilder(" SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (!searchRequest.getUserIdNot().isEmpty()) {
        createListNotWhereClause("u", "id",
            searchRequest.getUserIdNot().stream().map(UUID::fromString).toList(),
            strQueryWhere,
            parameters);
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields()
        .isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<User> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }
}
