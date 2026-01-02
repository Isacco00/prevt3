import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {BarChart3, Users, FileText, TrendingUp} from "lucide-react";
import {useAuth} from "../hooks/useAuth";
import {useDashboard} from '@/hooks/useDashboard.tsx';
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart.tsx";
import {Bar, BarChart, XAxis, YAxis} from 'recharts';

const Index = () => {
    const {user} = useAuth();
    const { loadDashboard } = useDashboard();
    const { data, isError, isLoading } = loadDashboard(!!user);

    if (isError || !data) return <div>Errore caricamento dashboard</div>;

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
                        <Users className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.prospectsCount}</div>
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
                        <FileText className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.preventiviCount}</div>
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
                        <BarChart3 className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.preventiviInCorso}</div>
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
                        <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            €{data.valoreTotale.toLocaleString("it-IT")}
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
                        {data.ultimiPreventivi.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                                Nessun preventivo ancora creato
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {data.ultimiPreventivi.map((preventivo) => (
                                    <div key={preventivo.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">{preventivo.titolo}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {preventivo.prospect?.ragioneSociale || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">€{(preventivo.totalePreventivo || 0).toLocaleString('it-IT', {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })}</p>
                                            <p className="text-xs text-muted-foreground capitalize">{preventivo.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        {data.valorePerStatus.length === 0 ? (
                            <div className="text-center py-6 text-muted-foreground">
                                Nessun preventivo ancora creato
                            </div>
                        ) : (
                            <ChartContainer
                                config={{
                                    valore: {
                                        label: "Valore",
                                        color: "hsl(var(--chart-1))",
                                    },
                                }}
                                className="h-[300px]"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={data.valorePerStatus}
                                    layout="horizontal"
                                    margin={{
                                        left: 80,
                                        right: 20,
                                        top: 20,
                                        bottom: 20,
                                    }}
                                >
                                    <XAxis type="number"/>
                                    <YAxis
                                        dataKey="status"
                                        type="category"
                                        tickLine={false}
                                        tickMargin={10}
                                        axisLine={false}
                                        width={80}
                                    />
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent
                                            indicator="line"
                                            formatter={(value) => [`€${Number(value).toLocaleString('it-IT', {maximumFractionDigits: 2})}`, "Valore"]}
                                        />}
                                    />
                                    <Bar
                                        dataKey="totaleValore"
                                        fill="var(--color-valore)"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Index;
