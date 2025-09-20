import { useState } from 'react';
import { Calendar, Clock, Send, Trash2, Edit3, Eye } from 'lucide-react';

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
  imageUrl?: string;
  hashtags: string[];
}

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-500' },
  { id: 'facebook', name: 'Facebook', icon: '👥', color: 'from-blue-500 to-blue-600' },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'from-gray-800 to-gray-900' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-700' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'from-black to-gray-800' }
];

export default function SchedulingSystem() {
  const [posts, setPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      title: 'Dicas de IA para empresas',
      content: 'Como a inteligência artificial está revolucionando os negócios em 2025. Descubra as principais tendências e como aplicar na sua empresa.',
      platforms: ['instagram', 'linkedin'],
      scheduledDate: '2025-09-21',
      scheduledTime: '10:00',
      status: 'scheduled',
      hashtags: ['#IA', '#Tecnologia', '#Negócios', '#Inovação']
    },
    {
      id: '2', 
      title: 'Automação de marketing',
      content: 'Studio IA está mudando a forma como criamos conteúdo. Menos tempo planejando, mais tempo executando!',
      platforms: ['twitter', 'facebook'],
      scheduledDate: '2025-09-21',
      scheduledTime: '14:30',
      status: 'scheduled',
      hashtags: ['#Marketing', '#Automação', '#StudioIA']
    }
  ]);

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    platforms: [] as string[],
    scheduledDate: '',
    scheduledTime: '',
    hashtags: [] as string[]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-yellow-400 bg-yellow-400/20';
      case 'published': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const handleSchedulePost = () => {
    if (!newPost.title || !newPost.content || newPost.platforms.length === 0) return;

    const post: ScheduledPost = {
      id: Date.now().toString(),
      ...newPost,
      status: 'scheduled'
    };

    setPosts(prev => [...prev, post]);
    setNewPost({
      title: '',
      content: '',
      platforms: [],
      scheduledDate: '',
      scheduledTime: '',
      hashtags: []
    });
    setShowNewPostModal(false);
  };

  const togglePlatform = (platformId: string) => {
    setNewPost(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const publishNow = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, status: 'published' as const }
        : post
    ));
    alert('Post publicado com sucesso! Em produção, seria enviado para as APIs das redes sociais.');
  };

  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white">Agendamento de Posts</h2>
        </div>
        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Agendar Post
        </button>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-900/30 rounded-lg p-4 border border-white/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{post.title}</h3>
                <p className="text-slate-300 text-sm line-clamp-2">{post.content}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(post.status)}`}>
                  {post.status}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {post.hashtags.map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  {post.scheduledDate} às {post.scheduledTime}
                </div>
                <div className="flex gap-1">
                  {post.platforms.map(platformId => {
                    const platform = platforms.find(p => p.id === platformId);
                    return platform ? (
                      <span key={platformId} className="text-sm" title={platform.name}>
                        {platform.icon}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg bg-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                {post.status === 'scheduled' && (
                  <button
                    onClick={() => publishNow(post.id)}
                    className="p-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deletePost(post.id)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-6">Agendar Novo Post</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título do post"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
              />
              
              <textarea
                placeholder="Conteúdo do post"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none resize-none"
              />

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Plataformas</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-3 rounded-lg border transition-all ${
                        newPost.platforms.includes(platform.id)
                          ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                          : 'border-white/20 hover:border-white/40 text-slate-300'
                      }`}
                    >
                      <div className="text-lg mb-1">{platform.icon}</div>
                      <div className="text-xs">{platform.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Data</label>
                  <input
                    type="date"
                    value={newPost.scheduledDate}
                    onChange={(e) => setNewPost(prev => ({ ...prev, scheduledDate: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Horário</label>
                  <input
                    type="time"
                    value={newPost.scheduledTime}
                    onChange={(e) => setNewPost(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSchedulePost}
                disabled={!newPost.title || !newPost.content || newPost.platforms.length === 0}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agendar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
