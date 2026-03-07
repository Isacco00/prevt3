package it.prevt.backend.mapper;

import it.prevt.backend.bean.ListinoAccessoriDeskBean;
import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.entity.ListinoAccessoriDesk;
import it.prevt.backend.entity.ListinoAccessoriStand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListinoAccessoriStandMapper
    extends AbstractMapper<ListinoAccessoriStand, ListinoAccessoriStandBean> {

  protected ListinoAccessoriStandBean doMapping(ListinoAccessoriStand entity) {
    return doMapping(new ListinoAccessoriStandBean(), entity);
  }

  protected ListinoAccessoriStandBean doMapping(ListinoAccessoriStandBean bean,
      ListinoAccessoriStand entity) {
    bean.setId(entity.getId());
    bean.setNome(entity.getNome());
    bean.setCostoUnitario(entity.getCostoUnitario());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    bean.setRicaricoPercentuale(entity.getRicaricoPercentuale());
    bean.setPrezzo(entity.getPrezzo());
    bean.setDescrizione(entity.getDescrizione());
    return bean;
  }
}
