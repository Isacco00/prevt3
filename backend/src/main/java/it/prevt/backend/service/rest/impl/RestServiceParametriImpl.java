package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.CostiRetroilluminazioneBean;
import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.manager.ParametriManager;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.request.bean.ParametriRequestBean;
import it.prevt.backend.service.rest.RestServiceParametri;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RestServiceParametriImpl implements RestServiceParametri {

  private final ParametriManager manager;

  @Override
  public List<ParametriBean> getParametriList(ParametriRequestBean request) {
    return manager.getParametriList(request);
  }

  @Override
  public ParametriBean saveParametro(ParametriBean bean) {
    return manager.saveParametro(bean);
  }

  @Override
  public List<ParametriACostiUnitariBean> getParametriACostiUnitari(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getParametriACostiUnitari(searchRequest);
  }

  @Override
  public ParametriACostiUnitariBean saveParametriCostiUnitari(ParametriACostiUnitariBean bean) {
    return manager.saveParametriCostiUnitari(bean);
  }

  @Override
  public List<CostiRetroilluminazioneBean> getCostiRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getCostiRetroilluminazione(searchRequest);
  }

  @Override
  public CostiRetroilluminazioneBean saveCostiRetroilluminazione(CostiRetroilluminazioneBean bean) {
    return manager.saveCostiRetroilluminazione(bean);
  }

  @Override
  public List<ListinoAccessoriStandBean> getListinoAccessoriStand(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getListinoAccessoriStand(searchRequest);
  }

  @Override
  public ListinoAccessoriStandBean saveListinoAccessoriStand(ListinoAccessoriStandBean dto) {
    return manager.saveListinoAccessoriStand(dto);
  }
}
