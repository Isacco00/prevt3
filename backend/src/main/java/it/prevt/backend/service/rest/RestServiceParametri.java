package it.prevt.backend.service.rest;

import it.prevt.backend.bean.*;
import it.prevt.backend.entity.ParametriACostiUnitari;
import it.prevt.backend.request.bean.ListinoAccessoriRequestBean;
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
  ListinoAccessoriStandBean saveListinoAccessoriStand(
      @RequestBody ListinoAccessoriStandBean dto);

}
