package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.*;
import it.prevt.backend.manager.PreventivoManager;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.service.rest.RestServicePreventivi;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RestServicePreventiviImpl implements RestServicePreventivi {

  private final PreventivoManager manager;

  @Override
  public List<PreventivoBean> getPreventiviList() {
    return manager.getPreventiviList();
  }

  @Override
  public List<AltriBeniServiziBean> getAltriBeniServizi(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getAltriBeniServizi(searchRequest);
  }

  @Override
  public PreventivoBean savePreventivo(PreventivoBean dto, Authentication authentication) {
    return manager.savePreventivo(dto, authentication);
  }

}
