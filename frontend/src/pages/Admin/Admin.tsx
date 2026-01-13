import React from 'react';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs.tsx';
import {UserManagement} from '@/components/UserManagement.tsx';
import {ParametriACostoUnitario} from "@/pages/Admin/Components/ParametriACostoUnitario.tsx";
import {NumeroProfiliDistribuzione} from "@/pages/Admin/Components/NumeroProfiliDistribuzione.tsx";
import {CostoRetroilluminazione} from "@/pages/Admin/Components/CostoRetroilluminazione.tsx";
import {ListinoAccessoriStand} from "@/pages/Admin/Components/ListinoAccessoriStand.tsx";
import {ListinoAccessoriDesk} from "@/pages/Admin/Components/ListinoAccessoriDesk.tsx";
import {ListinoAccessoriEspositori} from "@/pages/Admin/Components/ListinoAccessoriEspositori.tsx";
import {CostiStrutturaDesk} from "@/pages/Admin/Components/CostiStrutturaDesk.tsx";
import {CostiStrutturaEspositori} from "@/pages/Admin/Components/CostiStrutturaEspositori.tsx";

export default function Admin() {
  return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Amministrazione</h1>

        <Tabs defaultValue="parametri" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="utenti">Gestione Utenti</TabsTrigger>
            <TabsTrigger value="parametri">Parametri Preventivatore</TabsTrigger>
          </TabsList>

          <TabsContent value="utenti" className="space-y-4">
            <UserManagement/>
          </TabsContent>

          <TabsContent value="parametri" className="space-y-6">
            <ParametriACostoUnitario/>
            <NumeroProfiliDistribuzione/>
            <CostoRetroilluminazione/>
            <ListinoAccessoriStand/>
            <ListinoAccessoriDesk/>
            <ListinoAccessoriEspositori/>
            <CostiStrutturaDesk/>
            <CostiStrutturaEspositori/>

          </TabsContent>
        </Tabs>
      </div>
  );
}
