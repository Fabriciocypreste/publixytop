import { useState } from 'react';
import { Palette, Upload, Image, Sparkles, Download } from 'lucide-react';

const palettes = [
  { id: 'vibrant', name: 'Vibrante', colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'] },
  { id: 'pastel', name: 'Pastel', colors: ['#ffeaa7', '#fab1a0', '#fd79a8', '#fdcb6e'] },
  { id: 'dark', name: 'Escuro', colors: ['#2d3436', '#636e72', '#74b9ff', '#a29bfe'] },
  { id: 'minimal', name: 'Minimal', colors: ['#ffffff', '#ddd', '#555', '#000000'] },
  { id: 'warm', name: 'Quente', colors: ['#ff7675', '#fd79a8', '#fdcb6e', '#e17055'] },
  { id: 'cool', name: 'Frio', colors: ['#74b9ff', '#0984e3', '#00b894', '#00cec9'] }
];

const attributes = [
  { id: 'modern', name: 'Moderno', icon: '🔥' },
  { id: 'minimal', name: 'Minimalista', icon: '⚡' },
  { id: 'vintage', name: 'Vintage', icon: '📷' },
  { id: 'artistic', name: 'Artístico', icon: '🎨' },
  { id: 'corporate', name: 'Corporativo', icon: '💼' },
  { id: 'playful', name: 'Divertido', icon: '🎪' },
  { id: 'elegant', name: 'Elegante', icon: '✨' },
  { id: 'bold', name: 'Marcante', icon: '⚡' }
];

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  description: string;
  metadata: any;
}

export default function ArtGenerator() {
  const [selectedPalette, setSelectedPalette] = useState('vibrant');
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [magicPrompt, setMagicPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  const toggleAttribute = (attrId: string) => {
    setSelectedAttributes(prev => 
      prev.includes(attrId) 
        ? prev.filter(id => id !== attrId)
        : [...prev, attrId]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateMagicPrompt = async () => {
    if (!selectedPalette || selectedAttributes.length === 0) return;
    
    const prompt = `Crie uma imagem profissional com as seguintes especificações:

Tema: ${customPrompt || 'Arte criativa'}
Paleta: ${palettes.find(p => p.id === selectedPalette)?.name}
Atributos: ${selectedAttributes.map(id => attributes.find(a => a.id === id)?.name).join(', ')}
${referenceImage ? 'Baseada na imagem de referência fornecida' : ''}

Especificações técnicas:
- Resolução: 1080x1080 (Instagram)
- Estilo: ${selectedAttributes.includes('modern') ? 'moderno e clean' : 'profissional'}
- Iluminação: natural, bem equilibrada
- Composição: regra dos terços
- Cores: ${palettes.find(p => p.id === selectedPalette)?.colors.join(', ')}

Elementos visuais:
- Foco principal centralizado
- Elementos de apoio equilibrados
- Tipografia integrada se necessário
- Mood: ${selectedAttributes.includes('elegant') ? 'sofisticado' : 'vibrante'}
- Espaço adequado para logo e CTA
- Alta qualidade e profissional`;

    setMagicPrompt(prompt);
    setShowPrompt(true);
  };

  const generateArt = async () => {
    if (!magicPrompt && (!selectedPalette || selectedAttributes.length === 0)) {
      alert('Por favor, gere o prompt mágico primeiro!');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: magicPrompt || customPrompt,
          palette: selectedPalette,
          attributes: selectedAttributes,
          format: 'square',
          referenceImageUrl: referenceImage
        }),
      });

      const result = await response.json();

      if (result.success) {
        setGeneratedImage(result.data);
        alert('🎨 Imagem gerada com sucesso usando Nana Banana (Google Imagen)!');
      } else {
        throw new Error(result.error || 'Erro ao gerar imagem');
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      alert('Erro ao gerar imagem: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      // In a real implementation, this would download the actual image
      alert('Download iniciado! (Em produção, baixaria a imagem real)');
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(magicPrompt);
    alert('Prompt copiado para a área de transferência!');
  };

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-purple-900/30 rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
          <Palette className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">Gerador de Arte</h2>
        <div className="text-sm text-slate-400">Crie artes personalizadas com Nana Banana</div>
      </div>

      <div className="space-y-6">
        {/* Custom Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Prompt Customizado (opcional)
          </label>
          <textarea
            placeholder="Descreva a imagem que você quer gerar..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/20 text-white placeholder-slate-400 focus:border-emerald-400 focus:outline-none resize-none"
          />
        </div>

        {/* Reference Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Imagem de Referência (opcional)
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="reference-upload"
            />
            <label
              htmlFor="reference-upload"
              className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/40 transition-colors"
            >
              {referenceImage ? (
                <img 
                  src={referenceImage} 
                  alt="Referência" 
                  className="max-h-full max-w-full object-contain rounded"
                />
              ) : (
                <div className="text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-sm text-slate-400">Clique para enviar uma imagem</div>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Palette Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Paleta de Cores
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {palettes.map((palette) => (
              <button
                key={palette.id}
                onClick={() => setSelectedPalette(palette.id)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedPalette === palette.id
                    ? 'border-emerald-400 bg-emerald-500/20'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <div className="flex gap-1 mb-2">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="text-sm text-slate-300">{palette.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Attributes Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Atributos do Estilo
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {attributes.map((attr) => (
              <button
                key={attr.id}
                onClick={() => toggleAttribute(attr.id)}
                className={`p-3 rounded-lg border transition-all text-sm ${
                  selectedAttributes.includes(attr.id)
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                    : 'border-white/20 hover:border-white/40 text-slate-300'
                }`}
              >
                <div className="text-lg mb-1">{attr.icon}</div>
                {attr.name}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={generateMagicPrompt}
            disabled={!selectedPalette || selectedAttributes.length === 0}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Gerar Prompt Mágico
          </button>
          
          <button
            onClick={generateArt}
            disabled={isGenerating || (!magicPrompt && !customPrompt)}
            className="w-full py-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium hover:from-pink-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando com Nana Banana...
              </>
            ) : (
              <>
                <Image className="w-5 h-5" />
                Gerar Arte (Nana Banana)
              </>
            )}
          </button>
        </div>

        {/* Magic Prompt Display */}
        {showPrompt && magicPrompt && (
          <div className="bg-slate-900/30 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="text-purple-300 text-sm font-medium">✨ Prompt Mágico Gerado:</div>
              <div className="flex gap-2">
                <button
                  onClick={copyPrompt}
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
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
            <div className="text-slate-300 text-sm whitespace-pre-line">{magicPrompt}</div>
          </div>
        )}

        {/* Generated Image Display */}
        {generatedImage && (
          <div className="bg-slate-900/30 rounded-lg p-4 border border-emerald-500/20">
            <div className="text-emerald-300 text-sm font-medium mb-3">🎨 Imagem Gerada com Sucesso!</div>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-400 mb-1">ID:</div>
                <div className="text-slate-300 text-sm font-mono">{generatedImage.id}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Descrição IA:</div>
                <div className="text-slate-300 text-sm">{generatedImage.description}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadImage}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Baixar Imagem
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 text-center">
          🤖 <strong>Integrado:</strong> Usando Google Imagen (Nana Banana) via API oficial para geração de imagens profissionais
        </div>
      </div>
    </div>
  );
}
