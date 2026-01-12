package it.prevt.backend.repository.impl;

import it.prevt.backend.entity.*;
import it.prevt.backend.repository.FornituraRepository;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Repository
public class FornituraRepositoryImpl extends AbstractRepositoryImpl implements FornituraRepository {

  @Override
  public List<CondizioniStandardFornitura> getCondizioniStandardFornitura(
      ListinoAccessoriRequestBean searchRequest) {
    Class<CondizioniStandardFornitura> clazz = CondizioniStandardFornitura.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom =
        new StringBuilder(" SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null && searchRequest.getSortFields() != null && !searchRequest.getSortFields()
        .isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<CondizioniStandardFornitura> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<CondizioniFornituraPreventivi> getCondizioniFornituraPreventivi(
      ListinoAccessoriRequestBean searchRequest) {
    Class<CondizioniFornituraPreventivi> clazz = CondizioniFornituraPreventivi.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom =
        new StringBuilder(" SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getPreventivoId() != null) {
        strQueryWhere.append(" AND u.preventivo.id = :preventivoId ");
        parameters.put("preventivoId", UUID.fromString(searchRequest.getPreventivoId()));
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null && !searchRequest.getSortFields()
        .isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<CondizioniFornituraPreventivi> query =
        entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }
}
