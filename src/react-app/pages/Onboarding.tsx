import { useState } from 'react';
import { Sparkles, Palette, Type, MessageSquare, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router';

const businessTypes = [
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'saas', name: 'SaaS/Software', icon: '💻' },
  { id: 'consultoria', name: 'Consultoria', icon: '🤝' },
  { id: 'educacao', name: 'Educação', icon: '📚' },
  { id: 'saude', name: 'Saúde', icon: '🏥' },
  { id: 'imobiliario', name: 'Imobiliário', icon: '🏠' },
  { id: 'restaurante', name: 'Restaurante', icon: '🍽️' },
  { id: 'agencia', name: 'Agência', icon: '📊' }
];

const palettes = [
  { id: 'modern', name: 'Moderno', colors: ['#2563eb', '#06b6d4', '#8b5cf6'] },
  { id: 'warm', name: 'Acolhedor', colors: ['#f59e0b', '#ef4444', '#ec4899'] },
  { id: 'nature', name: 'Natureza', colors: ['#10b981', '#059669', '#84cc16'] },
  { id: 'elegant', name: 'Elegante', colors: ['#1f2937', '#6b7280', '#d1d5db'] },
  { id: 'vibrant', name: 'Vibrante', colors: ['#8b5cf6', '#ec4899', '#f59e0b'] },
  { id: 'minimal', name: 'Minimalista', colors: ['#374151', '#6b7280', '#9ca3af'] }
];

const tones = [
  { id: 'profissional', name: 'Profissional', description: 'Formal, técnico, autoridade' },
  { id: 'amigavel', name: 'Amigável', description: 'Caloroso, próximo, conversacional' },
  { id: 'inspirador', name: 'Inspirador', description: 'Motivacional, positivo, empoderador' },
  { id: 'educativo', name: 'Educativo', description: 'Informativo, didático, claro' },
  { id: 'divertido', name: 'Divertido', description: 'Descontraído, humor, leve' },
  { id: 'luxo', name: 'Luxo', description: 'Sofisticado, exclusivo, premium' }
];

