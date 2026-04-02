package it.prevt.backend.merger;

import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.bean.UserBean;
import it.prevt.backend.entity.Parametri;
import it.prevt.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ParametriMerger extends AbstractMerger<ParametriBean, Parametri> {

  @Override
  protected void doMerge(ParametriBean bean, Parametri entity) {
    entity.setNome(bean.getNome());
    entity.setAttivo(bean.isAttivo());
    entity.setTipo(bean.getTipo());
    entity.setValore(bean.getValore());
    entity.setRicaricoPercentuale(bean.getRicaricoPercentuale());
    entity.setPrezzo(bean.getPrezzo());
    entity.setDescrizione(bean.getDescrizione());
  }

}
