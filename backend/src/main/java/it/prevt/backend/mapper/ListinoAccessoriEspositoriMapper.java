package it.prevt.backend.mapper;

import it.prevt.backend.bean.CostiStrutturaEspositoriLayoutBean;
import it.prevt.backend.bean.ListinoAccessoriEspositoriBean;
import it.prevt.backend.entity.CostiStrutturaEspositoriLayout;
import it.prevt.backend.entity.ListinoAccessoriEspositori;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListinoAccessoriEspositoriMapper
    extends AbstractMapper<ListinoAccessoriEspositori, ListinoAccessoriEspositoriBean> {

  protected ListinoAccessoriEspositoriBean doMapping(ListinoAccessoriEspositori entity) {
    return doMapping(new ListinoAccessoriEspositoriBean(), entity);
  }

  protected ListinoAccessoriEspositoriBean doMapping(ListinoAccessoriEspositoriBean bean,
      ListinoAccessoriEspositori entity) {
    bean.setId(entity.getId());
    bean.setNome(entity.getNome());
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
