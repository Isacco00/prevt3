package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.MarginalitaPerProspectBean;
import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.MarginalitaPerProspect;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.entity.User;
import it.prevt.backend.manager.MarginalitaPerProspectManager;
import it.prevt.backend.mapper.MarginalitaPerProspectMapper;
import it.prevt.backend.mapper.ProspectMapper;
import it.prevt.backend.merger.ProspectMerger;
import it.prevt.backend.repository.ProspectRepository;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MarginalitaPerProspectManagerImpl implements MarginalitaPerProspectManager {

  private final ProspectRepository repository;
  private final MarginalitaPerProspectMapper mapper;


  @Override
  public List<MarginalitaPerProspectBean> getMarginalitaPerProspectList(
      ListinoAccessoriRequestBean searchRequest) {
    List<MarginalitaPerProspect> marginalitaPerProspects = repository.getMarginalitaPerProspectList(
        searchRequest);
    if (marginalitaPerProspects == null) {
      throw new UsernameNotFoundException("error.marginalitaperprospects.notfound");
    }
    return mapper.mapEntitiesToBeans(marginalitaPerProspects);
  }

  @Override
  public MarginalitaPerProspectBean saveMarginalitaPerProspect(MarginalitaPerProspectBean bean,
      Authentication authentication) {
    return null;
  }
}

