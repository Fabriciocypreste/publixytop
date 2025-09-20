import { Settings, User, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function Header() {
  const navigate = useNavigate();
  
  return (
    <header className="flex items-center justify-between gap-4 mb-8 p-6 bg-gradient-to-r from-slate-900/50 to-blue-900/50 rounded-xl border border-white/10">
      <div className="flex gap-3 items-center cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-slate-900 text-xl">
          AI
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Publixy</h1>
          <div className="text-slate-400 text-sm">Sua agência dentro de um botão</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/plans')}
          className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Planos
        </button>
        <button className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10 transition-colors flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Config
        </button>
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all flex items-center gap-2">
          <User className="w-4 h-4" />
          Conta
        </button>
      </div>
    </header>
  );
}
