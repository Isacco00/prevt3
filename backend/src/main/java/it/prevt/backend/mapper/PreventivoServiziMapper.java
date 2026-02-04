package it.prevt.backend.mapper;

import it.prevt.backend.bean.AltriBeniServiziBean;
import it.prevt.backend.bean.PreventivoServiziBean;
import it.prevt.backend.entity.AltriBeniServizi;
import it.prevt.backend.entity.PreventivoServizi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PreventivoServiziMapper
    extends AbstractMapper<PreventivoServizi, PreventivoServiziBean> {

  protected PreventivoServiziBean doMapping(PreventivoServizi entity) {
    return doMapping(new PreventivoServiziBean(), entity);
  }

  protected PreventivoServiziBean doMapping(PreventivoServiziBean bean,
      PreventivoServizi entity) {
    bean.setId(entity.getId());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    bean.setCertificazioni(entity.getCertificazioni());
    bean.setPreventivoMontaggio(entity.getPreventivoMontaggio());
    bean.setPreventivoSmontaggio(entity.getPreventivoSmontaggio());
    bean.setTotaleCostoMontaggio(entity.getTotaleCostoMontaggio());
    bean.setTotaleCostoSmontaggio(entity.getTotaleCostoSmontaggio());
    return bean;
  }
}
