package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.*;
import it.prevt.backend.entity.*;
import it.prevt.backend.manager.FornituraManager;
import it.prevt.backend.mapper.*;
import it.prevt.backend.merger.CondizioniFornituraPreventiviMerger;
import it.prevt.backend.merger.PreventivoMerger;
import it.prevt.backend.repository.FornituraRepository;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import jakarta.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FornituraManagerImpl implements FornituraManager {

  private final FornituraRepository repository;
  private final CondizioniStandardFornituraMapper condizioniStandardFornituraMapper;
  private final CondizioniFornituraPreventiviMapper condizioniFornituraPreventiviMapper;
  private final CondizioniFornituraPreventiviMerger merger;

  @Override
  public List<CondizioniStandardFornituraBean> getCondizioniStandardFornitura(
      ListinoAccessoriRequestBean searchRequest) {
    List<CondizioniStandardFornitura> condizioniStandardFornituraList =
        repository.getCondizioniStandardFornitura(searchRequest);
    if (condizioniStandardFornituraList == null) {
      throw new UsernameNotFoundException("error.condizionistandardfornitura.notfound");
    }
    return condizioniStandardFornituraMapper.mapEntitiesToBeans(condizioniStandardFornituraList);
  }

  @Override
  public List<CondizioniFornituraPreventiviBean> getCondizioniFornituraPreventivi(
      ListinoAccessoriRequestBean searchRequest) {
    List<CondizioniFornituraPreventivi> condizioniFornituraPreventiviList =
        repository.getCondizioniFornituraPreventivi(searchRequest);
    if (condizioniFornituraPreventiviList == null) {
      throw new UsernameNotFoundException("error.condizioniforniturapreventivi.notfound");
    }
    return condizioniFornituraPreventiviMapper.mapEntitiesToBeans(
        condizioniFornituraPreventiviList);
  }

  @Override
  public List<CondizioniFornituraPreventiviBean> saveCondizioniFornituraPreventivi(
      List<CondizioniFornituraPreventiviBean> beans) {
    List<CondizioniFornituraPreventiviBean> result = new ArrayList<>();
    for (CondizioniFornituraPreventiviBean bean : beans) {
      result.add(this.saveEntity(bean));
    }
    return result;
  }

  public CondizioniFornituraPreventiviBean saveEntity(CondizioniFornituraPreventiviBean bean) {
    CondizioniFornituraPreventivi entity;
    if (bean.getId() == null) {
      entity = merger.mapNew(bean, CondizioniFornituraPreventivi.class);
    } else {
      entity = repository.find(CondizioniFornituraPreventivi.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      merger.merge(bean, entity);
    }
    this.repository.save(entity);
    return condizioniFornituraPreventiviMapper.mapEntityToBean(entity);
  }
}

