import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Bookmark, Briefcase, Bell, Settings, LogOut, UserCircle2, ChevronDown, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

// Define the structure for the specialization sub-items
const subNavItems = [
    { label: 'AIML', href: '/specialization/aiml' },
    { label: 'Apigee', href: '/specialization/apigee' },
    { label: 'Database', href: '/specialization/database' },
    { label: 'GCE & Devops', href: '/specialization/gce-devops' },
    { label: 'GKE', href: '/specialization/gke' },
    { label: 'Networking', href: '/specialization/networking' },
    { label: 'Security', href: '/specialization/security' },
    { label: 'Serverless', href: '/specialization/serverless' },
    { label: 'Storage', href: '/specialization/storage' },
    { label: 'Others', href: '/specialization/others' },
];

// Main navigation items in their correct, original order
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
    const location = useLocation();
    
    // State to manage the open/closed status of the dropdown
    const [isSpecializationOpen, setSpecializationOpen] = useState(false);

    return (
        <TooltipProvider delayDuration={0}>
            <aside className={cn("flex flex-col bg-card border-r transition-all duration-300 ease-in-out p-4", isCollapsed ? "w-20" : "w-64")}>
                <div className="flex items-center gap-2 pb-4 mb-4 border-b">
                    <UserCircle2 className="w-10 h-10 text-primary" />
                    {!isCollapsed && <h1 className="text-xl font-bold text-foreground">Nova</h1>}
                </div>
                
                <nav className="flex-grow">
                    <ul>
                        {/* Part 1: Loop and render the main navigation items */}
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <li key={item.label} className="mb-2">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link to={item.href}>
                                                <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start gap-3">
                                                    <item.icon className={cn("w-5 h-5", isActive && "text-primary")} />
                                                    {!isCollapsed && <span>{item.label}</span>}
                                                </Button>
                                            </Link>
                                        </TooltipTrigger>
                                        {isCollapsed && <TooltipContent side="right"><p>{item.label}</p></TooltipContent>}
                                    </Tooltip>
                                </li>
                            );
                        })}

                        {/* Part 2: Render the collapsible Specialization menu separately */}
                        <li className="mb-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant={isSpecializationOpen ? "secondary" : "ghost"} className="w-full justify-start gap-3" onClick={() => setSpecializationOpen(!isSpecializationOpen)}>
                                        <Layers className={cn("w-5 h-5", isSpecializationOpen && "text-primary")} />
                                        {!isCollapsed && <span>Specialization</span>}
                                        {!isCollapsed && <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform", isSpecializationOpen && "rotate-180")} />}
                                    </Button>
                                </TooltipTrigger>
                                {isCollapsed && <TooltipContent side="right"><p>Specialization</p></TooltipContent>}
                            </Tooltip>

                            {/* Sub-menu Items */}
                            {isSpecializationOpen && !isCollapsed && (
                                <ul className="mt-2 pl-7 space-y-1">
                                    {subNavItems.map((subItem) => {
                                        const isActive = location.pathname === subItem.href;
                                        return (
                                            <li key={subItem.label}>
                                                <Link to={subItem.href}>
                                                    <Button variant={isActive ? "secondary" : "ghost"} size="sm" className="w-full justify-start text-xs font-normal">
                                                        {subItem.label}
                                                    </Button>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </li>
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
