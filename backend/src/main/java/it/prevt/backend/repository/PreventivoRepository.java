package it.prevt.backend.repository;

import it.prevt.backend.entity.*;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;

import java.util.List;

public interface PreventivoRepository extends AbstractRepository {

  List<Preventivo> getPreventiviList();

  List<ListinoAccessoriDesk> getListinoAccessoriDesk(ListinoAccessoriRequestBean searchRequest);

  List<Parametri> getParametriList();

  List<ListinoAccessoriStand> getListinoAccessoriStand(ListinoAccessoriRequestBean searchRequest);

  List<CostoStrutturaDeskLayout> getCostiStrutturaDesk(ListinoAccessoriRequestBean searchRequest);

  List<ParametriACostiUnitari> getParametriACostiUnitari(ListinoAccessoriRequestBean searchRequest);

  List<CostiRetroilluminazione> getCostiRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest);

  List<CostiStrutturaEspositoriLayout> getCostiStrutturaEspositoriLayout(
      ListinoAccessoriRequestBean searchRequest);

  List<ListinoAccessoriEspositori> getListinoAccessoriEspositori(ListinoAccessoriRequestBean searchRequest);
}
