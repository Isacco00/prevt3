import React from 'react';
import {Settings} from 'lucide-react';
import {Label} from '../ui/label.tsx';
import {Checkbox} from '../ui/checkbox.tsx';
import {Card, CardContent, CardHeader, CardTitle} from '../ui/card.tsx';
import {Button} from '../ui/button.tsx';
import {useQuery} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {PreventivoBean} from "@/types/preventivo.ts";
import {ParametriAPI} from "@/api/parametri.ts";

interface ServicesSectionProps {
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
  preventivoId?: string;
}

export function ServicesSection({formData, setFormData, preventivoId}: ServicesSectionProps) {
  const navigate = useNavigate();

// Query for service costs (certificazione + istruzioni/assistenza)
  const {
    data: serviceCosts = {},
  } = useQuery({
    queryKey: ['service-costs'],
    queryFn: async () => {
      const res = await ParametriAPI.getParametriACostiUnitari({
        attivo: true,
        parametri: [
          'Costo_certificazione',
          'Costo_istruzionieassistenza',
        ],
      });
      const costs: Record<string, number> = {};
      res.forEach((p) => {
        costs[p.parametro] = Number(p.valore) || 0;
      });
      return costs;
    },
  });

  const handleCheckboxChange = (field: keyof PreventivoBean, checked: boolean) => {
    setFormData({
      ...formData,
      [field]: checked
    });
  };

  const handleMontaggioConfig = () => {
    if (preventivoId) {
      navigate(`/servizio-montaggio/${preventivoId}`);
    }
  };

  const getCostDisplay = (serviceId: string) => {
    if (serviceId === 'servizioCertificazioni' && serviceCosts?.['Costo_certificazione']) {
      return `€${serviceCosts['Costo_certificazione'].toFixed(2)}`;
    }
    if (serviceId === 'servizioIstruzioniAssistenza' && serviceCosts?.['Costo_istruzionieassistenza']) {
      return `€${serviceCosts['Costo_istruzionieassistenza'].toFixed(2)}`;
    }
    return null;
  };

  const services = [
    {
      id: 'servizioMontaggioSmontaggio' as keyof PreventivoBean,
      label: 'Montaggio/Smontaggio',
      description: 'Servizio di montaggio e smontaggio della struttura',
      showButton: true
    },
    {
      id: 'servizioCertificazioni' as keyof PreventivoBean,
      label: 'Certificazioni',
      description: 'Documentazione e certificazioni necessarie',
      showButton: false
    },
    {
      id: 'servizioIstruzioniAssistenza' as keyof PreventivoBean,
      label: 'Istruzioni e assistenza',
      description: 'Supporto tecnico e documentazione operativa',
      showButton: false
    }
  ];

  return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5"/>
          <h4 className="text-md font-semibold">Dati di Ingresso per Servizi</h4>
        </div>

        <Card className="border-l-4 border-l-complement">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-complement">Servizi Aggiuntivi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                  <div key={service.id} className="flex items-start justify-between w-full">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                          id={service.id}
                          checked={!!formData[service.id]}
                          onCheckedChange={(checked) => handleCheckboxChange(service.id, checked === true)}
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

                    <div className="flex items-center gap-2">
                      {service.showButton && formData[service.id] && (
                          <Button
                              size="sm"
                              variant="default"
                              onClick={handleMontaggioConfig}
                              className="text-xs"
                          >
                            Configura
                          </Button>
                      )}

                      {!service.showButton && getCostDisplay(service.id) && (
                          <span className="text-sm font-semibold text-primary">
                      {getCostDisplay(service.id)}
                    </span>
                      )}
                    </div>
                  </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}