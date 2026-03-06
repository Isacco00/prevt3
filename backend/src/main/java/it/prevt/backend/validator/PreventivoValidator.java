package it.prevt.backend.validator;

import it.prevt.backend.bean.PreventivoBean;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.PreventiviRequestBean;
import it.prevt.backend.validator.internal.AbstractValidator;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class PreventivoValidator extends AbstractValidator<PreventivoBean> {

  private final PreventivoRepository preventivoRepository;

  public PreventivoValidator(PreventivoRepository preventivoRepository) {
    this.preventivoRepository = preventivoRepository;
  }

  @Override
  public void doValidate(PreventivoBean bean) {
    checkNumeroDuplicato(bean);
  }

  private void checkNumeroDuplicato(PreventivoBean bean) {
    if (bean.getNumeroPreventivo() == null) {
      addMessage("numeroPreventivo", null, "preventivo.message.error.numeroRequired");
      return;
    }
    PreventiviRequestBean request = new PreventiviRequestBean();
    request.setNumeroPreventivo(bean.getNumeroPreventivo());
    List<Preventivo> exists = preventivoRepository.getPreventiviList(request);
    if (!exists.isEmpty()) {
      addMessage("numeroPreventivo", bean.getNumeroPreventivo(),
          "preventivo.message.error.numeroDuplicato");
    }
  }
}