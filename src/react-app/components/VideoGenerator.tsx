import { useState } from 'react';
import { Video, Play, Sparkles, Download } from 'lucide-react';

const durations = [
  { id: '15s', name: '15 segundos', description: 'Ideal para stories' },
  { id: '30s', name: '30 segundos', description: 'Padrão para redes sociais' },
  { id: '60s', name: '60 segundos', description: 'Conteúdo detalhado' }
];

const styles = [
  { id: 'dynamic', name: 'Dinâmico', description: 'Movimento rápido, cortes ágeis' },
  { id: 'cinematic', name: 'Cinematográfico', description: 'Planos elaborados, transições suaves' },
  { id: 'minimal', name: 'Minimalista', description: 'Clean, focado, poucos elementos' },
  { id: 'storytelling', name: 'Storytelling', description: 'Narrativa envolvente' }
];

interface GeneratedVideo {
  id: string;
  url: string;
  prompt: string;
  script: string;
  metadata: any;
}

export default function VideoGenerator() {
  const [duration, setDuration] = useState('30s');
  const [style, setStyle] = useState('dynamic');
  const [brief, setBrief] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const generatePrompt = async () => {
    if (!brief.trim()) return;
    
    setIsGeneratingPrompt(true);
    
    const prompt = `Crie um vídeo ${duration} dinâmico e envolvente sobre: ${brief}. 
    
Elementos visuais:
- Estilo: ${styles.find(s => s.id === style)?.name}
- Duração: ${duration}
- Transições suaves e modernas
- Cores vibrantes e contrastantes
- Movimento fluido da câmera
- Tipografia limpa e legível
- Animações sutis e profissionais

Especificações técnicas:
- Resolução: 1080x1920 (vertical para redes sociais)
- Frame rate: 30fps
- Formato: MP4
- Qualidade: HD

Estilo cinematográfico:
- Iluminação profissional
- Composição equilibrada
- Ritmo adequado para ${duration}
- Call-to-action claro no final

Áudio:
- Música de fundo envolvente
- Sound design profissional
- Níveis balanceados`;

    setGeneratedPrompt(prompt);
    setIsGeneratingPrompt(false);
    setShowPrompt(true);
  };

  const generateVideo = async () => {
    if (!generatedPrompt && !customPrompt) {
      alert('Por favor, gere o prompt primeiro!');
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
          prompt: generatedPrompt || customPrompt,
          duration,
          style,
          brief
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedVideo(result.data);
        alert('🎬 Vídeo gerado com sucesso usando Veo 3!');
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

  const downloadVideo = () => {
    if (generatedVideo) {
      // In a real implementation, this would download the actual video
      alert('Download iniciado! (Em produção, baixaria o vídeo real)');
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('Prompt copiado para a área de transferência!');
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-indigo-900/30 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
          <Video className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Gerador de Vídeo</h2>
        <div className="text-sm text-slate-400">Crie vídeos com Veo 3</div>
      </div>

      <div className="space-y-6">
        {/* Brief Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Brief do Vídeo
          </label>
          <textarea
            placeholder="Descreva o que você quer no vídeo: tema, mensagem, estilo, público-alvo..."
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none resize-none"
          />
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Duração do Vídeo
          </label>
          <div className="grid grid-cols-3 gap-3">
            {durations.map((dur) => (
              <button
                key={dur.id}
                onClick={() => setDuration(dur.id)}
                className={`p-4 rounded-lg border transition-all text-center ${
                  duration === dur.id
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/20 hover:border-white/40 text-slate-300'
                }`}
              >
                <div className="font-medium">{dur.name}</div>
                <div className="text-xs text-slate-400 mt-1">{dur.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Estilo do Vídeo
          </label>
          <div className="grid grid-cols-2 gap-3">
            {styles.map((styleOption) => (
              <button
                key={styleOption.id}
                onClick={() => setStyle(styleOption.id)}
                className={`p-4 rounded-lg border transition-all text-left ${
                  style === styleOption.id
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/20 hover:border-white/40 text-slate-300'
                }`}
              >
                <div className="font-medium">{styleOption.name}</div>
                <div className="text-xs text-slate-400 mt-1">{styleOption.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Prompt Customizado (opcional)
          </label>
          <textarea
            placeholder="Ou insira seu próprio prompt detalhado..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none resize-none"
          />
        </div>

        {/* Generate Prompt Button */}
        <button
          onClick={generatePrompt}
          disabled={isGeneratingPrompt || !brief.trim()}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGeneratingPrompt ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando Prompt...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Gerar Prompt Mágico
            </>
          )}
        </button>

        {/* Generated Prompt Display */}
        {showPrompt && generatedPrompt && (
          <div className="bg-slate-900/30 rounded-lg p-4 border border-indigo-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-indigo-300 text-sm font-medium">✨ Prompt Mágico Gerado:</div>
              <div className="flex gap-2">
                <button
                  onClick={copyPrompt}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  📋 Copiar
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="text-slate-300 text-sm whitespace-pre-line">{generatedPrompt}</div>
          </div>
        )}

        {/* Generate Video Button */}
        <button
          onClick={generateVideo}
          disabled={isGeneratingVideo || (!generatedPrompt && !customPrompt)}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isGeneratingVideo ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Gerando com Veo 3...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Gerar Vídeo (Veo 3)
            </>
          )}
        </button>

        {/* Generated Video Display */}
        {generatedVideo && (
          <div className="bg-slate-900/30 rounded-lg p-4 border border-emerald-500/20">
            <div className="text-emerald-300 text-sm font-medium mb-3">🎬 Vídeo Gerado com Sucesso!</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">ID:</div>
                <div className="text-slate-300 text-sm font-mono">{generatedVideo.id}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Script/Storyboard:</div>
                <div className="text-slate-300 text-sm max-h-32 overflow-y-auto">{generatedVideo.script}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Metadados:</div>
                <div className="text-slate-300 text-xs">
                  Duração: {generatedVideo.metadata.duration} | Estilo: {generatedVideo.metadata.style}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadVideo}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Baixar Vídeo
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 text-center">
          🤖 <strong>Integrado:</strong> Usando Google Veo 3 via API oficial para geração de vídeos profissionais
        </div>
      </div>
    </div>
  );
}
