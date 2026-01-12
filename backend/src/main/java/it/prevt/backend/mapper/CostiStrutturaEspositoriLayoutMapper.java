package it.prevt.backend.mapper;

import it.prevt.backend.bean.CostiRetroilluminazioneBean;
import it.prevt.backend.bean.CostiStrutturaEspositoriLayoutBean;
import it.prevt.backend.entity.CostiRetroilluminazione;
import it.prevt.backend.entity.CostiStrutturaEspositoriLayout;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CostiStrutturaEspositoriLayoutMapper
    extends AbstractMapper<CostiStrutturaEspositoriLayout, CostiStrutturaEspositoriLayoutBean> {

  protected CostiStrutturaEspositoriLayoutBean doMapping(CostiStrutturaEspositoriLayout entity) {
    return doMapping(new CostiStrutturaEspositoriLayoutBean(), entity);
  }

  protected CostiStrutturaEspositoriLayoutBean doMapping(CostiStrutturaEspositoriLayoutBean bean,
      CostiStrutturaEspositoriLayout entity) {
    bean.setId(entity.getId());
    bean.setLayoutEspositore(entity.getLayoutEspositore());
    bean.setCostoUnitario(entity.getCostoUnitario());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
