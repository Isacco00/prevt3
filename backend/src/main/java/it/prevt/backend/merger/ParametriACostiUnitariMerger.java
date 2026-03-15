package it.prevt.backend.merger;

import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.entity.Parametri;
import it.prevt.backend.entity.ParametriACostiUnitari;
import org.springframework.stereotype.Component;

@Component
public class ParametriACostiUnitariMerger
    extends AbstractMerger<ParametriACostiUnitariBean, ParametriACostiUnitari> {

  @Override
  protected void doMerge(ParametriACostiUnitariBean bean, ParametriACostiUnitari entity) {
    entity.setValore(bean.getValore());
    entity.setRicaricoPercentuale(bean.getRicaricoPercentuale());
    entity.setPrezzo(bean.getPrezzo());
    entity.setDescrizione(bean.getDescrizione());
  }

}
