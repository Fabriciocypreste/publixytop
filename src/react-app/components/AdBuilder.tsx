import { useState } from 'react';
import { Target, DollarSign, BarChart3, Users } from 'lucide-react';

interface AdCampaign {
  id: string;
  name: string;
  objective: string;
  budget: number;
  duration: number;
  audience: {
    ageRange: string;
    interests: string[];
    location: string;
  };
  creative: {
    headline: string;
    description: string;
    imageUrl?: string;
    cta: string;
  };
  status: 'draft' | 'active' | 'paused';
}

const objectives = [
  { id: 'awareness', name: 'Reconhecimento da Marca', description: 'Aumentar visibilidade' },
  { id: 'traffic', name: 'Tráfego', description: 'Direcionar visitas ao site' },
  { id: 'engagement', name: 'Engajamento', description: 'Curtidas, comentários, shares' },
  { id: 'leads', name: 'Geração de Leads', description: 'Capturar contatos' },
  { id: 'conversions', name: 'Conversões', description: 'Vendas e ações importantes' }
];

const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55+'];
const interests = [
  'Tecnologia', 'Marketing Digital', 'Empreendedorismo', 'E-commerce',
  'Inteligência Artificial', 'Startups', 'Negócios', 'Inovação'
];

const ctas = [
  'Saiba Mais', 'Compre Agora', 'Cadastre-se', 'Baixe Grátis',
  'Entre em Contato', 'Agende uma Demo', 'Experimente Grátis'
];

