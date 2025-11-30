import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  onExportAll: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onHistoryClick, onSettingsClick, onExportAll }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground selection:bg-secondary/30">
      <Header onHistoryClick={onHistoryClick} onSettingsClick={onSettingsClick} onExportAll={onExportAll} />
      <main className="flex-1 container mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12 max-w-7xl">
        {children}
      </main>
    </div>
  );
};

export default Layout;
