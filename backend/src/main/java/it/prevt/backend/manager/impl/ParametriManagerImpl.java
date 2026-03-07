package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.AltriBeniServiziBean;
import it.prevt.backend.bean.ListinoRetroilluminazioneBean;
import it.prevt.backend.bean.ListinoStrutturaDeskBean;
import it.prevt.backend.bean.CostiStrutturaEspositoriLayoutBean;
import it.prevt.backend.bean.ListinoAccessoriDeskBean;
import it.prevt.backend.bean.ListinoAccessoriEspositoriBean;
import it.prevt.backend.bean.ListinoAccessoriStandBean;
import it.prevt.backend.bean.ParametriACostiUnitariBean;
import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.bean.PreventivoServiziBean;
import it.prevt.backend.entity.AltriBeniServizi;
import it.prevt.backend.entity.ListinoRetroilluminazione;
import it.prevt.backend.entity.CostiStrutturaEspositoriLayout;
import it.prevt.backend.entity.ListinoStrutturaDesk;
import it.prevt.backend.entity.ListinoAccessoriDesk;
import it.prevt.backend.entity.ListinoAccessoriEspositori;
import it.prevt.backend.entity.ListinoAccessoriStand;
import it.prevt.backend.entity.Parametri;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.entity.PreventivoServizi;
import it.prevt.backend.manager.ParametriManager;
import it.prevt.backend.mapper.AltriBeniServiziMapper;
import it.prevt.backend.mapper.ListinoRetroilluminazioneMapper;
import it.prevt.backend.mapper.CostiStrutturaEspositoriLayoutMapper;
import it.prevt.backend.mapper.ListinoStrutturaDeskMapper;
import it.prevt.backend.mapper.ListinoAccessoriDeskMapper;
import it.prevt.backend.mapper.ListinoAccessoriEspositoriMapper;
import it.prevt.backend.mapper.ListinoAccessoriStandMapper;
import it.prevt.backend.mapper.ParametriACostiUnitariMapper;
import it.prevt.backend.mapper.ParametriMapper;
import it.prevt.backend.mapper.PreventivoServiziMapper;
import it.prevt.backend.merger.AltriBeniServiziMerger;
import it.prevt.backend.merger.ListinoRetroilluminazioneMerger;
import it.prevt.backend.merger.ListinoStrutturaDeskMerger;
import it.prevt.backend.merger.CostiStrutturaEspositoriLayoutMerger;
import it.prevt.backend.merger.ListinoAccessoriDeskMerger;
import it.prevt.backend.merger.ListinoAccessoriEspositoriMerger;
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
  private final ListinoRetroilluminazioneMapper listinoRetroilluminazioneMapper;
  private final ListinoRetroilluminazioneMerger listinoRetroilluminazioneMerger;
  private final ListinoAccessoriStandMapper listinoAccessoriStandMapper;
  private final ListinoAccessoriStandMerger listinoAccessoriStandMerger;
  private final ListinoAccessoriDeskMapper listinoAccessoriDeskMapper;
  private final ListinoAccessoriDeskMerger listinoAccessoriDeskMerger;
  private final ListinoAccessoriEspositoriMapper listinoAccessoriEspositoriMapper;
  private final ListinoAccessoriEspositoriMerger listinoAccessoriEspositoriMerger;
  private final ListinoStrutturaDeskMapper listinoStrutturaDeskMapper;
  private final ListinoStrutturaDeskMerger listinoStrutturaDeskMerger;
  private final CostiStrutturaEspositoriLayoutMapper costiStrutturaEspositoriLayoutMapper;
  private final CostiStrutturaEspositoriLayoutMerger costiStrutturaEspositoriLayoutMerger;
  private final AltriBeniServiziMapper altriBeniServiziMapper;
  private final AltriBeniServiziMerger altriBeniServiziMerger;
  private final PreventivoServiziMapper preventivoServiziMapper;

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
    List<ParametriACostiUnitari> parametriACostiUnitaris = repository.getParametriACostiUnitari(
        searchRequest);
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
  public List<ListinoRetroilluminazioneBean> getListinoRetroilluminazione(
      ListinoAccessoriRequestBean searchRequest) {
    List<ListinoRetroilluminazione> listinoRetroilluminazioneList = repository.getListinoRetroilluminazione(
        searchRequest);
    if (listinoRetroilluminazioneList == null) {
      throw new UsernameNotFoundException("error.listinoretroilluminazione.notfound");
    }
    return listinoRetroilluminazioneMapper.mapEntitiesToBeans(listinoRetroilluminazioneList);
  }

  @Override
  public ListinoRetroilluminazioneBean saveListinoRetroilluminazione(
      ListinoRetroilluminazioneBean bean) {
    ListinoRetroilluminazione entity;
    if (bean.getId() == null) {
      entity = listinoRetroilluminazioneMerger.mapNew(bean, ListinoRetroilluminazione.class);
    } else {
      entity = repository.find(ListinoRetroilluminazione.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      listinoRetroilluminazioneMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return listinoRetroilluminazioneMapper.mapEntityToBean(entity);
  }

  @Override
  public List<ListinoAccessoriStandBean> getListinoAccessoriStand(
      ListinoAccessoriRequestBean searchRequest) {
    List<ListinoAccessoriStand> listinoAccessoriStandList = repository.getListinoAccessoriStand(
        searchRequest);
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

  @Override
  public void deleteListinoAccessoriStand(ListinoAccessoriStandBean bean) {
    if (bean != null) {
      ListinoAccessoriStand entity = repository.find(ListinoAccessoriStand.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      entity.setAttivo(false);
      this.repository.save(entity);
    }
  }

  @Override
  public List<ListinoAccessoriDeskBean> getListinoAccessoriDesk(
      ListinoAccessoriRequestBean searchRequest) {
    List<ListinoAccessoriDesk> listinoAccessoriDeskList = repository.getListinoAccessoriDesk(
        searchRequest);
    if (listinoAccessoriDeskList == null) {
      throw new UsernameNotFoundException("error.listinoaccessoridesk.notfound");
    }
    return listinoAccessoriDeskMapper.mapEntitiesToBeans(listinoAccessoriDeskList);
  }

  @Override
  public ListinoAccessoriDeskBean saveListinoAccessoriDesk(ListinoAccessoriDeskBean bean) {
    ListinoAccessoriDesk entity;
    if (bean.getId() == null) {
      entity = listinoAccessoriDeskMerger.mapNew(bean, ListinoAccessoriDesk.class);
    } else {
      entity = repository.find(ListinoAccessoriDesk.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      listinoAccessoriDeskMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return listinoAccessoriDeskMapper.mapEntityToBean(entity);
  }

  @Override
  public void deleteListinoAccessoriDesk(ListinoAccessoriDeskBean bean) {
    if (bean != null) {
      ListinoAccessoriDesk entity = repository.find(ListinoAccessoriDesk.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      entity.setAttivo(false);
      this.repository.save(entity);
    }
  }

  @Override
  public List<ListinoAccessoriEspositoriBean> getListinoAccessoriEspositori(
      ListinoAccessoriRequestBean searchRequest) {
    List<ListinoAccessoriEspositori> listinoAccessoriEspositoriList = repository.getListinoAccessoriEspositori(
        searchRequest);
    if (listinoAccessoriEspositoriList == null) {
      throw new UsernameNotFoundException("error.listinoaccessoriespositori.notfound");
    }
    return listinoAccessoriEspositoriMapper.mapEntitiesToBeans(listinoAccessoriEspositoriList);
  }

  @Override
  public ListinoAccessoriEspositoriBean saveListinoAccessoriEspositori(
      ListinoAccessoriEspositoriBean bean) {
    ListinoAccessoriEspositori entity;
    if (bean.getId() == null) {
      entity = listinoAccessoriEspositoriMerger.mapNew(bean, ListinoAccessoriEspositori.class);
    } else {
      entity = repository.find(ListinoAccessoriEspositori.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      listinoAccessoriEspositoriMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return listinoAccessoriEspositoriMapper.mapEntityToBean(entity);
  }

  @Override
  public void deleteListinoAccessoriEspositori(ListinoAccessoriEspositoriBean bean) {
    if (bean != null) {
      ListinoAccessoriEspositori entity = repository.find(ListinoAccessoriEspositori.class,
          bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      entity.setAttivo(false);
      this.repository.save(entity);
    }
  }

  @Override
  public List<ListinoStrutturaDeskBean> getListinoStrutturaDesk(
      ListinoAccessoriRequestBean searchRequest) {
    List<ListinoStrutturaDesk> listinoStrutturaDeskList = repository.getListinoStrutturaDesk(
        searchRequest);
    if (listinoStrutturaDeskList == null) {
      throw new UsernameNotFoundException("error.listinostrutturadesk.notfound");
    }
    return listinoStrutturaDeskMapper.mapEntitiesToBeans(listinoStrutturaDeskList);
  }

  @Override
  public ListinoStrutturaDeskBean saveListinoStrutturaDesk(ListinoStrutturaDeskBean bean) {
    ListinoStrutturaDesk entity;
    if (bean.getId() == null) {
      entity = listinoStrutturaDeskMerger.mapNew(bean, ListinoStrutturaDesk.class);
    } else {
      entity = repository.find(ListinoStrutturaDesk.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      listinoStrutturaDeskMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return listinoStrutturaDeskMapper.mapEntityToBean(entity);
  }

  @Override
  public void deleteListinoStrutturaDesk(ListinoStrutturaDeskBean bean) {
    if (bean != null) {
      ListinoStrutturaDesk entity = repository.find(ListinoStrutturaDesk.class,
          bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      entity.setAttivo(false);
      this.repository.save(entity);
    }
  }

  @Override
  public List<CostiStrutturaEspositoriLayoutBean> getCostiStrutturaEspositoriLayout(
      ListinoAccessoriRequestBean searchRequest) {
    List<CostiStrutturaEspositoriLayout> costiStrutturaEspositoriLayoutList = repository.getCostiStrutturaEspositoriLayout(
        searchRequest);
    if (costiStrutturaEspositoriLayoutList == null) {
      throw new UsernameNotFoundException("error.costistrutturaespositorilayout.notfound");
    }
    return costiStrutturaEspositoriLayoutMapper.mapEntitiesToBeans(
        costiStrutturaEspositoriLayoutList);
  }

  @Override
  public CostiStrutturaEspositoriLayoutBean saveCostiStrutturaEspositoriLayout(
      CostiStrutturaEspositoriLayoutBean bean) {
    CostiStrutturaEspositoriLayout entity;
    if (bean.getId() == null) {
      entity = costiStrutturaEspositoriLayoutMerger.mapNew(bean,
          CostiStrutturaEspositoriLayout.class);
    } else {
      entity = repository.find(CostiStrutturaEspositoriLayout.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      costiStrutturaEspositoriLayoutMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return costiStrutturaEspositoriLayoutMapper.mapEntityToBean(entity);
  }

  @Override
  public void deleteCostiStrutturaEspositoriLayout(CostiStrutturaEspositoriLayoutBean bean) {
    if (bean != null) {
      CostiStrutturaEspositoriLayout entity = repository.find(CostiStrutturaEspositoriLayout.class,
          bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      entity.setAttivo(false);
      this.repository.save(entity);
    }
  }

  @Override
  public List<AltriBeniServiziBean> getAltriBeniServiziByPreventivoId(
      ListinoAccessoriRequestBean searchRequest) {
    List<AltriBeniServizi> altriBeniServiziList = repository.getAltriBeniServizi(searchRequest);
    if (altriBeniServiziList == null) {
      throw new UsernameNotFoundException("error.listinoaccessoriespositori.notfound");
    }
    return altriBeniServiziMapper.mapEntitiesToBeans(altriBeniServiziList);
  }

  @Override
  public List<PreventivoServiziBean> getPreventivoServiziByPreventivoId(
      ListinoAccessoriRequestBean searchRequest) {
    List<PreventivoServizi> altriBeniServiziList = repository.getPreventivoServizi(searchRequest);
    if (altriBeniServiziList == null) {
      throw new UsernameNotFoundException("error.preventivoservizi.notfound");
    }
    return preventivoServiziMapper.mapEntitiesToBeans(altriBeniServiziList);
  }

  @Override
  public AltriBeniServiziBean saveAltriBeniServizi(AltriBeniServiziBean bean) {
    AltriBeniServizi entity;
    if (bean.getId() == null) {
      entity = altriBeniServiziMerger.mapNew(bean, AltriBeniServizi.class);
    } else {
      entity = repository.find(AltriBeniServizi.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      altriBeniServiziMerger.merge(bean, entity);
    }
    this.repository.save(entity);
    return altriBeniServiziMapper.mapEntityToBean(entity);
  }

  @Override
  public void deleteAltriBeniServizi(AltriBeniServiziBean bean) {
    if (bean != null) {
      AltriBeniServizi entity = repository.find(AltriBeniServizi.class, bean.getId());
      if (entity == null) {
        throw new EntityNotFoundException();
      }
      this.repository.delete(entity);
    }
  }
}

