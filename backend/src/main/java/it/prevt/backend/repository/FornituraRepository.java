package it.prevt.backend.repository;

import it.prevt.backend.entity.*;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;

import java.util.List;

public interface FornituraRepository extends AbstractRepository {

  List<CondizioniStandardFornitura> getCondizioniStandardFornitura(
      ListinoAccessoriRequestBean searchRequest);

  List<CondizioniFornituraPreventivi> getCondizioniFornituraPreventivi(
      ListinoAccessoriRequestBean searchRequest);
}
