import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Mail, FileText, Download, Eye, Users, Heart } from 'lucide-react';

interface ReportData {
  period: string;
  metrics: {
    impressions: number;
    engagements: number;
    clicks: number;
    followers: number;
    engagementRate: number;
    topPost: string;
    recommendation: string;
  };
}

interface AutoInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'success';
  title: string;
  description: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
}

export default function ReportsSystem() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [insights, setInsights] = useState<AutoInsight[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('weekly');
  const [emailReports, setEmailReports] = useState(true);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    generateMockData();
  }, []);

  const generateMockData = () => {
    const mockReports: ReportData[] = [
      {
        period: 'Semana 38/2025',
        metrics: {
          impressions: 45320,
          engagements: 3240,
          clicks: 890,
          followers: 12500,
          engagementRate: 7.2,
          topPost: 'Dicas de IA para empresas',
          recommendation: 'Aumente orçamento em posts sobre IA (+15% engagement)'
        }
      },
      {
        period: 'Semana 37/2025',
        metrics: {
          impressions: 38500,
          engagements: 2890,
          clicks: 750,
          followers: 12250,
          engagementRate: 6.8,
          topPost: 'Automação de processos',
          recommendation: 'Publique mais vídeos curtos (30s) para TikTok'
        }
      }
    ];

    const mockInsights: AutoInsight[] = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Horário Ótimo Identificado',
        description: 'Posts publicados às 14h têm 35% mais engajamento',
        action: 'Reagende posts para 14h-16h',
        impact: 'high'
      },
      {
        id: '2',
        type: 'success',
        title: 'Meta de Followers Atingida',
        description: 'Crescimento de 2% esta semana (250 novos followers)',
        action: 'Continue estratégia atual',
        impact: 'medium'
      },
      {
        id: '3',
        type: 'warning',
        title: 'Queda no Alcance',
        description: 'Impressões 12% menores que semana anterior',
        action: 'Aumente frequência de posts ou orçamento de ads',
        impact: 'high'
      }
    ];

    setReports(mockReports);
    setInsights(mockInsights);
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportContent = `
RELATÓRIO SEMANAL - STUDIO IA
Período: ${new Date().toLocaleDateString('pt-BR')}

===== MÉTRICAS PRINCIPAIS =====
📊 Impressões: 45.320 (+12%)
❤️ Engajamentos: 3.240 (+8%)
🔗 Cliques: 890 (+15%)
👥 Novos Followers: 250 (+2%)
📈 Taxa de Engajamento: 7.2% (acima da média)

===== POST DE DESTAQUE =====
🏆 "${reports[0]?.metrics.topPost}"
• 2.1K curtidas
• 340 comentários  
• 89 compartilhamentos

===== INSIGHTS AUTOMÁTICOS =====
🎯 Horário ótimo: 14h-16h (35% mais engajamento)
🚀 Conteúdo top: IA e Automação
⚠️ Atenção: Reduzir posts genéricos (-20% performance)

===== RECOMENDAÇÕES =====
✅ Aumente orçamento em posts sobre IA
✅ Publique mais vídeos curtos (30s)
✅ Reagende posts para 14h-16h
✅ Foque em conteúdo educativo

===== COMPARAÇÃO MENSAL =====
📈 Crescimento geral: +18%
🎯 Meta followers: Atingida (12.5K)
💰 ROI campanhas: +25%

Gerado automaticamente pelo Studio IA
    `.trim();
    
    // Simular download do relatório
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-semanal-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsGeneratingReport(false);
    alert('📊 Relatório gerado e baixado com sucesso!');
  };

  const sendEmailReport = async () => {
    alert('📧 Relatório automático por email configurado! Em produção, seria enviado via SendGrid/AWS SES.');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return '🎯';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return '📊';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'border-blue-500/20 bg-blue-500/10 text-blue-300';
      case 'warning': return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-300';
      case 'success': return 'border-green-500/20 bg-green-500/10 text-green-300';
      default: return 'border-slate-500/20 bg-slate-500/10 text-slate-300';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-300 bg-red-500/20';
      case 'medium': return 'text-yellow-300 bg-yellow-500/20';
      case 'low': return 'text-green-300 bg-green-500/20';
      default: return 'text-slate-300 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" />
            <div>
              <h2 className="text-xl font-bold text-white">Relatórios Automáticos</h2>
              <p className="text-slate-400">Analytics e insights em tempo real</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/20 text-white text-sm focus:border-purple-400 focus:outline-none"
            >
              <option value="weekly">Semanal</option>
              <option value="monthly">Mensal</option>
              <option value="quarterly">Trimestral</option>
            </select>
            
            <button
              onClick={generateReport}
              disabled={isGeneratingReport}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isGeneratingReport ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Gerar Relatório
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-400">Impressões</span>
          </div>
          <div className="text-2xl font-bold text-white">45.3K</div>
          <div className="text-xs text-green-400 mt-1">+12% vs anterior</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-sm text-slate-400">Engajamentos</span>
          </div>
          <div className="text-2xl font-bold text-white">3.2K</div>
          <div className="text-xs text-green-400 mt-1">+8% vs anterior</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-400">Followers</span>
          </div>
          <div className="text-2xl font-bold text-white">12.5K</div>
          <div className="text-xs text-green-400 mt-1">+250 esta semana</div>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-slate-400">Taxa Eng.</span>
          </div>
          <div className="text-2xl font-bold text-white">7.2%</div>
          <div className="text-xs text-green-400 mt-1">Acima da média</div>
        </div>
      </div>

      {/* Auto Insights */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">Insights Automáticos</h3>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded">
            Atualizado agora
          </span>
        </div>

        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getInsightIcon(insight.type)}</span>
                  <div>
                    <h4 className="font-medium text-white">{insight.title}</h4>
                    <p className="text-sm text-slate-300 mt-1">{insight.description}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(insight.impact)}`}>
                  {insight.impact}
                </span>
              </div>
              <div className="text-sm text-slate-400 mt-3">
                💡 <strong>Ação recomendada:</strong> {insight.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report History */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            Histórico de Relatórios
          </h3>
          
          <div className="space-y-3">
            {reports.map((report, index) => (
              <div key={index} className="bg-slate-900/30 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{report.period}</h4>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-slate-400">Impressões:</span>
                    <span className="text-white ml-2">{report.metrics.impressions.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Eng. Rate:</span>
                    <span className="text-white ml-2">{report.metrics.engagementRate}%</span>
                  </div>
                </div>
                
                <div className="text-xs text-slate-400">
                  <strong>Top Post:</strong> {report.metrics.topPost}
                </div>
                <div className="text-xs text-emerald-400 mt-1">
                  💡 {report.metrics.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Reports Config */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Relatórios por Email
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-white">Envio automático semanal</label>
              <input
                type="checkbox"
                checked={emailReports}
                onChange={(e) => setEmailReports(e.target.checked)}
                className="w-4 h-4 text-blue-500 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email para envio</label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2">Frequência</label>
              <select className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-blue-400 focus:outline-none">
                <option>Semanal (Segunda-feira)</option>
                <option>Mensal (1º dia do mês)</option>
                <option>Personalizado</option>
              </select>
            </div>
            
            <button
              onClick={sendEmailReport}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Configurar Envio Automático
            </button>
          </div>
          
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2">📧 Próximo relatório</h4>
            <p className="text-slate-300 text-sm">
              Segunda-feira, 23 de Setembro às 9:00
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Incluirá métricas da semana, insights e recomendações automáticas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