export default function AdBuilder() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [showBuilder, setShowBuilder] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<Partial<AdCampaign>>({
    name: '',
    objective: 'awareness',
    budget: 100,
    duration: 7,
    audience: {
      ageRange: '25-34',
      interests: [],
      location: 'Brasil'
    },
    creative: {
      headline: '',
      description: '',
      cta: 'Saiba Mais'
    }
  });

  const [step, setStep] = useState(1);

  const handleInterestToggle = (interest: string) => {
    setCurrentCampaign(prev => ({
      ...prev,
      audience: {
        ...prev.audience!,
        interests: prev.audience!.interests.includes(interest)
          ? prev.audience!.interests.filter(i => i !== interest)
          : [...prev.audience!.interests, interest]
      }
    }));
  };

  const createCampaign = () => {
    if (!currentCampaign.name || !currentCampaign.creative?.headline) return;

    const newCampaign: AdCampaign = {
      ...currentCampaign as AdCampaign,
      id: Date.now().toString(),
      status: 'draft'
    };

    setCampaigns(prev => [...prev, newCampaign]);
    setCurrentCampaign({
      name: '',
      objective: 'awareness',
      budget: 100,
      duration: 7,
      audience: {
        ageRange: '25-34',
        interests: [],
        location: 'Brasil'
      },
      creative: {
        headline: '',
        description: '',
        cta: 'Saiba Mais'
      }
    });
    setStep(1);
    setShowBuilder(false);
    alert('Campanha criada! Em produção, seria enviada para as APIs do Meta Ads, Google Ads, etc.');
  };

  const getEstimatedReach = () => {
    const baseReach = currentCampaign.budget! * 500; // Estimativa simplificada
    const interestMultiplier = currentCampaign.audience!.interests.length * 0.1 + 1;
    return Math.floor(baseReach * interestMultiplier);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/20';
      case 'draft': return 'text-slate-400 bg-slate-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-orange-900/30 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Builder de Anúncios</h2>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 text-white font-medium hover:from-orange-500 hover:to-red-500 transition-all flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Nova Campanha
        </button>
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma campanha criada ainda</p>
            <p className="text-sm">Clique em "Nova Campanha" para começar</p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-slate-900/30 rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                  <p className="text-slate-300 text-sm">{campaign.creative.headline}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Orçamento</div>
                  <div className="text-white font-medium">R${campaign.budget}/dia</div>
                </div>
                <div>
                  <div className="text-slate-400">Duração</div>
                  <div className="text-white font-medium">{campaign.duration} dias</div>
                </div>
                <div>
                  <div className="text-slate-400">Público</div>
                  <div className="text-white font-medium">{campaign.audience.ageRange}</div>
                </div>
                <div>
                  <div className="text-slate-400">Objetivo</div>
                  <div className="text-white font-medium">{objectives.find(o => o.id === campaign.objective)?.name}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Campaign Builder Modal */}
      {showBuilder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-3xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Criar Campanha Publicitária</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className={`w-3 h-3 rounded-full ${i <= step ? 'bg-orange-400' : 'bg-slate-600'}`} />
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Target className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white">Configurações Básicas</h4>
                </div>

                <input
                  type="text"
                  placeholder="Nome da campanha"
                  value={currentCampaign.name}
                  onChange={(e) => setCurrentCampaign(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none"
                />

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Objetivo da Campanha</label>
                  <div className="space-y-2">
                    {objectives.map((objective) => (
                      <button
                        key={objective.id}
                        onClick={() => setCurrentCampaign(prev => ({ ...prev, objective: objective.id }))}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          currentCampaign.objective === objective.id
                            ? 'border-orange-400 bg-orange-500/20 text-orange-300'
                            : 'border-white/20 hover:border-white/40 text-slate-300'
                        }`}
                      >
                        <div className="font-medium">{objective.name}</div>
                        <div className="text-sm text-slate-400">{objective.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <DollarSign className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white">Orçamento e Duração</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Orçamento Diário (R$)</label>
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      value={currentCampaign.budget}
                      onChange={(e) => setCurrentCampaign(prev => ({ ...prev, budget: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-orange-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Duração (dias)</label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={currentCampaign.duration}
                      onChange={(e) => setCurrentCampaign(prev => ({ ...prev, duration: Number(e.target.value) }))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-orange-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-slate-900/30 rounded-lg p-4 border border-orange-500/20">
                  <h5 className="font-medium text-orange-300 mb-2">Estimativas</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-400">Alcance estimado</div>
                      <div className="text-white font-medium">{getEstimatedReach().toLocaleString()} pessoas</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Investimento total</div>
                      <div className="text-white font-medium">R${(currentCampaign.budget! * currentCampaign.duration!).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Users className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white">Definir Público-Alvo</h4>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Faixa Etária</label>
                    <select
                      value={currentCampaign.audience?.ageRange}
                      onChange={(e) => setCurrentCampaign(prev => ({
                        ...prev,
                        audience: { ...prev.audience!, ageRange: e.target.value }
                      }))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-orange-400 focus:outline-none"
                    >
                      {ageRanges.map(range => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Localização</label>
                    <input
                      type="text"
                      value={currentCampaign.audience?.location}
                      onChange={(e) => setCurrentCampaign(prev => ({
                        ...prev,
                        audience: { ...prev.audience!, location: e.target.value }
                      }))}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-orange-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Interesses</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {interests.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-2 rounded-lg border text-sm transition-all ${
                          currentCampaign.audience!.interests.includes(interest)
                            ? 'border-orange-400 bg-orange-500/20 text-orange-300'
                            : 'border-white/20 hover:border-white/40 text-slate-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <BarChart3 className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-white">Criar Anúncio</h4>
                </div>

                <input
                  type="text"
                  placeholder="Título principal do anúncio"
                  value={currentCampaign.creative?.headline}
                  onChange={(e) => setCurrentCampaign(prev => ({
                    ...prev,
                    creative: { ...prev.creative!, headline: e.target.value }
                  }))}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none"
                />

                <textarea
                  placeholder="Descrição do anúncio"
                  value={currentCampaign.creative?.description}
                  onChange={(e) => setCurrentCampaign(prev => ({
                    ...prev,
                    creative: { ...prev.creative!, description: e.target.value }
                  }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-orange-400 focus:outline-none resize-none"
                />

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Call to Action</label>
                  <select
                    value={currentCampaign.creative?.cta}
                    onChange={(e) => setCurrentCampaign(prev => ({
                      ...prev,
                      creative: { ...prev.creative!, cta: e.target.value }
                    }))}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-orange-400 focus:outline-none"
                  >
                    {ctas.map(cta => (
                      <option key={cta} value={cta}>{cta}</option>
                    ))}
                  </select>
                </div>

                {/* Ad Preview */}
                <div className="bg-slate-900/30 rounded-lg p-4 border border-orange-500/20">
                  <h5 className="font-medium text-orange-300 mb-3">Pré-visualização do Anúncio</h5>
                  <div className="bg-slate-800/50 rounded p-4 border border-white/10">
                    <div className="text-white font-medium mb-2">{currentCampaign.creative?.headline}</div>
                    <div className="text-slate-300 text-sm mb-3">{currentCampaign.creative?.description}</div>
                    <button className="px-4 py-2 bg-orange-500 text-white rounded text-sm font-medium">
                      {currentCampaign.creative?.cta}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <div className="flex gap-2">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10 transition-colors"
                  >
                    Voltar
                  </button>
                )}
                <button
                  onClick={() => setShowBuilder(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10 transition-colors"
                >
                  Cancelar
                </button>
              </div>
              
              <button
                onClick={step < 4 ? () => setStep(step + 1) : createCampaign}
                disabled={
                  (step === 1 && !currentCampaign.name) ||
                  (step === 4 && !currentCampaign.creative?.headline)
                }
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 text-white font-medium hover:from-orange-500 hover:to-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 4 ? 'Criar Campanha' : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
