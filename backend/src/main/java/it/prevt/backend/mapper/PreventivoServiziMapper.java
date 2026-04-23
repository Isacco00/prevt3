package it.prevt.backend.mapper;

import it.prevt.backend.bean.PreventivoServiziBean;
import it.prevt.backend.entity.PreventivoServizi;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PreventivoServiziMapper
    extends AbstractMapper<PreventivoServizi, PreventivoServiziBean> {

  protected PreventivoServiziBean doMapping(PreventivoServizi entity) {
    return doMapping(new PreventivoServiziBean(), entity);
  }

  protected PreventivoServiziBean doMapping(PreventivoServiziBean bean,
      PreventivoServizi entity) {
    bean.setId(entity.getId());
    if (entity.getPreventivo() != null) {
      bean.setPreventivoId(entity.getPreventivo().getId().toString());
    }
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    bean.setMontaggioSmontaggio(entity.getMontaggioSmontaggio());
    bean.setCertificazioni(entity.getCertificazioni());
    bean.setIstruzioniAssistenza(entity.getIstruzioniAssistenza());

    bean.setPersonaleMont(entity.getPersonaleMont());
    bean.setCostoOrarioMont(entity.getCostoOrarioMont());
    bean.setGiorniMontaggio(entity.getGiorniMontaggio());
    bean.setOreLavoroCantxperMont(entity.getOreLavoroCantxperMont());
    bean.setKmArMont(entity.getKmArMont());
    bean.setConsegCant(entity.getConsegCant());
    bean.setVoloMont(entity.getVoloMont());
    bean.setTrenoMont(entity.getTrenoMont());
    bean.setOreViaggioTrasfertaMont(entity.getOreViaggioTrasfertaMont());
    bean.setViaggioAutoComMont(entity.getViaggioAutoComMont());
    bean.setExtraCostiTrasfertaMont(entity.getExtraCostiTrasfertaMont());
    bean.setExtraKmTraspFurgMont(entity.getExtraKmTraspFurgMont());
    bean.setExtraKmTraspTirMont(entity.getExtraKmTraspTirMont());
    bean.setRicaricoMontaggio(entity.getRicaricoMontaggio());

    bean.setTotCostOreMont(entity.getTotCostOreMont());
    bean.setTotCostKmMont(entity.getTotCostKmMont());
    bean.setNumVitti(entity.getNumVitti());
    bean.setNumAlloggi(entity.getNumAlloggi());
    bean.setTotCostVittall(entity.getTotCostVittall());
    bean.setTotCostoVoloAr(entity.getTotCostoVoloAr());
    bean.setTotCostoTreno(entity.getTotCostoTreno());
    bean.setTotCostoTrasfPers(entity.getTotCostoTrasfPers());
    bean.setTotCostiAuto(entity.getTotCostiAuto());
    bean.setTotCostiExtraTrasfMont(entity.getTotCostiExtraTrasfMont());
    bean.setTotCostiExtraKmTraspFurgMont(entity.getTotCostiExtraKmTraspFurgMont());
    bean.setTotCostiExtraKmTraspTirMont(entity.getTotCostiExtraKmTraspTirMont());
    bean.setTotCostiConsegnaCantiere(entity.getTotCostiConsegnaCantiere());
    bean.setTotaleCostoMontaggio(entity.getTotaleCostoMontaggio());
    bean.setPreventivoMontaggio(entity.getPreventivoMontaggio());

    bean.setPersonaleSmon(entity.getPersonaleSmon());
    bean.setCostoOrarioSmon(entity.getCostoOrarioSmon());
    bean.setGiorniSmontaggioViaggio(entity.getGiorniSmontaggioViaggio());
    bean.setOreLavoroCantxperSmon(entity.getOreLavoroCantxperSmon());
    bean.setKmArSmon(entity.getKmArSmon());
    bean.setVoloSmon(entity.getVoloSmon());
    bean.setTrenoSmon(entity.getTrenoSmon());
    bean.setOreViaggioTrasfertaSmon(entity.getOreViaggioTrasfertaSmon());
    bean.setViaggioAutoComSmon(entity.getViaggioAutoComSmon());
    bean.setExtraCostiTrasfertaSmon(entity.getExtraCostiTrasfertaSmon());
    bean.setExtraKmTraspFurgSmon(entity.getExtraKmTraspFurgSmon());
    bean.setExtraKmTraspTirSmon(entity.getExtraKmTraspTirSmon());

    bean.setTotCostOreSmon(entity.getTotCostOreSmon());
    bean.setTotCostKmSmon(entity.getTotCostKmSmon());
    bean.setNumVittiSmon(entity.getNumVittiSmon());
    bean.setNumAlloggiSmon(entity.getNumAlloggiSmon());
    bean.setTotCostVittallSmon(entity.getTotCostVittallSmon());
    bean.setTotCostoVoloArSmon(entity.getTotCostoVoloArSmon());
    bean.setTotCostoTrenoSmon(entity.getTotCostoTrenoSmon());
    bean.setTotCostoTrasfPersSmon(entity.getTotCostoTrasfPersSmon());
    bean.setTotCostiAutoSmon(entity.getTotCostiAutoSmon());
    bean.setTotCostiExtraTrasfSmon(entity.getTotCostiExtraTrasfSmon());
    bean.setTotCostiExtraKmTraspFurgSmon(entity.getTotCostiExtraKmTraspFurgSmon());
    bean.setTotCostiExtraKmTraspTirSmon(entity.getTotCostiExtraKmTraspTirSmon());
    bean.setTotaleCostoSmontaggio(entity.getTotaleCostoSmontaggio());
    bean.setPreventivoSmontaggio(entity.getPreventivoSmontaggio());
    return bean;
  }
}
