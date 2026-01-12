package it.prevt.backend.manager;

import it.prevt.backend.bean.AltriBeniServiziBean;
import it.prevt.backend.bean.CostiRetroilluminazioneBean;
import it.prevt.backend.bean.CostiStrutturaDeskLayoutBean;
import it.prevt.backend.bean.CostiStrutturaEspositoriLayoutBean;
import it.prevt.backend.bean.ListinoAccessoriDeskBean;
import it.prevt.backend.bean.ListinoAccessoriEspositoriBean;
import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.bean.PreventivoBean;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.request.bean.ParametriRequestBean;

import java.util.List;

import org.springframework.security.core.Authentication;

public interface ParametriManager {

  List<ParametriBean> getParametriList(ParametriRequestBean request);

  ParametriBean saveParametro(ParametriBean bean);

  List<ParametriACostiUnitariBean> getParametriACostiUnitari(
      ListinoAccessoriRequestBean searchRequest);

  ParametriACostiUnitariBean saveParametriCostiUnitari(ParametriACostiUnitariBean bean);

  List<CostiRetroilluminazioneBean> getCostiRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest);

  CostiRetroilluminazioneBean saveCostiRetroilluminazione(CostiRetroilluminazioneBean bean);

  List<ListinoAccessoriStandBean> getListinoAccessoriStand(ListinoAccessoriRequestBean searchRequest);

  ListinoAccessoriStandBean saveListinoAccessoriStand(ListinoAccessoriStandBean dto);
}
