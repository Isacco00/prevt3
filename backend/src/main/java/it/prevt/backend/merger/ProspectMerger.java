package it.prevt.backend.merger;

import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.bean.UserBean;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ProspectMerger extends AbstractMerger<ProspectBean, Prospect> {

  @Override
  protected void doMerge(ProspectBean bean, Prospect entity) {
    entity.setRagioneSociale(bean.getRagioneSociale());
    entity.setRagioneSociale(bean.getRagioneSociale());
    entity.setPartitaIva(bean.getPartitaIva());
    entity.setCodiceFiscale(bean.getCodiceFiscale());
    entity.setIndirizzo(bean.getIndirizzo());
    entity.setCitta(bean.getCitta());
    entity.setCap(bean.getCap());
    entity.setProvincia(bean.getProvincia());
    entity.setTelefono(bean.getTelefono());
    entity.setEmail(bean.getEmail());
    entity.setTipo(bean.getTipo());
    entity.setCreatedAt(bean.getCreatedAt());
    entity.setUpdatedAt(bean.getUpdatedAt());
    entity.setTipoProspect(bean.getTipoProspect());
  }

}
