import React, {useEffect} from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs.tsx';
import {UserManagement} from '@/components/UserManagement.tsx';
import {ParametriACostoUnitario} from "@/pages/Admin/Components/ParametriACostoUnitario.tsx";
import {NumeroProfiliDistribuzione} from "@/pages/Admin/Components/NumeroProfiliDistribuzione.tsx";
import {ListinoRetroilluminazione} from "@/pages/Admin/Components/ListinoRetroilluminazione.tsx";
import {ListinoAccessoriStand} from "@/pages/Admin/Components/ListinoAccessoriStand.tsx";
import {ListinoAccessoriDesk} from "@/pages/Admin/Components/ListinoAccessoriDesk.tsx";
import {ListinoAccessoriEspositori} from "@/pages/Admin/Components/ListinoAccessoriEspositori.tsx";
import {ListinoStrutturaDesk} from "@/pages/Admin/Components/ListinoStrutturaDesk.tsx";
import {ListinoStrutturaEspositori} from "@/pages/Admin/Components/ListinoStrutturaEspositori.tsx";
import {ListinoStrutturaStand} from "@/pages/Admin/Components/ListinoStrutturaStand.tsx";
import {ListinoServiziPrezzoUnitario} from "@/pages/Admin/Components/ListinoServiziPrezzoUnitario.tsx";
import {CoefficientiNoleggio} from "@/pages/Admin/Components/CoefficienteNoleggio.tsx";
import {useSearchParams, useLocation} from "react-router-dom";

export default function Admin() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tabParam = searchParams.get('tab') ?? 'parametri';

  useEffect(() => {
    const hash = location.hash.slice(1);
    const timer = setTimeout(() => {
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({behavior: 'smooth', block: 'start'});
      } else {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [location.hash, location.search]);

  return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Amministrazione</h1>

        <Tabs key={tabParam} defaultValue={tabParam} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="utenti">Gestione Utenti</TabsTrigger>
            <TabsTrigger value="parametri">Parametri Preventivatore</TabsTrigger>
          </TabsList>

          <TabsContent value="utenti" className="space-y-4">
            <UserManagement/>
          </TabsContent>

          <TabsContent value="parametri" className="space-y-6">
            <div id="parametri-costi"><ParametriACostoUnitario/></div>
            <div id="servizi"><ListinoServiziPrezzoUnitario/></div>
            <div id="profili"><NumeroProfiliDistribuzione/></div>
            <div id="retroilluminazione"><ListinoRetroilluminazione/></div>
            <div id="accessori-stand"><ListinoAccessoriStand/></div>
            <div id="accessori-desk"><ListinoAccessoriDesk/></div>
            <div id="accessori-espositori"><ListinoAccessoriEspositori/></div>
            <div id="struttura-stand"><ListinoStrutturaStand/></div>
            <div id="struttura-desk"><ListinoStrutturaDesk/></div>
            <div id="struttura-espositori"><ListinoStrutturaEspositori/></div>
            <div id="coefficienti"><CoefficientiNoleggio/></div>
          </TabsContent>
        </Tabs>
      </div>
  );
}
