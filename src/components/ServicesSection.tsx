import React from 'react';
import { Settings } from 'lucide-react';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ServicesData {
  servizio_montaggio_smontaggio: boolean;
  servizio_certificazioni: boolean;
  servizio_istruzioni_assistenza: boolean;
}

interface ServicesSectionProps {
  formData: ServicesData;
  setFormData: (data: any) => void;
}

export function ServicesSection({ formData, setFormData }: ServicesSectionProps) {
  const handleCheckboxChange = (field: keyof ServicesData, checked: boolean) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  const services = [
    {
      id: 'servizio_montaggio_smontaggio' as keyof ServicesData,
      label: 'Montaggio/Smontaggio',
      description: 'Servizio di montaggio e smontaggio della struttura'
    },
    {
      id: 'servizio_certificazioni' as keyof ServicesData,
      label: 'Certificazioni',
      description: 'Documentazione e certificazioni necessarie'
    },
    {
      id: 'servizio_istruzioni_assistenza' as keyof ServicesData,
      label: 'Istruzioni e assistenza',
      description: 'Supporto tecnico e documentazione operativa'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-5 w-5" />
        <h4 className="text-md font-semibold">Dati di Ingresso per Servizi</h4>
      </div>
      
      <Card className="border-l-4 border-l-complement">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-complement">Servizi Aggiuntivi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="flex items-start space-x-3">
                <Checkbox
                  id={service.id}
                  checked={formData[service.id]}
                  onCheckedChange={(checked) => handleCheckboxChange(service.id, checked as boolean)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label 
                    htmlFor={service.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {service.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}