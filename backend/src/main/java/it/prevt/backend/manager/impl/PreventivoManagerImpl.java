package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.PreventivoBean;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.entity.User;
import it.prevt.backend.enumerator.PreventivoStatus;
import it.prevt.backend.manager.PreventivoManager;
import it.prevt.backend.mapper.PreventivoMapper;
import it.prevt.backend.merger.PreventivoMerger;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.PreventiviRequestBean;
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
public class PreventivoManagerImpl implements PreventivoManager {

  private final PreventivoRepository repository;
  private final PreventivoMapper mapper;
  private final PreventivoMerger merger;

  @Override
  public List<PreventivoBean> getPreventiviList() {
    PreventiviRequestBean request = new PreventiviRequestBean();
    request.setStatiPreventivi(Preventivo.STATO_IN_CORSO);
    List<Preventivo> preventivoList = repository.getPreventiviList(request);
    if (preventivoList == null) {
      throw new EntityNotFoundException("error.preventivo.notfound");
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
      throw new EntityNotFoundException("error.user.notfound");
    }
    entity.setUser(user);
    this.repository.save(entity);
    return mapper.mapEntityToBean(entity);
  }

  @Override
  public PreventivoBean getPreventivoDetail(String id) {
    Preventivo preventivo = repository.find(Preventivo.class, UUID.fromString(id));
    if (preventivo == null) {
      throw new EntityNotFoundException("error.preventivo.notfound");
    }
    return mapper.mapEntityToBean(preventivo);
  }

  @Override
  public void deletePreventivo(String id) {
    Preventivo preventivo  = repository.find(Preventivo.class, UUID.fromString(id));
    if (preventivo == null) {
      throw new EntityNotFoundException("error.preventivo.notfound");
    }
    preventivo.setStatus(PreventivoStatus.CANCELLATO);
    this.repository.save(preventivo);
  }
}

