import { Home, User, Bookmark, Briefcase, Bell, Settings, LogOut, UserCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/stores/auth.store'; // Correctly imports the Zustand store
import { Link, useLocation } from 'react-router-dom';


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
    // Correctly gets user and logout function from the Zustand store
    const { user, logout } = useAuthStore(); 
        const location = useLocation();

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
                            // Check if the current URL matches the item's link
                            const isActive = location.pathname === item.href;
                            return (
                            <li key={item.label} className="mb-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* This is the key change: Link wraps Button */}
                                        <Link to={item.href}>
                                            <Button 
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
                        )})}
                    </ul>
                </nav>
                <div className="pt-4 mt-auto border-t">
                    {/* The user profile and logout button remain here... */}
                    {user && ( /* ... */ )}
                    <Tooltip>
                      {/* ... */}
                    </Tooltip>
                </div>
            </aside>
        </TooltipProvider>
    );
    
};

export default LeftSidebar;
