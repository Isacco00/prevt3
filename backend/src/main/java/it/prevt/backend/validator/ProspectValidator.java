package it.prevt.backend.validator;

import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.repository.ProspectRepository;
import it.prevt.backend.validator.internal.AbstractValidator;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ProspectValidator extends AbstractValidator<ProspectBean> {

  private final ProspectRepository prospectRepository;

  public ProspectValidator(ProspectRepository prospectRepository) {
    this.prospectRepository = prospectRepository;
  }

  @Override
  public void doValidate(ProspectBean bean) {
    checkPartitaIvaDuplicata(bean);
  }

  private void checkPartitaIvaDuplicata(ProspectBean bean) {
    if (bean.getPartitaIva() == null || bean.getPartitaIva().isBlank()) {
      addMessage("partitaIva", null, "prospect.message.error.partitaIvaRequired");
      return;
    }
    List<Prospect> exists = prospectRepository.findByPartitaIva(bean.getPartitaIva());
    if (!exists.isEmpty() && exists.stream().anyMatch(p -> !p.getId().equals(bean.getId()))) {
      addMessage("partitaIva", bean.getPartitaIva(), "prospect.message.error.partitaIvaDuplicata");
    }
  }
}
