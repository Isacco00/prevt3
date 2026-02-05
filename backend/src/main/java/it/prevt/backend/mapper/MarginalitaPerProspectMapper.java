package it.prevt.backend.mapper;

import it.prevt.backend.bean.MarginalitaPerProspectBean;
import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.MarginalitaPerProspect;
import it.prevt.backend.entity.Prospect;
import org.springframework.stereotype.Component;

@Component
public class MarginalitaPerProspectMapper extends
    AbstractMapper<MarginalitaPerProspect, MarginalitaPerProspectBean> {

  protected MarginalitaPerProspectBean doMapping(MarginalitaPerProspect entity) {
    return doMapping(new MarginalitaPerProspectBean(), entity);
  }

  protected MarginalitaPerProspectBean doMapping(MarginalitaPerProspectBean bean,
      MarginalitaPerProspect entity) {
    bean.setId(entity.getId());
    bean.setMarginalita(entity.getMarginalita());
    bean.setAttivo(entity.getAttivo());

    return bean;
  }
}
