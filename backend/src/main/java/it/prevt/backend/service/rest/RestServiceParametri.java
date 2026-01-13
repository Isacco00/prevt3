package it.prevt.backend.service.rest;

import it.prevt.backend.bean.*;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
import it.prevt.backend.request.bean.ParametriRequestBean;

import java.util.List;

import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(RestServicePath.PARAMETRI)
@PreAuthorize("isAuthenticated()")
public interface RestServiceParametri {

  @PostMapping("/getParametriList")
  List<ParametriBean> getParametriList(@RequestBody ParametriRequestBean request);

  @PostMapping("/saveParametro")
  ParametriBean saveParametro(@RequestBody ParametriBean dto);

  @PostMapping("/getParametriACostiUnitari")
  List<ParametriACostiUnitariBean> getParametriACostiUnitari(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveParametriCostiUnitari")
  ParametriACostiUnitariBean saveParametriCostiUnitari(@RequestBody ParametriACostiUnitariBean dto);

  @PostMapping("/getCostiRetroilluminazione")
  List<CostiRetroilluminazioneBean> getCostiRetroilluminazione(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveCostiRetroilluminazione")
  CostiRetroilluminazioneBean saveCostiRetroilluminazione(
      @RequestBody CostiRetroilluminazioneBean dto);

  @PostMapping("/getListinoAccessoriStand")
  List<ListinoAccessoriStandBean> getListinoAccessoriStand(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveListinoAccessoriStand")
  ListinoAccessoriStandBean saveListinoAccessoriStand(@RequestBody ListinoAccessoriStandBean dto);

  @PostMapping("/deleteListinoAccessoriStand")
  void deleteListinoAccessoriStand(@RequestBody ListinoAccessoriStandBean bean);

  @PostMapping("/getListinoAccessoriDesk")
  List<ListinoAccessoriDeskBean> getListinoAccessoriDesk(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveListinoAccessoriDesk")
  ListinoAccessoriDeskBean saveListinoAccessoriDesk(@RequestBody ListinoAccessoriDeskBean dto);

  @PostMapping("/deleteListinoAccessoriDesk")
  void deleteListinoAccessoriDesk(@RequestBody ListinoAccessoriDeskBean bean);

  @PostMapping("/getListinoAccessoriEspositori")
  List<ListinoAccessoriEspositoriBean> getListinoAccessoriEspositori(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveListinoAccessoriEspositori")
  ListinoAccessoriEspositoriBean saveListinoAccessoriEspositori(
      @RequestBody ListinoAccessoriEspositoriBean dto);

  @PostMapping("/deleteListinoAccessoriEspositori")
  void deleteListinoAccessoriEspositori(@RequestBody ListinoAccessoriEspositoriBean bean);

  @PostMapping("/getCostiStrutturaDesk")
  List<CostiStrutturaDeskLayoutBean> getCostiStrutturaDesk(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveCostiStrutturaDesk")
  CostiStrutturaDeskLayoutBean saveCostiStrutturaDesk(
      @RequestBody CostiStrutturaDeskLayoutBean dto);

  @PostMapping("/deleteCostiStrutturaDesk")
  void deleteCostiStrutturaDesk(@RequestBody CostiStrutturaDeskLayoutBean bean);

  @PostMapping("/getCostiStrutturaEspositoriLayout")
  List<CostiStrutturaEspositoriLayoutBean> getCostiStrutturaEspositoriLayout(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveCostiStrutturaEspositoriLayout")
  CostiStrutturaEspositoriLayoutBean saveCostiStrutturaEspositoriLayout(
      @RequestBody CostiStrutturaEspositoriLayoutBean dto);

  @PostMapping("/deleteCostiStrutturaEspositoriLayout")
  void deleteCostiStrutturaEspositoriLayout(@RequestBody CostiStrutturaEspositoriLayoutBean bean);

}
