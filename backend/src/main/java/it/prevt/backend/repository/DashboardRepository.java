package it.prevt.backend.repository;

import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.entity.Prospect;
import it.prevt.backend.request.bean.PreventiviRequestBean;

import java.util.List;

public interface DashboardRepository {

    List<Preventivo> getPreventiviList(PreventiviRequestBean preventiviRequestBean);

    List<Prospect> getProspectList();
}
