import Header from '@/react-app/components/Header';
import ContentWorkflow from '@/react-app/components/ContentWorkflow';
import ArtGenerator from '@/react-app/components/ArtGenerator';
import VideoGenerator from '@/react-app/components/VideoGenerator';
import LandingPageGenerator from '@/react-app/components/LandingPageGenerator';
import ReportsSystem from '@/react-app/components/ReportsSystem';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Header />
        
        <main className="space-y-8">
          {/* Hero Section */}
          <section className="text-center py-12 px-6 bg-gradient-to-r from-slate-800/30 to-blue-800/30 rounded-2xl border border-white/10">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Sua Agência Digital Autônoma
            </h2>
            <p className="text-xl text-slate-300 mb-6 max-w-3xl mx-auto">
              Gere estratégia completa de marketing em minutos: posts, artes, vídeos e landing pages com tecnologia de IA avançada
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Nana Banana Integration
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                Veo 3 Videos
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Gemini Canvas
              </span>
            </div>
          </section>

          {/* Content Workflow */}
          <ContentWorkflow />
          
          {/* Other Generators */}
          <div className="grid gap-8 lg:grid-cols-2">
            <ArtGenerator />
            <VideoGenerator />
          </div>
          
          <LandingPageGenerator />
          
          {/* Reports Section */}
          <ReportsSystem />

          {/* Integration Notes */}
          <section className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 rounded-xl p-6 border border-yellow-500/20">
            <h3 className="text-lg font-semibold text-yellow-300 mb-3">📋 Notas de Integração</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>• <strong>APIs Reais:</strong> Para integração completa, configure as chaves das APIs (Nana Banana, Veo 3, Gemini Canvas) no backend</p>
              <p>• <strong>Processamento:</strong> Implementar fila de processamento para geração de mídia (Redis + Workers)</p>
              <p>• <strong>Armazenamento:</strong> Configurar S3/Blob storage para assets gerados</p>
              <p>• <strong>Autenticação:</strong> Adicionar sistema de usuários e planos de pagamento</p>
              <p>• <strong>Analytics:</strong> Dashboard de métricas e relatórios automáticos</p>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center py-8 text-slate-400 border-t border-white/10">
            <p>&copy; 2025 Studio IA — Agência Digital Autônoma</p>
            <p className="text-sm mt-2">Transformando ideias em campanhas completas com inteligência artificial</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
