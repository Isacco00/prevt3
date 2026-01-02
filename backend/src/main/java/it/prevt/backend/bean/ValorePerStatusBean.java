package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class ValorePerStatusBean {

  private String status;
  private BigDecimal totaleValore;

  public ValorePerStatusBean(String key, BigDecimal value) {
    this.status = key;
    this.totaleValore = value;
  }
}
