package it.prevt.backend.repository.impl;

import it.prevt.backend.entity.AltriBeniServizi;
import it.prevt.backend.entity.CostiRetroilluminazione;
import it.prevt.backend.entity.CostiStrutturaEspositoriLayout;
import it.prevt.backend.entity.CostoStrutturaDeskLayout;
import it.prevt.backend.entity.ListinoAccessoriDesk;
import it.prevt.backend.entity.ListinoAccessoriEspositori;
import it.prevt.backend.entity.ListinoAccessoriStand;
import it.prevt.backend.entity.Parametri;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.repository.ParametriRepository;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.request.bean.ParametriRequestBean;
import jakarta.persistence.TypedQuery;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Repository;

@Repository
public class ParametriRepositoryImpl extends AbstractRepositoryImpl implements
    ParametriRepository {

  @Override
  public List<Parametri> getParametriList(ParametriRequestBean searchRequest) {
    Class<Parametri> clazz = Parametri.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<Parametri> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

}
