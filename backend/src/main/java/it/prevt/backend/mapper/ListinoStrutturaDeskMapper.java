package it.prevt.backend.mapper;

import it.prevt.backend.bean.ListinoStrutturaDeskBean;
import it.prevt.backend.entity.ListinoStrutturaDesk;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListinoStrutturaDeskMapper
    extends AbstractMapper<ListinoStrutturaDesk, ListinoStrutturaDeskBean> {

  protected ListinoStrutturaDeskBean doMapping(ListinoStrutturaDesk entity) {
    return doMapping(new ListinoStrutturaDeskBean(), entity);
  }

  protected ListinoStrutturaDeskBean doMapping(ListinoStrutturaDeskBean bean,
      ListinoStrutturaDesk entity) {
    bean.setId(entity.getId());
    bean.setLayoutDesk(entity.getLayoutDesk());
    bean.setCostoUnitario(entity.getCostoUnitario());
    bean.setRicaricoPercentuale(entity.getRicaricoPercentuale());
    bean.setPrezzo(entity.getPrezzo());
    bean.setDescrizione(entity.getDescrizione());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
