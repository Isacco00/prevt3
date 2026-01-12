package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.*;
import it.prevt.backend.manager.FornituraManager;
import it.prevt.backend.manager.PreventivoManager;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.service.rest.RestServiceFornitura;
import it.prevt.backend.service.rest.RestServicePreventivi;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RestServiceFornituraImpl implements RestServiceFornitura {

  private final FornituraManager manager;

  @Override
  public List<CondizioniStandardFornituraBean> getCondizioniStandardFornitura(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getCondizioniStandardFornitura(searchRequest);
  }

  @Override
  public List<CondizioniFornituraPreventiviBean> getCondizioniFornituraPreventivi(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getCondizioniFornituraPreventivi(searchRequest);
  }
}
