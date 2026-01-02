package it.prevt.backend.repository.impl;

import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.repository.DashboardRepository;
import it.prevt.backend.request.bean.PreventiviRequestBean;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class DashboardRepositoryImpl extends AbstractRepositoryImpl implements DashboardRepository {

    @Override
    public List<Preventivo> getPreventiviList(PreventiviRequestBean preventiviRequestBean) {
        Class<Preventivo> clazz = Preventivo.class;
        Map<String, Object> parameters = new HashMap<>();

        StringBuilder strQueryFrom = new StringBuilder(" SELECT p FROM " + clazz.getSimpleName() + " p ");
        StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

        if (preventiviRequestBean != null) {
            if (preventiviRequestBean.getStatiPreventivi() != null && !preventiviRequestBean.getStatiPreventivi().isEmpty()) {
                createListWhereClause("p", "status", preventiviRequestBean.getStatiPreventivi(), strQueryWhere, parameters);
            }
        }
        // Parameters
        String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
        TypedQuery<Preventivo> query = entityManager.createQuery(strQueryFinal, clazz);
        parameters.forEach(query::setParameter);
        return getResultList(query);
    }

    @Override
    public List<Prospect> getProspectList() {
        Class<Prospect> clazz = Prospect.class;
        Map<String, Object> parameters = new HashMap<>();

        StringBuilder strQueryFrom = new StringBuilder(" SELECT p FROM " + clazz.getSimpleName() + " p ");
        StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

        // Parameters
        String strQueryFinal = (strQueryFrom.append(strQueryWhere)).toString();
        TypedQuery<Prospect> query = entityManager.createQuery(strQueryFinal, clazz);
        parameters.forEach(query::setParameter);
        return getResultList(query);
    }
}
