package it.prevt.backend.mapper;

import it.prevt.backend.bean.AltriBeniServiziBean;
import it.prevt.backend.bean.ListinoAccessoriEspositoriBean;
import it.prevt.backend.entity.AltriBeniServizi;
import it.prevt.backend.entity.ListinoAccessoriEspositori;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AltriBeniServiziMapper
    extends AbstractMapper<AltriBeniServizi, AltriBeniServiziBean> {

  protected AltriBeniServiziBean doMapping(AltriBeniServizi entity) {
    return doMapping(new AltriBeniServiziBean(), entity);
  }

  protected AltriBeniServiziBean doMapping(AltriBeniServiziBean bean,
      AltriBeniServizi entity) {
    bean.setId(entity.getId());
    bean.setDescrizione(entity.getDescrizione());
    bean.setCostoUnitario(entity.getCostoUnitario());
    bean.setMarginalita(entity.getMarginalita());
    bean.setPrezzoUnitario(entity.getPrezzoUnitario());
    bean.setQuantita(entity.getQuantita());
    bean.setTotale(entity.getTotale());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
