package it.prevt.backend.request.bean;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class PreventiviRequestBean {

    private List<String> statiPreventivi;
    private UUID preventivoId;

}
