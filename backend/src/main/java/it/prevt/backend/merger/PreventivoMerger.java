package it.prevt.backend.merger;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.prevt.backend.bean.LayoutDeskBean;
import it.prevt.backend.bean.PreventivoBean;
import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.Parametri;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.repository.ProspectRepository;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PreventivoMerger extends AbstractMerger<PreventivoBean, Preventivo> {

  private static final ObjectMapper MAPPER = new ObjectMapper();
  private final ProspectRepository repository;

  public static String layoutDeskToJson(List<LayoutDeskBean> list) {
    if (list == null || list.isEmpty()) {
      return "[]";
    }
    try {
      return MAPPER.writeValueAsString(list);
    } catch (Exception e) {
      return "[]";
    }
  }


  @Override
  protected void doMerge(PreventivoBean bean, Preventivo entity) {
    entity.setNumeroPreventivo(bean.getNumeroPreventivo());
    entity.setTitolo(bean.getTitolo());
    entity.setDescrizione(bean.getDescrizione());
    entity.setLarghezza(bean.getLarghezza());
    entity.setAltezza(bean.getAltezza());
    entity.setCostoMq(bean.getCostoMq());
    entity.setCostoMc(bean.getCostoMc());
    entity.setCostoFisso(bean.getCostoFisso());
    entity.setStatus(bean.getStatus());
    entity.setDataScadenza(bean.getDataScadenza());
    entity.setNote(bean.getNote());
    entity.setCreatedAt(bean.getCreatedAt());
    entity.setUpdatedAt(bean.getUpdatedAt());
    entity.setProfondita(bean.getProfondita());
    entity.setLayout(bean.getLayout());
    entity.setDistribuzione(bean.getDistribuzione());
    entity.setComplessita(bean.getComplessita());
    entity.setSuperficieStampa(bean.getSuperficieStampa());
    entity.setSviluppoLineare(bean.getSviluppoLineare());
    entity.setNumeroPezzi(bean.getNumeroPezzi());
    entity.setCostoStruttura(bean.getCostoStruttura());
    entity.setCostoGrafica(bean.getCostoGrafica());
    entity.setCostoPremontaggio(bean.getCostoPremontaggio());
    entity.setCostoTotale(bean.getCostoTotale());
    entity.setTotale(bean.getTotale());
    entity.setBifaccialita(bean.getBifaccialita());
    entity.setRetroilluminazione(bean.getRetroilluminazione());

    entity.setLargStorage(bean.getLarghezzaStorage());
    entity.setProfStorage(bean.getProfonditaStorage());
    entity.setAltStorage(bean.getAltezzaStorage());
    entity.setLayoutStorage(bean.getLayoutStorage());
    entity.setNumeroPorte(bean.getNumeroPorte());
    entity.setDeskQta(bean.getDeskQta());
    entity.setLayoutDesk(layoutDeskToJson(bean.getLayoutDesk()));

    entity.setPortaScorrevole(bean.getPortaScorrevole());
    entity.setRipianoSuperiore(bean.getRipianoSuperiore());
    entity.setRipianoInferiore(bean.getRipianoInferiore());
    entity.setTecaPlexiglass(bean.getTecaPlexiglass());
    entity.setFronteLuminoso(bean.getFronteLuminoso());
    entity.setBorsa(bean.getBorsa());

    entity.setSuperficieStampaStorage(bean.getSuperficieStampaStorage());
    entity.setSviluppoMetriLineariStorage(bean.getSviluppoMetriLineariStorage());
    entity.setNumeroPezziStorage(bean.getNumeroPezziStorage());

    entity.setSuperficieStampaDesk(bean.getSuperficieStampaDesk());
    entity.setNumeroPezziDesk(bean.getNumeroPezziDesk());

    entity.setEspositoriConfig(bean.getEspositoriConfig());
    entity.setComplementiConfig(bean.getComplementiConfig());
    entity.setBorsaStand(bean.getBorsaStandard());
    entity.setBauleTrolley(bean.getBauleTrolley());
    entity.setStaffaMonitor(bean.getStaffaMonitor());
    entity.setMensola(bean.getMensola());
    entity.setSpotLight(bean.getSpotLight());
    entity.setKitFaro50w(bean.getKitFaro50w());
    entity.setKitFaro100w(bean.getKitFaro100w());
    entity.setQuadroElettrico16a(bean.getQuadroElettrico16a());
    entity.setNicchia(bean.getNicchia());
    entity.setPedana(bean.getPedana());

    entity.setQtaTipo30(bean.getQtaTipo30());
    entity.setQtaTipo50(bean.getQtaTipo50());
    entity.setQtaTipo100(bean.getQtaTipo100());

    entity.setNumeroPezziEspositori(bean.getNumeroPezziEspositori());
    entity.setSuperficieStampaEspositori(bean.getSuperficieStampaEspositori());

    entity.setRipiano30x30(bean.getRipiano30x30());
    entity.setRipiano50x50(bean.getRipiano50x50());
    entity.setRipiano100x50(bean.getRipiano100x50());

    entity.setTecaPlexiglass30x30x30(bean.getTecaPlexiglass30x30x30());
    entity.setTecaPlexiglass50x50x50(bean.getTecaPlexiglass50x50x50());
    entity.setTecaPlexiglass100x50x30(bean.getTecaPlexiglass100x50x30());

    entity.setRetroilluminazione30x30x100h(bean.getRetroilluminazione30x30x100h());
    entity.setRetroilluminazione50x50x100h(bean.getRetroilluminazione50x50x100h());
    entity.setRetroilluminazione100x50x100h(bean.getRetroilluminazione100x50x100h());

    entity.setServizioMontaggioSmontaggio(bean.isServizioMontaggioSmontaggio());
    entity.setServizioCertificazioni(bean.isServizioCertificazioni());
    entity.setServizioIstruzioniAssistenza(bean.isServizioIstruzioniAssistenza());

    entity.setExtraPercComplex(bean.getExtraPercComplex());
    entity.setExtraStandComplesso(bean.getExtraStandComplesso());
    entity.setCostoRetroilluminazione(bean.getCostoRetroilluminazione());

    entity.setAccessoriStandConfig(bean.getAccessoriStandConfig());
    entity.setAccessoriDeskConfig(bean.getAccessoriDeskConfig());

    entity.setBorsaEspositori(bean.getBorsaEspositori());
    entity.setPremontaggio(bean.isPremontaggio());
    entity.setPremontaggioStorage(bean.isPremontaggioStorage());
    entity.setPremontaggioDesk(bean.isPremontaggioDesk());
    entity.setPremontaggioEspositori(bean.isPremontaggioEspositori());

    entity.setScontoStrutturaTerra(bean.getScontoStrutturaTerra());
    entity.setGraficaCordinoAttiva(Boolean.TRUE.equals(bean.getGraficaCordinoAttiva()));
    entity.setScontoGraficaCordino(bean.getScontoGraficaCordino());
    entity.setScontoRetroilluminazione(bean.getScontoRetroilluminazione());
    entity.setScontoAccessoriVendita(bean.getScontoAccessoriVendita());
    entity.setScontoAccessoriNoleggio(bean.getScontoAccessoriNoleggio());
    entity.setScontoPremontaggio(bean.getScontoPremontaggio());
    entity.setScontoExtraStandComplesso(bean.getScontoExtraStandComplesso());

    entity.setMarginalitaStrutturaStorage(bean.getMarginalitaStrutturaStorage());
    entity.setMarginalitaGraficaStorage(bean.getMarginalitaGraficaStorage());
    entity.setMarginalitaPremontaggioStorage(bean.getMarginalitaPremontaggioStorage());
    entity.setScontoStrutturaStorage(bean.getScontoStrutturaStorage());
    entity.setScontoGraficaStorage(bean.getScontoGraficaStorage());
    entity.setScontoPremontaggioStorage(bean.getScontoPremontaggioStorage());
    entity.setGraficaStorageAttiva(bean.getGraficaStorageAttiva());
    entity.setScontoStrutturaGlobale(bean.getScontoStrutturaGlobale());
    entity.setScontoGraficaGlobale(bean.getScontoGraficaGlobale());
    entity.setScontoRetroilluminazioneGlobale(bean.getScontoRetroilluminazioneGlobale());
    entity.setScontoAccessoriGlobale(bean.getScontoAccessoriGlobale());
    entity.setScontoPremontaggiGlobale(bean.getScontoPremontaggiGlobale());
    entity.setScontoServiziGlobale(bean.getScontoServiziGlobale());
    entity.setScontoAltriBeniGlobale(bean.getScontoAltriBeniGlobale());

    entity.setMarginalitaStrutturaDesk(bean.getMarginalitaStrutturaDesk());
    entity.setMarginalitaGraficaDesk(bean.getMarginalitaGraficaDesk());
    entity.setMarginalitaPremontaggioDesk(bean.getMarginalitaPremontaggioDesk());
    entity.setMarginalitaAccessoriDesk(bean.getMarginalitaAccessoriDesk());
    entity.setScontoStrutturaDesk(bean.getScontoStrutturaDesk());
    entity.setScontoGraficaDesk(bean.getScontoGraficaDesk());
    entity.setScontoPremontaggioDesk(bean.getScontoPremontaggioDesk());
    entity.setScontoAccessoriDesk(bean.getScontoAccessoriDesk());

    entity.setMarginalitaStrutturaEspositori(bean.getMarginalitaStrutturaEspositori());
    entity.setMarginalitaGraficaEspositori(bean.getMarginalitaGraficaEspositori());
    entity.setMarginalitaPremontaggioEspositori(bean.getMarginalitaPremontaggioEspositori());
    entity.setMarginalitaAccessoriEspositori(bean.getMarginalitaAccessoriEspositori());

    entity.setScontoStrutturaEspositori(bean.getScontoStrutturaEspositori());
    entity.setScontoGraficaEspositori(bean.getScontoGraficaEspositori());
    entity.setScontoPremontaggioEspositori(bean.getScontoPremontaggioEspositori());
    entity.setScontoAccessoriEspositori(bean.getScontoAccessoriEspositori());

    entity.setTotalePreventivo(bean.getTotalePreventivo());
    entity.setTotaleCosti(bean.getTotaleCosti());

    if (bean.getProspect() != null) {
      entity.setProspect(repository.find(Prospect.class, bean.getProspect().getId()));
    }
    if (bean.getCoefficienteNoleggio() != null) {
      entity.setCoefficienteNoleggio(repository.find(Parametri.class, bean.getCoefficienteNoleggio().getId()));
    }
  }

}
