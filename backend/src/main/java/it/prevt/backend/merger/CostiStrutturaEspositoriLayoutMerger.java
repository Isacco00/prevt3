package it.prevt.backend.merger;

import it.prevt.backend.bean.CostiStrutturaEspositoriLayoutBean;
import it.prevt.backend.bean.ListinoAccessoriEspositoriBean;
import it.prevt.backend.entity.CostiStrutturaDeskLayout;
import it.prevt.backend.entity.CostiStrutturaEspositoriLayout;
import it.prevt.backend.entity.ListinoAccessoriEspositori;
import org.springframework.stereotype.Component;

@Component
public class CostiStrutturaEspositoriLayoutMerger extends
    AbstractMerger<CostiStrutturaEspositoriLayoutBean, CostiStrutturaEspositoriLayout> {

  @Override
  protected void doMerge(CostiStrutturaEspositoriLayoutBean bean,
      CostiStrutturaEspositoriLayout entity) {
    entity.setLayoutEspositore(bean.getLayoutEspositore());
    entity.setCostoUnitario(bean.getCostoUnitario());
    entity.setAttivo(bean.isAttivo());
  }

}
