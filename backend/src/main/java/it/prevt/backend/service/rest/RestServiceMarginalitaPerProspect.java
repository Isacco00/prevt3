package it.prevt.backend.service.rest;

import it.prevt.backend.bean.MarginalitaPerProspectBean;
import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RestServicePath.MARGINALITA_PER_PROSPECT)
@PreAuthorize("isAuthenticated()")
public interface RestServiceMarginalitaPerProspect {

  @PostMapping("/getMarginalitaPerProspectList")
  List<MarginalitaPerProspectBean> getMarginalitaPerProspectList(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveMarginalitaPerProspect")
  MarginalitaPerProspectBean saveMarginalitaPerProspect(@RequestBody MarginalitaPerProspectBean dto,
      Authentication authentication);

}
