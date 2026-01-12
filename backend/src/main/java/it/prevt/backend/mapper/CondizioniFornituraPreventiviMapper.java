package it.prevt.backend.mapper;

import it.prevt.backend.bean.CondizioniFornituraPreventiviBean;
import it.prevt.backend.bean.CostiStrutturaEspositoriLayoutBean;
import it.prevt.backend.entity.CondizioniFornituraPreventivi;
import it.prevt.backend.entity.CostiStrutturaEspositoriLayout;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CondizioniFornituraPreventiviMapper
    extends AbstractMapper<CondizioniFornituraPreventivi, CondizioniFornituraPreventiviBean> {

  protected CondizioniFornituraPreventiviBean doMapping(CondizioniFornituraPreventivi entity) {
    return doMapping(new CondizioniFornituraPreventiviBean(), entity);
  }

  protected CondizioniFornituraPreventiviBean doMapping(CondizioniFornituraPreventiviBean bean,
      CondizioniFornituraPreventivi entity) {
    bean.setId(entity.getId());
    bean.setPreventivoId(entity.getPreventivo().getId().toString());
    bean.setVoce(entity.getVoce());
    bean.setTesto(entity.getTesto());
    bean.setSelezionato(entity.getSelezionato());
    bean.setOrdine(entity.getOrdine());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
