package it.prevt.backend.merger;

import it.prevt.backend.bean.ListinoRetroilluminazioneBean;
import it.prevt.backend.entity.ListinoRetroilluminazione;
import org.springframework.stereotype.Component;

@Component
public class ListinoRetroilluminazioneMerger
    extends AbstractMerger<ListinoRetroilluminazioneBean, ListinoRetroilluminazione> {

  @Override
  protected void doMerge(ListinoRetroilluminazioneBean bean, ListinoRetroilluminazione entity) {
    entity.setAltezza(bean.getAltezza());
    entity.setCostoAlMetro(bean.getCostoAlMetro());
    entity.setRicaricoPercentuale(bean.getRicaricoPercentuale());
    entity.setPrezzo(bean.getPrezzo());
    entity.setDescrizione(bean.getDescrizione());
  }

}
