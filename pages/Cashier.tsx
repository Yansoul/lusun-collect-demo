import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sprout, Copy, CheckCircle, ShieldCheck, Building2, Smartphone, CreditCard, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { getOrderById, submitInvoiceInfo } from '../services/storage';
import { Order, BANK_INFO, InvoiceType } from '../types';

const Cashier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'WECHAT' | 'ALIPAY' | 'BANK'>('WECHAT');
  const [showBankInfo, setShowBankInfo] = useState(false);

  // Invoice Form State
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('GENERAL');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [email, setEmail] = useState('');
  // Special Invoice Fields
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankAccount, setBankAccount] = useState('');

  useEffect(() => {
    if (id) {
      setOrder(getOrderById(id));
    }
    setLoading(false);
  }, [id]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板');
  };

  const handleWeChatPay = () => alert('正在唤起微信支付...');
  const handleAliPay = () => alert('正在唤起支付宝...');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    
    submitInvoiceInfo(order.id, { 
        type: invoiceType,
        companyName, 
        taxId, 
        email, 
        address: invoiceType === 'SPECIAL' ? address : undefined,
        phone: invoiceType === 'SPECIAL' ? phone : undefined,
        bankName: invoiceType === 'SPECIAL' ? bankName : undefined,
        bankAccount: invoiceType === 'SPECIAL' ? bankAccount : undefined,
        submittedAt: new Date().toISOString() 
    });
    setSubmitted(true);
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center text-slate-400 font-medium">Loading details...</div>;
  if (!order) return <div className="p-10 text-center text-slate-500">订单无效或已过期</div>;

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex justify-center font-sans py-0 md:py-8 antialiased">
        <div className="w-full max-w-[420px] bg-white min-h-screen md:min-h-0 md:h-auto md:rounded-[24px] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] relative flex flex-col md:border md:border-slate-200/60 overflow-hidden">
            
            {/* Header / Brand */}
            <div className="bg-white border-b border-slate-100 px-6 py-5 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 bg-[#0A2540] rounded flex items-center justify-center text-[#00D4FF]">
                        <Sprout size={14} strokeWidth={3} />
                    </div>
                    <span className="font-bold text-[#0A2540] tracking-tight text-base">芦笋云汇</span>
                </div>
                <div className="px-2 py-1 bg-slate-50 rounded text-[10px] font-bold text-slate-400 flex items-center gap-1 border border-slate-100">
                    <Lock size={8} />
                    SECURE CHECKOUT
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white">
                
                {/* Amount Section */}
                <div className="text-left">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Amount</p>
                    <div className="flex items-baseline text-[#0A2540]">
                         <span className="text-2xl font-bold mr-1">¥</span>
                         <h1 className="text-5xl font-bold tracking-tighter tabular-nums">{order.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
                    </div>
                    <div className="mt-3 text-sm text-slate-500 font-medium">
                        订单: {order.projectName} <span className="mx-1 text-slate-300">|</span> <span className="font-mono text-xs">{order.id.split('-').pop()}</span>
                    </div>
                </div>

                {/* 1. Payment Method Section */}
                <div>
                    <h3 className="font-bold text-[#0A2540] mb-4 text-sm flex items-center gap-2">
                        支付方式
                    </h3>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                        {/* WeChat Pay */}
                        <button 
                            onClick={() => { setPaymentMethod('WECHAT'); handleWeChatPay(); }}
                            className={`group relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-200 ${paymentMethod === 'WECHAT' ? 'bg-[#09BB07]/5 border-[#09BB07] ring-1 ring-[#09BB07]' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                        >
                            <div className="bg-[#09BB07] text-white p-2.5 rounded-lg shadow-sm"><Smartphone size={20} /></div>
                            <span className={`text-xs font-bold ${paymentMethod === 'WECHAT' ? 'text-[#09BB07]' : 'text-slate-600'}`}>微信支付</span>
                            {paymentMethod === 'WECHAT' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#09BB07]"></div>}
                        </button>

                        {/* Alipay */}
                        <button 
                            onClick={() => { setPaymentMethod('ALIPAY'); handleAliPay(); }}
                            className={`group relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-200 ${paymentMethod === 'ALIPAY' ? 'bg-[#1677FF]/5 border-[#1677FF] ring-1 ring-[#1677FF]' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                        >
                             <div className="bg-[#1677FF] text-white p-2.5 rounded-lg shadow-sm"><CreditCard size={20} /></div>
                             <span className={`text-xs font-bold ${paymentMethod === 'ALIPAY' ? 'text-[#1677FF]' : 'text-slate-600'}`}>支付宝</span>
                             {paymentMethod === 'ALIPAY' && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#1677FF]"></div>}
                        </button>
                    </div>

                    {/* Bank Transfer (Full Width) */}
                    <div className={`border rounded-xl overflow-hidden transition-all duration-300 ${paymentMethod === 'BANK' || showBankInfo ? 'bg-slate-50 border-slate-300' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
                        <button 
                            onClick={() => { setPaymentMethod('BANK'); setShowBankInfo(!showBankInfo); }}
                            className="w-full p-4 flex items-center justify-between text-slate-800"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-md transition-colors ${paymentMethod === 'BANK' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}><Building2 size={16} /></div>
                                <div className="text-left">
                                    <span className="font-bold text-[#0A2540] block text-sm">企业对公转账</span>
                                </div>
                            </div>
                            {showBankInfo ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>
                        
                        {showBankInfo && (
                            <div className="px-5 pb-5 pt-0 space-y-4 animate-fade-in">
                                    <div className="h-px bg-slate-200 mb-4"></div>
                                    <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm space-y-4">
                                    {[
                                        { label: '户名', value: BANK_INFO.accountName },
                                        { label: '账号', value: BANK_INFO.accountNumber, isMono: true, big: true },
                                        { label: '开户行', value: BANK_INFO.bankName },
                                        { label: '附言/备注', value: order.id, isMono: true, highlight: true }
                                    ].map((item, idx) => (
                                        <div key={idx} onClick={() => handleCopy(item.value)} className="cursor-pointer group">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</p>
                                            <div className="flex justify-between items-center">
                                                <p className={`font-medium text-slate-800 break-all pr-4 ${item.isMono ? 'font-mono' : ''} ${item.big ? 'text-base tracking-tight' : 'text-sm'} ${item.highlight ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100' : ''}`}>
                                                    {item.value}
                                                </p>
                                                <Copy size={14} className="text-slate-300 group-hover:text-[#635BFF] transition-colors flex-shrink-0" />
                                            </div>
                                        </div>
                                    ))}
                                    </div>
                                    <div className="flex items-start gap-2 text-xs text-slate-500 bg-[#F3F4F6] px-3 py-2.5 rounded-lg leading-relaxed border border-slate-200">
                                        <ShieldCheck size={14} className="mt-0.5 text-emerald-600 flex-shrink-0" />
                                        <span>为确保系统自动核销，请务必在转账时在用途/附言栏填写订单号。</span>
                                    </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-100"></div>

                {/* 2. Invoice Section */}
                <div>
                    <h3 className="font-bold text-[#0A2540] mb-4 text-sm flex items-center gap-2">
                        发票申请
                    </h3>

                    {order.invoiceInfo || submitted ? (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-8 text-center">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle size={24} className="text-emerald-600" />
                            </div>
                            <p className="text-emerald-900 font-bold text-lg mb-1">申请已提交</p>
                            <p className="text-emerald-700/80 text-sm">电子发票将在资金到账后发送至您的邮箱</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {/* Invoice Type Segmented Control */}
                            <div className="flex p-1 bg-slate-100 rounded-lg">
                                <button 
                                    onClick={() => setInvoiceType('GENERAL')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all duration-200 ${invoiceType === 'GENERAL' ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    增值税普通发票
                                </button>
                                <button 
                                    onClick={() => setInvoiceType('SPECIAL')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all duration-200 ${invoiceType === 'SPECIAL' ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    增值税专用发票
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="group">
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">抬头名称</label>
                                        <input 
                                            required placeholder="公司全称" 
                                            value={companyName} onChange={e => setCompanyName(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                    <div className="group">
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">税号</label>
                                        <input 
                                            required placeholder="纳税人识别号" 
                                            value={taxId} onChange={e => setTaxId(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>

                                    {/* Special Invoice Fields */}
                                    {invoiceType === 'SPECIAL' && (
                                        <div className="space-y-4 animate-fade-in pt-2">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">注册电话</label>
                                                    <input 
                                                        required placeholder="公司电话" 
                                                        value={phone} onChange={e => setPhone(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 shadow-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">开户银行</label>
                                                    <input 
                                                        required placeholder="银行名称" 
                                                        value={bankName} onChange={e => setBankName(e.target.value)}
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 shadow-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">银行账号</label>
                                                <input 
                                                    required placeholder="对公银行账号" 
                                                    value={bankAccount} onChange={e => setBankAccount(e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 shadow-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">注册地址</label>
                                                <textarea 
                                                    required placeholder="营业执照注册地址" 
                                                    value={address} onChange={e => setAddress(e.target.value)}
                                                    rows={2}
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 shadow-sm resize-none"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 mb-1.5 ml-1">接收邮箱</label>
                                        <input 
                                            required type="email" placeholder="email@company.com" 
                                            value={email} onChange={e => setEmail(e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-[#0A2540] outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-[#635BFF] text-white font-bold py-4 rounded-xl mt-6 shadow-md shadow-[#635BFF]/20 active:scale-[0.99] transition-all hover:bg-[#5851df] flex items-center justify-center gap-2">
                                    提交信息
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="h-4"></div>
            </main>
        </div>
        <style>{`
            @keyframes fade-in {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
                animation: fade-in 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default Cashier;