import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit3, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

export function Profile() {
    const { user } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [firstName, setFirstName] = useState(user?.firstName ?? "");
    const [lastName, setLastName] = useState(user?.lastName ?? "");

    const displayName =
        firstName && lastName ? `${firstName} ${lastName}` : user?.email ?? "Utente";

    const initials =
        firstName && lastName
            ? `${firstName.charAt(0)}${lastName.charAt(0)}`
            : user?.email?.charAt(0).toUpperCase() ?? "U";

    const handleSave = async () => {
        // ⏳ verrà collegato a Spring (/api/profile)
        toast({
            title: "Non ancora disponibile",
            description: "La modifica del profilo sarà disponibile a breve.",
        });
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto py-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-primary">Il mio profilo</h1>
                    <p className="text-muted-foreground mt-2">
                        Gestisci le informazioni del tuo account
                    </p>
                </div>

                <Card>
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Avatar className="h-24 w-24">
                                <AvatarImage />
                                <AvatarFallback className="text-lg">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <CardTitle className="flex items-center justify-center gap-2">
                            <User className="h-5 w-5" />
                            {displayName}
                        </CardTitle>

                        <CardDescription>{user?.email}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nome</Label>
                                {isEditing ? (
                                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                ) : (
                                    <div className="p-2 bg-muted rounded-md">
                                        {firstName || "Non specificato"}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Cognome</Label>
                                {isEditing ? (
                                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                ) : (
                                    <div className="p-2 bg-muted rounded-md">
                                        {lastName || "Non specificato"}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="p-2 bg-muted rounded-md text-muted-foreground">
                                {user?.email}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            {isEditing ? (
                                <>
                                    <Button onClick={handleSave}>Salva</Button>
                                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                                        Annulla
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={() => setIsEditing(true)}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Modifica profilo
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
