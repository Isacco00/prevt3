package it.prevt.backend.mapper;

import it.prevt.backend.bean.CostiStrutturaDeskLayoutBean;
import it.prevt.backend.entity.CostiStrutturaDeskLayout;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CostiStrutturaDeskLayoutMapper
    extends AbstractMapper<CostiStrutturaDeskLayout, CostiStrutturaDeskLayoutBean> {

  protected CostiStrutturaDeskLayoutBean doMapping(CostiStrutturaDeskLayout entity) {
    return doMapping(new CostiStrutturaDeskLayoutBean(), entity);
  }

  protected CostiStrutturaDeskLayoutBean doMapping(CostiStrutturaDeskLayoutBean bean,
      CostiStrutturaDeskLayout entity) {
    bean.setId(entity.getId());
    bean.setLayoutDesk(entity.getLayoutDesk());
    bean.setCostoUnitario(entity.getCostoUnitario());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
