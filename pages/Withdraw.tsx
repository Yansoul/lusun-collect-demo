import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Wallet, CheckCircle, ArrowRight } from 'lucide-react';
import { getOrders, updateOrder } from '../services/storage';
import { Order, OrderStatus, FEES } from '../types';

const Withdraw: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'AUTH' | 'CONFIRM' | 'DONE'>('AUTH');
  const [totalAmount, setTotalAmount] = useState(0);
  const [payableOrders, setPayableOrders] = useState<Order[]>([]);

  // Auth
  const [name, setName] = useState('');
  const [idCard, setIdCard] = useState('');

  useEffect(() => {
    const all = getOrders();
    const payables = all.filter(o => o.status === OrderStatus.PAID);
    setPayableOrders(payables);
    setTotalAmount(payables.reduce((a, b) => a + b.amount, 0));

    if(localStorage.getItem('lusun_verified') === 'true') {
        setStep('CONFIRM');
    }
  }, []);

  const handleNext = () => {
      if (step === 'AUTH') {
          if (!name || !idCard) return alert("请填写完整信息");
          localStorage.setItem('lusun_verified', 'true');
          setStep('CONFIRM');
      } else if (step === 'CONFIRM') {
          payableOrders.forEach(o => updateOrder({...o, status: OrderStatus.FINISHED}));
          setStep('DONE');
      }
  }

  if (step === 'DONE') {
      return (
          <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6 animate-bounce shadow-sm">
                  <CheckCircle size={40} strokeWidth={3} />
              </div>
              <h2 className="text-2xl font-bold text-[#0A2540] mb-2 tracking-tight">提现申请已提交</h2>
              <p className="text-slate-500 mb-10 leading-relaxed text-sm">系统处理中，资金预计 2 小时内到账。<br/>请留意银行短信通知。</p>
              <button onClick={() => navigate('/dashboard')} className="w-full bg-[#0A2540] hover:bg-slate-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/10 transition-all active:scale-[0.98]">返回首页</button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex justify-center py-0 md:py-8 font-sans antialiased">
        <div className="w-full max-w-[420px] bg-white min-h-screen md:min-h-0 md:h-[800px] md:rounded-[32px] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] relative flex flex-col md:border md:border-slate-200/60 overflow-hidden">
            
            {/* Header */}
            <div className="px-4 py-4 flex items-center gap-2 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-500 hover:text-[#0A2540] hover:bg-slate-50 rounded-full transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-base text-[#0A2540]">
                    {step === 'AUTH' ? '实名签约' : '确认提现'}
                </span>
            </div>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
                {step === 'AUTH' && (
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="bg-[#F7F9FC] border border-slate-200 p-5 rounded-xl">
                            <div className="flex gap-3">
                                <Shield size={20} className="text-[#635BFF] flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-slate-600 leading-relaxed">
                                    <p className="font-bold text-[#0A2540] mb-1">合规保障</p>
                                    为保障资金安全及税务合规，首次提现需完成实名认证并签署灵活用工协议。
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">真实姓名</label>
                                <input 
                                    value={name} onChange={e => setName(e.target.value)} 
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3.5 outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 font-medium text-[#0A2540] shadow-sm" 
                                    placeholder="姓名" 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">身份证号</label>
                                <input 
                                    value={idCard} onChange={e => setIdCard(e.target.value)} 
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3.5 outline-none focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] focus:shadow-[0_0_0_4px_rgba(99,91,255,0.1)] transition-all placeholder:text-slate-300 font-medium font-mono text-[#0A2540] shadow-sm" 
                                    placeholder="18位身份证号" 
                                />
                            </div>
                        </div>
                        
                        <div className="text-xs text-slate-400 text-center px-4 leading-relaxed">
                            点击下一步即代表您已同意 <span className="text-slate-600 font-bold hover:underline cursor-pointer">《自由职业者合作协议》</span>
                        </div>
                    </div>
                )}

                {step === 'CONFIRM' && (
                    <div className="space-y-8 animate-fade-in-up">
                        <div className="text-center py-4">
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Estimated Arrival</p>
                            <div className="flex items-start justify-center text-[#0A2540]">
                                <span className="text-2xl font-bold mt-1 mr-1">¥</span>
                                <h1 className="text-5xl font-bold tracking-tighter tabular-nums">{(totalAmount * (1 - FEES.RATE)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h1>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">提现总额</span>
                                <span className="font-bold text-[#0A2540] tabular-nums">¥ {totalAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">综合税费服务费 ({FEES.RATE_DISPLAY})</span>
                                <span className="text-rose-500 font-bold tabular-nums">- ¥ {(totalAmount * FEES.RATE).toLocaleString()}</span>
                            </div>
                            <div className="border-t border-slate-100 my-2"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-[#0A2540] text-sm">到账银行卡</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-[#0048cc] rounded-full flex items-center justify-center text-white text-[10px] font-bold">建</div>
                                    <span className="text-sm text-slate-700 font-medium">建设银行 (8888)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-6">
                <button 
                    onClick={handleNext}
                    className="w-full bg-[#635BFF] hover:bg-[#5851df] text-white font-bold py-4 rounded-xl text-lg shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {step === 'AUTH' ? <span>下一步</span> : <span>确认提现</span>}
                    {step === 'AUTH' && <ArrowRight size={20} />}
                </button>
            </div>

        </div>
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

export default Withdraw;