import { useState } from 'react';
import { Check, Star, Zap, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import Header from '@/react-app/components/Header';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 39,
    description: 'Perfeito para empreendedores iniciantes',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-blue-400 to-cyan-400',
    features: [
      '50 posts por mês',
      '20 imagens IA por mês',
      '10 vídeos curtos por mês',
      '2 landing pages',
      'Agendamento básico',
      'Analytics essenciais',
      'Suporte por chat',
      'Templates básicos'
    ],
    limits: {
      posts: 50,
      images: 20,
      videos: 10,
      landings: 2
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 89,
    description: 'Para profissionais e pequenas agências',
    icon: <Star className="w-6 h-6" />,
    color: 'from-purple-400 to-pink-400',
    features: [
      '200 posts por mês',
      '100 imagens IA por mês',
      '50 vídeos por mês',
      '10 landing pages',
      'Agendamento avançado',
      'Analytics completos',
      'Suporte prioritário',
      'Templates premium',
      'Integração com redes sociais',
      'Relatórios automáticos',
      'Builder de anúncios',
      'A/B testing básico'
    ],
    limits: {
      posts: 200,
      images: 100,
      videos: 50,
      landings: 10
    },
    popular: true
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 199,
    description: 'Para agências e grandes empresas',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-yellow-400 to-orange-400',
    features: [
      'Posts ilimitados',
      'Imagens IA ilimitadas',
      'Vídeos ilimitados',
      'Landing pages ilimitadas',
      'Agendamento enterprise',
      'Analytics avançados',
      'Suporte 24/7',
      'Templates exclusivos',
      'White-label',
      'API access',
      'Multi-clientes',
      'Aprovação workflow',
      'Custom integrations',
      'Treinamento dedicado'
    ],
    limits: {
      posts: -1,
      images: -1,
      videos: -1,
      landings: -1
    }
  }
];

export default function PlansPage() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    
    // Simulate plan selection
    setTimeout(() => {
      localStorage.setItem('selected_plan', planId);
      alert(`Plano ${plans.find(p => p.id === planId)?.name} selecionado! Em produção, integraria com sistema de pagamento.`);
      navigate('/dashboard');
    }, 1000);
  };

  const getPrice = (price: number) => {
    return billing === 'yearly' ? Math.floor(price * 0.83) : price; // 17% discount for yearly
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header />
        
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </button>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Escolha o plano ideal para você
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Escale sua presença digital com tecnologia de IA avançada
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 bg-slate-800/50 rounded-xl p-2 w-fit mx-auto">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  billing === 'monthly'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBilling('yearly')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  billing === 'yearly'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Anual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">-17%</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-slate-800/50 rounded-2xl p-8 border transition-all hover:scale-105 ${
                  plan.popular
                    ? 'border-purple-400/50 ring-2 ring-purple-400/20'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4 text-slate-900`}>
                    {plan.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-white">R${getPrice(plan.price)}</span>
                    <span className="text-slate-400">/{billing === 'monthly' ? 'mês' : 'ano'}</span>
                  </div>
                  
                  {billing === 'yearly' && plan.price !== getPrice(plan.price) && (
                    <div className="text-sm text-green-400 mt-1">
                      Economize R${(plan.price - getPrice(plan.price)) * 12}/ano
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePlanSelect(plan.id)}
                  disabled={selectedPlan === plan.id}
                  className={`w-full py-4 rounded-xl font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-500 hover:to-slate-600'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {selectedPlan === plan.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processando...
                    </div>
                  ) : (
                    'Escolher Plano'
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-16 bg-slate-800/30 rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-center mb-8">Compare os recursos</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 text-slate-400">Recurso</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center py-4 text-white font-medium min-w-32">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Posts por mês', key: 'posts' },
                    { name: 'Imagens IA', key: 'images' },
                    { name: 'Vídeos', key: 'videos' },
                    { name: 'Landing Pages', key: 'landings' }
                  ].map((item) => (
                    <tr key={item.key} className="border-b border-white/5">
                      <td className="py-4 text-slate-300">{item.name}</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-4 text-white">
                          {plan.limits[item.key as keyof typeof plan.limits] === -1 
                            ? 'Ilimitado' 
                            : plan.limits[item.key as keyof typeof plan.limits]
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-6">Dúvidas frequentes</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-2">Posso mudar de plano a qualquer momento?</h4>
                <p className="text-slate-300 text-sm">Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor no próximo ciclo de cobrança.</p>
              </div>
              <div className="bg-slate-800/30 rounded-xl p-6 border border-white/10">
                <h4 className="font-semibold text-white mb-2">Existe período de teste gratuito?</h4>
                <p className="text-slate-300 text-sm">Oferecemos 7 dias grátis em qualquer plano para você testar todas as funcionalidades sem compromisso.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
