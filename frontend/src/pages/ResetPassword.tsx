import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const ResetPassword = () => {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate("/auth");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-primary">
                        Recupero Password
                    </CardTitle>
                    <CardDescription>
                        La funzionalità di recupero password è in fase di attivazione.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                        Contatta un amministratore oppure utilizza le credenziali fornite.
                    </p>

                    <Button className="w-full" onClick={handleBackToLogin}>
                        Torna al login
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPassword;
