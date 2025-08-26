import React from 'react';
import { Calculator } from 'lucide-react';

interface EmptySectionProps {
  sectionName: string;
}

export function EmptySection({ sectionName }: EmptySectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Calculator className="h-5 w-5" />
        <h4 className="text-md font-semibold">Dati di Ingresso per {sectionName}</h4>
      </div>
      
      <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted rounded-lg">
        <p>Configurazione {sectionName} in arrivo...</p>
        <p className="text-sm mt-2">Questa sezione sarà configurata prossimamente</p>
      </div>
    </div>
  );
}