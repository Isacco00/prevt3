package it.prevt.backend.mapper;

import it.prevt.backend.bean.CondizioniStandardFornituraBean;
import it.prevt.backend.entity.CondizioniStandardFornitura;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CondizioniStandardFornituraMapper
    extends AbstractMapper<CondizioniStandardFornitura, CondizioniStandardFornituraBean> {

  protected CondizioniStandardFornituraBean doMapping(CondizioniStandardFornitura entity) {
    return doMapping(new CondizioniStandardFornituraBean(), entity);
  }

  protected CondizioniStandardFornituraBean doMapping(CondizioniStandardFornituraBean bean,
      CondizioniStandardFornitura entity) {
    bean.setId(entity.getId());
    bean.setVoce(entity.getVoce());
    bean.setTestoStandard(entity.getTestoStandard());
    bean.setOrdine(entity.getOrdine());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
