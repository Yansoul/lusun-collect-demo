import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, User, Briefcase, LayoutDashboard, Trash2, ChevronRight, X, LogIn, Receipt } from 'lucide-react';
import { getOrders, resetData } from '../services/storage';
import { Order, OrderStatus } from '../types';

const GlobalDebugMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOrders(getOrders());
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
        <button 
            onClick={toggleMenu}
            className={`w-12 h-12 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-slate-800 rotate-90 text-white' : 'bg-slate-900 text-white hover:bg-slate-700'}`}
        >
            {isOpen ? <X size={20} /> : <Settings size={20} />}
        </button>

        {isOpen && (
            <div className="absolute bottom-14 right-0 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in-up origin-bottom-right">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="font-bold text-slate-700 text-xs uppercase tracking-wide">Role Switcher</span>
                </div>
                
                <div className="p-1 space-y-1">
                     <button 
                        onClick={() => { navigate('/'); setIsOpen(false); }}
                        className={`w-full text-left px-2 py-2 rounded-lg flex items-center gap-2 transition-colors ${isActive('/') ? 'bg-slate-100 text-slate-800' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                        <LogIn size={16} />
                        <span className="text-sm font-medium">Onboarding (Root)</span>
                    </button>

                    <button 
                        onClick={() => { navigate('/dashboard'); setIsOpen(false); }}
                        className={`w-full text-left px-2 py-2 rounded-lg flex items-center gap-2 transition-colors ${isActive('/dashboard') ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                        <User size={16} />
                        <span className="text-sm font-medium">我是自由职业者</span>
                    </button>

                     <button 
                        onClick={() => { navigate('/billing'); setIsOpen(false); }}
                        className={`w-full text-left px-2 py-2 rounded-lg flex items-center gap-2 transition-colors ${isActive('/billing') ? 'bg-orange-50 text-orange-700' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                         <Receipt size={16} />
                        <span className="text-sm font-medium">我是企业 (Billing)</span>
                    </button>

                    <button 
                        onClick={() => { navigate('/admin'); setIsOpen(false); }}
                        className={`w-full text-left px-2 py-2 rounded-lg flex items-center gap-2 transition-colors ${isActive('/admin') ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                         <LayoutDashboard size={16} />
                        <span className="text-sm font-medium">平台超级管理员</span>
                    </button>

                    <div className="border-t border-slate-100 my-1 pt-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase">模拟企业客户</div>
                        <div className="max-h-32 overflow-y-auto">
                            {orders.filter(o => o.status === OrderStatus.PENDING).map(order => (
                                <button 
                                    key={order.id}
                                    onClick={() => { navigate(`/cashier/${order.id}`); setIsOpen(false); }}
                                    className="w-full text-left px-2 py-1.5 rounded hover:bg-amber-50 flex items-center justify-between group"
                                >
                                    <span className="text-xs text-slate-600 truncate max-w-[120px]">{order.projectName}</span>
                                    <ChevronRight size={10} className="text-slate-300" />
                                </button>
                            ))}
                             {orders.filter(o => o.status === OrderStatus.PENDING).length === 0 && (
                                <div className="text-[10px] text-slate-400 px-2 italic">无待支付订单</div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-1 border-t border-slate-200">
                    <button 
                        onClick={() => { if(confirm('Reset all?')) resetData(); }}
                        className="w-full flex items-center justify-center gap-1 text-[10px] text-red-500 hover:bg-red-50 p-1.5 rounded"
                    >
                        <Trash2 size={10} />
                        重置数据
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default GlobalDebugMenu;