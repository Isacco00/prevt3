package it.prevt.backend.bean;

import it.prevt.backend.enumerator.PreventivoStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ValorePerStatusBean {

  private PreventivoStatus status;
  private BigDecimal totaleValore;

  public ValorePerStatusBean(PreventivoStatus key, BigDecimal value) {
    this.status = key;
    this.totaleValore = value;
  }
}
