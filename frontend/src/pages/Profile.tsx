import {useState} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {AvatarUpload} from '@/components/AvatarUpload';
import {toast} from '@/hooks/use-toast';
import {User, Edit3} from 'lucide-react';
import {ProfileAPI} from '@/api/profile';
import {UserBean} from '@/types/profile';
import { useAuth } from "@/hooks/useAuth";

export function Profile() {
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [showAvatarUpload, setShowAvatarUpload] = useState(false);
    const [profileDraft, setProfileDraft] = useState<UserBean | null>(null);
    const { setAvatarKey } = useAuth();
    const { user } = useAuth();

    /* =========================
       LOAD PROFILE
    ========================= */
    const {data: profile, isLoading} = useQuery({
        queryKey: ['profile'],
        queryFn: ProfileAPI.getProfile,
    });

    /* =========================
       SAVE PROFILE
    ========================= */
    const updateProfileMutation = useMutation({
        mutationFn: ProfileAPI.saveProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['profile']});
            toast({
                title: 'Successo',
                description: 'Profilo aggiornato con successo',
            });
            setIsEditing(false);
            setProfileDraft(null);
        },
        onError: () => {
            toast({
                title: 'Errore',
                description: "Errore durante l'aggiornamento del profilo",
                variant: 'destructive',
            });
        },
    });

    /* =========================
       HANDLERS
    ========================= */
    const handleEdit = () => {
        if (!profile) return;
        setProfileDraft({...profile}); // clone
        setIsEditing(true);
    };

    const handleSave = () => {
        if (!profileDraft) return;
        updateProfileMutation.mutate(profileDraft);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileDraft(null);
    };

    const handleAvatarUpdate = (avatarUrl: string) => {
        setAvatarKey();          // 👈 QUESTO È IL PUNTO CHIAVE
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        setShowAvatarUpload(false);
    };

    /* =========================
       DISPLAY HELPERS
    ========================= */
    const displayName =
        profile?.firstName && profile?.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : profile?.email || 'Utente';

    const initials =
        profile?.firstName && profile?.lastName
            ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
            : profile?.email?.charAt(0).toUpperCase() || 'U';

    /* =========================
       RENDER
    ========================= */
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
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage
                                        key={user?.avatarKey}
                                        src="/api/profile/getAvatar" />
                                    <AvatarFallback className="text-lg">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                                    onClick={() => setShowAvatarUpload(true)}
                                >
                                    <Edit3 className="h-4 w-4"/>
                                </Button>
                            </div>
                        </div>

                        <CardTitle className="flex items-center justify-center gap-2">
                            <User className="h-5 w-5"/>
                            {displayName}
                        </CardTitle>
                        <CardDescription>{profile?.email}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Nome</Label>
                                {isEditing ? (
                                    <Input
                                        id="firstName"
                                        value={profileDraft?.firstName ?? ''}
                                        onChange={e =>
                                            setProfileDraft(d =>
                                                d ? {...d, firstName: e.target.value} : d
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="p-2 bg-muted rounded-md">
                                        {profile?.firstName || 'Non specificato'}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Cognome</Label>
                                {isEditing ? (
                                    <Input
                                        id="lastName"
                                        value={profileDraft?.lastName ?? ''}
                                        onChange={e =>
                                            setProfileDraft(d =>
                                                d ? {...d, lastName: e.target.value} : d
                                            )
                                        }
                                    />
                                ) : (
                                    <div className="p-2 bg-muted rounded-md">
                                        {profile?.lastName || 'Non specificato'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <div className="p-2 bg-muted rounded-md text-muted-foreground">
                                {profile?.email}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                L'indirizzo email non può essere modificato
                            </p>
                        </div>

                        <div className="flex gap-2 pt-4">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleSave}
                                        disabled={updateProfileMutation.isPending}
                                    >
                                        {updateProfileMutation.isPending
                                            ? 'Salvataggio...'
                                            : 'Salva'}
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel}>
                                        Annulla
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={handleEdit}>
                                    <Edit3 className="h-4 w-4 mr-2"/>
                                    Modifica profilo
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {showAvatarUpload && (
                    <AvatarUpload
                        currentAvatarUrl={profile?.avatarUrl}
                        onAvatarUpdate={handleAvatarUpdate}
                        onClose={() => setShowAvatarUpload(false)}
                    />
                )}
            </div>
        </div>
    );
}
