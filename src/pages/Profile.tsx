import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarUpload } from '@/components/AvatarUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { User, Edit3 } from 'lucide-react';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export function Profile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
  });

  // Fetch user profile
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      if (!user?.id) throw new Error('No user logged in');
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Successo",
        description: "Profilo aggiornato con successo",
      });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Errore durante l'aggiornamento del profilo",
        variant: "destructive",
      });
      console.error('Profile update error:', error);
    }
  });

  const handleEdit = () => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    updateProfileMutation.mutate({
      first_name: editForm.first_name,
      last_name: editForm.last_name,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({ first_name: '', last_name: '' });
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    updateProfileMutation.mutate({ avatar_url: avatarUrl });
    setShowAvatarUpload(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = profile?.first_name && profile?.last_name
    ? `${profile.first_name} ${profile.last_name}`
    : profile?.email || 'Utente';

  const initials = profile?.first_name && profile?.last_name
    ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`
    : profile?.email?.charAt(0).toUpperCase() || 'U';

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
                  <AvatarImage src={profile?.avatar_url || undefined} />
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
                  <Edit3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <User className="h-5 w-5" />
              {displayName}
            </CardTitle>
            <CardDescription>{profile?.email}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nome</Label>
                {isEditing ? (
                  <Input
                    id="first_name"
                    value={editForm.first_name}
                    onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    placeholder="Inserisci il nome"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md">
                    {profile?.first_name || 'Non specificato'}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Cognome</Label>
                {isEditing ? (
                  <Input
                    id="last_name"
                    value={editForm.last_name}
                    onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    placeholder="Inserisci il cognome"
                  />
                ) : (
                  <div className="p-2 bg-muted rounded-md">
                    {profile?.last_name || 'Non specificato'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
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
                    {updateProfileMutation.isPending ? 'Salvataggio...' : 'Salva'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Annulla
                  </Button>
                </>
              ) : (
                <Button onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Modifica profilo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {showAvatarUpload && (
          <AvatarUpload
            currentAvatarUrl={profile?.avatar_url || undefined}
            onAvatarUpdate={handleAvatarUpdate}
            onClose={() => setShowAvatarUpload(false)}
          />
        )}
      </div>
    </div>
  );
}