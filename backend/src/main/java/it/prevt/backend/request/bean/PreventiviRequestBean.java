package it.prevt.backend.request.bean;

import it.prevt.backend.enumerator.PreventivoStatus;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class PreventiviRequestBean {

    private List<PreventivoStatus> statiPreventivi;
    private UUID preventivoId;

}
