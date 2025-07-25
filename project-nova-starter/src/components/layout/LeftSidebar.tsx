import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bookmark, Briefcase, Bell, Settings, LogOut, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/stores/auth.store';

const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: User, label: 'My Network', href: '/network' },
    { icon: Bookmark, label: 'My Saved Items', href: '/saved' },
    { icon: Briefcase, label: 'Career Hub', href: '/careers' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

interface LeftSidebarProps {
    isCollapsed: boolean;
}

const LeftSidebar = ({ isCollapsed }: LeftSidebarProps) => {
    const { user, logout } = useAuthStore();
    const location = useLocation(); // Get the current URL from React Router

    return (
        <TooltipProvider delayDuration={0}>
            <aside className={`flex flex-col bg-card border-r transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'} p-4`}>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b">
                    <UserCircle2 className="w-10 h-10 text-primary" />
                    {!isCollapsed && <h1 className="text-xl font-bold text-foreground">Nova</h1>}
                </div>
                <nav className="flex-grow">
                    <ul>
                        {navItems.map((item) => {
                            // Check if the current page's URL matches this nav item's URL
                            const isActive = location.pathname === item.href;
                            
                            return (
                                <li key={item.label} className="mb-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            {/* Wrap the entire button in a Link component to make it a clickable link */}
                                            <Link to={item.href}>
                                                <Button 
                                                    // Dynamically change the button style if it's the active page
                                                    variant={isActive ? "secondary" : "ghost"} 
                                                    className="w-full justify-start gap-3"
                                                >
                                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                                                    {!isCollapsed && <span>{item.label}</span>}
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        {isCollapsed && <TooltipContent side="right"><p>{item.label}</p></TooltipContent>}
                                    </Tooltip>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
                <div className="pt-4 mt-auto border-t">
                    {user && (
                        <div className="flex items-center gap-3 p-2 mb-2 rounded-lg hover:bg-muted">
                            <img src={user.pictureUrl || ''} alt={user.name} className="w-10 h-10 rounded-full" />
                            {!isCollapsed && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                                    <p className="text-xs truncate text-muted-foreground">{user.email}</p>
                                </div>
                            )}
                        </div>
                    )}
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start gap-3" onClick={logout}>
                                <LogOut className="w-5 h-5" />
                                {!isCollapsed && <span>Logout</span>}
                            </Button>
                        </TooltipTrigger>
                        {isCollapsed && <TooltipContent side="right"><p>Logout</p></TooltipContent>}
                    </Tooltip>
                </div>
            </aside>
        </TooltipProvider>
    );
};

export default LeftSidebar;
