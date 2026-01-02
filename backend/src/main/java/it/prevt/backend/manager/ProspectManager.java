package it.prevt.backend.manager;

import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.bean.UserBean;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProspectManager {

  List<ProspectBean> getProspectList();

  ProspectBean saveProspect(ProspectBean bean, Authentication authentication);

}
