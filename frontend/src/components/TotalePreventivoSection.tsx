import React from 'react';
import {Calculator} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

interface TotalePreventivoSectionProps {
    // Stand costs and margins
    standCosts: {
        strutturaTerra: number;
        graficaCordino: number;
        retroilluminazione: number;
        extraStandComplesso: number;
        costiAccessori: number;
        premontaggio: number;
        totale: number;
    };
    standMargins: {
        marginalitaStruttura: number;
        marginalitaGrafica: number;
        marginalitaRetroilluminazione: number;
        marginalitaAccessori: number;
        marginalitaPremontaggio: number;
    };

    // Storage costs and margins
    storageCosts: {
        costoStrutturaStorage: number;
        costoGraficaStorage: number;
        costoPremontaggioStorage: number;
        costoTotaleStorage: number;
    };
    storageMargins: {
        marginalitaStrutturaStorage: number;
        marginalitaGraficaStorage: number;
        marginalitaPremontaggioStorage: number;
    };

    // Desk costs and margins
    deskCosts: {
        strutturaTerra?: number;
        graficaCordino?: number;
        premontaggio?: number;
        accessori?: number;
        totale?: number;
    };
    deskMargins: {
        marginalitaStrutturaDesk: number;
        marginalitaGraficaDesk: number;
        marginalitaPremontaggiDesk: number;
        marginalitaAccessoriDesk: number;
    };

    // Espositori costs and margins
    espositoriCosts: {
        strutturaEspositori: number;
        graficaEspositori: number;
        premontaggioEspositori: number;
        accessoriEspositori: number;
        costoTotaleEspositori: number;
    };
    espositoriMargins: {
        marginalitaStrutturaEspositori: number;
        marginalitagraficaEspositori: number;
        marginalitapremontaggioEspositori: number;
        marginalitaaccessoriEspositori: number;
    };

    // Services
    servicesTotal: number;
    servicesCost: number;

    // Altri Beni/Servizi
    altriBeniServiziTotal: number;
    altriBeniServiziCost: number;
    onTotalsCalculated?: (totals: { totalePreventivo: number; totaleCosti: number }) => void;
}

