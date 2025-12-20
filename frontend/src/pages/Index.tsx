import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart3, Users, FileText, TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { useAuth } from "../hooks/useAuth";

const Index = () => {
    const { user } = useAuth();

    // 🔹 PLACEHOLDER (verranno da /api/dashboard)
    const prospectsCount = 0;
    const preventiviCount = 0;
    const preventiviInCorso = 0;
    const valoreTotale = 0;

    const ultimiPreventivi: any[] = [];

    const valorePerStatus: { status: string; valore: number }[] = [];

    return (
        <div className="flex-1 space-y-6 p-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-muted-foreground">
                    Panoramica generale del sistema PrevT3
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Totale Anagrafiche
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{prospectsCount}</div>
                        <p className="text-xs text-muted-foreground">
                            prospect e clienti registrati
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Preventivi Totali
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{preventiviCount}</div>
                        <p className="text-xs text-muted-foreground">
                            preventivi creati
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Preventivi in Corso
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{preventiviInCorso}</div>
                        <p className="text-xs text-muted-foreground">
                            preventivi in lavorazione
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Valore Preventivi
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            €{valoreTotale.toLocaleString("it-IT")}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            valore totale preventivi
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 items-stretch">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Ultimi Preventivi</CardTitle>
                        <CardDescription>
                            I preventivi più recenti del sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6 text-muted-foreground">
                            Nessun preventivo ancora creato
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-full">
                    <CardHeader>
                        <CardTitle>Valore Preventivi per Status</CardTitle>
                        <CardDescription>
                            Distribuzione del valore preventivi per stato
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6 text-muted-foreground">
                            Nessun preventivo ancora creato
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Index;
