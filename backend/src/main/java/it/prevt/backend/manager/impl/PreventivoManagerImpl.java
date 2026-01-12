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
  private final ListinoAccessoriDeskMapper listinoAccessoriDeskMapper;
  private final ListinoAccessoriStandMapper listinoAccessoriStandMapper;
  private final CostoStrutturaDeskLayoutMapper costoStrutturaDeskLayoutMapper;
  private final CostiRetroilluminazioneMapper costiRetroilluminazioneMapper;
  private final CostiStrutturaEspositoriLayoutMapper costiStrutturaEspositoriLayoutMapper;
  private final ListinoAccessoriEspositoriMapper listinoAccessoriEspositoriMapper;
  private final AltriBeniServiziMapper altriBeniServiziMapper;

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

  @Override
  public List<ListinoAccessoriDeskBean> getListinoAccessoriDesk(
      ListinoAccessoriRequestBean searchRequest) {
    List<ListinoAccessoriDesk> listinoAccessoriDeskList =
        repository.getListinoAccessoriDesk(searchRequest);
    if (listinoAccessoriDeskList == null) {
      throw new UsernameNotFoundException("error.listinoaccessoridesk.notfound");
    }
    return listinoAccessoriDeskMapper.mapEntitiesToBeans(listinoAccessoriDeskList);
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
  public List<CostiStrutturaDeskLayoutBean> getCostiStrutturaDesk(
      ListinoAccessoriRequestBean searchRequest) {
    List<CostoStrutturaDeskLayout> costiStrutturaDeskList =
        repository.getCostiStrutturaDesk(searchRequest);
    if (costiStrutturaDeskList == null) {
      throw new UsernameNotFoundException("error.costistrutturadesk.notfound");
    }
    return costoStrutturaDeskLayoutMapper.mapEntitiesToBeans(costiStrutturaDeskList);
  }

  @Override
  public List<CostiStrutturaEspositoriLayoutBean> getCostiStrutturaEspositoriLayout(
      ListinoAccessoriRequestBean searchRequest) {
    List<CostiStrutturaEspositoriLayout> costiStrutturaEspositoriLayoutList =
        repository.getCostiStrutturaEspositoriLayout(searchRequest);
    if (costiStrutturaEspositoriLayoutList == null) {
      throw new UsernameNotFoundException("error.costistrutturaespositorilayout.notfound");
    }
    return costiStrutturaEspositoriLayoutMapper.mapEntitiesToBeans(
        costiStrutturaEspositoriLayoutList);
  }

  @Override
  public List<ListinoAccessoriEspositoriBean> getListinoAccessoriEspositori(
      ListinoAccessoriRequestBean searchRequest) {
    List<ListinoAccessoriEspositori> listinoAccessoriEspositoriList =
        repository.getListinoAccessoriEspositori(searchRequest);
    if (listinoAccessoriEspositoriList == null) {
      throw new UsernameNotFoundException("error.listinoaccessoriespositori.notfound");
    }
    return listinoAccessoriEspositoriMapper.mapEntitiesToBeans(listinoAccessoriEspositoriList);
  }

  @Override
  public List<AltriBeniServiziBean> getAltriBeniServizi(
      ListinoAccessoriRequestBean searchRequest) {
    List<AltriBeniServizi> altriBeniServiziList =
        repository.getAltriBeniServizi(searchRequest);
    if (altriBeniServiziList == null) {
      throw new UsernameNotFoundException("error.listinoaccessoriespositori.notfound");
    }
    return altriBeniServiziMapper.mapEntitiesToBeans(altriBeniServiziList);
  }

}

