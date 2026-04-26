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
