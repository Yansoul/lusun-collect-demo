import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, RefreshCw, X, Wallet, Share2, ChevronRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import Layout from '../components/Layout';
import { getOrders, createOrder } from '../services/storage';
import { Order, OrderStatus } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [balance, setBalance] = useState(0);

  // Form State
  const [formProject, setFormProject] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [formAmount, setFormAmount] = useState('');

  const refreshData = () => {
    const loadedOrders = getOrders();
    setOrders(loadedOrders);
    const currentBalance = loadedOrders
      .filter(o => o.status === OrderStatus.PAID)
      .reduce((sum, o) => sum + o.amount, 0);
    setBalance(currentBalance);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formProject || !formDetails || !formAmount) return;
    
    createOrder(formProject, Number(formAmount), formDetails);
    setShowCreateSheet(false);
    setFormProject('');
    setFormDetails('');
    setFormAmount('');
    refreshData();
  };

  const copyLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/cashier/${id}`;
    navigator.clipboard.writeText(url);
    alert('链接已复制');
  };

  const handleShare = async (order: Order, e: React.MouseEvent) => {
      e.stopPropagation();
      const url = `${window.location.origin}/#/cashier/${order.id}`;
      if (navigator.share) {
          try {
              await navigator.share({
                  title: '芦笋云汇收银台',
                  text: `请支付订单：${order.projectName} - ¥${order.amount}`,
                  url: url
              });
          } catch (error) {
              console.log('Error sharing:', error);
          }
      } else {
          copyLink(order.id, e);
      }
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return { label: '待支付', className: 'text-amber-700 bg-amber-50 border-amber-200/50' };
      case OrderStatus.PAID: return { label: '已到账', className: 'text-emerald-700 bg-emerald-50 border-emerald-200/50' };
      case OrderStatus.FINISHED: return { label: '已提现', className: 'text-slate-500 bg-slate-100 border-slate-200/50' };
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-8">
          
        {/* Balance Card - Stripe "Dark Slate" Style */}
        <div className="bg-[#0A2540] rounded-2xl p-6 text-white shadow-[0_13px_27px_-5px_rgba(50,50,93,0.25),0_8px_16px_-8px_rgba(0,0,0,0.3)] relative overflow-hidden isolate group">
             {/* Abstract Geometric Shapes */}
             <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-[#425ae1] rounded-full mix-blend-screen opacity-20 blur-[60px] group-hover:opacity-30 transition-opacity duration-700"></div>
             <div className="absolute bottom-[-20%] left-[-10%] w-[200px] h-[200px] bg-[#00d4ff] rounded-full mix-blend-screen opacity-10 blur-[40px] group-hover:opacity-20 transition-opacity duration-700"></div>
             
             <div className="relative z-10">
                 <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Available Balance</p>
                        <TrendingUp size={14} className="text-[#00d4ff]" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight tabular-nums text-white">
                        <span className="text-2xl align-top mr-1 text-slate-400 font-medium">¥</span>
                        {balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h1>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <button 
                        onClick={() => setShowCreateSheet(true)}
                        className="bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 border border-white/10 transition-all active:scale-[0.98]"
                     >
                        <Plus size={16} />
                        收款
                     </button>
                     <button 
                        onClick={() => navigate('/withdraw')}
                        disabled={balance <= 0}
                        className={`bg-white text-[#0A2540] py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] hover:bg-slate-50 ${balance <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                     >
                        <Wallet size={16} />
                        提现
                     </button>
                 </div>
             </div>
        </div>

        {/* Recent Orders */}
        <div>
            <div className="flex items-center justify-between px-1 mb-4">
                <h2 className="text-base font-bold text-[#0A2540] tracking-tight">最近交易</h2>
                <button onClick={refreshData} className="p-2 text-slate-400 hover:text-[#0A2540] rounded-full hover:bg-slate-100 transition-all">
                    <RefreshCw size={16} />
                </button>
            </div>

            <div className="space-y-3">
                {orders.length === 0 ? (
                    <div className="py-16 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                            <Plus size={20} className="text-slate-300" />
                        </div>
                        <p className="text-sm font-medium">暂无订单，创建一个试试</p>
                    </div>
                ) : (
                    orders.map(order => {
                        const statusStyle = getStatusStyle(order.status);
                        return (
                            <div 
                                key={order.id} 
                                onClick={() => window.open(`/#/cashier/${order.id}`, '_blank')}
                                className="group bg-white rounded-xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] border border-slate-200 hover:border-slate-300 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 min-w-0 mr-4">
                                        <h3 className="font-bold text-[#0A2540] truncate tracking-tight text-sm mb-1">{order.projectName}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-1 font-medium">{order.details}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-[#0A2540] tabular-nums tracking-tight">
                                            ¥{order.amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/80">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyle.className}`}>
                                        {statusStyle.label}
                                    </span>
                                    
                                    <div className="text-[10px] text-slate-400 font-mono">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                
                                {order.status === OrderStatus.PENDING && (
                                    <div className="absolute right-4 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button 
                                            onClick={(e) => copyLink(order.id, e)}
                                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                                            title="复制链接"
                                        >
                                            <Copy size={14} />
                                        </button>
                                        <button 
                                            onClick={(e) => handleShare(order, e)}
                                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors"
                                            title="分享"
                                        >
                                            <Share2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
      </div>

      {/* Create Order Bottom Sheet - Stripe Style Drawer */}
      {showCreateSheet && (
          <>
            <div 
                className="absolute inset-0 bg-[#0A2540]/40 backdrop-blur-[2px] z-50 transition-opacity duration-300"
                onClick={() => setShowCreateSheet(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] z-50 p-6 pb-10 animate-slide-up shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 max-w-[420px] mx-auto">
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-8"></div>
                
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-[#0A2540] tracking-tight">创建收款</h3>
                    <button onClick={() => setShowCreateSheet(false)} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-5">
                        <div className="group">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block group-focus-within:text-[#635BFF] transition-colors">项目名称</label>
                            <input 
                                type="text" 
                                required
                                value={formProject}
                                onChange={(e) => setFormProject(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-[#0A2540] font-medium focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.15)] outline-none transition-all placeholder:text-slate-300 shadow-sm"
                                placeholder="例如：芦笋官网设计二期"
                            />
                        </div>

                        <div className="group">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block group-focus-within:text-[#635BFF] transition-colors">收款详情</label>
                            <input 
                                type="text" 
                                required
                                value={formDetails}
                                onChange={(e) => setFormDetails(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-[#0A2540] font-medium focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.15)] outline-none transition-all placeholder:text-slate-300 shadow-sm"
                                placeholder="例如：设计咨询费"
                            />
                        </div>

                        <div className="group">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block group-focus-within:text-[#635BFF] transition-colors">金额 (CNY)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">¥</span>
                                <input 
                                    type="number" 
                                    required
                                    min="1"
                                    value={formAmount}
                                    onChange={(e) => setFormAmount(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-[#0A2540] font-mono text-xl font-bold focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.15)] outline-none transition-all placeholder:text-slate-300 shadow-sm"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-[#635BFF] hover:bg-[#5851df] text-white font-bold py-3.5 rounded-lg text-base shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        <span>立即创建</span>
                        <ArrowUpRight size={18} />
                    </button>
                </form>
            </div>
          </>
      )}

      <style>{`
        @keyframes slide-up {
            from { transform: translateY(100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
            animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;