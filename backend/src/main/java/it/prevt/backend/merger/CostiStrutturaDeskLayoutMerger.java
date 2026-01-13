package it.prevt.backend.merger;

import it.prevt.backend.bean.CostiStrutturaDeskLayoutBean;
import it.prevt.backend.entity.CostiStrutturaDeskLayout;
import org.springframework.stereotype.Component;

@Component
public class CostiStrutturaDeskLayoutMerger extends
    AbstractMerger<CostiStrutturaDeskLayoutBean, CostiStrutturaDeskLayout> {

  @Override
  protected void doMerge(CostiStrutturaDeskLayoutBean bean, CostiStrutturaDeskLayout entity) {
    entity.setLayoutDesk(bean.getLayoutDesk());
    entity.setCostoUnitario(bean.getCostoUnitario());
    entity.setAttivo(bean.isAttivo());
  }

}
