package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.entity.User;
import it.prevt.backend.manager.ProspectManager;
import it.prevt.backend.mapper.ProspectMapper;
import it.prevt.backend.merger.ProspectMerger;
import it.prevt.backend.repository.ProspectRepository;
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
public class ProspectManagerImpl implements ProspectManager {

  private final ProspectRepository repository;
  private final ProspectMapper mapper;
  private final ProspectMerger merger;

  @Override
  public List<ProspectBean> getProspectList() {
    List<Prospect> prospects = repository.getProspectList();
    if (prospects == null) {
      throw new UsernameNotFoundException("error.prospect.notfound");
    }
    return mapper.mapEntitiesToBeans(prospects);
  }

  @Override
  public ProspectBean saveProspect(ProspectBean bean, Authentication authentication) {
    Prospect entity;
    if (bean.getId() == null) {
      entity = merger.mapNew(bean, Prospect.class);
    } else {
      entity = repository.find(Prospect.class, bean.getId());
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

