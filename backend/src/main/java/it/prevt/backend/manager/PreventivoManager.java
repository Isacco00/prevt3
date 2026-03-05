package it.prevt.backend.manager;

import it.prevt.backend.bean.*;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface PreventivoManager {

  List<PreventivoBean> getPreventiviList();

  PreventivoBean savePreventivo(PreventivoBean bean, Authentication authentication);

  PreventivoBean getPreventivoDetail(String id);

  void deletePreventivo(String id);

}
