package it.prevt.backend.merger;

import it.prevt.backend.bean.ListinoAccessoriDeskBean;
import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.entity.ListinoAccessoriDesk;
import it.prevt.backend.entity.ListinoAccessoriStand;
import org.springframework.stereotype.Component;

@Component
public class ListinoAccessoriDeskMerger
    extends AbstractMerger<ListinoAccessoriDeskBean, ListinoAccessoriDesk> {

  @Override
  protected void doMerge(ListinoAccessoriDeskBean bean, ListinoAccessoriDesk entity) {
    entity.setNome(bean.getNome());
    entity.setCostoUnitario(bean.getCostoUnitario());
  }

}
