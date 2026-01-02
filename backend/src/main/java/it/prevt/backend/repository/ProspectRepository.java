package it.prevt.backend.repository;

import it.prevt.backend.entity.Prospect;

import java.util.List;

public interface ProspectRepository extends AbstractRepository {

  List<Prospect> getProspectList();
}
