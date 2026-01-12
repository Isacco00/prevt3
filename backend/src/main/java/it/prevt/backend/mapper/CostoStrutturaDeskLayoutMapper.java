package it.prevt.backend.mapper;

import it.prevt.backend.bean.CostiStrutturaDeskLayoutBean;
import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.entity.CostoStrutturaDeskLayout;
import it.prevt.backend.entity.ListinoAccessoriStand;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CostoStrutturaDeskLayoutMapper
    extends AbstractMapper<CostoStrutturaDeskLayout, CostiStrutturaDeskLayoutBean> {

  protected CostiStrutturaDeskLayoutBean doMapping(CostoStrutturaDeskLayout entity) {
    return doMapping(new CostiStrutturaDeskLayoutBean(), entity);
  }

  protected CostiStrutturaDeskLayoutBean doMapping(CostiStrutturaDeskLayoutBean bean,
      CostoStrutturaDeskLayout entity) {
    bean.setId(entity.getId());
    bean.setLayoutDesk(entity.getLayoutDesk());
    bean.setCostoUnitario(entity.getCostoUnitario());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
