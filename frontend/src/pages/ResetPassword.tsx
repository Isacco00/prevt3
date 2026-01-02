import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "@/components/ui/use-toast";
import { AuthAPI } from "@/api/auth";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    /* =========================
       VALIDAZIONE TOKEN
    ========================= */
    if (!token) {
        toast({
            title: "Link non valido",
            description: "Token di reset mancante o non valido.",
            variant: "destructive",
        });
        navigate("/auth");
        return null;
    }

    /* =========================
       SUBMIT
    ========================= */
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Errore",
                description: "Le password non coincidono.",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 8) {
            toast({
                title: "Errore",
                description: "La password deve avere almeno 8 caratteri.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            await AuthAPI.confirmResetPassword(token, password);

            toast({
                title: "Password aggiornata",
                description: "Ora puoi effettuare il login.",
            });

            navigate("/auth");
        } catch (err: any) {
            toast({
                title: "Errore",
                description:
                    err?.response?.data?.message ||
                    "Token scaduto o non valido.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">
                        Nuova Password
                    </CardTitle>
                    <CardDescription>
                        Inserisci la tua nuova password
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Nuova Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Conferma Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Aggiornamento..." : "Aggiorna Password"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
