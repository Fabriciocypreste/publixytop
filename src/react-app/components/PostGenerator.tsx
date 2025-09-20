import { useState } from 'react';
import { Send, Eye, Image, Video, Sparkles } from 'lucide-react';
import type { Post } from '@/shared/types';

export default function PostGenerator() {
  const [subject, setSubject] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const generatePosts = async () => {
    if (!subject.trim()) return;
    
    setIsGenerating(true);
    
    // Simulação client-side
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedPosts: Post[] = Array.from({ length: 10 }, (_, i) => ({
      id: `post-${i + 1}`,
      title: `Post ${i + 1} sobre ${subject}`,
      content: `Conteúdo envolvente sobre ${subject}. Este é um exemplo de como o conteúdo seria gerado automaticamente pela IA, incluindo informações relevantes e chamadas para ação estratégicas.`,
      hashtags: [`#${subject.replace(/\s+/g, '')}`, '#marketing', '#conteudo', '#ia', '#digital'],
      magicPrompt: `Crie uma imagem profissional e envolvente sobre ${subject} com estilo moderno, cores vibrantes e composição equilibrada. Inclua elementos visuais que transmitam ${subject} de forma criativa e impactante.`
    }));
    
    setPosts(generatedPosts);
    setIsGenerating(false);
  };

  const togglePrompt = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  const simulateImageGeneration = (post: Post) => {
    alert(`🎨 Simulação: Gerando imagem com Nana Banana para "${post.title}"`);
  };

  const simulateVideoGeneration = (post: Post) => {
    alert(`🎬 Simulação: Gerando vídeo com Veo 3 para "${post.title}"`);
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-blue-900/30 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
          <Send className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Gerador de Posts</h2>
        <div className="text-sm text-slate-400">Gere 10 posts a partir de um assunto</div>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Digite o assunto para gerar posts..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
            disabled={isGenerating}
          />
          <button
            onClick={generatePosts}
            disabled={isGenerating || !subject.trim()}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-medium hover:from-emerald-500 hover:to-cyan-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar Posts
              </>
            )}
          </button>
        </div>

        {posts.length > 0 && (
          <div className="grid gap-4 mt-6">
            <div className="text-sm text-emerald-400 font-medium">
              ✨ {posts.length} posts gerados com sucesso!
            </div>
            
            {posts.map((post) => (
              <div key={post.id} className="bg-slate-900/30 rounded-lg p-4 border border-white/10">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-white mb-2">{post.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.hashtags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                    <button
                      onClick={() => togglePrompt(post.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Prompt Mágico
                    </button>
                    
                    <button
                      onClick={() => simulateImageGeneration(post)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-sm"
                    >
                      <Image className="w-4 h-4" />
                      Nana Banana
                    </button>
                    
                    <button
                      onClick={() => simulateVideoGeneration(post)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-colors text-sm"
                    >
                      <Video className="w-4 h-4" />
                      Veo 3
                    </button>
                  </div>

                  {expandedPost === post.id && post.magicPrompt && (
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-purple-500/20">
                      <div className="text-purple-300 text-xs font-medium mb-2">✨ Prompt Mágico:</div>
                      <div className="text-slate-300 text-sm">{post.magicPrompt}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
