package it.prevt.backend.manager;

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
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.request.bean.ParametriRequestBean;
import java.util.List;

public interface ParametriManager {

  List<ParametriBean> getParametriList(ParametriRequestBean request);

  ParametriBean saveParametro(ParametriBean bean);

  List<ParametriACostiUnitariBean> getParametriACostiUnitari(
      ListinoAccessoriRequestBean searchRequest);

  ParametriACostiUnitariBean saveParametriCostiUnitari(ParametriACostiUnitariBean bean);

  List<ListinoRetroilluminazioneBean> getListinoRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest);

  ListinoRetroilluminazioneBean saveListinoRetroilluminazione(ListinoRetroilluminazioneBean bean);

  List<ListinoAccessoriStandBean> getListinoAccessoriStand(
      ListinoAccessoriRequestBean searchRequest);

  ListinoAccessoriStandBean saveListinoAccessoriStand(ListinoAccessoriStandBean dto);

  void deleteListinoAccessoriStand(ListinoAccessoriStandBean id);

  List<ListinoAccessoriDeskBean> getListinoAccessoriDesk(ListinoAccessoriRequestBean searchRequest);

  ListinoAccessoriDeskBean saveListinoAccessoriDesk(ListinoAccessoriDeskBean dto);

  void deleteListinoAccessoriDesk(ListinoAccessoriDeskBean bean);

  List<ListinoAccessoriEspositoriBean> getListinoAccessoriEspositori(
      ListinoAccessoriRequestBean searchRequest);

  ListinoAccessoriEspositoriBean saveListinoAccessoriEspositori(ListinoAccessoriEspositoriBean dto);

  void deleteListinoAccessoriEspositori(ListinoAccessoriEspositoriBean bean);

  List<CostiStrutturaDeskLayoutBean> getCostiStrutturaDesk(
      ListinoAccessoriRequestBean searchRequest);

  CostiStrutturaDeskLayoutBean saveCostiStrutturaDesk(CostiStrutturaDeskLayoutBean dto);

  void deleteCostiStrutturaDesk(CostiStrutturaDeskLayoutBean bean);

  List<CostiStrutturaEspositoriLayoutBean> getCostiStrutturaEspositoriLayout(
      ListinoAccessoriRequestBean searchRequest);

  CostiStrutturaEspositoriLayoutBean saveCostiStrutturaEspositoriLayout(
      CostiStrutturaEspositoriLayoutBean dto);

  void deleteCostiStrutturaEspositoriLayout(CostiStrutturaEspositoriLayoutBean bean);

  List<AltriBeniServiziBean> getAltriBeniServiziByPreventivoId(
      ListinoAccessoriRequestBean searchRequest);

  List<PreventivoServiziBean> getPreventivoServiziByPreventivoId(
      ListinoAccessoriRequestBean searchRequest);

  AltriBeniServiziBean saveAltriBeniServizi(AltriBeniServiziBean bean);

  void deleteAltriBeniServizi(AltriBeniServiziBean bean);

}
