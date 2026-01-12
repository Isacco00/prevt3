import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Save, X, Search, UserCheck, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProfileAPI } from '@/api/profile';
import { UserBean } from '@/types/profile';

/* =========================
   COMPONENT
========================= */
export function UserManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<UserBean | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserBean>>({});
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUserForm, setNewUserForm] = useState<UserBean>({
    id: null,
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',
    active: true,
  });
  /* =========================
       LOAD USERS
    ========================= */
  const { data: users = [] } = useQuery({
    queryKey: ['users-admin'],
    queryFn: () =>
        ProfileAPI.getUserList({
          sortFields: [{ field: 'USER_LIST_CREATED_AT', desc: false }],
        }),
  });
  /* =========================
     SAVE USER (CREATE / UPDATE)
  ========================= */
  const saveUserMutation = useMutation({
    mutationFn: ProfileAPI.saveProfile,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users-admin'] });

      toast({
        title: variables.id ? 'Utente aggiornato' : 'Utente creato',
        description: 'Operazione completata con successo',
      });

      setEditingUser(null);
      setEditForm({});
      setShowCreateDialog(false);
      setNewUserForm({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        role: 'user',
        active: true,
      });
    },
    onError: (error: unknown) => {
      const message =
          error instanceof Error ? error.message : 'Operazione fallita';

      toast({
        title: 'Errore',
        description: message,
        variant: 'destructive',
      });
    },
  });

  /* =========================
     HANDLERS
  ========================= */
  const saveUser = (user: UserBean) => {
    if (!user.firstName || !user.lastName || !user.email) {
      toast({
        title: 'Errore',
        description: 'Nome, cognome ed email sono obbligatori',
        variant: 'destructive',
      });
      return;
    }
    saveUserMutation.mutate(user);
  };

  const handleEdit = (user: UserBean) => {
    setEditingUser(user);
    setEditForm(user);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditForm({});
  };

  /* =========================
     FILTER
  ========================= */
  const filteredUsers = users.filter(
      (u) =>
          u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* =========================
     RENDER
  ========================= */
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

                  <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        saveUser(newUserForm);
                      }}
                      className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nome</Label>
                        <Input
                            required
                            value={newUserForm.firstName}
                            onChange={(e) =>
                                setNewUserForm((p) => ({
                                  ...p,
                                  firstName: e.target.value,
                                }))
                            }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Cognome</Label>
                        <Input
                            required
                            value={newUserForm.lastName}
                            onChange={(e) =>
                                setNewUserForm((p) => ({
                                  ...p,
                                  lastName: e.target.value,
                                }))
                            }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                          required
                          type="email"
                          value={newUserForm.email}
                          onChange={(e) =>
                              setNewUserForm((p) => ({
                                ...p,
                                email: e.target.value,
                              }))
                          }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ruolo</Label>
                      <Select
                          value={newUserForm.role}
                          onValueChange={(value) =>
                              setNewUserForm((p) => ({ ...p, role: value }))
                          }
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
                      <Button type="submit" className="flex-1">
                        Crea Utente
                      </Button>
                      <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowCreateDialog(false)}
                          className="flex-1"
                      >
                        Annulla
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardTitle>

            <CardDescription>Gestisci gli utenti del sistema</CardDescription>
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
                {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        {editingUser?.id === u.id ? (
                            <Input
                                value={editForm.firstName || ''}
                                onChange={(e) =>
                                    setEditForm((p) => ({
                                      ...p,
                                      firstName: e.target.value,
                                    }))
                                }
                            />
                        ) : (
                            u.firstName
                        )}
                      </TableCell>

                      <TableCell>
                        {editingUser?.id === u.id ? (
                            <Input
                                value={editForm.lastName || ''}
                                onChange={(e) =>
                                    setEditForm((p) => ({
                                      ...p,
                                      lastName: e.target.value,
                                    }))
                                }
                            />
                        ) : (
                            u.lastName
                        )}
                      </TableCell>

                      <TableCell>
                        {editingUser?.id === u.id ? (
                            <Input
                                value={editForm.email || ''}
                                onChange={(e) =>
                                    setEditForm((p) => ({
                                      ...p,
                                      email: e.target.value,
                                    }))
                                }
                            />
                        ) : (
                            u.email
                        )}
                      </TableCell>

                      <TableCell>
                        {editingUser?.id === u.id ? (
                            <Select
                                value={editForm.role}
                                onValueChange={(value) =>
                                    setEditForm((p) => ({ ...p, role: value }))
                                }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                        ) : (
                            <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                    u.role === 'admin'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                                }`}>
                              {u.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {editingUser?.id === u.id ? (
                            <Checkbox
                                checked={!!editForm.active}
                                onCheckedChange={(v) =>
                                    setEditForm((p) => ({
                                      ...p,
                                      active: Boolean(v),
                                    }))
                                }
                            />
                        ) : u.active ? (
                            <span className="text-green-600 flex items-center">
                        <UserCheck className="h-4 w-4 mr-1" />
                        Attivo
                      </span>
                        ) : (
                            <span className="text-red-600 flex items-center">
                        <UserX className="h-4 w-4 mr-1" />
                        Disattivo
                      </span>
                        )}
                      </TableCell>

                      <TableCell>
                        {editingUser?.id === u.id ? (
                            <div className="flex gap-2">
                              <Button
                                  size="sm"
                                  onClick={() =>
                                      saveUser({
                                        ...editingUser!,
                                        ...editForm,
                                      })
                                  }
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(u)}
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
