package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.entity.Parametri;
import it.prevt.backend.manager.ParametriManager;
import it.prevt.backend.mapper.ParametriMapper;
import it.prevt.backend.merger.ParametriMerger;
import it.prevt.backend.repository.PreventivoRepository;
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

}

