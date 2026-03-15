package it.prevt.backend.repository.impl;

import it.prevt.backend.entity.*;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.request.bean.ParametriRequestBean;
import it.prevt.backend.request.bean.PreventiviRequestBean;
import jakarta.persistence.TypedQuery;
import java.util.UUID;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class PreventivoRepositoryImpl extends AbstractRepositoryImpl implements
    PreventivoRepository {

  @Override
  public List<Preventivo> getPreventiviList(PreventiviRequestBean request) {
    Class<Preventivo> clazz = Preventivo.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    if (request != null) {
      if (request.getPreventivoId() != null) {
        strQueryWhere.append(" AND u.id = :preventivoId ");
        parameters.put("preventivoId", request.getPreventivoId());
      }
      if (request.getStatiPreventivi() != null
          && !request.getStatiPreventivi().isEmpty()) {
        createListWhereClause("u", "status", request.getStatiPreventivi(),
            strQueryWhere, parameters);
      }
      if (request.getNumeroPreventivo() != null) {
        strQueryWhere.append(" AND u.numeroPreventivo = :numeroPreventivo ");
        parameters.put("numeroPreventivo", request.getNumeroPreventivo());
      }
      if (request.getStatiPreventivi() != null
          && !request.getStatiPreventivi().isEmpty()) {
        createListWhereClause("u", "status", request.getStatiPreventivi(),
            strQueryWhere, parameters);
      }
    }
    // Parameters
    strQueryWhere.append("ORDER BY u.createdAt DESC ");
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<Preventivo> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<ListinoAccessoriDesk> getListinoAccessoriDesk(
      ListinoAccessoriRequestBean searchRequest) {
    Class<ListinoAccessoriDesk> clazz = ListinoAccessoriDesk.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getAttivo() != null) {
        strQueryWhere.append(" AND u.attivo = :attivo ");
        parameters.put("attivo", searchRequest.getAttivo());
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<ListinoAccessoriDesk> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

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

  @Override
  public List<ListinoAccessoriStand> getListinoAccessoriStand(
      ListinoAccessoriRequestBean searchRequest) {
    Class<ListinoAccessoriStand> clazz = ListinoAccessoriStand.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getAttivo() != null) {
        strQueryWhere.append(" AND u.attivo = :attivo ");
        parameters.put("attivo", searchRequest.getAttivo());
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<ListinoAccessoriStand> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<ListinoStrutturaDesk> getListinoStrutturaDesk(
      ListinoAccessoriRequestBean searchRequest) {
    Class<ListinoStrutturaDesk> clazz = ListinoStrutturaDesk.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getAttivo() != null) {
        strQueryWhere.append(" AND u.attivo = :attivo ");
        parameters.put("attivo", searchRequest.getAttivo());
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<ListinoStrutturaDesk> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<ParametriACostiUnitari> getParametriACostiUnitari(
      ListinoAccessoriRequestBean searchRequest) {
    Class<ParametriACostiUnitari> clazz = ParametriACostiUnitari.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getAttivo() != null) {
        strQueryWhere.append(" AND u.attivo = :attivo ");
        parameters.put("attivo", searchRequest.getAttivo());
      }
      if (searchRequest.getParametri() != null && !searchRequest.getParametri().isEmpty()) {
        createListWhereClause("u", "parametro", searchRequest.getParametri(), strQueryWhere,
            parameters);
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<ParametriACostiUnitari> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<ListinoServiziPrezzoUnitario> getListinoServiziPrezzoUnitario(
      ListinoAccessoriRequestBean searchRequest) {
    Class<ListinoServiziPrezzoUnitario> clazz = ListinoServiziPrezzoUnitario.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getAttivo() != null) {
        strQueryWhere.append(" AND u.attivo = :attivo ");
        parameters.put("attivo", searchRequest.getAttivo());
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<ListinoServiziPrezzoUnitario> query = entityManager.createQuery(strQueryFinal,
        clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<ListinoRetroilluminazione> getListinoRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest) {
    Class<ListinoRetroilluminazione> clazz = ListinoRetroilluminazione.class;
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
    TypedQuery<ListinoRetroilluminazione> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<ListinoStrutturaEspositori> getListinoStrutturaEspositori(
      ListinoAccessoriRequestBean searchRequest) {
    Class<ListinoStrutturaEspositori> clazz = ListinoStrutturaEspositori.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getAttivo() != null) {
        strQueryWhere.append(" AND u.attivo = :attivo ");
        parameters.put("attivo", searchRequest.getAttivo());
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<ListinoStrutturaEspositori> query = entityManager.createQuery(strQueryFinal,
        clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<ListinoAccessoriEspositori> getListinoAccessoriEspositori(
      ListinoAccessoriRequestBean searchRequest) {
    Class<ListinoAccessoriEspositori> clazz = ListinoAccessoriEspositori.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getAttivo() != null) {
        strQueryWhere.append(" AND u.attivo = :attivo ");
        parameters.put("attivo", searchRequest.getAttivo());
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<ListinoAccessoriEspositori> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<AltriBeniServizi> getAltriBeniServizi(ListinoAccessoriRequestBean searchRequest) {
    Class<AltriBeniServizi> clazz = AltriBeniServizi.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getPreventivoId() != null) {
        strQueryWhere.append(" AND u.preventivo.id = :preventivoId ");
        parameters.put("preventivoId", UUID.fromString(searchRequest.getPreventivoId()));
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<AltriBeniServizi> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

  @Override
  public List<PreventivoServizi> getPreventivoServizi(ListinoAccessoriRequestBean searchRequest) {
    Class<PreventivoServizi> clazz = PreventivoServizi.class;
    Map<String, Object> parameters = new HashMap<>();

    StringBuilder strQueryFrom = new StringBuilder(
        " SELECT u FROM " + clazz.getSimpleName() + " u ");
    StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

    // Parameters
    if (searchRequest != null) {
      if (searchRequest.getPreventivoId() != null) {
        strQueryWhere.append(" AND u.preventivo.id = :preventivoId ");
        parameters.put("preventivoId", UUID.fromString(searchRequest.getPreventivoId()));
      }
    }
    if (searchRequest != null && searchRequest.getSortFields() != null
        && !searchRequest.getSortFields().isEmpty()) {
      StringBuilder strQueryOrderBy = orderBy(null, searchRequest.getSortFields(), null);
      strQueryWhere.append(strQueryOrderBy.toString());
    }
    String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
    TypedQuery<PreventivoServizi> query = entityManager.createQuery(strQueryFinal, clazz);
    parameters.forEach(query::setParameter);
    return getResultList(query);
  }

}
