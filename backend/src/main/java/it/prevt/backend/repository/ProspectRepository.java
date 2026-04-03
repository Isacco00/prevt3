package it.prevt.backend.repository;

import it.prevt.backend.entity.MarginalitaPerProspect;
import it.prevt.backend.entity.Prospect;

import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import java.util.List;

public interface ProspectRepository extends AbstractRepository {

  List<Prospect> getProspectList();

  List<Prospect> findByPartitaIva(String partitaIva);

  List<MarginalitaPerProspect> getMarginalitaPerProspectList(
      ListinoAccessoriRequestBean searchRequest);
}
