package it.prevt.backend.merger;

import it.prevt.backend.bean.ListinoAccessoriDeskBean;
import it.prevt.backend.bean.ListinoAccessoriEspositoriBean;
import it.prevt.backend.entity.ListinoAccessoriDesk;
import it.prevt.backend.entity.ListinoAccessoriEspositori;
import org.springframework.stereotype.Component;

@Component
public class ListinoAccessoriEspositoriMerger
    extends AbstractMerger<ListinoAccessoriEspositoriBean, ListinoAccessoriEspositori> {

  @Override
  protected void doMerge(ListinoAccessoriEspositoriBean bean, ListinoAccessoriEspositori entity) {
    entity.setNome(bean.getNome());
    entity.setCostoUnitario(bean.getCostoUnitario());
    entity.setAttivo(bean.isAttivo());
  }

}
