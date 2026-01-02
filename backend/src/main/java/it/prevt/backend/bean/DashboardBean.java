package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class DashboardBean {

    private long prospectsCount;
    private long preventiviCount;
    private long preventiviInCorso;
    private BigDecimal valoreTotale;

    private List<PreventiviBean> ultimiPreventivi;
    private List<ValorePerStatusBean> valorePerStatus;

}
