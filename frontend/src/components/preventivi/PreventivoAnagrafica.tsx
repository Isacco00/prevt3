import React from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {FileText} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {useQuery} from "@tanstack/react-query";
import {ProspectsAPI} from "@/api/prospects";
import {PreventivoBean} from "@/types/preventivo";
import {usePreventivoMargins} from "@/hooks/usePreventivi";
import {MarginalitaPerProspectAPI} from "@/api/marginalitaPerProspect.ts";
import {ProspectBean} from "@/types/prospect.ts";
import {MarginalitaPerProspectBean} from "@/types/marginalitaPerProspect.ts";
import {ParametriAPI} from "@/api/parametri.ts";

interface PreventivoAnagraficaProps {
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}

export function PreventivoAnagrafica({
                                       formData,
                                       setFormData
                                     }: PreventivoAnagraficaProps) {

  // Prospects
  const {data: prospects = []} = useQuery<ProspectBean[]>({
    queryKey: ["prospects"],
    queryFn: ProspectsAPI.getProspects
  });

  // Marginalità per prospect
  const {data: marginalitaProspect = []} = useQuery<MarginalitaPerProspectBean[]>({
    queryKey: ["marginalita-per-prospect"],
    queryFn: () => MarginalitaPerProspectAPI.getMarginalitaPerProspectList({
      attivo: true
    })
  });

  const {updateMarginsBasedOnProspect} = usePreventivoMargins({
    prospects,
    marginalitaProspect,
    setFormData
  });

  const {data: coefficienti = []} = useQuery({
    queryKey: ['parametri', 'coefficiente'],
    queryFn: () =>
        ParametriAPI.getParametriList({
          tipo: 'coefficiente_noleggio',
        }),
  });

  return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5"/>
          <h3 className="text-lg font-semibold">1. Anagrafica Preventivo</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Numero Preventivo *</Label>
            <Input
                value={formData.numeroPreventivo}
                onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      numeroPreventivo: e.target.value
                    }))
                }
                required
            />
          </div>

          <div className="space-y-2">
            <Label>Titolo *</Label>
            <Input
                value={formData.titolo}
                onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      titolo: e.target.value
                    }))
                }
                required
            />
          </div>

          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select
                value={formData.prospect?.id ?? ""}
                onValueChange={updateMarginsBasedOnProspect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona un cliente"/>
              </SelectTrigger>
              <SelectContent>
                {prospects.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.ragioneSociale}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Stato</Label>
            <Select
                value={formData.status}
                onValueChange={value =>
                    setFormData(prev => ({
                      ...prev,
                      status: value
                    }))
                }>
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bozza">Bozza</SelectItem>
                <SelectItem value="inviato">Inviato</SelectItem>
                <SelectItem value="in_revisione">In Revisione</SelectItem>
                <SelectItem value="accettato">Accettato</SelectItem>
                <SelectItem value="rifiutato">Rifiutato</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Coeff. noleggio</Label>
            <Select
                value={formData.coefficienteNoleggio?.id}
                onValueChange={value => {
                  const selected = coefficienti.find(p => p.id === value)
                  setFormData(prev => ({
                    ...prev,
                    coefficienteNoleggio: selected || null,
                  }))
                }}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona coefficiente" />
              </SelectTrigger>

              <SelectContent>
                {coefficienti
                .filter(p => p.attivo)
                .map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome} (x{p.valore})
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Descrizione</Label>
          <Textarea
              value={formData.descrizione}
              onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    descrizione: e.target.value
                  }))
              }
          />
        </div>
      </div>
  );
}
