package it.prevt.backend.mapper;

import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.entity.ListinoAccessoriDesk;
import it.prevt.backend.entity.Parametri;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ParametriMapper extends AbstractMapper<Parametri, ParametriBean> {

  protected ParametriBean doMapping(Parametri entity) {
    return doMapping(new ParametriBean(), entity);
  }

  protected ParametriBean doMapping(ParametriBean bean, Parametri entity) {
    bean.setId(entity.getId());
    bean.setTipo(entity.getTipo());
    bean.setNome(entity.getNome());
    bean.setValore(entity.getValore());
    bean.setValoreTesto(entity.getValoreTesto());
    bean.setDescrizione(entity.getDescrizione());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    bean.setValoreChiave(entity.getValoreChiave());
    bean.setOrdine(entity.getOrdine());
    return bean;
  }
}
