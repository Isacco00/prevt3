package it.prevt.backend.bean;

import java.util.UUID;

public class ProspectBean {

    private UUID id;
    private String ragioneSociale;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRagioneSociale() {
        return ragioneSociale;
    }

    public void setRagioneSociale(String ragioneSociale) {
        this.ragioneSociale = ragioneSociale;
    }
}
