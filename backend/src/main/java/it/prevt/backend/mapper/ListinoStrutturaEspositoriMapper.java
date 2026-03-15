package it.prevt.backend.mapper;

import it.prevt.backend.bean.ListinoStrutturaEspositoriBean;
import it.prevt.backend.entity.ListinoStrutturaEspositori;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListinoStrutturaEspositoriMapper
    extends AbstractMapper<ListinoStrutturaEspositori, ListinoStrutturaEspositoriBean> {

  protected ListinoStrutturaEspositoriBean doMapping(ListinoStrutturaEspositori entity) {
    return doMapping(new ListinoStrutturaEspositoriBean(), entity);
  }

  protected ListinoStrutturaEspositoriBean doMapping(ListinoStrutturaEspositoriBean bean,
      ListinoStrutturaEspositori entity) {
    bean.setId(entity.getId());
    bean.setLayoutEspositore(entity.getLayoutEspositore());
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
