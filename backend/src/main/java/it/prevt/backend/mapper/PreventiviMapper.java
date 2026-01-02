package it.prevt.backend.mapper;

import it.prevt.backend.bean.PreventiviBean;
import it.prevt.backend.entity.Preventivo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PreventiviMapper extends AbstractMapper<Preventivo, PreventiviBean> {

    private final ProspectMapper prospectMapper;

    protected PreventiviBean doMapping(Preventivo entity) {
        return doMapping(new PreventiviBean(), entity);
    }

    protected PreventiviBean doMapping(PreventiviBean bean, Preventivo entity) {
        bean.setId(entity.getId());
        bean.setStatus(entity.getStatus());
        bean.setTitolo(entity.getTitolo());
        bean.setTotalePreventivo(entity.getTotalePreventivo());

        if (entity.getProspect() != null) {
            bean.setProspect(prospectMapper.mapEntityToBean(entity.getProspect()));
        }
        return bean;
    }
}
