package it.prevt.backend.merger;

import it.prevt.backend.bean.PreventivoBean;
import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.entity.Prospect;
import org.springframework.stereotype.Component;

@Component
public class PreventivoMerger extends AbstractMerger<PreventivoBean, Preventivo> {

  @Override
  protected void doMerge(PreventivoBean bean, Preventivo entity) {
  }

}
