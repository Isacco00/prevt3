package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.manager.ParametriManager;
import it.prevt.backend.request.bean.ParametriRequestBean;
import it.prevt.backend.service.rest.RestServiceParametri;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RestServiceParametriImpl implements RestServiceParametri {

  private final ParametriManager manager;

  @Override
  public List<ParametriBean> getParametriList(ParametriRequestBean request) {
    return manager.getParametriList(request);
  }

  @Override
  public ParametriBean saveParametro(ParametriBean bean) {
    return manager.saveParametro(bean);
  }

}
