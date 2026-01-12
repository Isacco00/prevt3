package it.prevt.backend.mapper;

import it.prevt.backend.bean.CostiRetroilluminazioneBean;
import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.entity.CostiRetroilluminazione;
import it.prevt.backend.entity.ParametriACostiUnitari;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CostiRetroilluminazioneMapper
    extends AbstractMapper<CostiRetroilluminazione, CostiRetroilluminazioneBean> {

  protected CostiRetroilluminazioneBean doMapping(CostiRetroilluminazione entity) {
    return doMapping(new CostiRetroilluminazioneBean(), entity);
  }

  protected CostiRetroilluminazioneBean doMapping(CostiRetroilluminazioneBean bean,
      CostiRetroilluminazione entity) {
    bean.setId(entity.getId());
    bean.setAltezza(entity.getAltezza());
    bean.setCostoAlMetro(entity.getCostoAlMetro());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
