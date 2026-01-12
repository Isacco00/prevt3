package it.prevt.backend.repository;

import it.prevt.backend.entity.AltriBeniServizi;
import it.prevt.backend.entity.CostiRetroilluminazione;
import it.prevt.backend.entity.CostiStrutturaEspositoriLayout;
import it.prevt.backend.entity.CostoStrutturaDeskLayout;
import it.prevt.backend.entity.ListinoAccessoriDesk;
import it.prevt.backend.entity.ListinoAccessoriEspositori;
import it.prevt.backend.entity.ListinoAccessoriStand;
import it.prevt.backend.entity.Parametri;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.request.bean.ParametriRequestBean;
import java.util.List;

public interface ParametriRepository extends AbstractRepository {

  List<Parametri> getParametriList(ParametriRequestBean request);

}
