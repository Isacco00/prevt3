package it.prevt.backend.merger;

import it.prevt.backend.bean.ListinoServiziPrezzoUnitarioBean;
import it.prevt.backend.entity.ListinoServiziPrezzoUnitario;
import it.prevt.backend.entity.ParametriACostiUnitari;
import org.springframework.stereotype.Component;

@Component
public class ListinoServiziPrezzoUnitarioMerger
    extends AbstractMerger<ListinoServiziPrezzoUnitarioBean, ListinoServiziPrezzoUnitario> {

  @Override
  protected void doMerge(ListinoServiziPrezzoUnitarioBean bean,
      ListinoServiziPrezzoUnitario entity) {
    entity.setCosto(bean.getCosto());
    entity.setRicaricoPercentuale(bean.getRicaricoPercentuale());
    entity.setDescrizione(bean.getDescrizione());
  }

}
