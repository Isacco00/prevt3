package it.prevt.backend.manager;

import it.prevt.backend.bean.MarginalitaPerProspectBean;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import java.util.List;
import org.springframework.security.core.Authentication;

public interface MarginalitaPerProspectManager {

  List<MarginalitaPerProspectBean> getMarginalitaPerProspectList(
      ListinoAccessoriRequestBean searchRequest);

  MarginalitaPerProspectBean saveMarginalitaPerProspect(MarginalitaPerProspectBean bean,
      Authentication authentication);

}
