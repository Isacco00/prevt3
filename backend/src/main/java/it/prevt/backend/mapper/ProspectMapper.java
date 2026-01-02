package it.prevt.backend.mapper;

import it.prevt.backend.bean.ProspectBean;
import it.prevt.backend.entity.Prospect;
import org.springframework.stereotype.Component;

@Component
public class ProspectMapper extends AbstractMapper<Prospect, ProspectBean> {

  protected ProspectBean doMapping(Prospect entity) {
    return doMapping(new ProspectBean(), entity);
  }

  protected ProspectBean doMapping(ProspectBean bean, Prospect entity) {
    bean.setId(entity.getId());
    bean.setRagioneSociale(entity.getRagioneSociale());
    bean.setPartitaIva(entity.getPartitaIva());
    bean.setCodiceFiscale(entity.getCodiceFiscale());
    bean.setIndirizzo(entity.getIndirizzo());
    bean.setCitta(entity.getCitta());
    bean.setCap(entity.getCap());
    bean.setProvincia(entity.getProvincia());
    bean.setTelefono(entity.getTelefono());
    bean.setEmail(entity.getEmail());
    bean.setTipo(entity.getTipo());
    bean.setCreatedAt(entity.getCreatedAt());
    bean.setUpdatedAt(entity.getUpdatedAt());
    bean.setTipoProspect(entity.getTipoProspect());
    return bean;
  }
}
