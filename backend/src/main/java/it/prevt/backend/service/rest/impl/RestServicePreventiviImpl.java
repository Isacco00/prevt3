package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.*;
import it.prevt.backend.manager.PreventivoManager;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
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
public class RestServicePreventiviImpl implements RestServicePreventivi {

  private final PreventivoManager manager;

  @Override
  public List<PreventivoBean> getPreventiviList() {
    return manager.getPreventiviList();
  }

  @Override
  public List<ListinoAccessoriDeskBean> getListinoAccessoriDesk(
      @RequestBody ListinoAccessoriRequestBean searchRequest) {
    return manager.getListinoAccessoriDesk(searchRequest);
  }

  @Override
  public List<ListinoAccessoriStandBean> getListinoAccessoriStand(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getListinoAccessoriStand(searchRequest);
  }

  @Override
  public List<CostiStrutturaDeskLayoutBean> getCostiStrutturaDesk(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getCostiStrutturaDesk(searchRequest);
  }

  @Override
  public List<ParametriACostiUnitariBean> getParametriACostiUnitari(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getParametriACostiUnitari(searchRequest);
  }

  @Override
  public List<CostiRetroilluminazioneBean> getCostiRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getCostiRetroilluminazione(searchRequest);
  }

  @Override
  public List<CostiStrutturaEspositoriLayoutBean> getCostiStrutturaEspositoriLayout(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getCostiStrutturaEspositoriLayout(searchRequest);
  }

  @Override
  public List<ListinoAccessoriEspositoriBean> getListinoAccessoriEspositori(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getListinoAccessoriEspositori(searchRequest);
  }

  @Override
  public List<ParametriBean> getParametriList() {
    return manager.getParametriList();
  }

  @Override
  public PreventivoBean savePreventivo(PreventivoBean dto, Authentication authentication) {
    return manager.savePreventivo(dto, authentication);
  }

}
