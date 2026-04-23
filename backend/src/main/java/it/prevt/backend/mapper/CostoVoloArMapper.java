package it.prevt.backend.mapper;

import it.prevt.backend.bean.CostoVoloArBean;
import it.prevt.backend.entity.CostoVoloArEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CostoVoloArMapper extends AbstractMapper<CostoVoloArEntity, CostoVoloArBean> {

  protected CostoVoloArBean doMapping(CostoVoloArEntity entity) {
    CostoVoloArBean bean = new CostoVoloArBean();
    bean.setId(entity.getId());
    bean.setTipologia(entity.getTipologia());
    bean.setCostoVoloAr(entity.getCostoVoloAr());
    bean.setAttivo(entity.getAttivo());
    return bean;
  }
}
