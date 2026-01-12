package it.prevt.backend.mapper;

import it.prevt.backend.bean.ListinoAccessoriDeskBean;
import it.prevt.backend.bean.PreventivoBean;
import it.prevt.backend.entity.ListinoAccessoriDesk;
import it.prevt.backend.entity.Preventivo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ListinoAccessoriDeskMapper
    extends AbstractMapper<ListinoAccessoriDesk, ListinoAccessoriDeskBean> {

  protected ListinoAccessoriDeskBean doMapping(ListinoAccessoriDesk entity) {
    return doMapping(new ListinoAccessoriDeskBean(), entity);
  }

  protected ListinoAccessoriDeskBean doMapping(ListinoAccessoriDeskBean bean,
      ListinoAccessoriDesk entity) {
    bean.setId(entity.getId());
    bean.setNome(entity.getNome());
    bean.setCostoUnitario(entity.getCostoUnitario());
    bean.setAttivo(entity.getAttivo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    return bean;
  }
}
