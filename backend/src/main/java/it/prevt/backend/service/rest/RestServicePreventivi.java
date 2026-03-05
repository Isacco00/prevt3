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

  @PostMapping("/savePreventivo")
  PreventivoBean savePreventivo(@RequestBody PreventivoBean dto, Authentication authentication);

  @GetMapping("/getPreventivoDetail/{id}")
  PreventivoBean getPreventivoDetail(@PathVariable String id);

  @DeleteMapping("/deletePreventivo/{id}")
  void deletePreventivo(@PathVariable String id);

}
