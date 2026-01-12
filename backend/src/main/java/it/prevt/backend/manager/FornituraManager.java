package it.prevt.backend.manager;

import it.prevt.backend.bean.*;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface FornituraManager {
  List<CondizioniStandardFornituraBean> getCondizioniStandardFornitura(
      ListinoAccessoriRequestBean searchRequest);

  List<CondizioniFornituraPreventiviBean> getCondizioniFornituraPreventivi(
      ListinoAccessoriRequestBean searchRequest);
}
