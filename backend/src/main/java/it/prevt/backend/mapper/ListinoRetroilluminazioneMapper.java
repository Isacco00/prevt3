package it.prevt.backend.mapper;

import it.prevt.backend.bean.ListinoRetroilluminazioneBean;
import it.prevt.backend.entity.ListinoRetroilluminazione;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListinoRetroilluminazioneMapper
    extends AbstractMapper<ListinoRetroilluminazione, ListinoRetroilluminazioneBean> {

  protected ListinoRetroilluminazioneBean doMapping(ListinoRetroilluminazione entity) {
    return doMapping(new ListinoRetroilluminazioneBean(), entity);
  }

  protected ListinoRetroilluminazioneBean doMapping(ListinoRetroilluminazioneBean bean,
      ListinoRetroilluminazione entity) {
    bean.setId(entity.getId());
    bean.setAltezza(entity.getAltezza());
    bean.setCostoAlMetro(entity.getCostoAlMetro());
    bean.setRicaricoPercentuale(entity.getRicaricoPercentuale());
    bean.setPrezzo(entity.getPrezzo());
    bean.setDescrizione(entity.getDescrizione());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
