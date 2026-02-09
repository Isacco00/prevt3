package it.prevt.backend.mapper;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import it.prevt.backend.bean.LayoutDeskBean;
import it.prevt.backend.bean.PreventivoBean;
import it.prevt.backend.entity.Preventivo;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PreventivoMapper extends AbstractMapper<Preventivo, PreventivoBean> {

  private static final ObjectMapper MAPPER = new ObjectMapper();
  private final ProspectMapper prospectMapper;

  public static List<LayoutDeskBean> parseLayoutDesk(String json) {
    if (json == null || json.isBlank()) {
      return Collections.emptyList();
    }
    try {
      return MAPPER.readValue(json, new TypeReference<>() {
      });
    } catch (Exception e) {
      return Collections.emptyList();
    }
  }


  protected PreventivoBean doMapping(Preventivo entity) {
    return doMapping(new PreventivoBean(), entity);
  }

  protected PreventivoBean doMapping(PreventivoBean bean, Preventivo entity) {
    bean.setId(entity.getId());
    bean.setNumeroPreventivo(entity.getNumeroPreventivo());
    bean.setTitolo(entity.getTitolo());
    bean.setDescrizione(entity.getDescrizione());
    bean.setLarghezza(entity.getLarghezza());
    bean.setAltezza(entity.getAltezza());
    bean.setCostoMq(entity.getCostoMq());
    bean.setCostoMc(entity.getCostoMc());
    bean.setCostoFisso(entity.getCostoFisso());
    bean.setStatus(entity.getStatus());
    bean.setDataScadenza(entity.getDataScadenza());
    bean.setNote(entity.getNote());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    bean.setProfondita(entity.getProfondita());
    bean.setLayout(entity.getLayout());
    bean.setDistribuzione(entity.getDistribuzione());
    bean.setComplessita(entity.getComplessita());
    bean.setSuperficieStampa(entity.getSuperficieStampa());
    bean.setSviluppoLineare(entity.getSviluppoLineare());
    bean.setNumeroPezzi(entity.getNumeroPezzi());
    bean.setCostoStruttura(entity.getCostoStruttura());
    bean.setCostoGrafica(entity.getCostoGrafica());
    bean.setCostoPremontaggio(entity.getCostoPremontaggio());
    bean.setCostoTotale(entity.getCostoTotale());
    bean.setTotale(entity.getTotale());
    bean.setBifaccialita(entity.getBifaccialita());
    bean.setRetroilluminazione(entity.getRetroilluminazione());

    bean.setLarghezzaStorage(entity.getLargStorage());
    bean.setProfonditaStorage(entity.getProfStorage());
    bean.setAltezzaStorage(entity.getAltStorage());
    bean.setLayoutStorage(entity.getLayoutStorage());
    bean.setNumeroPorte(entity.getNumeroPorte());
    bean.setDeskQta(entity.getDeskQta());
    bean.setLayoutDesk(parseLayoutDesk(entity.getLayoutDesk()));

    bean.setPortaScorrevole(entity.getPortaScorrevole());
    bean.setRipianoSuperiore(entity.getRipianoSuperiore());
    bean.setRipianoInferiore(entity.getRipianoInferiore());
    bean.setTecaPlexiglass(entity.getTecaPlexiglass());
    bean.setFronteLuminoso(entity.getFronteLuminoso());
    bean.setBorsa(entity.getBorsa());

    bean.setSuperficieStampaStorage(entity.getSuperficieStampaStorage());
    bean.setSviluppoMetriLineariStorage(entity.getSviluppoMetriLineariStorage());
    bean.setNumeroPezziStorage(entity.getNumeroPezziStorage());

    bean.setSuperficieStampaDesk(entity.getSuperficieStampaDesk());
    bean.setNumeroPezziDesk(entity.getNumeroPezziDesk());

    bean.setEspositoriConfig(entity.getEspositoriConfig());
    bean.setComplementiConfig(entity.getComplementiConfig());
    bean.setBorsaStandard(entity.getBorsaStand());
    bean.setBauleTrolley(entity.getBauleTrolley());
    bean.setStaffaMonitor(entity.getStaffaMonitor());
    bean.setMensola(entity.getMensola());
    bean.setSpotLight(entity.getSpotLight());
    bean.setKitFaro50w(entity.getKitFaro50w());
    bean.setKitFaro100w(entity.getKitFaro100w());
    bean.setQuadroElettrico16a(entity.getQuadroElettrico16a());
    bean.setNicchia(entity.getNicchia());
    bean.setPedana(entity.getPedana());

    bean.setQtaTipo30(entity.getQtaTipo30());
    bean.setQtaTipo50(entity.getQtaTipo50());
    bean.setQtaTipo100(entity.getQtaTipo100());

    bean.setNumeroPezziEspositori(entity.getNumeroPezziEspositori());
    bean.setSuperficieStampaEspositori(entity.getSuperficieStampaEspositori());

    bean.setRipiano30x30(entity.getRipiano30x30());
    bean.setRipiano50x50(entity.getRipiano50x50());
    bean.setRipiano100x50(entity.getRipiano100x50());

    bean.setTecaPlexiglass30x30x30(entity.getTecaPlexiglass30x30x30());
    bean.setTecaPlexiglass50x50x50(entity.getTecaPlexiglass50x50x50());
    bean.setTecaPlexiglass100x50x30(entity.getTecaPlexiglass100x50x30());

    bean.setRetroilluminazione30x30x100h(entity.getRetroilluminazione30x30x100h());
    bean.setRetroilluminazione50x50x100h(entity.getRetroilluminazione50x50x100h());
    bean.setRetroilluminazione100x50x100h(entity.getRetroilluminazione100x50x100h());

    bean.setServizioMontaggioSmontaggio(entity.getServizioMontaggioSmontaggio());
    bean.setServizioCertificazioni(entity.getServizioCertificazioni());
    bean.setServizioIstruzioniAssistenza(entity.getServizioIstruzioniAssistenza());

    bean.setExtraPercComplex(entity.getExtraPercComplex());
    bean.setExtraStandComplesso(entity.getExtraStandComplesso());
    bean.setCostoRetroilluminazione(entity.getCostoRetroilluminazione());

    bean.setAccessoriStandConfig(entity.getAccessoriStandConfig());

    bean.setBorsaEspositori(entity.getBorsaEspositori());
    bean.setPremontaggio(entity.getPremontaggio());

    bean.setMarginalitaStruttura(entity.getMarginalitaStruttura());
    bean.setMarginalitaGrafica(entity.getMarginalitaGrafica());
    bean.setMarginalitaRetroilluminazione(entity.getMarginalitaRetroilluminazione());
    bean.setMarginalitaAccessori(entity.getMarginalitaAccessori());
    bean.setMarginalitaPremontaggio(entity.getMarginalitaPremontaggio());

    bean.setMarginalitaStrutturaStorage(entity.getMarginalitaStrutturaStorage());
    bean.setMarginalitaGraficaStorage(entity.getMarginalitaGraficaStorage());
    bean.setMarginalitaPremontaggioStorage(entity.getMarginalitaPremontaggioStorage());

    bean.setMarginalitaStrutturaDesk(entity.getMarginalitaStrutturaDesk());
    bean.setMarginalitaGraficaDesk(entity.getMarginalitaGraficaDesk());
    bean.setMarginalitaPremontaggioDesk(entity.getMarginalitaPremontaggioDesk());
    bean.setMarginalitaAccessoriDesk(entity.getMarginalitaAccessoriDesk());

    bean.setMarginalitaStrutturaEspositori(entity.getMarginalitaStrutturaEspositori());
    bean.setMarginalitaGraficaEspositori(entity.getMarginalitaGraficaEspositori());
    bean.setMarginalitaPremontaggioEspositori(entity.getMarginalitaPremontaggioEspositori());
    bean.setMarginalitaAccessoriEspositori(entity.getMarginalitaAccessoriEspositori());

    bean.setTotalePreventivo(entity.getTotalePreventivo());
    bean.setTotaleCosti(entity.getTotaleCosti());

    if (entity.getProspect() != null) {
      bean.setProspect(prospectMapper.mapEntityToBean(entity.getProspect()));
    }
    return bean;
  }
}

