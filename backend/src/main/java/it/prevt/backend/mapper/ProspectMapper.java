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
        return bean;
    }
}
