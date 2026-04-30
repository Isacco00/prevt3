package it.prevt.backend.merger;

import it.prevt.backend.bean.CostoExtraTrasfMontBean;
import it.prevt.backend.entity.CostoExtraTrasfMontEntity;
import org.springframework.stereotype.Component;

@Component
public class CostoExtraTrasfMontMerger
    extends AbstractMerger<CostoExtraTrasfMontBean, CostoExtraTrasfMontEntity> {

  @Override
  protected void doMerge(CostoExtraTrasfMontBean bean, CostoExtraTrasfMontEntity entity) {
    entity.setLivello(bean.getLivello());
    entity.setCostoExtraMont(bean.getCostoExtraMont());
    entity.setCostoExtraSmont(bean.getCostoExtraSmont());
    if (bean.getAttivo() != null) {
      entity.setAttivo(bean.getAttivo());
    }
  }
}
