import React, { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Label } from "@/components/ui/label.tsx";
import { toast } from "sonner";
import { FornituraAPI } from "@/api/fornitura.ts";
import {
    CondizioniFornituraPreventiviBean,
    CondizioniStandardFornituraBean,
} from "@/types/fornitura.ts";

interface CondizioniFornituraProps {
    preventivoId: string;
}

export function CondizioniFornituraSection({ preventivoId }: CondizioniFornituraProps) {
    const queryClient = useQueryClient();

    const [localCondizioni, setLocalCondizioni] = useState<CondizioniFornituraPreventiviBean[]>([]);
    const didInitRef = useRef(false);

    // --- Fetch standard conditions ---
    const {
        data: standardCondizioni = [],
        isLoading: isLoadingStandard,
        isError: isErrorStandard,
    } = useQuery<CondizioniStandardFornituraBean[]>({
        queryKey: ["condizioni-standard-fornitura"],
        queryFn: () =>
            FornituraAPI.getCondizioniStandardFornitura({
                attivo: true,
                sortFields: [{ field: "CONDIZIONI_STANDARD_FORNITURA_ORDINE", desc: false }],
            }),
    });

    // --- Fetch preventivo conditions ---
    const {
        data: preventivoCondizioni = [],
        isLoading: isLoadingPreventivo,
        isError: isErrorPreventivo,
    } = useQuery<CondizioniFornituraPreventiviBean[]>({
        queryKey: ["condizioni-fornitura-preventivi", preventivoId],
        queryFn: () =>
            FornituraAPI.getCondizioniFornituraPreventivi({
                preventivoId,
                attivo: true,
                sortFields: [{ field: "CONDIZIONI_FORNITURA_PREVENTIVI_ORDINE", desc: false }],
            }),
        enabled: !!preventivoId,
    });

    // Build default conditions from standard list
    const defaultFromStandard = useMemo<CondizioniFornituraPreventiviBean[]>(() => {
        return standardCondizioni.map((std) => ({
            id: null,
            preventivoId: preventivoId,
            voce: std.voce,
            testo: std.testoStandard,
            selezionato: true,
            ordine: std.ordine,
            attivo: true,
        }));
    }, [standardCondizioni]);

    // --- Initialize local state ONCE when data arrives ---
    useEffect(() => {
        if (didInitRef.current) return;

        // aspetta almeno che una delle due liste abbia “senso”
        const hasPreventivo = preventivoCondizioni && preventivoCondizioni.length > 0;
        const hasStandard = defaultFromStandard && defaultFromStandard.length > 0;

        if (!hasPreventivo && !hasStandard) return;

        setLocalCondizioni(hasPreventivo ? preventivoCondizioni : defaultFromStandard);
        didInitRef.current = true;
    }, [preventivoCondizioni, defaultFromStandard]);

    // --- Save mutation (NO supabase) ---
    const saveConditionsMutation = useMutation({
        mutationFn: async (condizioni: CondizioniFornituraPreventiviBean[]) => {
            await FornituraAPI.saveCondizioniFornituraPreventivi(condizioni);
        },
        onSuccess: async () => {
            toast.success("Condizioni di fornitura aggiornate con successo");
            await queryClient.invalidateQueries({
                queryKey: ["condizioni-fornitura-preventivi", preventivoId],
            });
        },
        onError: (error) => {
            console.error("Error saving conditions:", error);
            toast.error("Errore nel salvare le condizioni di fornitura");
        },
    });

    const handleCheckboxChange = (index: number, checked: boolean) => {
        setLocalCondizioni((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], selezionato: checked };
            return updated;
        });
    };

    const handleTextChange = (index: number, text: string) => {
        setLocalCondizioni((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], testo: text };
            return updated;
        });
    };

    const handleSave = () => {
        if (!preventivoId) return;
        if (!localCondizioni.length) return;

        // se vuoi salvare anche quelle non selezionate, ok così.
        // se invece vuoi salvare SOLO le selezionate:
        // const payload = localCondizioni.filter(c => c.selezionato);
        const payload = localCondizioni;

        saveConditionsMutation.mutate(payload);
    };

    const isLoading = isLoadingStandard || isLoadingPreventivo;
    const isError = isErrorStandard || isErrorPreventivo;

    if (!preventivoId) return null;
    if (isLoading && !didInitRef.current) return null; // oppure skeleton
    if (isError) return null;

    if (!localCondizioni.length) return null;

    return (
        <div className="space-y-6">
            {localCondizioni.map((condizione, index) => (
                <div key={`${condizione.voce}-${index}`} className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`condizione-${index}`}
                            checked={!!condizione.selezionato}
                            onCheckedChange={(checked) => handleCheckboxChange(index, checked as boolean)}
                        />
                        <Label htmlFor={`condizione-${index}`} className="text-sm font-medium cursor-pointer">
                            {condizione.voce}
                        </Label>
                    </div>

                    <Textarea
                        value={condizione.testo ?? ""}
                        onChange={(e) => handleTextChange(index, e.target.value)}
                        placeholder="Inserisci testo"
                        className="min-h-[80px] resize-y"
                        rows={3}
                    />
                </div>
            ))}

            <div className="flex justify-end pt-4">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saveConditionsMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                    {saveConditionsMutation.isPending ? "Salvataggio..." : "Salva Condizioni"}
                </button>
            </div>
        </div>
    );
}
