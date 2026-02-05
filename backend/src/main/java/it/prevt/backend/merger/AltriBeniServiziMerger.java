package it.prevt.backend.merger;

import it.prevt.backend.bean.AltriBeniServiziBean;
import it.prevt.backend.entity.AltriBeniServizi;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.repository.PreventivoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AltriBeniServiziMerger extends AbstractMerger<AltriBeniServiziBean, AltriBeniServizi> {

  private final PreventivoRepository repository;
  @Override
  protected void doMerge(AltriBeniServiziBean bean, AltriBeniServizi entity) {
    entity.setPreventivo(repository.find(Preventivo.class, UUID.fromString(bean.getPreventivoId())));
    entity.setDescrizione(bean.getDescrizione());
    entity.setCostoUnitario(bean.getCostoUnitario());
    entity.setMarginalita(bean.getMarginalita());
    entity.setPrezzoUnitario(bean.getPrezzoUnitario());
    entity.setQuantita(bean.getQuantita());
    entity.setTotale(bean.getTotale());
    entity.setCreatedAt(bean.getCreatedAt());
    entity.setUpdatedAt(bean.getUpdatedAt());
  }

}
