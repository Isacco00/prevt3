package it.prevt.backend.service.rest;

import it.prevt.backend.bean.*;
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

  @PostMapping("/getListinoServiziPrezzoUnitario")
  List<ListinoServiziPrezzoUnitarioBean> getListinoServiziPrezzoUnitario(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveListinoServiziPrezzoUnitario")
  ListinoServiziPrezzoUnitarioBean saveListinoServiziPrezzoUnitario(
      @RequestBody ListinoServiziPrezzoUnitarioBean dto);

  @PostMapping("/getListinoRetroilluminazione")
  List<ListinoRetroilluminazioneBean> getListinoRetroilluminazione(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveListinoRetroilluminazione")
  ListinoRetroilluminazioneBean saveListinoRetroilluminazione(
      @RequestBody ListinoRetroilluminazioneBean dto);

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

  @PostMapping("/getListinoStrutturaDesk")
  List<ListinoStrutturaDeskBean> getListinoStrutturaDesk(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveListinoStrutturaDesk")
  ListinoStrutturaDeskBean saveListinoStrutturaDesk(
      @RequestBody ListinoStrutturaDeskBean dto);

  @PostMapping("/deleteListinoStrutturaDesk")
  void deleteListinoStrutturaDesk(@RequestBody ListinoStrutturaDeskBean bean);

  @PostMapping("/getListinoStrutturaEspositori")
  List<ListinoStrutturaEspositoriBean> getListinoStrutturaEspositori(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveListinoStrutturaEspositori")
  ListinoStrutturaEspositoriBean saveListinoStrutturaEspositori(
      @RequestBody ListinoStrutturaEspositoriBean dto);

  @PostMapping("/deleteListinoStrutturaEspositori")
  void deleteListinoStrutturaEspositori(@RequestBody ListinoStrutturaEspositoriBean bean);

  @PostMapping("/getAltriBeniServiziByPreventivoId")
  List<AltriBeniServiziBean> getAltriBeniServiziByPreventivoId(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/getPreventivoServiziByPreventivoId")
  List<PreventivoServiziBean> getPreventivoServiziByPreventivoId(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/savePreventivoServizi")
  PreventivoServiziBean savePreventivoServizi(@RequestBody PreventivoServiziBean dto);

  @PostMapping("/getCostiVoloAr")
  List<CostoVoloArBean> getCostiVoloAr(@RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/getCostiExtraTrasfMont")
  List<CostoExtraTrasfMontBean> getCostiExtraTrasfMont(
      @RequestBody ListinoAccessoriRequestBean searchRequest);

  @PostMapping("/saveAltriBeniServizi")
  AltriBeniServiziBean saveAltriBeniServizi(@RequestBody AltriBeniServiziBean dto);

  @PostMapping("/deleteAltriBeniServizi")
  void deleteAltriBeniServizi(@RequestBody AltriBeniServiziBean bean);

}
