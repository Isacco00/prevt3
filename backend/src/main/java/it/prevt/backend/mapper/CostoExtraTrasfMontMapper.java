package it.prevt.backend.mapper;

import it.prevt.backend.bean.CostoExtraTrasfMontBean;
import it.prevt.backend.entity.CostoExtraTrasfMontEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CostoExtraTrasfMontMapper
    extends AbstractMapper<CostoExtraTrasfMontEntity, CostoExtraTrasfMontBean> {

  protected CostoExtraTrasfMontBean doMapping(CostoExtraTrasfMontEntity entity) {
    CostoExtraTrasfMontBean bean = new CostoExtraTrasfMontBean();
    bean.setId(entity.getId());
    bean.setLivello(entity.getLivello());
    bean.setCostoExtraMont(entity.getCostoExtraMont());
    bean.setCostoExtraSmont(entity.getCostoExtraSmont());
    bean.setAttivo(entity.getAttivo());
    return bean;
  }
}
