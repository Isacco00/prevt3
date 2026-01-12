package it.prevt.backend.service.rest;

import it.prevt.backend.bean.*;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RestServicePath.FORNITURA)
@PreAuthorize("isAuthenticated()")
public interface RestServiceFornitura {

  @PostMapping("/getCondizioniStandardFornitura")
  List<CondizioniStandardFornituraBean> getCondizioniStandardFornitura(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/getCondizioniFornituraPreventivi")
  List<CondizioniFornituraPreventiviBean> getCondizioniFornituraPreventivi(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

}
