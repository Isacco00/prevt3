package it.prevt.backend.repository;

import it.prevt.backend.entity.Parametri;
import it.prevt.backend.request.bean.ParametriRequestBean;
import java.util.List;

public interface ParametriRepository extends AbstractRepository {

  List<Parametri> getParametriList(ParametriRequestBean request);

}
