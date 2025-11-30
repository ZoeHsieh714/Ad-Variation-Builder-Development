import React from 'react';
import { Layers, Download, History, Settings, Menu } from 'lucide-react';

interface HeaderProps {
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  onExportAll: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHistoryClick, onSettingsClick, onExportAll }) => {
  return (
    <header className="w-full h-20 bg-background/90 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 lg:px-12 sticky top-0 z-50 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-sm">
          <Layers size={22} />
        </div>
        <h1 className="text-2xl font-serif font-bold tracking-wide text-foreground">
          AdVariation<span className="text-secondary italic">Builder</span>
        </h1>
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        <button
          onClick={onHistoryClick}
          className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-2"
        >
          <History size={18} /> History
        </button>
        <button
          onClick={onSettingsClick}
          className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors flex items-center gap-2"
        >
          <Settings size={18} /> Settings
        </button>
        <button
          onClick={onExportAll}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <Download size={18} /> Export All
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2 text-foreground hover:bg-black/5 rounded-full">
        <Menu size={24} />
      </button>
    </header>
  );
};

export default Header;
