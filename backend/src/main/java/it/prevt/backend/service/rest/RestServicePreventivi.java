package it.prevt.backend.service.rest;

import it.prevt.backend.bean.*;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RestServicePath.PREVENTIVI)
@PreAuthorize("isAuthenticated()")
public interface RestServicePreventivi {

  @GetMapping("/getPreventiviList")
  List<PreventivoBean> getPreventiviList();

  @PostMapping("/getListinoAccessoriDesk")
  List<ListinoAccessoriDeskBean> getListinoAccessoriDesk(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/getCostiStrutturaDesk")
  List<CostiStrutturaDeskLayoutBean> getCostiStrutturaDesk(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/getCostiStrutturaEspositoriLayout")
  List<CostiStrutturaEspositoriLayoutBean> getCostiStrutturaEspositoriLayout(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/getListinoAccessoriEspositori")
  List<ListinoAccessoriEspositoriBean> getListinoAccessoriEspositori(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/getAltriBeniServizi")
  List<AltriBeniServiziBean> getAltriBeniServizi(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/savePreventivo")
  PreventivoBean savePreventivo(@RequestBody PreventivoBean dto, Authentication authentication);

}
