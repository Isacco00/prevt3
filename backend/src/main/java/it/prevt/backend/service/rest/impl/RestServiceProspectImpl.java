package it.prevt.backend.service.rest.impl;

import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.bean.UserBean;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.manager.ProspectManager;
import it.prevt.backend.manager.UserManager;
import it.prevt.backend.service.rest.RestServiceProfile;
import it.prevt.backend.service.rest.RestServiceProspect;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RestServiceProspectImpl implements RestServiceProspect {

  private final ProspectManager manager;

  @Override
  public List<ProspectBean> getProspectList() {
    return manager.getProspectList();
  }

  @Override
  public ProspectBean saveProspect(ProspectBean dto, Authentication authentication) {
    return manager.saveProspect(dto, authentication);
  }

}
