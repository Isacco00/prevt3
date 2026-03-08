package it.prevt.backend.mapper;

import it.prevt.backend.bean.ListinoServiziPrezzoUnitarioBean;
import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.entity.ListinoServiziPrezzoUnitario;
import it.prevt.backend.entity.ParametriACostiUnitari;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListinoServiziPrezzoUnitarioMapper
    extends AbstractMapper<ListinoServiziPrezzoUnitario, ListinoServiziPrezzoUnitarioBean> {

  protected ListinoServiziPrezzoUnitarioBean doMapping(ListinoServiziPrezzoUnitario entity) {
    return doMapping(new ListinoServiziPrezzoUnitarioBean(), entity);
  }

  protected ListinoServiziPrezzoUnitarioBean doMapping(ListinoServiziPrezzoUnitarioBean bean,
      ListinoServiziPrezzoUnitario entity) {
    bean.setId(entity.getId());
    bean.setParametro(entity.getParametro());
    bean.setUnitaMisura(entity.getUnitaMisura());
    bean.setCosto(entity.getCosto());
    bean.setRicaricoPercentuale(entity.getRicaricoPercentuale());
    bean.setDescrizione(entity.getDescrizione());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
