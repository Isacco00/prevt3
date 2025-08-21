import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Save, X, Search, UserCheck, UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  active: boolean;
  created_at: string;
}

interface NewUserForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user'
  });

  // Fetch all users (only admins can see this)
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
    enabled: !!user?.id,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: NewUserForm) => {
      const { data, error } = await supabase.rpc('create_user_by_admin', {
        email: userData.email,
        password: userData.password,
        first_name: userData.firstName,
        last_name: userData.lastName,
        user_role: userData.role
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] });
      toast({
        title: "Utente creato",
        description: "L'utente è stato creato con successo.",
      });
      setShowCreateDialog(false);
      setNewUserForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user'
      });
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nella creazione dell'utente.",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Profile> }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] });
      toast({
        title: "Utente aggiornato",
        description: "L'utente è stato aggiornato con successo.",
      });
      setEditingUser(null);
      setEditForm({});
    },
    onError: (error: any) => {
      toast({
        title: "Errore",
        description: error.message || "Errore nell'aggiornamento dell'utente.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (profile: Profile) => {
    setEditingUser(profile.id);
    setEditForm(profile);
  };

  const handleSave = () => {
    if (!editingUser || !editForm) return;

    updateUserMutation.mutate({
      id: editingUser,
      updates: {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        email: editForm.email,
        role: editForm.role,
        active: editForm.active,
      },
    });
  };

  const handleCancel = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleCreateUser = () => {
    if (!newUserForm.firstName || !newUserForm.lastName || !newUserForm.email || !newUserForm.password) {
      toast({
        title: "Errore",
        description: "Tutti i campi sono obbligatori.",
        variant: "destructive",
      });
      return;
    }

    createUserMutation.mutate(newUserForm);
  };

  const filteredUsers = users.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-6">Caricamento utenti...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Gestione Utenti
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuovo Utente
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crea Nuovo Utente</DialogTitle>
                  <DialogDescription>
                    Inserisci i dati per creare un nuovo utente
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        value={newUserForm.firstName}
                        onChange={(e) => setNewUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Cognome</Label>
                      <Input
                        id="lastName"
                        value={newUserForm.lastName}
                        onChange={(e) => setNewUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Ruolo</Label>
                    <Select
                      value={newUserForm.role}
                      onValueChange={(value) => setNewUserForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={handleCreateUser} 
                      disabled={createUserMutation.isPending}
                      className="flex-1"
                    >
                      {createUserMutation.isPending ? 'Creazione...' : 'Crea Utente'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreateDialog(false)}
                      className="flex-1"
                    >
                      Annulla
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
          <CardDescription>
            Gestisci gli utenti del sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4" />
            <Input
              placeholder="Cerca utenti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cognome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    {editingUser === profile.id ? (
                      <Input
                        value={editForm.first_name || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                        className="w-full"
                      />
                    ) : (
                      profile.first_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === profile.id ? (
                      <Input
                        value={editForm.last_name || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                        className="w-full"
                      />
                    ) : (
                      profile.last_name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === profile.id ? (
                      <Input
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full"
                      />
                    ) : (
                      profile.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === profile.id ? (
                      <Select
                        value={editForm.role}
                        onValueChange={(value) => setEditForm(prev => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        profile.role === 'admin' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                      }`}>
                        {profile.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === profile.id ? (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={editForm.active}
                          onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, active: checked as boolean }))}
                        />
                        <Label>Attivo</Label>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        {profile.active ? (
                          <div className="flex items-center text-green-600">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Attivo
                          </div>
                        ) : (
                          <div className="flex items-center text-red-600">
                            <UserX className="h-4 w-4 mr-1" />
                            Disattivo
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser === profile.id ? (
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleSave}
                          disabled={updateUserMutation.isPending}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleEdit(profile)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}