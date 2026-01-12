package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.CostiRetroilluminazioneBean;
import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.entity.CostiRetroilluminazione;
import it.prevt.backend.entity.ListinoAccessoriStand;
import it.prevt.backend.entity.Parametri;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.manager.ParametriManager;
import it.prevt.backend.mapper.CostiRetroilluminazioneMapper;
import it.prevt.backend.mapper.ListinoAccessoriStandMapper;
import it.prevt.backend.mapper.ParametriACostiUnitariMapper;
import it.prevt.backend.mapper.ParametriMapper;
import it.prevt.backend.merger.CostiRetroilluminazioneMerger;
import it.prevt.backend.merger.ListinoAccessoriStandMerger;
import it.prevt.backend.merger.ParametriACostiUnitariMerger;
import it.prevt.backend.merger.ParametriMerger;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.request.bean.ParametriRequestBean;
import jakarta.persistence.EntityNotFoundException;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ParametriManagerImpl implements ParametriManager {

  private final PreventivoRepository repository;
  private final ParametriMapper mapper;
  private final ParametriMerger merger;
  private final ParametriACostiUnitariMapper parametriACostiUnitariMapper;
  private final ParametriACostiUnitariMerger parametriACostiUnitariMerger;
  private final CostiRetroilluminazioneMapper costiRetroilluminazioneMapper;
  private final CostiRetroilluminazioneMerger costiRetroilluminazioneMerger;
  private final ListinoAccessoriStandMapper listinoAccessoriStandMapper;
  private final ListinoAccessoriStandMerger listinoAccessoriStandMerger;

  @Override
  public List<ParametriBean> getParametriList(ParametriRequestBean request) {
    List<Parametri> parametriList = repository.getParametriList(request);
    if (parametriList == null) {
      throw new UsernameNotFoundException("error.parametri.notfound");
    }
    return mapper.mapEntitiesToBeans(parametriList);
  }

  @Override
  public ParametriBean saveParametro(ParametriBean bean) {
    Parametri entity;
    if (bean.getId() == null) {
      entity = merger.mapNew(bean, Parametri.class);
    } else {
      entity = repository.find(Parametri.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      merger.merge(bean, entity);
    }
    this.repository.save(entity);
    return mapper.mapEntityToBean(entity);
  }

  @Override
  public List<ParametriACostiUnitariBean> getParametriACostiUnitari(
      ListinoAccessoriRequestBean searchRequest) {
    List<ParametriACostiUnitari> parametriACostiUnitaris =
        repository.getParametriACostiUnitari(searchRequest);
    if (parametriACostiUnitaris == null) {
      throw new UsernameNotFoundException("error.parametriacostiunitari.notfound");
    }
    return parametriACostiUnitariMapper.mapEntitiesToBeans(parametriACostiUnitaris);
  }

  @Override
  public ParametriACostiUnitariBean saveParametriCostiUnitari(ParametriACostiUnitariBean bean) {
    ParametriACostiUnitari entity;
    if (bean.getId() == null) {
      entity = parametriACostiUnitariMerger.mapNew(bean, ParametriACostiUnitari.class);
    } else {
      entity = repository.find(ParametriACostiUnitari.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      parametriACostiUnitariMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return parametriACostiUnitariMapper.mapEntityToBean(entity);
  }

  @Override
  public List<CostiRetroilluminazioneBean> getCostiRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest) {
    List<CostiRetroilluminazione> costiRetroilluminazioneList =
        repository.getCostiRetroilluminazione(searchRequest);
    if (costiRetroilluminazioneList == null) {
      throw new UsernameNotFoundException("error.costiretroilluminazione.notfound");
    }
    return costiRetroilluminazioneMapper.mapEntitiesToBeans(costiRetroilluminazioneList);
  }

  @Override
  public CostiRetroilluminazioneBean saveCostiRetroilluminazione(CostiRetroilluminazioneBean bean) {
    CostiRetroilluminazione entity;
    if (bean.getId() == null) {
      entity = costiRetroilluminazioneMerger.mapNew(bean, CostiRetroilluminazione.class);
    } else {
      entity = repository.find(CostiRetroilluminazione.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      costiRetroilluminazioneMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return costiRetroilluminazioneMapper.mapEntityToBean(entity);
  }

  @Override
  public List<ListinoAccessoriStandBean> getListinoAccessoriStand(
      ListinoAccessoriRequestBean searchRequest) {
    List<ListinoAccessoriStand> listinoAccessoriStandList =
        repository.getListinoAccessoriStand(searchRequest);
    if (listinoAccessoriStandList == null) {
      throw new UsernameNotFoundException("error.listinoaccessoristand.notfound");
    }
    return listinoAccessoriStandMapper.mapEntitiesToBeans(listinoAccessoriStandList);
  }

  @Override
  public ListinoAccessoriStandBean saveListinoAccessoriStand(ListinoAccessoriStandBean bean) {
    ListinoAccessoriStand entity;
    if (bean.getId() == null) {
      entity = listinoAccessoriStandMerger.mapNew(bean, ListinoAccessoriStand.class);
    } else {
      entity = repository.find(ListinoAccessoriStand.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      listinoAccessoriStandMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return listinoAccessoriStandMapper.mapEntityToBean(entity);
  }
}

