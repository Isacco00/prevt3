package it.prevt.backend.merger;

import it.prevt.backend.bean.CostiRetroilluminazioneBean;
import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.entity.CostiRetroilluminazione;
import it.prevt.backend.entity.ParametriACostiUnitari;
import org.springframework.stereotype.Component;

@Component
public class CostiRetroilluminazioneMerger
    extends AbstractMerger<CostiRetroilluminazioneBean, CostiRetroilluminazione> {

  @Override
  protected void doMerge(CostiRetroilluminazioneBean bean, CostiRetroilluminazione entity) {
    entity.setAltezza(bean.getAltezza());
    entity.setCostoAlMetro(bean.getCostoAlMetro());
  }

}
