import React from 'react';
import { Sprout, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'DEFAULT' | 'ENTERPRISE';
}

const Layout: React.FC<LayoutProps> = ({ children, variant = 'DEFAULT' }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex justify-center py-0 md:py-8 font-sans antialiased text-slate-900">
      {/* Mobile Frame Simulation */}
      <div className="w-full max-w-[420px] bg-white h-screen md:h-[850px] md:max-h-[calc(100vh-4rem)] md:rounded-[32px] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] relative flex flex-col overflow-hidden border border-slate-200/60 ring-1 ring-slate-900/5">
        
        {/* Mobile Header - Glassmorphism */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-between transition-all duration-200">
            <Link to={variant === 'ENTERPRISE' ? '/billing' : '/dashboard'} className="flex items-center gap-2.5 group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform duration-200 ${variant === 'ENTERPRISE' ? 'bg-orange-600 text-white' : 'bg-[#0A2540] text-[#00D4FF]'}`}>
                    <Sprout size={18} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col justify-center">
                    <span className="font-bold text-lg text-[#0A2540] tracking-tight leading-none">芦笋云汇</span>
                    {variant === 'ENTERPRISE' && (
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-0.5">Enterprise</span>
                    )}
                </div>
            </Link>
            
            {/* Avatar / Settings */}
            <div className="w-9 h-9 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-all cursor-pointer shadow-sm">
                {variant === 'ENTERPRISE' ? <Settings size={18} /> : <User size={18} />}
            </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth bg-gray-50">
          {children}
          {/* Bottom spacer for scroll */}
          <div className="h-24" />
        </main>

      </div>
    </div>
  );
};

export default Layout;