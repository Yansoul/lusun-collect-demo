import React, { useState, useEffect } from 'react';
import { Download, FileText, Receipt, ChevronRight, ArrowUpRight, CheckCircle2, Clock, Plus } from 'lucide-react';
import Layout from '../components/Layout';
import { getOrders } from '../services/storage';
import { Order, OrderStatus } from '../types';

const Billing: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Order[]>([]);
  const [monthlySpend, setMonthlySpend] = useState(0);

  useEffect(() => {
    // Simulate network delay for skeleton effect
    const timer = setTimeout(() => {
        const allOrders = getOrders();
        // Filter for "Paid" or "Finished" orders to simulate history
        // In a real app, this would filter by company ID
        const paidOrders = allOrders.filter(o => o.status === OrderStatus.PAID || o.status === OrderStatus.FINISHED);
        setTransactions(paidOrders);
        
        const spend = paidOrders.reduce((acc, curr) => acc + curr.amount, 0);
        setMonthlySpend(spend);
        
        setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleSetupProfile = () => {
      alert("跳转至发票抬头设置页...");
  };

  const downloadInvoice = (e: React.MouseEvent) => {
      e.stopPropagation();
      alert("正在下载电子发票 PDF...");
  };

  return (
    <Layout variant="ENTERPRISE">
      <div className="p-6 space-y-8">
        
        {/* Page Header / Data Overview */}
        <div className="animate-fade-in">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">本月支出 (Total Spend)</h2>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
                    ¥{loading ? '---,---' : monthlySpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-medium text-gray-400">CNY</span>
            </div>
        </div>

        {/* Main Content Area */}
        {loading ? (
            // Skeleton Loading State
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between animate-pulse">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-full"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-32 bg-gray-100 rounded"></div>
                                <div className="h-3 w-20 bg-gray-100 rounded"></div>
                            </div>
                        </div>
                        <div className="h-4 w-16 bg-gray-100 rounded"></div>
                    </div>
                ))}
            </div>
        ) : transactions.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-gray-100/50 rounded-full flex items-center justify-center mb-6 border border-gray-200/50">
                    <Receipt size={32} className="text-gray-300" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">尚未产生交易</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed mb-8">
                    当您通过芦笋云收款完成向自由职业者的支付后，所有的付款记录和电子发票将自动汇总在这里。
                </p>
                <button 
                    onClick={handleSetupProfile}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all active:scale-[0.98]"
                >
                    <Plus size={16} />
                    预设发票抬头
                </button>
            </div>
        ) : (
            // Populated List State
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-fade-in-up">
                {/* List Header (Hidden on Mobile usually, but keeping simple for this shell) */}
                <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">最近交易</h3>
                    <button className="text-xs font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1">
                        全部记录 <ArrowUpRight size={12} />
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {transactions.map((order) => (
                        <div 
                            key={order.id}
                            className="group flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer active:bg-gray-100"
                        >
                            {/* Left: Subject */}
                            <div className="flex items-center gap-4 flex-1 min-w-0 pr-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500 text-xs font-bold">
                                    {order.projectName.slice(0, 1)}
                                </div>
                                <div className="min-w-0">
                                    <h4 className="text-sm font-medium text-gray-900 truncate group-hover:text-black transition-colors">
                                        {order.projectName}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-medium font-variant-numeric tabular-nums mt-0.5">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            {/* Right: Amount & Status */}
                            <div className="text-right flex flex-col items-end gap-1.5">
                                <span className="text-sm font-semibold text-gray-900 font-variant-numeric tabular-nums">
                                    ¥{order.amount.toLocaleString()}
                                </span>
                                
                                <div className="flex items-center gap-3">
                                    {order.status === OrderStatus.PAID || order.status === OrderStatus.FINISHED ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                            已支付
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                                            <Clock size={10} />
                                            确认中
                                        </span>
                                    )}
                                    
                                    {/* Download Action - Only Visible if Paid */}
                                    {(order.status === OrderStatus.PAID || order.status === OrderStatus.FINISHED) && (
                                        <button 
                                            onClick={downloadInvoice}
                                            className="p-1 text-gray-300 hover:text-gray-600 transition-colors"
                                            title="下载发票"
                                        >
                                            <Download size={14} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Footer of Card */}
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-[10px] text-gray-400">仅显示最近 30 天的交易记录</p>
                </div>
            </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.4s ease-out; }
        .font-variant-numeric { font-variant-numeric: tabular-nums; }
      `}</style>
    </Layout>
  );
};

export default Billing;