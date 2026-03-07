package it.prevt.backend.merger;

import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.entity.ListinoAccessoriStand;
import org.springframework.stereotype.Component;

@Component
public class ListinoAccessoriStandMerger
    extends AbstractMerger<ListinoAccessoriStandBean, ListinoAccessoriStand> {

  @Override
  protected void doMerge(ListinoAccessoriStandBean bean, ListinoAccessoriStand entity) {
    entity.setNome(bean.getNome());
    entity.setCostoUnitario(bean.getCostoUnitario());
  }

}
