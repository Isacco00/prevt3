package it.prevt.backend.service.rest;

import it.prevt.backend.bean.ParametriBean;
import it.prevt.backend.bean.UserBean;
import it.prevt.backend.request.bean.ParametriRequestBean;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(RestServicePath.PARAMETRI)
@PreAuthorize("isAuthenticated()")
public interface RestServiceParametri {

  @PostMapping("/getParametriList")
  List<ParametriBean> getParametriList(@RequestBody ParametriRequestBean request);

  @PostMapping("/saveParametro")
  ParametriBean saveParametro(@RequestBody ParametriBean dto);
}
