package it.prevt.backend.repository;

import it.prevt.backend.entity.*;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;

import it.prevt.backend.request.bean.ParametriRequestBean;
import it.prevt.backend.request.bean.PreventiviRequestBean;
import java.util.List;

public interface PreventivoRepository extends AbstractRepository {

  List<Preventivo> getPreventiviList(PreventiviRequestBean preventiviRequestBean);

  List<ListinoAccessoriDesk> getListinoAccessoriDesk(ListinoAccessoriRequestBean searchRequest);

  List<Parametri> getParametriList(ParametriRequestBean request);

  List<ListinoAccessoriStand> getListinoAccessoriStand(ListinoAccessoriRequestBean searchRequest);

  List<CostiStrutturaDeskLayout> getCostiStrutturaDesk(ListinoAccessoriRequestBean searchRequest);

  List<ParametriACostiUnitari> getParametriACostiUnitari(ListinoAccessoriRequestBean searchRequest);

  List<ListinoRetroilluminazione> getListinoRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest);

  List<CostiStrutturaEspositoriLayout> getCostiStrutturaEspositoriLayout(
      ListinoAccessoriRequestBean searchRequest);

  List<ListinoAccessoriEspositori> getListinoAccessoriEspositori(
      ListinoAccessoriRequestBean searchRequest);

  List<AltriBeniServizi> getAltriBeniServizi(
      ListinoAccessoriRequestBean searchRequest);

  List<PreventivoServizi> getPreventivoServizi(
      ListinoAccessoriRequestBean searchRequest);
}
