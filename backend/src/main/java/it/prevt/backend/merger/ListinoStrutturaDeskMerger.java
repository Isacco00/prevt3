package it.prevt.backend.merger;

import it.prevt.backend.bean.ListinoStrutturaDeskBean;
import it.prevt.backend.entity.ListinoStrutturaDesk;
import org.springframework.stereotype.Component;

@Component
public class ListinoStrutturaDeskMerger extends
    AbstractMerger<ListinoStrutturaDeskBean, ListinoStrutturaDesk> {

  @Override
  protected void doMerge(ListinoStrutturaDeskBean bean, ListinoStrutturaDesk entity) {
    entity.setLayoutDesk(bean.getLayoutDesk());
    if (bean.getSuperficie() != null) {
      entity.setSuperficie(bean.getSuperficie());
    }
    if (bean.getNumeroPezzi() != null) {
      entity.setNumeroPezzi(bean.getNumeroPezzi());
    }
    entity.setCostoUnitario(bean.getCostoUnitario());
    entity.setRicaricoPercentuale(bean.getRicaricoPercentuale());
    entity.setPrezzo(bean.getPrezzo());
    entity.setDescrizione(bean.getDescrizione());
    entity.setAttivo(bean.isAttivo());
  }

}
