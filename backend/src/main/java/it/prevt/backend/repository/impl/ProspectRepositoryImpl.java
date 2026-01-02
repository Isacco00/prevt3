package it.prevt.backend.repository.impl;

import it.prevt.backend.entity.Prospect;
import it.prevt.backend.entity.User;
import it.prevt.backend.repository.ProspectRepository;
import it.prevt.backend.repository.UserRepository;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ProspectRepositoryImpl extends AbstractRepositoryImpl implements ProspectRepository {

  @Override
  public List<Prospect> getProspectList() {
    Class<Prospect> clazz = Prospect.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom =
        new StringBuilder(" SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    strQueryWhere.append("ORDER BY u.createdAt DESC ");
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<Prospect> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }
}
