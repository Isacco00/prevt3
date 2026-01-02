import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {useState} from "react";

export function AppHeader() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const initials =
        user.firstName && user.lastName
            ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
            : user.email?.charAt(0).toUpperCase() || 'U';

    const userDisplayName =
        user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.email || 'Utente';

    const handleSignOut = async () => {
        await signOut();
        navigate('/auth');
    };

    return (
        <header className="h-16 border-b bg-background flex items-center justify-between px-6">
            <div>
                <h1 className="text-xl font-semibold text-primary">PrevT3</h1>
                <p className="text-sm text-muted-foreground">
                    Sistema di gestione preventivi
                </p>
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage
                                key={user?.avatarKey}
                                src="/api/profile/getAvatar" />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{userDisplayName}</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                        <User className="h-4 w-4 mr-2" />
                        Il mio profilo
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Esci
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
