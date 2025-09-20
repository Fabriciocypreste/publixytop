import { useState, useEffect } from 'react';
import { BarChart3, Calendar, TrendingUp, Users, Eye, Heart, Share2, Plus, Settings } from 'lucide-react';
import Header from '@/react-app/components/Header';
import SchedulingSystem from '@/react-app/components/SchedulingSystem';
import AdBuilder from '@/react-app/components/AdBuilder';
import ReportsSystem from '@/react-app/components/ReportsSystem';

interface AnalyticsData {
  impressions: number;
  engagements: number;
  clicks: number;
  followers: number;
  postsThisWeek: number;
  engagement_rate: number;
}

interface ScheduledPost {
  id: string;
  title: string;
  platform: string;
  scheduledFor: string;
  status: 'scheduled' | 'published' | 'failed';
}

export default function DashboardPage() {
  const [analytics] = useState<AnalyticsData>({
    impressions: 45320,
    engagements: 3240,
    clicks: 890,
    followers: 12500,
    postsThisWeek: 8,
    engagement_rate: 7.2
  });

  const [scheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      title: 'Dicas de Marketing Digital para 2025',
      platform: 'Instagram',
      scheduledFor: '2025-09-21 10:00',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Como usar IA no seu negócio',
      platform: 'LinkedIn',
      scheduledFor: '2025-09-21 14:30',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Novidades do Studio IA',
      platform: 'TikTok',
      scheduledFor: '2025-09-22 09:15',
      status: 'scheduled'
    }
  ]);

  const [userBrand, setUserBrand] = useState<any>(null);

  useEffect(() => {
    const brandData = localStorage.getItem('user_brand');
    if (brandData) {
      setUserBrand(JSON.parse(brandData));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-yellow-400 bg-yellow-400/20';
      case 'published': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      'Instagram': '📸',
      'LinkedIn': '💼', 
      'TikTok': '🎵',
      'Facebook': '👥',
      'Twitter': '🐦'
    };
    return icons[platform] || '📱';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header />
        
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-xl p-6 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-emerald-300 mb-2">
                  Bem-vindo ao seu Dashboard, {userBrand?.businessName || 'Usuário'}! 
                </h1>
                <p className="text-slate-300">
                  {userBrand?.businessType && `${userBrand.businessType} • `}
                  Sua agência digital está funcionando 24/7
                </p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Novo Projeto
              </button>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-slate-400">Impressões</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.impressions.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+12% vs semana anterior</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="text-sm text-slate-400">Engajamentos</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.engagements.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+8% vs semana anterior</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Share2 className="w-5 h-5 text-purple-400" />
                <span className="text-sm text-slate-400">Cliques</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.clicks.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+15% vs semana anterior</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="text-sm text-slate-400">Seguidores</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.followers.toLocaleString()}</div>
              <div className="text-xs text-green-400 mt-1">+250 esta semana</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-5 h-5 text-green-400" />
                <span className="text-sm text-slate-400">Posts</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.postsThisWeek}</div>
              <div className="text-xs text-slate-400 mt-1">Esta semana</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-slate-400">Taxa Eng.</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.engagement_rate}%</div>
              <div className="text-xs text-green-400 mt-1">Acima da média</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Scheduled Posts */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">Posts Agendados</h2>
                </div>
                <button className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm">
                  Ver todos
                </button>
              </div>

              <div className="space-y-3">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="bg-slate-900/30 rounded-lg p-4 border border-white/5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getPlatformIcon(post.platform)}</span>
                        <div>
                          <h3 className="font-medium text-white text-sm">{post.title}</h3>
                          <p className="text-xs text-slate-400">{post.platform}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      📅 {new Date(post.scheduledFor).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Performance Semanal</h2>
              </div>
              
              <div className="space-y-4">
                {/* Simulated chart bars */}
                {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day, i) => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-8 text-sm text-slate-400">{day}</div>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${20 + (i * 10) + Math.random() * 30}%` }}
                      />
                    </div>
                    <div className="text-sm text-slate-300 w-12 text-right">
                      {Math.floor(1000 + Math.random() * 2000)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-400" />
              Ações Rápidas
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 hover:border-purple-400/40 transition-all text-left">
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium text-white">Gerar Posts</div>
                <div className="text-xs text-slate-400">10 posts de um assunto</div>
              </button>

              <button className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20 hover:border-green-400/40 transition-all text-left">
                <div className="text-2xl mb-2">🎨</div>
                <div className="font-medium text-white">Criar Arte</div>
                <div className="text-xs text-slate-400">Imagens com IA</div>
              </button>

              <button className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 hover:border-blue-400/40 transition-all text-left">
                <div className="text-2xl mb-2">🎬</div>
                <div className="font-medium text-white">Gerar Vídeos</div>
                <div className="text-xs text-slate-400">6s a 60s</div>
              </button>

              <button className="p-4 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/20 hover:border-orange-400/40 transition-all text-left">
                <div className="text-2xl mb-2">🌐</div>
                <div className="font-medium text-white">Landing Pages</div>
                <div className="text-xs text-slate-400">Páginas de conversão</div>
              </button>
            </div>
          </div>

          {/* Advanced Features */}
          <div className="space-y-6">
            <SchedulingSystem />
            <AdBuilder />
            <ReportsSystem />
          </div>
        </div>
      </div>
    </div>
  );
}
