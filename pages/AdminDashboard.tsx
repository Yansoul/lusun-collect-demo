import React, { useState, useEffect } from 'react';
import { Sprout, Wallet, FileText, CheckCircle, Download, RefreshCw, Search, ArrowLeft, MoreHorizontal, Bell, Send, X, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getOrders, adminMarkAsPaid, adminSendInvoice } from '../services/storage';
import { Order, OrderStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Invoice Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSending, setIsSending] = useState(false);

  const refreshData = () => {
    setOrders(getOrders());
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirmPayment = (id: string) => {
    if (confirm('确认收到该笔企业对公打款？')) {
      adminMarkAsPaid(id);
      refreshData();
    }
  };

  const openInvoiceModal = (order: Order) => {
      setSelectedOrder(order);
  };

  const handleSendInvoice = async () => {
      if(!selectedOrder) return;
      setIsSending(true);
      
      // Simulate API delay (generating PDF and sending email)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      adminSendInvoice(selectedOrder.id);
      setIsSending(false);
      setSelectedOrder(null);
      refreshData();
  };

  // Calculations
  const pendingAmount = orders.filter(o => o.status === OrderStatus.PENDING).reduce((sum, o) => sum + o.amount, 0);
  const paidAmount = orders.filter(o => o.status === OrderStatus.PAID || o.status === OrderStatus.FINISHED).reduce((sum, o) => sum + o.amount, 0);
  
  // Sort: Pending Payment first, then Paid but Invoice Pending, then others
  const filteredOrders = orders
    .filter(o => 
        o.projectName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        // Simple priority sort
        const getPriority = (o: Order) => {
            if (o.status === OrderStatus.PENDING) return 1;
            if (o.status === OrderStatus.PAID && o.invoiceInfo && !o.invoiceInfo.sentAt) return 2;
            return 3;
        };
        return getPriority(a) - getPriority(b);
    });

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex font-sans text-slate-900">
      
      {/* Sidebar - Desktop Only */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-col fixed h-full inset-y-0 left-0 z-30 hidden md:flex">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
             <div className="w-7 h-7 bg-[#0A2540] rounded-lg flex items-center justify-center text-[#00D4FF] shadow-sm">
                <Sprout size={16} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-[#0A2540] text-lg tracking-tight">芦笋云汇</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
            <div className="px-3 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overview</div>
            <button className="w-full flex items-center gap-3 px-3 py-2 bg-[#F3F4F6] text-[#0A2540] rounded-md font-medium transition-all text-sm">
                <Wallet size={16} />
                <span>资金管理</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-[#0A2540] hover:bg-slate-50 rounded-md transition-all text-sm font-medium">
                <FileText size={16} />
                <span>发票中心</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 text-slate-500 hover:text-[#0A2540] hover:bg-slate-50 rounded-md transition-all text-sm font-medium">
                <MoreHorizontal size={16} />
                <span>设置</span>
            </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
             <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 text-slate-500 hover:text-[#0A2540] transition-colors text-sm px-2 py-2 rounded-md hover:bg-slate-50">
                <ArrowLeft size={16} />
                返回前台 (Mobile)
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-w-0 bg-[#F7F9FC]">
         {/* Top Header */}
         <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <h2 className="font-bold text-base text-[#0A2540]">资金控制台</h2>
                <div className="h-4 w-px bg-slate-200"></div>
                <span className="text-xs text-slate-500 font-medium">Overview</span>
            </div>
            <div className="flex items-center gap-6">
                 <button className="text-slate-400 hover:text-slate-600 relative">
                    <Bell size={18} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                 </button>
                 <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                     <div className="text-right mr-2 hidden sm:block">
                        <p className="text-xs font-bold text-[#0A2540] leading-tight">Admin User</p>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Administrator</p>
                     </div>
                     <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-600 font-bold shadow-sm text-xs">
                        A
                     </div>
                 </div>
            </div>
         </header>

         <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-8">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">待确认入账</p>
                        <RefreshCw size={14} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A2540] tabular-nums tracking-tight">¥{pendingAmount.toLocaleString()}</h3>
                </div>
                 <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">累计已入账</p>
                        <Wallet size={14} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A2540] tabular-nums tracking-tight">¥{paidAmount.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">总订单数</p>
                        <FileText size={14} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A2540] tabular-nums tracking-tight">{orders.length}</h3>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="font-bold text-sm text-[#0A2540]">交易订单明细</h3>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input 
                                type="text" 
                                placeholder="搜索订单..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#635BFF] focus:border-[#635BFF] w-full md:w-64 transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <button onClick={refreshData} className="p-1.5 text-slate-500 hover:text-[#0A2540] rounded border border-slate-200 hover:bg-slate-50 transition-all">
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200 font-semibold">
                                <th className="px-6 py-3 whitespace-nowrap">订单号 / 时间</th>
                                <th className="px-6 py-3 whitespace-nowrap">项目详情</th>
                                <th className="px-6 py-3 whitespace-nowrap">金额 (CNY)</th>
                                <th className="px-6 py-3 whitespace-nowrap">资金状态</th>
                                <th className="px-6 py-3 whitespace-nowrap">开票状态</th>
                                <th className="px-6 py-3 whitespace-nowrap text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">暂无相关订单数据</td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="font-mono text-xs font-medium text-slate-500 mb-0.5">{order.id}</div>
                                            <div className="text-[10px] text-slate-400 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="font-semibold text-[#0A2540] text-sm mb-0.5">{order.projectName}</div>
                                            <div className="text-[10px] text-slate-500 max-w-[200px] truncate">{order.details}</div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="font-mono font-bold text-[#0A2540] tabular-nums text-sm">¥{order.amount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                                order.status === OrderStatus.PENDING 
                                                    ? 'bg-amber-50 text-amber-700 border-amber-100' 
                                                    : order.status === OrderStatus.PAID 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                    : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                                {order.status === OrderStatus.PENDING ? '待支付' : order.status === OrderStatus.PAID ? '已到账' : '已完结'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3">
                                            {order.invoiceInfo ? (
                                                <div className="flex flex-col gap-1">
                                                     {/* Company Name with Type Indicator */}
                                                     <div className="flex items-center gap-1.5">
                                                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${order.invoiceInfo.type === 'SPECIAL' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
                                                        <span className="text-xs font-medium text-slate-700 truncate max-w-[150px]" title={order.invoiceInfo.companyName}>{order.invoiceInfo.companyName}</span>
                                                     </div>
                                                     
                                                     {/* Status Badge */}
                                                     <div className="pl-3">
                                                         {order.invoiceInfo.sentAt ? (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                                                                <CheckCircle size={10} />
                                                                已发送
                                                            </span>
                                                         ) : (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600">
                                                                <FileText size={10} />
                                                                待开票
                                                            </span>
                                                         )}
                                                     </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic pl-2">--</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {order.status === OrderStatus.PENDING && (
                                                    <button 
                                                        onClick={() => handleConfirmPayment(order.id)}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-[#0A2540] text-xs font-semibold rounded shadow-sm transition-all whitespace-nowrap"
                                                    >
                                                        <CheckCircle size={12} className="text-slate-400" />
                                                        确认收款
                                                    </button>
                                                )}
                                                
                                                {/* Invoice Action - Only visible if Invoice Requested & Payment Received & Not Sent yet */}
                                                {order.status !== OrderStatus.PENDING && order.invoiceInfo && !order.invoiceInfo.sentAt && (
                                                    <button 
                                                        onClick={() => openInvoiceModal(order)}
                                                        className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#635BFF] text-white text-xs font-semibold rounded shadow-sm hover:bg-[#5851df] transition-all whitespace-nowrap"
                                                    >
                                                        <Send size={12} />
                                                        开具发票
                                                    </button>
                                                )}

                                                 {/* View Sent Invoice */}
                                                {order.invoiceInfo && order.invoiceInfo.sentAt && (
                                                     <button disabled className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 text-slate-400 text-xs font-semibold rounded cursor-not-allowed whitespace-nowrap border border-transparent">
                                                        <CheckCircle size={12} />
                                                        已完成
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
         </div>
      </main>

      {/* Invoice Processing Modal */}
      {selectedOrder && selectedOrder.invoiceInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[#0A2540]/50 backdrop-blur-[2px]" onClick={() => !isSending && setSelectedOrder(null)}></div>
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up ring-1 ring-slate-900/5">
                  
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-50 text-[#635BFF] rounded-md">
                              <FileText size={18} />
                          </div>
                          <div>
                              <h3 className="font-bold text-[#0A2540] text-sm">开具数电发票</h3>
                              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">Generating Digital Invoice</p>
                          </div>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} disabled={isSending} className="text-slate-400 hover:text-slate-600 p-1">
                          <X size={18} />
                      </button>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-6">
                      
                      {/* Recipient Info Card */}
                      <div className="bg-[#F7F9FC] rounded-lg p-5 border border-slate-200 space-y-4">
                           <div className="flex justify-between items-start">
                               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">发票抬头</span>
                               <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${selectedOrder.invoiceInfo.type === 'SPECIAL' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                   {selectedOrder.invoiceInfo.type === 'SPECIAL' ? '增值税专用发票' : '增值税普通发票'}
                               </span>
                           </div>
                           <p className="text-base font-bold text-[#0A2540]">{selectedOrder.invoiceInfo.companyName}</p>
                           
                           <div className="grid grid-cols-2 gap-4 pt-1">
                               <div>
                                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">税号</span>
                                   <p className="text-sm font-mono text-slate-700">{selectedOrder.invoiceInfo.taxId}</p>
                               </div>
                               <div>
                                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">开票金额</span>
                                   <p className="text-sm font-mono font-bold text-[#0A2540]">¥{selectedOrder.amount.toLocaleString()}</p>
                               </div>
                           </div>

                            {/* Additional Info for Special Invoice */}
                            {selectedOrder.invoiceInfo.type === 'SPECIAL' && (
                                <div className="pt-3 mt-1 border-t border-slate-200/60 grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-600">
                                    <div className="col-span-2">
                                        <span className="text-slate-400 mr-2 font-medium">地址:</span>
                                        {selectedOrder.invoiceInfo.address}
                                    </div>
                                    <div>
                                        <span className="text-slate-400 mr-2 font-medium">电话:</span>
                                        {selectedOrder.invoiceInfo.phone}
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-slate-400 mr-2 font-medium">银行:</span>
                                        {selectedOrder.invoiceInfo.bankName} {selectedOrder.invoiceInfo.bankAccount}
                                    </div>
                                </div>
                            )}
                      </div>

                      {/* Sending To */}
                      <div className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100/50 rounded-lg text-blue-900">
                          <Mail size={16} className="text-[#635BFF]" />
                          <div className="flex-1">
                              <p className="text-[10px] font-bold text-[#635BFF] uppercase tracking-wide">接收邮箱</p>
                              <p className="text-sm font-medium">{selectedOrder.invoiceInfo.email}</p>
                          </div>
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                      <button 
                        onClick={() => setSelectedOrder(null)} 
                        disabled={isSending}
                        className="px-4 py-2 text-slate-600 font-bold text-sm hover:bg-slate-200 rounded-lg transition-colors"
                      >
                          取消
                      </button>
                      <button 
                        onClick={handleSendInvoice}
                        disabled={isSending}
                        className="px-5 py-2 bg-[#635BFF] text-white font-bold text-sm rounded-lg hover:bg-[#5851df] transition-all shadow-md shadow-[#635BFF]/20 flex items-center gap-2 min-w-[150px] justify-center active:scale-[0.98]"
                      >
                          {isSending ? (
                              <>
                                <RefreshCw size={14} className="animate-spin" />
                                <span>生成发送中...</span>
                              </>
                          ) : (
                              <>
                                <Send size={14} />
                                <span>确认开票并发送</span>
                              </>
                          )}
                      </button>
                  </div>
              </div>
          </div>
      )}
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;