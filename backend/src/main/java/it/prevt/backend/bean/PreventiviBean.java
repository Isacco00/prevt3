package it.prevt.backend.bean;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
public class PreventiviBean {
    private UUID id;
    private String titolo;
    private String status;
    private BigDecimal totalePreventivo;
    private ProspectBean prospect;

}
