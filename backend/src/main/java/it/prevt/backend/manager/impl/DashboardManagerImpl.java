package it.prevt.backend.manager.impl;

import it.prevt.backend.bean.DashboardBean;
import it.prevt.backend.bean.ValorePerStatusBean;
import it.prevt.backend.entity.Preventivo;
import it.prevt.backend.manager.DashboardManager;
import it.prevt.backend.mapper.PreventiviMapper;
import it.prevt.backend.repository.DashboardRepository;
import it.prevt.backend.request.bean.PreventiviRequestBean;
import it.prevt.backend.utility.CalcUtility;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardManagerImpl implements DashboardManager {

  private final DashboardRepository repository;
  private final CalcUtility calcUtility;
  private final PreventiviMapper preventiviMapper;

  @Override
  public DashboardBean loadDashboard() {

    DashboardBean dashboardBean = new DashboardBean();
    dashboardBean.setProspectsCount(repository.getProspectList().size());

    PreventiviRequestBean request = new PreventiviRequestBean();
    List<Preventivo> totalePreventivi = repository.getPreventiviList(request);
    dashboardBean.setPreventiviCount(totalePreventivi.size());
    request.setStatiPreventivi(Preventivo.STATO_IN_CORSO);
    dashboardBean.setPreventiviInCorso(repository.getPreventiviList(request).size());
    dashboardBean.setValoreTotale(
        calcUtility.sumBigDecimalValues(totalePreventivi, Preventivo::getTotalePreventivo));
    dashboardBean.setUltimiPreventivi(
        totalePreventivi.stream().sorted(Comparator.comparing(Preventivo::getCreatedAt).reversed())
            .limit(5).map(preventiviMapper::mapEntityToBean).toList());
    dashboardBean.setValorePerStatus(
        totalePreventivi.stream().filter(p -> p.getTotalePreventivo() != null).collect(
                Collectors.groupingBy(Preventivo::getStatus,
                    Collectors.mapping(Preventivo::getTotalePreventivo,
                        Collectors.reducing(BigDecimal.ZERO, BigDecimal::add)))).entrySet().stream()
            .map(e -> new ValorePerStatusBean(e.getKey(), e.getValue())).toList());

    return dashboardBean;
  }

}

