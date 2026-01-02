import { useState } from "react";
import { Navigate } from "react-router-dom";

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

import { useAuth } from "../hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import {AuthAPI} from "@/api/auth.ts";

const LoadingOverlay = () => (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
);

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [resetEmail, setResetEmail] = useState("");
    const [showResetForm, setShowResetForm] = useState(false);

    const [loading, setLoading] = useState(false);

    const { signIn, user } = useAuth();

    if (user) {
        return <Navigate to="/" replace />;
    }

    /* =========================
       LOGIN
    ========================= */
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn(email, password);
            toast({
                title: "Accesso effettuato",
                description: "Benvenuto in PrevT3!",
            });
        } catch (err: any) {
            toast({
                title: "Errore di accesso",
                description:
                    err?.response?.data?.message || "Credenziali non valide",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       RESET PASSWORD
    ========================= */
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await AuthAPI.resetPassword(resetEmail);
            toast({
                title: "Email inviata",
                description:
                    "Controlla la tua email per le istruzioni di recupero password.",
            });
            setShowResetForm(false);
            setResetEmail("");
        } catch (err: any) {
            toast({
                title: "Errore",
                description:
                    err?.response?.data?.message ||
                    "Errore durante il reset della password",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       RESET FORM
    ========================= */
    if (showResetForm) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <div className="relative w-full max-w-md">
                    {loading && <LoadingOverlay />}

                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold text-primary">
                                Recupera Password
                            </CardTitle>
                            <CardDescription>
                                Inserisci la tua email per ricevere le istruzioni
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="resetEmail">Email</Label>
                                    <Input
                                        id="resetEmail"
                                        type="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Invio in corso..." : "Invia email"}
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => setShowResetForm(false)}
                                >
                                    Torna al login
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    /* =========================
       LOGIN FORM
    ========================= */
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="relative w-full max-w-md">
                {loading && <LoadingOverlay />}

                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-primary">
                            PrevT3
                        </CardTitle>
                        <CardDescription>
                            Sistema di gestione preventivi
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Accesso in corso..." : "Accedi"}
                            </Button>

                            <div className="text-center">
                                <Button
                                    type="button"
                                    variant="link"
                                    className="text-sm"
                                    onClick={() => setShowResetForm(true)}
                                >
                                    Password dimenticata?
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Auth;
