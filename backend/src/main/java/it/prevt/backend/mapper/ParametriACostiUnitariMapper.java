package it.prevt.backend.mapper;

import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.entity.ParametriACostiUnitari;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ParametriACostiUnitariMapper
    extends AbstractMapper<ParametriACostiUnitari, ParametriACostiUnitariBean> {

  protected ParametriACostiUnitariBean doMapping(ParametriACostiUnitari entity) {
    return doMapping(new ParametriACostiUnitariBean(), entity);
  }

  protected ParametriACostiUnitariBean doMapping(ParametriACostiUnitariBean bean,
      ParametriACostiUnitari entity) {
    bean.setId(entity.getId());
    bean.setParametro(entity.getParametro());
    bean.setUnitaMisura(entity.getUnitaMisura());
    bean.setValore(entity.getValore());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