export function TotalePreventivoSection({
                                            standCosts,
                                            standMargins,
                                            storageCosts,
                                            storageMargins,
                                            deskCosts,
                                            deskMargins,
                                            espositoriCosts,
                                            espositoriMargins,
                                            servicesTotal,
                                            servicesCost,
                                            altriBeniServiziTotal,
                                            altriBeniServiziCost,
                                            onTotalsCalculated
                                        }) {

    // Calculate preventivo totals (costs + margins)
    const calculatePreventivoWithMargin = (cost: number, margin: number) => {
        return cost * (1 + margin / 100);
    };

    // Struttura totals
    const costoStruttura = standCosts.strutturaTerra + storageCosts.costoStrutturaStorage + (deskCosts.strutturaTerra || 0) + espositoriCosts.strutturaEspositori;
    const preventivoStruttura =
        calculatePreventivoWithMargin(standCosts.strutturaTerra, standMargins.marginalitaStruttura) +
        calculatePreventivoWithMargin(storageCosts.costoStrutturaStorage, storageMargins.marginalitaStrutturaStorage) +
        calculatePreventivoWithMargin(deskCosts.strutturaTerra, deskMargins.marginalitaStrutturaDesk) +
        calculatePreventivoWithMargin(espositoriCosts.strutturaEspositori, espositoriMargins.marginalitaStrutturaEspositori);

    // Grafiche totals
    const costoGrafiche = standCosts.graficaCordino + storageCosts.costoGraficaStorage + (deskCosts.graficaCordino || 0) + espositoriCosts.graficaEspositori;
    const preventivoGrafiche =
        calculatePreventivoWithMargin(standCosts.graficaCordino, standMargins.marginalitaGrafica) +
        calculatePreventivoWithMargin(storageCosts.costoGraficaStorage, storageMargins.marginalitaGraficaStorage) +
        calculatePreventivoWithMargin(deskCosts.graficaCordino, deskMargins.marginalitaGraficaDesk) +
        calculatePreventivoWithMargin(espositoriCosts.graficaEspositori, espositoriMargins.marginalitagraficaEspositori);

    // Retroilluminazione (only for stands)
    const costoRetroilluminazione = standCosts.retroilluminazione;
    const preventivoRetroilluminazione = calculatePreventivoWithMargin(standCosts.retroilluminazione, standMargins.marginalitaRetroilluminazione);

    // Extra per struttura complessa (only for stands)
    const costoExtraComplessa = standCosts.extraStandComplesso;
    // const preventivoExtraComplessa = calculatePreventivoWithMargin(standCosts.extraStandComplesso, standMargins.marginalitaStruttura);

    // Accessori totals
    const costoAccessori = standCosts.costi_accessori + (deskCosts.accessori ?? 0) + espositoriCosts.accessoriEspositori;
    const preventivoAccessori =
        calculatePreventivoWithMargin(standCosts.costi_accessori, standMargins.marginalitaAccessori) +
        calculatePreventivoWithMargin(deskCosts.accessori ?? 0, deskMargins.marginalitaAccessoriDesk) +
        calculatePreventivoWithMargin(espositoriCosts.accessoriEspositori, espositoriMargins.marginalitaaccessoriEspositori);

    // Premontaggi totals
    const costoPremontaggi = standCosts.premontaggio + storageCosts.costoPremontaggioStorage + (deskCosts.premontaggio ?? 0) + espositoriCosts.premontaggioEspositori;
    const preventivoPremontaggi =
        calculatePreventivoWithMargin(standCosts.premontaggio, standMargins.marginalitaPremontaggio) +
        calculatePreventivoWithMargin(storageCosts.costoPremontaggioStorage, storageMargins.marginalitaPremontaggioStorage) +
        calculatePreventivoWithMargin(deskCosts.premontaggio ?? 0, deskMargins.marginalitaPremontaggiDesk) +
        calculatePreventivoWithMargin(espositoriCosts.premontaggioEspositori, espositoriMargins.marginalitapremontaggioEspositori);


    // Final totals
    const costoTotale = costoStruttura + costoGrafiche + costoRetroilluminazione + costoAccessori +
        costoPremontaggi + servicesCost + altriBeniServiziCost;

    const preventivoTotale = preventivoStruttura + preventivoGrafiche + preventivoRetroilluminazione +
        costoExtraComplessa + preventivoAccessori + preventivoPremontaggi +
        servicesTotal + altriBeniServiziTotal;

    // Marginalità media
    const marginalitaMedia = costoTotale > 0 ? ((preventivoTotale - costoTotale) / costoTotale) * 100 : 0;

    // Expose calculated values to parent component
    React.useEffect(() => {
        if (onTotalsCalculated) {
            onTotalsCalculated({
                totalePreventivo: parseFloat(preventivoTotale.toFixed(2)),
                totaleCosti: parseFloat(costoTotale.toFixed(2))
            });
        }
    }, [preventivoTotale, costoTotale, onTotalsCalculated]);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5"/>
                <h3 className="text-lg font-semibold">Totale Preventivo Fornitura</h3>
            </div>

            {/* Grid with individual category cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Totale Struttura</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{preventivoStruttura.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Totale grafiche</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{preventivoGrafiche.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Retroilluminazione</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{preventivoRetroilluminazione.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Extra per struttura complessa</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{costoExtraComplessa.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Totali accessori</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{preventivoAccessori.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Totali Premontaggi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{preventivoPremontaggi.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Totali Servizi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{servicesTotal.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="text-center">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Totali Altri Beni/Servizi</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{altriBeniServiziTotal.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Final totals card */}
            <Card className="border-2 border-primary">
                <CardContent className="p-6">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-sm font-medium mb-2">Totale preventivo</div>
                            <div className="text-3xl font-bold">€{preventivoTotale.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium mb-2">Totale costi</div>
                            <div className="text-3xl font-bold">€{costoTotale.toFixed(2)}</div>
                        </div>
                        <div>
                            <div className="text-sm font-medium mb-2">Marginalità Media (%)</div>
                            <div className="text-3xl font-bold">{marginalitaMedia.toFixed(1)}%</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
