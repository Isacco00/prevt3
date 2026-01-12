package it.prevt.backend.manager;

import it.prevt.backend.bean.*;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface PreventivoManager {

  List<PreventivoBean> getPreventiviList();

  PreventivoBean savePreventivo(PreventivoBean bean, Authentication authentication);

  List<ListinoAccessoriDeskBean> getListinoAccessoriDesk(ListinoAccessoriRequestBean searchRequest);

  List<ParametriBean> getParametriList();

  List<ListinoAccessoriStandBean> getListinoAccessoriStand(
      ListinoAccessoriRequestBean searchRequest);

  List<CostiStrutturaDeskLayoutBean> getCostiStrutturaDesk(
      ListinoAccessoriRequestBean searchRequest);

  List<ParametriACostiUnitariBean> getParametriACostiUnitari(
      ListinoAccessoriRequestBean searchRequest);

  List<CostiRetroilluminazioneBean> getCostiRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest);

  List<CostiStrutturaEspositoriLayoutBean> getCostiStrutturaEspositoriLayout(
      ListinoAccessoriRequestBean searchRequest);

  List<ListinoAccessoriEspositoriBean> getListinoAccessoriEspositori(ListinoAccessoriRequestBean searchRequest);
}
