package it.prevt.backend.merger;

import it.prevt.backend.bean.PreventivoServiziBean;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.entity.PreventivoServizi;
import it.prevt.backend.repository.PreventivoRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PreventivoServiziMerger
    extends AbstractMerger<PreventivoServiziBean, PreventivoServizi> {

  private final PreventivoRepository repository;

  @Override
  protected void doMerge(PreventivoServiziBean bean, PreventivoServizi entity) {
    if (bean.getPreventivoId() != null) {
      Preventivo preventivo = repository.find(Preventivo.class,
          UUID.fromString(bean.getPreventivoId()));
      entity.setPreventivo(preventivo);
    }
    if (bean.getMontaggioSmontaggio() != null) {
      entity.setMontaggioSmontaggio(bean.getMontaggioSmontaggio());
    }
    if (bean.getCertificazioni() != null) {
      entity.setCertificazioni(bean.getCertificazioni());
    }
    if (bean.getIstruzioniAssistenza() != null) {
      entity.setIstruzioniAssistenza(bean.getIstruzioniAssistenza());
    }

    entity.setPersonaleMont(bean.getPersonaleMont());
    entity.setCostoOrarioMont(bean.getCostoOrarioMont());
    entity.setGiorniMontaggio(bean.getGiorniMontaggio());
    entity.setOreLavoroCantxperMont(bean.getOreLavoroCantxperMont());
    entity.setKmArMont(bean.getKmArMont());
    if (bean.getPuntoPartenza() != null) entity.setPuntoPartenza(bean.getPuntoPartenza());
    if (bean.getPuntoArrivo() != null) entity.setPuntoArrivo(bean.getPuntoArrivo());
    if (bean.getRientroDopomont() != null) entity.setRientroDopomont(bean.getRientroDopomont());
    if (bean.getGiorniViaggio() != null) entity.setGiorniViaggio(bean.getGiorniViaggio());
    if (bean.getPernottamentiViaggio() != null) entity.setPernottamentiViaggio(bean.getPernottamentiViaggio());
    if (bean.getTempoViaggioArMont() != null) entity.setTempoViaggioArMont(bean.getTempoViaggioArMont());
    if (bean.getCostoOrarioViaggio() != null) entity.setCostoOrarioViaggio(bean.getCostoOrarioViaggio());
    if (bean.getNoleggioMezzo() != null) entity.setNoleggioMezzo(bean.getNoleggioMezzo());
    if (bean.getGiorniNoleggio() != null) entity.setGiorniNoleggio(bean.getGiorniNoleggio());
    if (bean.getCostoPedaggi() != null) entity.setCostoPedaggi(bean.getCostoPedaggi());
    if (bean.getCostoVoloPp() != null) entity.setCostoVoloPp(bean.getCostoVoloPp());
    if (bean.getCostoTrenoPp() != null) entity.setCostoTrenoPp(bean.getCostoTrenoPp());
    entity.setConsegCant(bean.getConsegCant());
    entity.setVoloMont(bean.getVoloMont());
    entity.setTrenoMont(bean.getTrenoMont());
    entity.setOreViaggioTrasfertaMont(bean.getOreViaggioTrasfertaMont());
    entity.setViaggioAutoComMont(bean.getViaggioAutoComMont());
    entity.setExtraCostiTrasfertaMont(bean.getExtraCostiTrasfertaMont());
    entity.setExtraKmTraspFurgMont(bean.getExtraKmTraspFurgMont());
    entity.setExtraKmTraspTirMont(bean.getExtraKmTraspTirMont());
    entity.setRicaricoMontaggio(bean.getRicaricoMontaggio());
    entity.setScontoMontaggio(bean.getScontoMontaggio());

    entity.setTotCostOreMont(bean.getTotCostOreMont());
    entity.setTotCostKmMont(bean.getTotCostKmMont());
    entity.setNumVitti(bean.getNumVitti());
    entity.setNumAlloggi(bean.getNumAlloggi());
    entity.setTotCostVittall(bean.getTotCostVittall());
    entity.setTotCostoVoloAr(bean.getTotCostoVoloAr());
    entity.setTotCostoTreno(bean.getTotCostoTreno());
    entity.setTotCostoTrasfPers(bean.getTotCostoTrasfPers());
    entity.setTotCostiAuto(bean.getTotCostiAuto());
    if (bean.getTotCostNoleggio() != null) entity.setTotCostNoleggio(bean.getTotCostNoleggio());
    entity.setTotCostiExtraTrasfMont(bean.getTotCostiExtraTrasfMont());
    entity.setTotCostiExtraKmTraspFurgMont(bean.getTotCostiExtraKmTraspFurgMont());
    entity.setTotCostiExtraKmTraspTirMont(bean.getTotCostiExtraKmTraspTirMont());
    entity.setTotCostiConsegnaCantiere(bean.getTotCostiConsegnaCantiere());
    entity.setTotaleCostoMontaggio(bean.getTotaleCostoMontaggio());
    entity.setPreventivoMontaggio(bean.getPreventivoMontaggio());
    entity.setTotalePrezzoListinoMont(bean.getTotalePrezzoListinoMont());
    entity.setTotalePrezzoNettoMont(bean.getTotalePrezzoNettoMont());
    entity.setMargineMont(bean.getMargineMont());
    entity.setMarginalitaMont(bean.getMarginalitaMont());

    entity.setPersonaleSmon(bean.getPersonaleSmon());
    entity.setCostoOrarioSmon(bean.getCostoOrarioSmon());
    entity.setGiorniSmontaggioViaggio(bean.getGiorniSmontaggioViaggio());
    entity.setOreLavoroCantxperSmon(bean.getOreLavoroCantxperSmon());
    entity.setKmArSmon(bean.getKmArSmon());
    if (bean.getPuntoPartenzaSmon() != null) entity.setPuntoPartenzaSmon(bean.getPuntoPartenzaSmon());
    if (bean.getPuntoArrivoSmon() != null) entity.setPuntoArrivoSmon(bean.getPuntoArrivoSmon());
    if (bean.getRientroDoposmont() != null) entity.setRientroDoposmont(bean.getRientroDoposmont());
    if (bean.getGiorniViaggioSmon() != null) entity.setGiorniViaggioSmon(bean.getGiorniViaggioSmon());
    if (bean.getPernottamentiViaggioSmon() != null) entity.setPernottamentiViaggioSmon(bean.getPernottamentiViaggioSmon());
    if (bean.getTempoViaggioArSmon() != null) entity.setTempoViaggioArSmon(bean.getTempoViaggioArSmon());
    if (bean.getCostoOrarioViaggioSmon() != null) entity.setCostoOrarioViaggioSmon(bean.getCostoOrarioViaggioSmon());
    if (bean.getNoleggioMezzoSmon() != null) entity.setNoleggioMezzoSmon(bean.getNoleggioMezzoSmon());
    if (bean.getGiorniNoleggioSmon() != null) entity.setGiorniNoleggioSmon(bean.getGiorniNoleggioSmon());
    if (bean.getCostoPedaggiSmon() != null) entity.setCostoPedaggiSmon(bean.getCostoPedaggiSmon());
    if (bean.getCostoVoloPpSmon() != null) entity.setCostoVoloPpSmon(bean.getCostoVoloPpSmon());
    if (bean.getCostoTrenoPpSmon() != null) entity.setCostoTrenoPpSmon(bean.getCostoTrenoPpSmon());
    if (bean.getRitiroCant() != null) entity.setRitiroCant(bean.getRitiroCant());
    entity.setVoloSmon(bean.getVoloSmon());
    entity.setTrenoSmon(bean.getTrenoSmon());
    entity.setOreViaggioTrasfertaSmon(bean.getOreViaggioTrasfertaSmon());
    entity.setViaggioAutoComSmon(bean.getViaggioAutoComSmon());
    entity.setExtraCostiTrasfertaSmon(bean.getExtraCostiTrasfertaSmon());
    entity.setExtraKmTraspFurgSmon(bean.getExtraKmTraspFurgSmon());
    entity.setExtraKmTraspTirSmon(bean.getExtraKmTraspTirSmon());

    entity.setTotCostOreSmon(bean.getTotCostOreSmon());
    entity.setTotCostKmSmon(bean.getTotCostKmSmon());
    entity.setNumVittiSmon(bean.getNumVittiSmon());
    entity.setNumAlloggiSmon(bean.getNumAlloggiSmon());
    entity.setTotCostVittallSmon(bean.getTotCostVittallSmon());
    entity.setTotCostoVoloArSmon(bean.getTotCostoVoloArSmon());
    entity.setTotCostoTrenoSmon(bean.getTotCostoTrenoSmon());
    entity.setTotCostoTrasfPersSmon(bean.getTotCostoTrasfPersSmon());
    entity.setTotCostiAutoSmon(bean.getTotCostiAutoSmon());
    if (bean.getTotCostNoleggioSmon() != null) entity.setTotCostNoleggioSmon(bean.getTotCostNoleggioSmon());
    if (bean.getTotCostiRitiroCantiere() != null) entity.setTotCostiRitiroCantiere(bean.getTotCostiRitiroCantiere());
    entity.setTotCostiExtraTrasfSmon(bean.getTotCostiExtraTrasfSmon());
    entity.setTotCostiExtraKmTraspFurgSmon(bean.getTotCostiExtraKmTraspFurgSmon());
    entity.setTotCostiExtraKmTraspTirSmon(bean.getTotCostiExtraKmTraspTirSmon());
    entity.setTotaleCostoSmontaggio(bean.getTotaleCostoSmontaggio());
    entity.setPreventivoSmontaggio(bean.getPreventivoSmontaggio());
    entity.setTotalePrezzoListinoSmon(bean.getTotalePrezzoListinoSmon());
    entity.setTotalePrezzoNettoSmon(bean.getTotalePrezzoNettoSmon());
    entity.setMargineSmon(bean.getMargineSmon());
    entity.setMarginalitaSmon(bean.getMarginalitaSmon());
  }
}
