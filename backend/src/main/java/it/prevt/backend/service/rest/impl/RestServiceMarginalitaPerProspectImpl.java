package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.MarginalitaPerProspectBean;
import it.prevt.backend.manager.MarginalitaPerProspectManager;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.service.rest.RestServiceMarginalitaPerProspect;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RestServiceMarginalitaPerProspectImpl implements RestServiceMarginalitaPerProspect {

  private final MarginalitaPerProspectManager manager;

  @Override
  public List<MarginalitaPerProspectBean> getMarginalitaPerProspectList(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getMarginalitaPerProspectList(searchRequest);
  }

  @Override
  public MarginalitaPerProspectBean saveMarginalitaPerProspect(MarginalitaPerProspectBean dto,
      Authentication authentication) {
    return manager.saveMarginalitaPerProspect(dto, authentication);
  }

}
