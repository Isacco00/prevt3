import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Badge} from "@/components/ui/badge";
import {toast} from "@/components/ui/use-toast";
import {Plus, Edit, Search} from "lucide-react";
import {ProspectBean} from "@/types/prospects";
import {ProspectsAPI} from "@/api/prospects";

const Prospects = () => {
    const [prospects, setProspects] = useState<ProspectBean[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] =
        useState<"all" | "prospect" | "cliente">("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProspect, setEditingProspect] =
        useState<ProspectBean | null>(null);

    const [formData, setFormData] = useState({
        ragioneSociale: "",
        partitaIva: "",
        codiceFiscale: "",
        indirizzo: "",
        citta: "",
        cap: "",
        provincia: "",
        telefono: "",
        email: "",
        tipo: "prospect" as "prospect" | "cliente",
        tipoProspect: "Professional" as "Professional" | "Finale",
    });

    useEffect(() => {
        loadProspects();
    }, []);

    const loadProspects = async () => {
        try {
            const data = await ProspectsAPI.getProspects();
            setProspects(data);
        } catch (e: any) {
            toast({
                title: "Errore",
                description: e.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const validatePartitaIva = (piva: string): boolean => {
        const cleaned = piva.replace(/\s/g, "");
        if (!/^\d{11}$/.test(cleaned)) return false;

        let sum = 0;
        for (let i = 0; i < 10; i++) {
            let d = parseInt(cleaned[i]);
            if (i % 2 === 1) {
                d *= 2;
                if (d > 9) d = Math.floor(d / 10) + (d % 10);
            }
            sum += d;
        }
        return (10 - (sum % 10)) % 10 === parseInt(cleaned[10]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePartitaIva(formData.partitaIva)) {
            toast({
                title: "Errore",
                description: "Partita IVA non valida",
                variant: "destructive",
            });
            return;
        }

        try {
            await ProspectsAPI.saveProspects(formData);
            toast({title: "Anagrafica salvata"});
            resetForm();
            setIsDialogOpen(false);
            loadProspects();
        } catch (e: any) {
            toast({
                title: "Errore",
                description: e.message,
                variant: "destructive",
            });
        }
    };

    const resetForm = () => {
        setFormData({
            ragioneSociale: "",
            partitaIva: "",
            codiceFiscale: "",
            indirizzo: "",
            citta: "",
            cap: "",
            provincia: "",
            telefono: "",
            email: "",
            tipo: "prospect",
            tipoProspect: "Professional",
        });
        setEditingProspect(null);
    };

    const handleEdit = (p: ProspectBean) => {
        setFormData({...p});
        setEditingProspect(p);
        setIsDialogOpen(true);
    };

    const filtered = prospects.filter((p) => {
        const q = searchTerm.toLowerCase();
        const matchesSearch =
            p.ragioneSociale.toLowerCase().includes(q) ||
            p.partitaIva.includes(q) ||
            p.citta.toLowerCase().includes(q);

        const matchesFilter = filterType === "all" || p.tipo === filterType;
        return matchesSearch && matchesFilter;
    });

    if (loading) return <div className="p-6">Caricamento...</div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Gestione Anagrafiche</h1>
                    <p className="text-muted-foreground">
                        Gestisci prospect e clienti
                    </p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={resetForm}>
                            <Plus className="h-4 w-4 mr-2"/>
                            Nuova Anagrafica
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                {editingProspect ? "Modifica Anagrafica" : "Nuova Anagrafica"}
                            </DialogTitle>
                            <DialogDescription>
                                Inserisci i dati dell'anagrafica
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <Label htmlFor="ragioneSociale">Ragione Sociale *</Label>
                                    <Input
                                        id="ragioneSociale"
                                        value={formData.ragioneSociale}
                                        onChange={(e) => setFormData({...formData, ragioneSociale: e.target.value})}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="partitaIva">Partita IVA *</Label>
                                    <Input
                                        id="partitaIva"
                                        value={formData.partitaIva}
                                        onChange={(e) => setFormData({...formData, partitaIva: e.target.value})}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="codiceFiscale">Codice Fiscale</Label>
                                    <Input
                                        id="codiceFiscale"
                                        value={formData.codiceFiscale}
                                        onChange={(e) => setFormData({...formData, codiceFiscale: e.target.value})}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="indirizzo">Indirizzo *</Label>
                                    <Input
                                        id="indirizzo"
                                        value={formData.indirizzo}
                                        onChange={(e) => setFormData({...formData, indirizzo: e.target.value})}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="citta">Città *</Label>
                                    <Input
                                        id="citta"
                                        value={formData.citta}
                                        onChange={(e) => setFormData({...formData, citta: e.target.value})}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="cap">CAP *</Label>
                                    <Input
                                        id="cap"
                                        value={formData.cap}
                                        onChange={(e) => setFormData({...formData, cap: e.target.value})}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="provincia">Provincia *</Label>
                                    <Input
                                        id="provincia"
                                        value={formData.provincia}
                                        onChange={(e) => setFormData({...formData, provincia: e.target.value})}
                                        required
                                        maxLength={2}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="telefono">Telefono</Label>
                                    <Input
                                        id="telefono"
                                        value={formData.telefono}
                                        onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="tipo">Tipo *</Label>
                                    <Select value={formData.tipo}
                                            onValueChange={(value: 'prospect' | 'cliente') => setFormData({
                                                ...formData,
                                                tipo: value
                                            })}>
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="prospect">Prospect</SelectItem>
                                            <SelectItem value="cliente">Cliente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="col-span-2">
                                    <Label htmlFor="tipoProspect">Relazione *</Label>
                                    <Select value={formData.tipoProspect}
                                            onValueChange={(value: 'Professional' | 'Finale') => setFormData({
                                                ...formData,
                                                tipoProspect: value
                                            })}>
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Professional">Professional</SelectItem>
                                            <SelectItem value="Finale">Finale</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    Annulla
                                </Button>
                                <Button type="submit">
                                    {editingProspect ? 'Aggiorna' : 'Crea'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Anagrafiche</CardTitle>
                    <CardDescription>
                        Lista di prospect e clienti
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/>
                            <Input
                                className="pl-10"
                                placeholder="Cerca..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <Select
                            value={filterType}
                            onValueChange={(v) =>
                                setFilterType(v as "all" | "prospect" | "cliente")
                            }
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tutti</SelectItem>
                                <SelectItem value="prospect">Prospect</SelectItem>
                                <SelectItem value="cliente">Clienti</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ragione Sociale</TableHead>
                                <TableHead>P.IVA</TableHead>
                                <TableHead>Città</TableHead>
                                <TableHead>Telefono</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead/>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">
                                        {p.ragioneSociale}
                                    </TableCell>
                                    <TableCell>{p.partitaIva}</TableCell>
                                    <TableCell>
                                        {p.citta} ({p.provincia})
                                    </TableCell>
                                    <TableCell>{p.telefono || "-"}</TableCell>
                                    <TableCell>{p.email || "-"}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={p.tipo === "cliente" ? "default" : "secondary"}>
                                            {p.tipo}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(p)}
                                        >
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filtered.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center text-muted-foreground"
                                    >
                                        Nessuna anagrafica trovata
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Prospects;
