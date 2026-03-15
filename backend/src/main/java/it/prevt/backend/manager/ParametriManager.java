package it.prevt.backend.manager;

import it.prevt.backend.bean.AltriBeniServiziBean;
import it.prevt.backend.bean.ListinoRetroilluminazioneBean;
import it.prevt.backend.bean.ListinoServiziPrezzoUnitarioBean;
import it.prevt.backend.bean.ListinoStrutturaDeskBean;
import it.prevt.backend.bean.ListinoStrutturaEspositoriBean;
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

  List<ListinoStrutturaDeskBean> getListinoStrutturaDesk(
      ListinoAccessoriRequestBean searchRequest);

  ListinoStrutturaDeskBean saveListinoStrutturaDesk(ListinoStrutturaDeskBean dto);

  void deleteListinoStrutturaDesk(ListinoStrutturaDeskBean bean);

  List<ListinoStrutturaEspositoriBean> getListinoStrutturaEspositori(
      ListinoAccessoriRequestBean searchRequest);

  ListinoStrutturaEspositoriBean saveListinoStrutturaEspositori(
      ListinoStrutturaEspositoriBean dto);

  void deleteListinoStrutturaEspositori(ListinoStrutturaEspositoriBean bean);

  List<AltriBeniServiziBean> getAltriBeniServiziByPreventivoId(
      ListinoAccessoriRequestBean searchRequest);

  List<PreventivoServiziBean> getPreventivoServiziByPreventivoId(
      ListinoAccessoriRequestBean searchRequest);

  AltriBeniServiziBean saveAltriBeniServizi(AltriBeniServiziBean bean);

  void deleteAltriBeniServizi(AltriBeniServiziBean bean);

  List<ListinoServiziPrezzoUnitarioBean> getListinoServiziPrezzoUnitario(
      ListinoAccessoriRequestBean searchRequest);

  ListinoServiziPrezzoUnitarioBean saveListinoServiziPrezzoUnitario(
      ListinoServiziPrezzoUnitarioBean bean);

}
