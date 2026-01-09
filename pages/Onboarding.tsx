import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'FREELANCER' | 'COMPANY' | null>(null);

  const handleContinue = () => {
    if (role === 'FREELANCER') navigate('/dashboard');
    if (role === 'COMPANY') navigate('/billing');
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex justify-center py-0 md:py-8 font-sans">
      {/* Mobile Frame Container - Matches Layout.tsx */}
      <div className="w-full max-w-[420px] bg-gray-50 h-screen md:h-[850px] md:max-h-[calc(100vh-4rem)] md:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative flex flex-col overflow-hidden border border-slate-200/60 ring-1 ring-slate-900/5">
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-12 pb-6">
            {/* Header */}
            <div className="mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                    <div className="w-6 h-6 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-lg"></div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">欢迎加入芦笋云汇</h1>
                <p className="text-base text-gray-500 mt-2 leading-relaxed">为自由职业者和企业提供合规、高效的资金结算服务。请选择您的身份以继续。</p>
            </div>

            {/* Selection Cards */}
            <div className="space-y-4">
                {/* Freelancer Card (C-End) */}
                <div 
                    onClick={() => setRole('FREELANCER')}
                    className={`relative w-full rounded-xl border p-5 text-left cursor-pointer transition-all duration-200 ease-in-out group
                    ${role === 'FREELANCER' 
                        ? 'bg-blue-50/50 border-blue-500 ring-1 ring-blue-500 shadow-md z-10' 
                        : 'bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow'}`}
                >
                    {role === 'FREELANCER' && <CheckCircle2 className="absolute top-4 right-4 text-blue-600 w-5 h-5 animate-scale-in" />}
                    
                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${role === 'FREELANCER' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold mb-1 ${role === 'FREELANCER' ? 'text-blue-900' : 'text-gray-900'}`}>我是自由职业者</h3>
                            <p className="text-sm text-gray-500 leading-normal">创建收款项目，签约提现，自动报税，合规完税证明。</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100/80 flex items-center gap-2 text-xs text-gray-400 font-medium tracking-wide">
                        <span>创建收款单</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>查看进度</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>签约提现</span>
                    </div>
                </div>

                {/* Company Card (B-End) */}
                <div 
                    onClick={() => setRole('COMPANY')}
                    className={`relative w-full rounded-xl border p-5 text-left cursor-pointer transition-all duration-200 ease-in-out group
                    ${role === 'COMPANY' 
                        ? 'bg-orange-50/50 border-orange-500 ring-1 ring-orange-500 shadow-md z-10' 
                        : 'bg-white border-gray-200 shadow-sm hover:border-gray-300 hover:shadow'}`}
                >
                    {role === 'COMPANY' && <CheckCircle2 className="absolute top-4 right-4 text-orange-600 w-5 h-5 animate-scale-in" />}

                    <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors ${role === 'COMPANY' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                            <Building2 size={20} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-semibold mb-1 ${role === 'COMPANY' ? 'text-orange-900' : 'text-gray-900'}`}>我是企业管理员</h3>
                            <p className="text-sm text-gray-500 leading-normal">管理对公打款，审核发票，资金分发，企业账户管理。</p>
                        </div>
                    </div>
                    
                     <div className="mt-4 pt-4 border-t border-gray-100/80 flex items-center gap-2 text-xs text-gray-400 font-medium tracking-wide">
                        <span>对公打款</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>发票审核</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span>资金管理</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Sticky Footer */}
        <div className="p-6 bg-white border-t border-gray-100 pb-8">
             <p className="text-[10px] text-gray-400 text-center mb-4">
                点击继续即代表同意 <span className="underline cursor-pointer hover:text-gray-600">《用户服务协议》</span> 和 <span className="underline cursor-pointer hover:text-gray-600">《隐私政策》</span>
             </p>
             <button 
                onClick={handleContinue}
                disabled={!role}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2
                ${role 
                    ? 'bg-gray-900 text-white shadow-xl shadow-gray-900/20 active:scale-[0.98] hover:bg-gray-800' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
             >
                <span>继续</span>
                <ArrowRight size={18} className={role ? 'opacity-100 translate-x-0 transition-all' : 'opacity-0 -translate-x-2'} />
             </button>
        </div>

      </div>
      <style>{`
        @keyframes scale-in {
            from { transform: scale(0.5); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
            animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default Onboarding;