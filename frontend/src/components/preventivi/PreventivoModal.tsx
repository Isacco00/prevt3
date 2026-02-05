import React, {useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {ChevronDown} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {StandSection} from "@/components/preventivi/StandSection.tsx";
import {StorageSection} from "@/components/preventivi/StorageSection.tsx";
import {DeskSection} from "@/components/preventivi/DeskSection.tsx";
import {TotalePreventivoSection} from "@/components/preventivi/TotalePreventivoSection.tsx";
import {PreventivoBean} from "@/types/preventivo.ts";
import {PreventivoAnagrafica} from "@/components/preventivi/PreventivoAnagrafica.tsx";
import {ExpositoreSection} from "@/components/preventivi/ExpositoreSection.tsx";
import {AltriBeniServiziSection} from "@/components/preventivi/AltriBeniServiziSection.tsx";
import {CondizioniFornituraSection} from "@/components/preventivi/CondizioniFornituraSection.tsx";
import {ServicesSection} from "@/components/preventivi/ServicesSection.tsx";

interface PreventivoModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  formData: PreventivoBean;
  setFormData: React.Dispatch<React.SetStateAction<PreventivoBean>>;
  isEditing: boolean;
}

export function PreventivoModal({
                                  open,
                                  onOpenChange,
                                  formData,
                                  setFormData,
                                  isEditing,
                                }: PreventivoModalProps) {
  // State per controllare le sezioni collassabili
  const [sectionsOpen, setSectionsOpen] = useState({
    stand: false,
    storage: false,
    desk: false,
    espositori: false,
    servizi: false,
    altriBeniServizi: false,
    condizioniFornitura: false
  });

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Modifica Preventivo' : 'Nuovo Preventivo'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Modifica il preventivo esistente' : 'Crea un nuovo preventivo compilando le sezioni seguenti'}.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-8">
            <PreventivoAnagrafica formData={formData} setFormData={setFormData}/>
            <Separator/>
            {/* Sezione Stand - collassabile */}
            <Collapsible open={sectionsOpen.stand} onOpenChange={open => setSectionsOpen(prev => ({
              ...prev,
              stand: open
            }))}>
              <div
                  className="bg-[hsl(var(--section-stand))] border border-[hsl(var(--section-stand-border))] rounded-lg overflow-hidden">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost"
                          className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-stand-border))] rounded-none border-0">
                    <div className="flex items-center gap-3">
                      <div
                          className="w-3 h-3 rounded-full bg-[hsl(var(--section-stand-foreground))]"></div>
                      <span
                          className="font-medium text-[hsl(var(--section-stand-foreground))]">Stand</span>
                      <span
                          className="ml-2 text-xs bg-[hsl(var(--section-stand-foreground))] text-[hsl(var(--section-stand))] px-2 py-1 rounded-full">
                            Principale
                          </span>
                    </div>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-stand-foreground))] ${sectionsOpen.stand ? 'rotate-180' : ''}`}/>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="border-t border-[hsl(var(--section-stand-border))] bg-card p-6">
                    <StandSection formData={formData} setFormData={setFormData}/>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
            {/* Sezioni aggiuntive collassabili */}
            <div className="space-y-3">
              <Collapsible open={sectionsOpen.storage}
                           onOpenChange={open => setSectionsOpen(prev => ({
                             ...prev,
                             storage: open
                           }))}>
                <div
                    className="bg-[hsl(var(--section-storage))] border border-[hsl(var(--section-storage-border))] rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-storage-border))] rounded-none border-0">
                      <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full bg-[hsl(var(--section-storage-foreground))]"></div>
                        <span
                            className="font-medium text-[hsl(var(--section-storage-foreground))]">Storage</span>
                      </div>
                      <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-storage-foreground))] ${sectionsOpen.storage ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div
                        className="border-t border-[hsl(var(--section-storage-border))] bg-card p-6">
                      <StorageSection formData={formData} setFormData={setFormData}/>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>

              <Collapsible open={sectionsOpen.desk} onOpenChange={open => setSectionsOpen(prev => ({
                ...prev,
                desk: open
              }))}>
                <div
                    className="bg-[hsl(var(--section-desk))] border border-[hsl(var(--section-desk-border))] rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-desk-border))] rounded-none border-0">
                      <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full bg-[hsl(var(--section-desk-foreground))]"></div>
                        <span
                            className="font-medium text-[hsl(var(--section-desk-foreground))]">Desk</span>
                      </div>
                      <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-desk-foreground))] ${sectionsOpen.desk ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-[hsl(var(--section-desk-border))] bg-card p-6">
                      <DeskSection formData={formData} setFormData={setFormData}/>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
              <Collapsible open={sectionsOpen.espositori}
                           onOpenChange={open => setSectionsOpen(prev => ({
                             ...prev,
                             espositori: open
                           }))}>
                <div
                    className="bg-[hsl(var(--section-expo))] border border-[hsl(var(--section-expo-border))] rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-expo-border))] rounded-none border-0">
                      <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full bg-[hsl(var(--section-expo-foreground))]"></div>
                        <span
                            className="font-medium text-[hsl(var(--section-expo-foreground))]">Espositori/Plinto</span>
                      </div>
                      <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-expo-foreground))] ${sectionsOpen.espositori ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-[hsl(var(--section-expo-border))] bg-card p-6">
                      <ExpositoreSection formData={formData} setFormData={setFormData}/>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
              <Collapsible open={sectionsOpen.servizi} onOpenChange={open => setSectionsOpen(prev => ({
                ...prev,
                servizi: open
              }))}>
                <div
                    className="bg-[hsl(var(--section-complement))] border border-[hsl(var(--section-complement-border))] rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-complement-border))] rounded-none border-0 px-[15px]">
                      <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full bg-[hsl(var(--section-complement-foreground))]"></div>
                        <span
                            className="font-medium text-[hsl(var(--section-complement-foreground))]">Servizi</span>
                      </div>
                      <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-complement-foreground))] ${sectionsOpen.servizi ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div
                        className="border-t border-[hsl(var(--section-complement-border))] bg-card p-6">
                      <ServicesSection formData={formData} setFormData={setFormData}
                                       preventivoId={formData?.id}/>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
              <Collapsible open={sectionsOpen.altriBeniServizi}
                           onOpenChange={open => setSectionsOpen(prev => ({
                             ...prev,
                             altriBeniServizi: open
                           }))}>
                <div
                    className="bg-[hsl(var(--section-services))] border border-[hsl(var(--section-services-border))] rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-services-border))] rounded-none border-0">
                      <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full bg-[hsl(var(--section-services-foreground))]"></div>
                        <span
                            className="font-medium text-[hsl(var(--section-services-foreground))]">Altri Beni/Servizi</span>
                      </div>
                      <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-services-foreground))] ${sectionsOpen.altriBeniServizi ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div
                        className="border-t border-[hsl(var(--section-services-border))] bg-card p-6 mx-0 my-0 px-[2px] py-[12px]">
                      <AltriBeniServiziSection preventivoId={formData?.id || ''}/>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
              <Collapsible open={sectionsOpen.condizioniFornitura}
                           onOpenChange={open => setSectionsOpen(prev => ({
                             ...prev,
                             condizioniFornitura: open
                           }))}>
                <div
                    className="bg-[hsl(var(--section-conditions))] border border-[hsl(var(--section-conditions-border))] rounded-lg overflow-hidden">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost"
                            className="w-full justify-between p-4 h-auto hover:bg-[hsl(var(--section-conditions-border))] rounded-none border-0">
                      <div className="flex items-center gap-3">
                        <div
                            className="w-3 h-3 rounded-full bg-[hsl(var(--section-conditions-foreground))]"></div>
                        <span
                            className="font-medium text-[hsl(var(--section-conditions-foreground))]">Condizioni di fornitura</span>
                      </div>
                      <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 text-[hsl(var(--section-conditions-foreground))] ${sectionsOpen.condizioniFornitura ? 'rotate-180' : ''}`}/>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div
                        className="border-t border-[hsl(var(--section-conditions-border))] bg-card p-6">
                      <CondizioniFornituraSection preventivoId={formData?.id || ''}/>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataScadenza">Data Scadenza</Label>
                <Input
                    id="dataScadenza"
                    type="date"
                    value={formData.dataScadenza ?? ""}
                    onChange={(e) =>
                        setFormData(prev => ({
                          ...prev,
                          dataScadenza: e.target.value || null
                        }))
                    }
                />
              </div>
            </div>

            {/* Sezione Totale Preventivo Fornitura */}
            <TotalePreventivoSection formData={formData} setFormData={setFormData}/>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea id="note" value={formData.note} onChange={e => setFormData({
                ...formData,
                note: e.target.value
              })} placeholder="Note aggiuntive"/>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annulla
              </Button>
              { /*<Button type="submit"
                      disabled={isSubmitting}>
                {editingPreventivo ? 'Aggiorna' : 'Salva'}
              </Button>*/}
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
}
