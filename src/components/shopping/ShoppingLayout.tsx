import React, { useState } from 'react';
import ShoppingSidebar from './ShoppingSidebar';
import Header from '@/components/Header';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface ShoppingLayoutProps {
  children: React.ReactNode;
  onNewChat: () => void;
}

export default function ShoppingLayout({ children, onNewChat }: ShoppingLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNewChat = () => {
    onNewChat();
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 lg:w-72 flex-shrink-0">
          <ShoppingSidebar onNewChat={handleNewChat} />
        </div>

        {/* Mobile Sidebar (Sheet) */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <ShoppingSidebar onNewChat={handleNewChat} />
          </SheetContent>
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative min-w-0">
          {/* Mobile Header toggle */}
          <div className="md:hidden absolute top-4 left-4 z-10">
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm shadow-sm" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>
          </div>
          
          <main className="flex-1 overflow-hidden relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
