import { useState, ReactNode } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import LeftSidebar from './LeftSidebar'; // This relative path is correct because they are in the same folder
import { Button } from '@/components/ui/button'; // The corrected import path

// This component now correctly accepts 'children' as a prop
const AppLayout = ({ children }: { children: ReactNode }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-muted/40">
            <LeftSidebar isCollapsed={isCollapsed} />
            <div className="flex flex-col flex-1">
                <header className="flex items-center h-16 px-6 bg-card border-b">
                     <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                    </Button>
                    {/* Header content like search bar can go here */}
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                     {/* This will now correctly render the routes passed from App.tsx */}
                     {children}
                </main>
            </div>
        </div>
    );
};

export default AppLayout;