const typography = [
  { id: 'modern', name: 'Moderno', description: 'Inter, clean, sans-serif' },
  { id: 'elegant', name: 'Elegante', description: 'Playfair, serifa, sofisticado' },
  { id: 'friendly', name: 'Amigável', description: 'Roboto, humanista, acessível' },
  { id: 'tech', name: 'Tech', description: 'Montserrat, geométrico, inovador' }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGeneratingBranding, setIsGeneratingBranding] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    targetAudience: '',
    website: '',
    contact: '',
    iban: '',
    palette: '',
    tone: '',
    typography: '',
    goals: [] as string[],
    generatedBranding: {
      logo: '',
      colorPrimary: '',
      colorSecondary: '',
      font: '',
      brandMessage: ''
    }
  });

  const generateBranding = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const brandingData = {
      logo: `🎨 Logo ${formData.businessName}`,
      colorPrimary: palettes.find(p => p.id === formData.palette)?.colors[0] || '#667eea',
      colorSecondary: palettes.find(p => p.id === formData.palette)?.colors[1] || '#764ba2',
      font: formData.typography === 'modern' ? 'Inter' : formData.typography === 'elegant' ? 'Playfair Display' : 'Roboto',
      brandMessage: `Transforme seu ${businessTypes.find(t => t.id === formData.businessType)?.name} com nossa solução inovadora`
    };
    
    setFormData(prev => ({ ...prev, generatedBranding: brandingData }));
  };

  const handleNext = async () => {
    if (step < 6) {
      if (step === 5) {
        // Generate branding
        setIsGeneratingBranding(true);
        await generateBranding();
        setIsGeneratingBranding(false);
      }
      setStep(step + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('user_brand', JSON.stringify(formData));
      navigate('/dashboard');
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.businessName && formData.businessType && formData.targetAudience;
      case 2: return formData.website && formData.contact;
      case 3: return formData.palette;
      case 4: return formData.tone && formData.typography;
      case 5: return formData.goals.length > 0;
      case 6: return true; // Branding generated
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-slate-900 text-xl">
              AI
            </div>
            <h1 className="text-2xl font-bold">Studio IA</h1>
          </div>
          <p className="text-slate-300">Vamos configurar sua agência digital em minutos</p>
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step ? 'bg-emerald-400 text-slate-900' : 'bg-slate-700 text-slate-400'
                }`}>
                  {i < step ? <Check className="w-4 h-4" /> : i}
                </div>
                {i < 6 && <div className={`w-8 h-0.5 ${i < step ? 'bg-emerald-400' : 'bg-slate-700'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-slate-800/50 rounded-2xl p-8 border border-white/10">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Conte-nos sobre seu negócio</h2>
                <p className="text-slate-400">Essas informações nos ajudam a personalizar sua experiência</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Nome do seu negócio"
                  value={formData.businessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData(prev => ({ ...prev, businessType: type.id }))}
                      className={`p-4 rounded-lg border transition-all ${
                        formData.businessType === type.id
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                          : 'border-white/20 hover:border-white/40 text-slate-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium">{type.name}</div>
                    </button>
                  ))}
                </div>
                
                <textarea
                  placeholder="Descreva seu público-alvo (idade, interesses, comportamento...)"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Type className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Informações de contato</h2>
                <p className="text-slate-400">Dados para comunicação e pagamentos</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="Website ou rede social principal"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
                
                <input
                  type="text"
                  placeholder="E-mail ou telefone para contato"
                  value={formData.contact}
                  onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
                
                <input
                  type="text"
                  placeholder="PIX, IBAN ou dados bancários (opcional)"
                  value={formData.iban}
                  onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <Palette className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Escolha sua identidade visual</h2>
                <p className="text-slate-400">Selecione a paleta que melhor representa sua marca</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {palettes.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => setFormData(prev => ({ ...prev, palette: palette.id }))}
                    className={`p-6 rounded-lg border transition-all ${
                      formData.palette === palette.id
                        ? 'border-emerald-400 bg-emerald-500/20'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className="flex gap-2 mb-3 justify-center">
                      {palette.colors.map((color, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="text-white font-medium">{palette.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Identidade da marca</h2>
                <p className="text-slate-400">Tom de voz e tipografia</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Tom de Voz</label>
                <div className="grid gap-3">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setFormData(prev => ({ ...prev, tone: tone.id }))}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        formData.tone === tone.id
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                          : 'border-white/20 hover:border-white/40 text-slate-300'
                      }`}
                    >
                      <div className="font-medium mb-1">{tone.name}</div>
                      <div className="text-sm text-slate-400">{tone.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">Estilo Tipográfico</label>
                <div className="grid grid-cols-2 gap-3">
                  {typography.map((typo) => (
                    <button
                      key={typo.id}
                      onClick={() => setFormData(prev => ({ ...prev, typography: typo.id }))}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        formData.typography === typo.id
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                          : 'border-white/20 hover:border-white/40 text-slate-300'
                      }`}
                    >
                      <div className="font-medium mb-1">{typo.name}</div>
                      <div className="text-sm text-slate-400">{typo.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center">
                <Type className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Seus objetivos principais</h2>
                <p className="text-slate-400">O que você quer alcançar? (selecione até 3)</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'awareness', name: 'Aumentar Conhecimento da Marca' },
                  { id: 'engagement', name: 'Melhorar Engajamento' },
                  { id: 'leads', name: 'Gerar Leads Qualificados' },
                  { id: 'sales', name: 'Aumentar Vendas' },
                  { id: 'traffic', name: 'Direcionar Tráfego' },
                  { id: 'retention', name: 'Fidelizar Clientes' }
                ].map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setFormData(prev => {
                      const goals = prev.goals.includes(goal.id)
                        ? prev.goals.filter(g => g !== goal.id)
                        : prev.goals.length < 3 
                          ? [...prev.goals, goal.id]
                          : prev.goals;
                      return { ...prev, goals };
                    })}
                    disabled={!formData.goals.includes(goal.id) && formData.goals.length >= 3}
                    className={`p-4 rounded-lg border transition-all text-center ${
                      formData.goals.includes(goal.id)
                        ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                        : 'border-white/20 hover:border-white/40 text-slate-300 disabled:opacity-50'
                    }`}
                  >
                    <div className="text-sm font-medium">{goal.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Seu branding foi gerado!</h2>
                <p className="text-slate-400">Identidade visual criada com IA</p>
              </div>
              
              <div className="bg-slate-900/30 rounded-lg p-6 border border-emerald-500/20">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{formData.generatedBranding.logo}</div>
                    <h3 className="text-xl font-bold text-white">{formData.businessName}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Cor Principal</div>
                      <div 
                        className="w-12 h-12 rounded-lg mx-auto mb-2"
                        style={{ backgroundColor: formData.generatedBranding.colorPrimary }}
                      />
                      <div className="text-xs text-slate-300">{formData.generatedBranding.colorPrimary}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-400 mb-1">Cor Secundária</div>
                      <div 
                        className="w-12 h-12 rounded-lg mx-auto mb-2"
                        style={{ backgroundColor: formData.generatedBranding.colorSecondary }}
                      />
                      <div className="text-xs text-slate-300">{formData.generatedBranding.colorSecondary}</div>
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-1">Tipografia</div>
                    <div className="text-lg font-medium text-white" style={{ fontFamily: formData.generatedBranding.font }}>
                      {formData.generatedBranding.font}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-slate-400 mb-2">Mensagem da Marca</div>
                    <div className="text-slate-300 italic">"{formData.generatedBranding.brandMessage}"</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 rounded-lg p-4 border border-emerald-500/20">
                <h4 className="text-emerald-300 font-medium mb-2">🎯 Plano Sugerido: PRO</h4>
                <p className="text-slate-300 text-sm">
                  Para {businessTypes.find(t => t.id === formData.businessType)?.name}, recomendamos o plano PRO 
                  com geração ilimitada de posts e vídeos para máximo crescimento.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-6 py-3 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Voltar
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed() || (step === 5 && isGeneratingBranding)}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGeneratingBranding ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  Gerando Branding...
                </>
              ) : step === 6 ? 'Ir para Dashboard' : step === 5 ? 'Gerar Branding' : 'Continuar'}
              {!isGeneratingBranding && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
