import {ProspectBean} from "@/types/prospect.ts";
import {PreventivoBean} from "@/types/preventivo.ts";
import {MarginalitaPerProspectBean} from "@/types/marginalitaPerProspect.ts";

export function usePreventivoMargins({
                                         prospects,
                                         marginalitaProspect,
                                         setFormData
                                     }: {
    prospects: ProspectBean[];
    marginalitaProspect: MarginalitaPerProspectBean[];
    setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
}) {
    const updateMarginsBasedOnProspect = (prospectId: string) => {
        const selectedProspect = prospects.find(p => p.id === prospectId);

        if (!selectedProspect) {
            setFormData(prev => ({
                ...prev,
                prospect: prospectId ? { id: prospectId } : null
            }));
            return;
        }

        const defaultMargin = marginalitaProspect.find(
            m => m.tipoProspect === selectedProspect.tipoProspect
        );

        if (!defaultMargin) {
            setFormData(prev => ({
                ...prev,
                prospect: { id: prospectId }
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,

            // 🔗 collega il prospect
            prospect: { id: prospectId },

            // Stand
            marginalitaStruttura: defaultMargin.marginalita,
            marginalitaGrafica: defaultMargin.marginalita,
            marginalitaRetroilluminazione: defaultMargin.marginalita,
            marginalitaAccessori: defaultMargin.marginalita,
            marginalitaPremontaggio: defaultMargin.marginalita,

            // Storage
            marginalitaStrutturaStorage: defaultMargin.marginalita,
            marginalitaGraficaStorage: defaultMargin.marginalita,
            marginalitaPremontaggioStorage: defaultMargin.marginalita,

            // Desk
            marginalitaStrutturaDesk: defaultMargin.marginalita,
            marginalitaGraficaDesk: defaultMargin.marginalita,
            marginalitaPremontaggioDesk: defaultMargin.marginalita,
            marginalitaAccessoriDesk: defaultMargin.marginalita,

            // Espositori
            marginalitaStrutturaEspositori: defaultMargin.marginalita,
            marginalitaGraficaEspositori: defaultMargin.marginalita,
            marginalitaPremontaggioEspositori: defaultMargin.marginalita,
            marginalitaAccessoriEspositori: defaultMargin.marginalita
        }));
    };

    return { updateMarginsBasedOnProspect };
}
