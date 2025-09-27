import React from 'react';
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TotalePreventivoSectionProps {
  // Stand costs and margins
  standCosts: {
    struttura_terra: number;
    grafica_cordino: number;
    retroilluminazione: number;
    extra_stand_complesso: number;
    costi_accessori: number;
    premontaggio: number;
    totale: number;
  };
  standMargins: {
    marginalita_struttura: number;
    marginalita_grafica: number;
    marginalita_retroilluminazione: number;
    marginalita_accessori: number;
    marginalita_premontaggio: number;
  };
  
  // Storage costs and margins
  storageCosts: {
    costo_struttura_storage: number;
    costo_grafica_storage: number;
    costo_premontaggio_storage: number;
    costo_totale_storage: number;
  };
  storageMargins: {
    marginalita_struttura_storage: number;
    marginalita_grafica_storage: number;
    marginalita_premontaggio_storage: number;
  };
  
  // Desk costs and margins
  deskCosts: {
    struttura_terra?: number;
    grafica_cordino?: number;
    premontaggio?: number;
    accessori?: number;
    totale?: number;
  };
  deskMargins: {
    marginalita_struttura_desk: number;
    marginalita_grafica_desk: number;
    marginalita_premontaggio_desk: number;
    marginalita_accessori_desk: number;
  };
  
  // Espositori costs and margins
  espositoriCosts: {
    struttura_espositori: number;
    grafica_espositori: number;
    premontaggio_espositori: number;
    accessori_espositori: number;
    costo_totale_espositori: number;
  };
  espositoriMargins: {
    marginalita_struttura_espositori: number;
    marginalita_grafica_espositori: number;
    marginalita_premontaggio_espositori: number;
    marginalita_accessori_espositori: number;
  };
  
  // Services
  servicesTotal: number;
  servicesCost: number;
  
  // Altri Beni/Servizi
  altriBeniServiziTotal: number;
  altriBeniServiziCost: number;
  onTotalsCalculated?: (totals: { totale_preventivo: number; totale_costi: number }) => void;
}

export const TotalePreventivoSection: React.FC<TotalePreventivoSectionProps> = ({
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
}) => {
 
  // Calculate preventivo totals (costs + margins)
  const calculatePreventivoWithMargin = (cost: number, margin: number) => {
    return cost * (1 + margin / 100);
  };

  // Struttura totals
  const costoStruttura = standCosts.struttura_terra + storageCosts.costo_struttura_storage + (deskCosts.struttura_terra || 0) + espositoriCosts.struttura_espositori;
  const preventivoStruttura = 
    calculatePreventivoWithMargin(standCosts.struttura_terra, standMargins.marginalita_struttura) +
    calculatePreventivoWithMargin(storageCosts.costo_struttura_storage, storageMargins.marginalita_struttura_storage) +
    calculatePreventivoWithMargin(deskCosts.struttura_terra || 0, deskMargins.marginalita_struttura_desk) +
    calculatePreventivoWithMargin(espositoriCosts.struttura_espositori, espositoriMargins.marginalita_struttura_espositori);

  // Grafiche totals
  const costoGrafiche = standCosts.grafica_cordino + storageCosts.costo_grafica_storage + (deskCosts.grafica_cordino || 0) + espositoriCosts.grafica_espositori;
  const preventivoGrafiche = 
    calculatePreventivoWithMargin(standCosts.grafica_cordino, standMargins.marginalita_grafica) +
    calculatePreventivoWithMargin(storageCosts.costo_grafica_storage, storageMargins.marginalita_grafica_storage) +
    calculatePreventivoWithMargin(deskCosts.grafica_cordino || 0, deskMargins.marginalita_grafica_desk) +
    calculatePreventivoWithMargin(espositoriCosts.grafica_espositori, espositoriMargins.marginalita_grafica_espositori);

  // Retroilluminazione (only for stands)
  const costoRetroilluminazione = standCosts.retroilluminazione;
  const preventivoRetroilluminazione = calculatePreventivoWithMargin(standCosts.retroilluminazione, standMargins.marginalita_retroilluminazione);

  // Extra per struttura complessa (only for stands)
  const costoExtraComplessa = standCosts.extra_stand_complesso;
  // const preventivoExtraComplessa = calculatePreventivoWithMargin(standCosts.extra_stand_complesso, standMargins.marginalita_struttura);

  // Accessori totals
  const costoAccessori = standCosts.costi_accessori + (deskCosts.accessori ?? 0) + espositoriCosts.accessori_espositori;
  const preventivoAccessori = 
    calculatePreventivoWithMargin(standCosts.costi_accessori, standMargins.marginalita_accessori) +
    calculatePreventivoWithMargin(deskCosts.accessori ?? 0, deskMargins.marginalita_accessori_desk) +
    calculatePreventivoWithMargin(espositoriCosts.accessori_espositori, espositoriMargins.marginalita_accessori_espositori);

  // Premontaggi totals
  const costoPremontaggi = standCosts.premontaggio + storageCosts.costo_premontaggio_storage + (deskCosts.premontaggio ?? 0) + espositoriCosts.premontaggio_espositori;
  const preventivoPremontaggi = 
    calculatePreventivoWithMargin(standCosts.premontaggio, standMargins.marginalita_premontaggio) +
    calculatePreventivoWithMargin(storageCosts.costo_premontaggio_storage, storageMargins.marginalita_premontaggio_storage) +
    calculatePreventivoWithMargin(deskCosts.premontaggio ?? 0, deskMargins.marginalita_premontaggio_desk) +
    calculatePreventivoWithMargin(espositoriCosts.premontaggio_espositori, espositoriMargins.marginalita_premontaggio_espositori);


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
        totale_preventivo: parseFloat(preventivoTotale.toFixed(2)),
        totale_costi: parseFloat(costoTotale.toFixed(2))
      });
    }
  }, [preventivoTotale, costoTotale, onTotalsCalculated]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5" />
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