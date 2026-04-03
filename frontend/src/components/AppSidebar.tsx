import {useState, useEffect} from 'react';
import {Users, FileText, Settings, User, BarChart3, ChevronDown, ChevronRight} from 'lucide-react';
import {NavLink, useLocation} from 'react-router-dom';
import {useAuth} from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const navigationItems = [
  {title: 'Dashboard', url: '/', icon: BarChart3},
  {title: 'Anagrafiche', url: '/prospects', icon: Users},
  {title: 'Preventivi', url: '/preventivi', icon: FileText},
  {title: 'Il mio profilo', url: '/profile', icon: User},
];

const adminSubItems = [
  {title: 'Gestione Utenti', url: '/admin?tab=utenti'},
  {title: 'Parametri Costi', url: '/admin?tab=parametri'},
  {title: 'Listino Servizi', url: '/admin?tab=parametri#servizi'},
  {title: 'Profili Distribuzione', url: '/admin?tab=parametri#profili'},
  {title: 'Retroilluminazione', url: '/admin?tab=parametri#retroilluminazione'},
  {title: 'Accessori Stand', url: '/admin?tab=parametri#accessori-stand'},
  {title: 'Accessori Desk', url: '/admin?tab=parametri#accessori-desk'},
  {title: 'Accessori Espositori', url: '/admin?tab=parametri#accessori-espositori'},
  {title: 'Struttura Stand', url: '/admin?tab=parametri#struttura-stand'},
  {title: 'Struttura Desk', url: '/admin?tab=parametri#struttura-desk'},
  {title: 'Struttura Espositori', url: '/admin?tab=parametri#struttura-espositori'},
  {title: 'Coefficienti Noleggio', url: '/admin?tab=parametri#coefficienti'},
];

export function AppSidebar() {
  const {state} = useSidebar();
  const location = useLocation();
  const {user} = useAuth();

  const collapsed = state === 'collapsed';
  const isAdmin = user?.role === 'admin';
  const isOnAdmin = location.pathname === '/admin';

  const [adminOpen, setAdminOpen] = useState(isOnAdmin);

  // Chiudi il sottomenu quando la sidebar collassa
  useEffect(() => {
    if (collapsed) setAdminOpen(false);
  }, [collapsed]);

  // Apri automaticamente se si naviga in /admin
  useEffect(() => {
    if (isOnAdmin) setAdminOpen(true);
  }, [isOnAdmin]);

  const getNavCls = ({isActive}: {isActive: boolean}) =>
      isActive ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50';

  return (
      <Sidebar className={collapsed ? 'w-14' : 'w-60'} collapsible="icon">
        <SidebarTrigger className="m-2 self-end"/>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary font-semibold">
              PrevT3
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} end className={getNavCls}>
                          <item.icon className="h-4 w-4"/>
                          {!collapsed && <span>{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}

                {isAdmin && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                          onClick={() => {
                            if (collapsed) return;
                            setAdminOpen(o => !o);
                          }}
                          asChild={collapsed}
                          className={isOnAdmin ? 'bg-accent text-accent-foreground font-medium' : 'hover:bg-accent/50'}
                      >
                        {collapsed ? (
                            <NavLink to="/admin" className={getNavCls}>
                              <Settings className="h-4 w-4"/>
                            </NavLink>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Settings className="h-4 w-4"/>
                                <span>Amministrazione</span>
                              </div>
                              {adminOpen
                                  ? <ChevronDown className="h-3 w-3 text-muted-foreground"/>
                                  : <ChevronRight className="h-3 w-3 text-muted-foreground"/>}
                            </div>
                        )}
                      </SidebarMenuButton>

                      {!collapsed && adminOpen && (
                          <SidebarMenuSub>
                            {adminSubItems.map(sub => (
                                <SidebarMenuSubItem key={sub.title}>
                                  <SidebarMenuSubButton asChild>
                                    <NavLink
                                        to={sub.url}
                                        className={({isActive}) =>
                                            isActive ? 'text-accent-foreground font-medium' : 'hover:bg-accent/50'
                                        }
                                    >
                                      <span>{sub.title}</span>
                                    </NavLink>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
}
