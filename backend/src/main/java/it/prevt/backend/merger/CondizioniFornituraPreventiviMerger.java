package it.prevt.backend.merger;

import it.prevt.backend.bean.CondizioniFornituraPreventiviBean;
import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.CondizioniFornituraPreventivi;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.repository.AbstractRepository;
import it.prevt.backend.repository.FornituraRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CondizioniFornituraPreventiviMerger extends
    AbstractMerger<CondizioniFornituraPreventiviBean, CondizioniFornituraPreventivi> {

  private final FornituraRepository repo;

  @Override
  protected void doMerge(CondizioniFornituraPreventiviBean bean,
      CondizioniFornituraPreventivi entity) {
    entity.setOrdine(bean.getOrdine());
    entity.setSelezionato(bean.isSelezionato());
    entity.setVoce(bean.getVoce());
    entity.setTesto(bean.getTesto());
    entity.setPreventivo(repo.find(Preventivo.class, UUID.fromString(bean.getPreventivoId())));
  }

}
