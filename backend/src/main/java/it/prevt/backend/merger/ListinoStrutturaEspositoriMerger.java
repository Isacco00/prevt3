package it.prevt.backend.merger;

import it.prevt.backend.bean.ListinoStrutturaEspositoriBean;
import it.prevt.backend.entity.ListinoStrutturaEspositori;
import org.springframework.stereotype.Component;

@Component
public class ListinoStrutturaEspositoriMerger extends
    AbstractMerger<ListinoStrutturaEspositoriBean, ListinoStrutturaEspositori> {

  @Override
  protected void doMerge(ListinoStrutturaEspositoriBean bean,
      ListinoStrutturaEspositori entity) {
    entity.setLayoutEspositore(bean.getLayoutEspositore());
    entity.setCostoUnitario(bean.getCostoUnitario());
    entity.setRicaricoPercentuale(bean.getRicaricoPercentuale());
    entity.setPrezzo(bean.getPrezzo());
    entity.setDescrizione(bean.getDescrizione());
    entity.setAttivo(bean.isAttivo());
  }

}
