import { useState } from 'react';
import { Globe, Eye, Download, Sparkles } from 'lucide-react';

const businessTypes = [
  'E-commerce',
  'SaaS/Software',
  'Consultoria',
  'Educação',
  'Saúde',
  'Imobiliário',
  'Restaurante',
  'Agência',
  'Outro'
];

const goals = [
  { id: 'leads', name: 'Gerar Leads', description: 'Capturar contatos interessados' },
  { id: 'sales', name: 'Vendas Diretas', description: 'Converter visitantes em clientes' },
  { id: 'awareness', name: 'Awareness', description: 'Aumentar conhecimento da marca' },
  { id: 'engagement', name: 'Engagement', description: 'Engajar com o público' }
];

interface GeneratedLanding {
  headline: string;
  subheadline: string;
  bullets: string[];
  cta: string;
  html: string;
  designSuggestions?: {
    colors: string[];
    typography: string;
  };
}

export default function LandingPageGenerator() {
  const [briefing, setBriefing] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mainGoal, setMainGoal] = useState('leads');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLanding, setGeneratedLanding] = useState<GeneratedLanding | null>(null);
  

  const generateLanding = async () => {
    if (!briefing.trim() || !businessType || !targetAudience.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-landing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          briefing,
          businessType,
          targetAudience,
          mainGoal
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedLanding(result.data);
        alert('🚀 Landing page gerada com sucesso usando Gemini Canvas!');
      } else {
        throw new Error(result.error || 'Erro ao gerar landing page');
      }
    } catch (error) {
      console.error('Erro ao gerar landing page:', error);
      alert('Erro ao gerar landing page: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadLanding = () => {
    if (!generatedLanding) return;
    
    const blob = new Blob([generatedLanding.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landing-page-${businessType.toLowerCase()}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('📁 Landing page baixada com sucesso!');
  };

  const previewLanding = () => {
    if (!generatedLanding) return;
    
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(generatedLanding.html);
      newWindow.document.close();
    }
  };

  const copyHTML = () => {
    if (generatedLanding) {
      navigator.clipboard.writeText(generatedLanding.html);
      alert('📋 HTML copiado para a área de transferência!');
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-green-900/30 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center">
          <Globe className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Landing Page Generator</h2>
        <div className="text-sm text-slate-400">Crie páginas de conversão com Gemini Canvas</div>
      </div>

      <div className="space-y-6">
        {/* Briefing */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Briefing do Projeto *
          </label>
          <textarea
            placeholder="Descreva seu produto/serviço, diferenciais, proposta de valor, benefícios principais..."
            value={briefing}
            onChange={(e) => setBriefing(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Business Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Tipo de Negócio *
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="">Selecione o tipo de negócio</option>
              {businessTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Público-Alvo *
            </label>
            <input
              type="text"
              placeholder="Ex: empresários, jovens profissionais, mães empreendedoras..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Main Goal */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Objetivo Principal
          </label>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <button
                key={goal.id}
                onClick={() => setMainGoal(goal.id)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  mainGoal === goal.id
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/20 hover:border-white/40 text-slate-300'
                }`}
              >
                <div className="font-medium">{goal.name}</div>
                <div className="text-xs text-slate-400 mt-1">{goal.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateLanding}
          disabled={isGenerating || !briefing.trim() || !businessType || !targetAudience.trim()}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando com Gemini Canvas...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Gerar Landing Page
            </>
          )}
        </button>

        {/* Generated Landing Preview */}
        {generatedLanding && (
          <div className="bg-slate-900/30 rounded-lg p-6 border border-green-500/20">
            <div className="text-green-300 text-lg font-medium mb-4">✨ Landing Page Gerada!</div>
            
            <div className="space-y-4">
              <div>
                <div className="text-sm text-slate-400 mb-1">Headline:</div>
                <div className="text-white font-medium">{generatedLanding.headline}</div>
              </div>
              
              <div>
                <div className="text-sm text-slate-400 mb-1">Subheadline:</div>
                <div className="text-slate-300">{generatedLanding.subheadline}</div>
              </div>
              
              <div>
                <div className="text-sm text-slate-400 mb-2">Benefícios:</div>
                <div className="space-y-1">
                  {generatedLanding.bullets.map((bullet: string, i: number) => (
                    <div key={i} className="text-slate-300 text-sm">{bullet}</div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-400 mb-1">Call-to-Action:</div>
                <div className="text-emerald-400 font-medium">{generatedLanding.cta}</div>
              </div>

              {generatedLanding.designSuggestions && (
                <div>
                  <div className="text-sm text-slate-400 mb-2">Sugestões de Design:</div>
                  <div className="text-slate-300 text-sm">
                    <div>Cores: {generatedLanding.designSuggestions.colors.join(', ')}</div>
                    <div>Tipografia: {generatedLanding.designSuggestions.typography}</div>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={previewLanding}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Visualizar
                </button>
                
                <button
                  onClick={downloadLanding}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Baixar HTML
                </button>

                <button
                  onClick={copyHTML}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
                >
                  📋 Copiar HTML
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 text-center">
          🤖 <strong>Integrado:</strong> Usando Google Gemini Canvas via API oficial para geração de landing pages profissionais
        </div>
      </div>
    </div>
  );
}
