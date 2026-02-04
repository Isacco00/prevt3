package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.*;
import it.prevt.backend.entity.*;
import it.prevt.backend.manager.PreventivoManager;
import it.prevt.backend.mapper.*;
import it.prevt.backend.merger.PreventivoMerger;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PreventivoManagerImpl implements PreventivoManager {

  private final PreventivoRepository repository;
  private final PreventivoMapper mapper;
  private final PreventivoMerger merger;

  @Override
  public List<PreventivoBean> getPreventiviList() {
    List<Preventivo> preventivoList = repository.getPreventiviList();
    if (preventivoList == null) {
      throw new UsernameNotFoundException("error.preventivo.notfound");
    }
    return mapper.mapEntitiesToBeans(preventivoList);
  }

  @Override
  public PreventivoBean savePreventivo(PreventivoBean bean, Authentication authentication) {
    Preventivo entity;
    if (bean.getId() == null) {
      entity = merger.mapNew(bean, Preventivo.class);
    } else {
      entity = repository.find(Preventivo.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      merger.merge(bean, entity);
    }
    UUID userId = UUID.fromString(authentication.getName());
    User user = repository.find(User.class, userId);
    if (user == null) {
      throw new UsernameNotFoundException("error.user.notfound");
    }
    entity.setUser(user);
    this.repository.save(entity);
    return mapper.mapEntityToBean(entity);
  }

}

