package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.AltriBeniServiziBean;
import it.prevt.backend.bean.ListinoRetroilluminazioneBean;
import it.prevt.backend.bean.CostiStrutturaDeskLayoutBean;
import it.prevt.backend.bean.CostiStrutturaEspositoriLayoutBean;
import it.prevt.backend.bean.ListinoAccessoriDeskBean;
import it.prevt.backend.bean.ListinoAccessoriEspositoriBean;
import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.bean.PreventivoServiziBean;
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
  public List<ListinoRetroilluminazioneBean> getListinoRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getListinoRetroilluminazione(searchRequest);
  }

  @Override
  public ListinoRetroilluminazioneBean saveListinoRetroilluminazione(
      ListinoRetroilluminazioneBean bean) {
    return manager.saveListinoRetroilluminazione(bean);
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

  @Override
  public void deleteListinoAccessoriStand(ListinoAccessoriStandBean id) {
    manager.deleteListinoAccessoriStand(id);
  }

  @Override
  public List<ListinoAccessoriDeskBean> getListinoAccessoriDesk(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getListinoAccessoriDesk(searchRequest);
  }

  @Override
  public ListinoAccessoriDeskBean saveListinoAccessoriDesk(ListinoAccessoriDeskBean dto) {
    return manager.saveListinoAccessoriDesk(dto);
  }

  @Override
  public void deleteListinoAccessoriDesk(ListinoAccessoriDeskBean bean) {
    manager.deleteListinoAccessoriDesk(bean);
  }

  @Override
  public List<ListinoAccessoriEspositoriBean> getListinoAccessoriEspositori(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getListinoAccessoriEspositori(searchRequest);
  }

  @Override
  public ListinoAccessoriEspositoriBean saveListinoAccessoriEspositori(
      ListinoAccessoriEspositoriBean dto) {
    return manager.saveListinoAccessoriEspositori(dto);
  }

  @Override
  public void deleteListinoAccessoriEspositori(ListinoAccessoriEspositoriBean bean) {
    manager.deleteListinoAccessoriEspositori(bean);
  }

  @Override
  public List<CostiStrutturaDeskLayoutBean> getCostiStrutturaDesk(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getCostiStrutturaDesk(searchRequest);
  }

  @Override
  public CostiStrutturaDeskLayoutBean saveCostiStrutturaDesk(CostiStrutturaDeskLayoutBean dto) {
    return manager.saveCostiStrutturaDesk(dto);
  }

  @Override
  public void deleteCostiStrutturaDesk(CostiStrutturaDeskLayoutBean bean) {
    manager.deleteCostiStrutturaDesk(bean);
  }

  @Override
  public List<CostiStrutturaEspositoriLayoutBean> getCostiStrutturaEspositoriLayout(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getCostiStrutturaEspositoriLayout(searchRequest);
  }

  @Override
  public CostiStrutturaEspositoriLayoutBean saveCostiStrutturaEspositoriLayout(
      CostiStrutturaEspositoriLayoutBean dto) {
    return manager.saveCostiStrutturaEspositoriLayout(dto);
  }

  @Override
  public void deleteCostiStrutturaEspositoriLayout(CostiStrutturaEspositoriLayoutBean bean) {
    manager.deleteCostiStrutturaEspositoriLayout(bean);
  }

  @Override
  public List<AltriBeniServiziBean> getAltriBeniServiziByPreventivoId(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getAltriBeniServiziByPreventivoId(searchRequest);
  }

  @Override
  public List<PreventivoServiziBean> getPreventivoServiziByPreventivoId(
      ListinoAccessoriRequestBean searchRequest) {
    return manager.getPreventivoServiziByPreventivoId(searchRequest);
  }

  @Override
  public AltriBeniServiziBean saveAltriBeniServizi(AltriBeniServiziBean bean) {
    return manager.saveAltriBeniServizi(bean);
  }

  @Override
  public void deleteAltriBeniServizi(AltriBeniServiziBean bean) {
    manager.deleteAltriBeniServizi(bean);
  }
}
