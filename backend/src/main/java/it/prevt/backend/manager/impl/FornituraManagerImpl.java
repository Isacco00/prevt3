package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.*;
import it.prevt.backend.entity.*;
import it.prevt.backend.manager.FornituraManager;
import it.prevt.backend.mapper.*;
import it.prevt.backend.merger.PreventivoMerger;
import it.prevt.backend.repository.FornituraRepository;
import it.prevt.backend.repository.PreventivoRepository;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import lombok.RequiredArgsConstructor;
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
    return condizioniFornituraPreventiviMapper.mapEntitiesToBeans(condizioniFornituraPreventiviList);
  }
}

