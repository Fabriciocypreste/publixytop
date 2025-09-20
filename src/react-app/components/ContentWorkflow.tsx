import { useState } from 'react';
import { Send, Image, Video, Sparkles, Calendar, Check, Download } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  hashtags: string[];
  cta: string;
  mediaType: string;
  magicPrompt?: string;
  imageUrl?: string;
  videoUrl?: string;
  status: 'generated' | 'approved' | 'scheduled' | 'published';
}

interface ContentWorkflowProps {
  initialSubject?: string;
}

export default function ContentWorkflow({ initialSubject = '' }: ContentWorkflowProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [tone, setTone] = useState('profissional');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('engagement');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPrompt, setShowPrompt] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [workflowStep, setWorkflowStep] = useState<'input' | 'generate' | 'review' | 'approve'>('input');

  const tones = [
    { id: 'profissional', name: 'Profissional' },
    { id: 'casual', name: 'Casual' },
    { id: 'criativo', name: 'Criativo' },
    { id: 'inspirador', name: 'Inspirador' },
    { id: 'educativo', name: 'Educativo' }
  ];

  const goals = [
    { id: 'engagement', name: 'Engagement' },
    { id: 'leads', name: 'Gerar Leads' },
    { id: 'sales', name: 'Vendas' },
    { id: 'awareness', name: 'Awareness' }
  ];

  const generatePosts = async () => {
    if (!subject.trim()) return;
    
    setIsGenerating(true);
    setWorkflowStep('generate');
    
    try {
      const response = await fetch('/api/generate-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          tone,
          audience: audience || 'público geral',
          goal
        }),
      });

      const result = await response.json();

      if (result.success) {
        const generatedPosts = result.data.map((post: any) => ({
          ...post,
          status: 'generated' as const
        }));
        
        setPosts(generatedPosts);
        setWorkflowStep('review');
      } else {
        throw new Error(result.error || 'Erro ao gerar posts');
      }
    } catch (error) {
      console.error('Erro ao gerar posts:', error);
      alert('Erro ao gerar posts: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
      setWorkflowStep('input');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMagicPrompt = async (post: Post) => {
    if (!post.magicPrompt) return;

    const enhancedPrompt = `${post.magicPrompt}

Elementos específicos:
- Foco em ${subject}
- Paleta de cores: azul, verde, branco
- Estilo: moderno, profissional, clean
- Composição: regra dos terços
- Texto: "${post.title}" integrado
- Resolução: 1080x1080 (Instagram)
- Mood: inspirador, confiável, inovador
- Tom: ${tone}
- Público: ${audience || 'geral'}`;

    setPosts(prev => prev.map(p => 
      p.id === post.id 
        ? { ...p, magicPrompt: enhancedPrompt }
        : p
    ));
    
    setShowPrompt(post.id);
  };

  const generateImage = async (post: Post) => {
    if (!post.magicPrompt) {
      alert('Gere o prompt mágico primeiro!');
      return;
    }

    setIsGeneratingImage(true);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: post.magicPrompt,
          palette: 'vibrant',
          attributes: ['modern', 'professional'],
          format: 'square'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPosts(prev => prev.map(p => 
          p.id === post.id 
            ? { ...p, imageUrl: result.data.url }
            : p
        ));
        alert('🎨 Imagem gerada com Nana Banana!');
      } else {
        throw new Error(result.error || 'Erro ao gerar imagem');
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateVideo = async (post: Post) => {
    if (!post.magicPrompt) {
      alert('Gere o prompt mágico primeiro!');
      return;
    }

    setIsGeneratingVideo(true);
    
    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: post.magicPrompt,
          duration: '30s',
          style: 'dynamic',
          brief: post.content
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPosts(prev => prev.map(p => 
          p.id === post.id 
            ? { ...p, videoUrl: result.data.url }
            : p
        ));
        alert('🎬 Vídeo gerado com Veo 3!');
      } else {
        throw new Error(result.error || 'Erro ao gerar vídeo');
      }
    } catch (error) {
      console.error('Erro ao gerar vídeo:', error);
      alert('Erro ao gerar vídeo: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const approvePost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, status: 'approved' as const }
        : p
    ));
  };

  const schedulePost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, status: 'scheduled' as const }
        : p
    ));
    alert('📅 Post agendado com sucesso!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'text-blue-400 bg-blue-400/20';
      case 'approved': return 'text-green-400 bg-green-400/20';
      case 'scheduled': return 'text-purple-400 bg-purple-400/20';
      case 'published': return 'text-emerald-400 bg-emerald-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const exportToCsv = () => {
    const csvContent = [
      ['ID', 'Título', 'Conteúdo', 'Hashtags', 'CTA', 'Status'],
      ...posts.map(post => [
        post.id,
        post.title,
        post.content.replace(/\n/g, ' '),
        post.hashtags.join(' '),
        post.cta,
        post.status
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `posts-${subject.replace(/\s+/g, '-')}-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (workflowStep === 'input') {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-xl p-8 border border-white/10">
        <div className="text-center mb-8">
          <Send className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Gerador de Conteúdo Completo</h2>
          <p className="text-slate-400">Digite um assunto e gere 10 posts otimizados com IA</p>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Assunto Principal
            </label>
            <input
              type="text"
              placeholder="Ex: Marketing Digital, Sustentabilidade, Tecnologia..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-6 py-4 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none text-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Tom de Voz
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-emerald-400 focus:outline-none"
              >
                {tones.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Objetivo
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-emerald-400 focus:outline-none"
              >
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Público-Alvo (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: empresários, jovens profissionais, mães..."
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
            />
          </div>
          
          <button
            onClick={generatePosts}
            disabled={!subject.trim() || isGenerating}
            className="w-full py-4 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar 10 Posts Completos
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  if (workflowStep === 'generate') {
    return (
      <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-xl p-8 border border-white/10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Gerando Conteúdo...</h2>
          <p className="text-slate-400">Nossa IA está criando 10 posts otimizados sobre "{subject}"</p>
          
          <div className="mt-8 space-y-2">
            <div className="text-sm text-slate-300">✅ Analisando tendências</div>
            <div className="text-sm text-slate-300">✅ Criando títulos envolventes</div>
            <div className="text-sm text-slate-300">✅ Gerando hashtags estratégicas</div>
            <div className="text-sm text-slate-300">✅ Otimizando CTAs</div>
            <div className="text-sm text-slate-300">✅ Configurando prompts mágicos</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-xl p-6 border border-emerald-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-emerald-300 mb-1">
              ✨ {posts.length} Posts Gerados: "{subject}"
            </h2>
            <p className="text-slate-400">Tom: {tone} | Objetivo: {goal} | Público: {audience || 'geral'}</p>
          </div>
          <button
            onClick={() => {
              setWorkflowStep('input');
              setPosts([]);
              setSubject('');
              setAudience('');
            }}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors"
          >
            Novo Assunto
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {posts.map((post, index) => (
          <div key={post.id} className="bg-slate-900/30 rounded-lg p-6 border border-white/10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-slate-400">Post {index + 1}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}>
                    {post.status}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded">
                    {post.mediaType}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2">{post.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.hashtags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="text-sm text-emerald-400 font-medium">
                  CTA: {post.cta}
                </div>
              </div>

              {/* Generated Media */}
              <div className="flex gap-2 ml-4">
                {post.imageUrl && (
                  <div className="w-16 h-16 bg-emerald-500/20 rounded flex items-center justify-center">
                    <Image className="w-6 h-6 text-emerald-400" />
                  </div>
                )}
                {post.videoUrl && (
                  <div className="w-16 h-16 bg-cyan-500/20 rounded flex items-center justify-center">
                    <Video className="w-6 h-6 text-cyan-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
              <button
                onClick={() => generateMagicPrompt(post)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Prompt Mágico
              </button>
              
              <button
                onClick={() => generateImage(post)}
                disabled={isGeneratingImage}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-sm disabled:opacity-50"
              >
                <Image className="w-4 h-4" />
                {isGeneratingImage ? 'Gerando...' : 'Nana Banana'}
              </button>
              
              <button
                onClick={() => generateVideo(post)}
                disabled={isGeneratingVideo}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors text-sm disabled:opacity-50"
              >
                <Video className="w-4 h-4" />
                {isGeneratingVideo ? 'Gerando...' : 'Veo 3'}
              </button>
              
              <button
                onClick={() => approvePost(post.id)}
                disabled={post.status === 'approved' || post.status === 'scheduled'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors text-sm disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Aprovar
              </button>
              
              <button
                onClick={() => schedulePost(post.id)}
                disabled={post.status !== 'approved'}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors text-sm disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                Agendar
              </button>
            </div>

            {/* Magic Prompt Display */}
            {showPrompt === post.id && post.magicPrompt && (
              <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-purple-300 text-sm font-medium">✨ Prompt Mágico Gerado:</div>
                  <button
                    onClick={() => setShowPrompt(null)}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-slate-300 text-sm whitespace-pre-line">{post.magicPrompt}</div>
                <button
                  onClick={() => navigator.clipboard.writeText(post.magicPrompt!)}
                  className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
                >
                  📋 Copiar prompt
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Ações em Lote</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => posts.forEach(post => approvePost(post.id))}
            className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Aprovar Todos
          </button>
          <button
            onClick={() => posts.filter(p => p.status === 'approved').forEach(post => schedulePost(post.id))}
            className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Agendar Aprovados
          </button>
          <button
            onClick={exportToCsv}
            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="text-xs text-slate-500 text-center">
        🤖 <strong>Integrado:</strong> Usando Google Gemini para posts, Nana Banana para imagens e Veo 3 para vídeos
      </div>
    </div>
  );
}
