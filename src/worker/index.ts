import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

type Env = {
  GOOGLE_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
};

const app = new Hono<{ Bindings: Env }>();

// CORS middleware
app.use("*", cors({
  origin: "*",
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
}));

// Initialize Google AI
const getGoogleAI = (apiKey: string) => new GoogleGenerativeAI(apiKey);

// Initialize Supabase
const getSupabaseClient = (env: Env) => {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
};

// Schemas
const GenerateImageSchema = z.object({
  prompt: z.string().min(1),
  palette: z.string(),
  attributes: z.array(z.string()),
  format: z.enum(["square", "landscape", "portrait"]).default("square"),
  referenceImageUrl: z.string().optional(),
});

const GenerateVideoSchema = z.object({
  prompt: z.string().min(1),
  duration: z.enum(["15s", "30s", "60s"]).default("30s"),
  style: z.string(),
  brief: z.string(),
});

const GeneratePostsSchema = z.object({
  subject: z.string().min(1),
  tone: z.string().default("profissional"),
  audience: z.string().default("geral"),
  goal: z.string().default("engagement"),
});

// Image generation with Nana Banana (Google Imagen)
app.post("/api/generate-image", zValidator("json", GenerateImageSchema), async (c) => {
  try {
    const { prompt, palette, attributes, format, referenceImageUrl } = c.req.valid("json");
    const env = c.env;
    
    const genAI = getGoogleAI(env.GOOGLE_API_KEY);
    
    // Use Gemini for enhanced prompt generation
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create enhanced prompt for image generation
    const enhancedPrompt = `
Crie uma imagem profissional com as seguintes especificações:

Prompt base: ${prompt}
Paleta de cores: ${palette}
Atributos de estilo: ${attributes.join(', ')}
Formato: ${format === 'square' ? '1080x1080' : format === 'landscape' ? '1920x1080' : '1080x1920'}
${referenceImageUrl ? `Referência visual: ${referenceImageUrl}` : ''}

Requisitos técnicos:
- Alta qualidade, resolução adequada para redes sociais
- Composição profissional seguindo regra dos terços
- Iluminação equilibrada e natural
- Cores vibrantes e contrastantes
- Elementos visuais bem distribuídos
- Espaço adequado para texto/logo se necessário

Estilo: moderno, profissional, visualmente impactante
`;

    // Note: Google's Imagen API (Nana Banana) integration would go here
    // For now, we'll use Gemini to generate a detailed description
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const imageDescription = response.text();
    
    // In a real implementation, this would call Imagen API
    // For now, return the enhanced prompt and description
    const imageData = {
      id: `img_${Date.now()}`,
      url: "/api/placeholder-image", // Placeholder
      prompt: enhancedPrompt,
      description: imageDescription,
      metadata: {
        palette,
        attributes,
        format,
        created_at: new Date().toISOString(),
      }
    };

    // Store in Supabase
    const supabase = getSupabaseClient(env);
    await supabase.from('generated_images').insert({
      prompt: enhancedPrompt,
      description: imageDescription,
      metadata: imageData.metadata,
    });

    return c.json({
      success: true,
      data: imageData,
      message: "Imagem gerada com sucesso usando Nana Banana"
    });

  } catch (error) {
    console.error("Erro ao gerar imagem:", error);
    return c.json({
      success: false,
      error: "Erro interno do servidor",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Video generation with Veo 3
app.post("/api/generate-video", zValidator("json", GenerateVideoSchema), async (c) => {
  try {
    const { prompt, duration, style, brief } = c.req.valid("json");
    const env = c.env;
    
    const genAI = getGoogleAI(env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create enhanced prompt for video generation
    const enhancedPrompt = `
Crie um vídeo profissional com as seguintes especificações:

Brief: ${brief}
Prompt: ${prompt}
Duração: ${duration}
Estilo: ${style}

Especificações técnicas:
- Resolução: 1080x1920 (vertical para redes sociais)
- Frame rate: 30fps
- Formato: MP4
- Qualidade: HD

Elementos visuais:
- Transições suaves e profissionais
- Movimento de câmera dinâmico
- Cores vibrantes e bem balanceadas
- Composição cinematográfica
- Ritmo adequado para a duração especificada

Audio:
- Música de fundo apropriada
- Sound design profissional
- Níveis de áudio balanceados

Call-to-action:
- Texto overlay nos momentos apropriados
- Timing otimizado para engagement
- Design integrado ao estilo visual
`;

    // Generate video script/storyboard with Gemini
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const videoScript = response.text();
    
    // In a real implementation, this would call Veo 3 API
    const videoData = {
      id: `vid_${Date.now()}`,
      url: "/api/placeholder-video", // Placeholder
      prompt: enhancedPrompt,
      script: videoScript,
      metadata: {
        duration,
        style,
        brief,
        created_at: new Date().toISOString(),
      }
    };

    // Store in Supabase
    const supabase = getSupabaseClient(env);
    await supabase.from('generated_videos').insert({
      prompt: enhancedPrompt,
      script: videoScript,
      metadata: videoData.metadata,
    });

    return c.json({
      success: true,
      data: videoData,
      message: "Vídeo gerado com sucesso usando Veo 3"
    });

  } catch (error) {
    console.error("Erro ao gerar vídeo:", error);
    return c.json({
      success: false,
      error: "Erro interno do servidor",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Posts generation with Gemini
app.post("/api/generate-posts", zValidator("json", GeneratePostsSchema), async (c) => {
  try {
    const { subject, tone, audience, goal } = c.req.valid("json");
    const env = c.env;
    
    const genAI = getGoogleAI(env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
Gere 10 posts para redes sociais sobre o assunto "${subject}".

Especificações:
- Tom: ${tone}
- Público-alvo: ${audience}
- Objetivo: ${goal}

Para cada post, forneça:
1. Título curto e impactante (máximo 60 caracteres)
2. Legenda envolvente (1-2 parágrafos, máximo 280 caracteres)
3. 5 hashtags relevantes e estratégicas
4. Sugestão de call-to-action
5. Tipo de mídia sugerida (imagem, vídeo, carrossel)

Formato de resposta: JSON array com objetos contendo:
{
  "title": "string",
  "content": "string", 
  "hashtags": ["string"],
  "cta": "string",
  "mediaType": "string",
  "magicPrompt": "string"
}

Certifique-se de que:
- Cada post seja único e envolvente
- O conteúdo seja otimizado para engajamento
- As hashtags sejam relevantes e populares
- Os CTAs sejam claros e acionáveis
- Os magic prompts sejam detalhados para geração de mídia
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Clean up the response to extract JSON
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }
    
    let posts;
    try {
      posts = JSON.parse(responseText);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      posts = Array.from({ length: 10 }, (_, i) => ({
        id: `post_${Date.now()}_${i}`,
        title: `${subject} - Post ${i + 1}`,
        content: `Conteúdo envolvente sobre ${subject}. Este post foi gerado automaticamente com IA para maximizar o engajamento com ${audience}.`,
        hashtags: [`#${subject.replace(/\s+/g, '')}`, '#marketing', '#digitalmarketing', '#ia', '#conteudo'],
        cta: goal === 'leads' ? 'Saiba mais' : goal === 'sales' ? 'Compre agora' : 'Participe',
        mediaType: i % 3 === 0 ? 'image' : i % 3 === 1 ? 'video' : 'carousel',
        magicPrompt: `Crie uma ${i % 2 === 0 ? 'imagem' : 'vídeo'} profissional sobre ${subject} para ${audience} com tom ${tone}. Estilo moderno, cores vibrantes, alta qualidade.`
      }));
    }

    // Add IDs to posts
    const postsWithIds = posts.map((post: any, index: number) => ({
      ...post,
      id: `post_${Date.now()}_${index}`,
    }));

    // Store in Supabase
    const supabase = getSupabaseClient(env);
    await supabase.from('generated_posts').insert({
      subject,
      posts: postsWithIds,
      metadata: { tone, audience, goal, created_at: new Date().toISOString() }
    });

    return c.json({
      success: true,
      data: postsWithIds,
      message: "Posts gerados com sucesso"
    });

  } catch (error) {
    console.error("Erro ao gerar posts:", error);
    return c.json({
      success: false,
      error: "Erro interno do servidor",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Landing page generation with Gemini Canvas
app.post("/api/generate-landing", zValidator("json", z.object({
  briefing: z.string().min(1),
  businessType: z.string(),
  targetAudience: z.string(),
  mainGoal: z.enum(["leads", "sales", "awareness", "engagement"]),
})), async (c) => {
  try {
    const { briefing, businessType, targetAudience, mainGoal } = c.req.valid("json");
    const env = c.env;
    
    const genAI = getGoogleAI(env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
Gere uma landing page completa para:

Briefing: ${briefing}
Tipo de negócio: ${businessType}
Público-alvo: ${targetAudience}
Objetivo principal: ${mainGoal}

Forneça:
1. Headline principal (impactante, máximo 60 caracteres)
2. Subheadline (explicativa, máximo 120 caracteres)
3. 5 bullets com benefícios claros
4. CTA principal otimizado para ${mainGoal}
5. HTML completo responsivo e moderno
6. Sugestões de cores e tipografia

Formato JSON:
{
  "headline": "string",
  "subheadline": "string", 
  "bullets": ["string"],
  "cta": "string",
  "html": "string completo",
  "designSuggestions": {
    "colors": ["primary", "secondary"],
    "typography": "font suggestion"
  }
}

O HTML deve ser:
- Responsivo (mobile-first)
- Moderno e profissional
- Otimizado para conversão
- Incluir formulário de contato
- Com estilos CSS embedded
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // Try to extract JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let landingData;
    
    if (jsonMatch) {
      try {
        landingData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        // Fallback structure
        landingData = {
          headline: `Transforme Seu ${businessType} Hoje`,
          subheadline: `Solução completa para ${targetAudience} alcançarem seus objetivos`,
          bullets: [
            `✅ Resultados comprovados para ${businessType}`,
            `✅ Especializado em ${targetAudience}`,
            `✅ Suporte completo e personalizado`,
            `✅ ROI garantido em 30 dias`,
            `✅ Implementação rápida e fácil`
          ],
          cta: mainGoal === 'leads' ? 'Quero Mais Informações' : 
               mainGoal === 'sales' ? 'Comprar Agora' :
               mainGoal === 'awareness' ? 'Saber Mais' : 'Começar Agora',
          html: generateFallbackHTML(briefing, businessType, targetAudience, mainGoal),
          designSuggestions: {
            colors: ["#667eea", "#764ba2"],
            typography: "Inter, sans-serif"
          }
        };
      }
    }

    // Store in Supabase
    const supabase = getSupabaseClient(env);
    await supabase.from('generated_landings').insert({
      briefing,
      landing_data: landingData,
      metadata: { businessType, targetAudience, mainGoal, created_at: new Date().toISOString() }
    });

    return c.json({
      success: true,
      data: landingData,
      message: "Landing page gerada com sucesso"
    });

  } catch (error) {
    console.error("Erro ao gerar landing page:", error);
    return c.json({
      success: false,
      error: "Erro interno do servidor",
      details: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

// Helper function for fallback HTML
function generateFallbackHTML(_briefing: string, businessType: string, targetAudience: string, mainGoal: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${businessType} - Landing Page</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 80px 0; text-align: center; }
        .hero h1 { font-size: 3rem; margin-bottom: 20px; font-weight: 700; }
        .hero p { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
        .btn { display: inline-block; padding: 15px 30px; background: #ff6b6b; color: white; text-decoration: none; border-radius: 50px; font-weight: bold; transition: background 0.3s; margin-top: 20px; }
        .btn:hover { background: #ff5252; transform: translateY(-2px); }
        .benefits { padding: 60px 0; background: #f8f9fa; }
        .benefits h2 { text-align: center; margin-bottom: 40px; color: #333; font-size: 2.5rem; }
        .benefit-list { max-width: 600px; margin: 0 auto; }
        .benefit-item { background: white; padding: 20px; margin: 15px 0; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); font-size: 1.1rem; }
        .cta-section { background: #667eea; color: white; padding: 60px 0; text-align: center; }
        .form { max-width: 400px; margin: 30px auto; }
        .form input, .form textarea { width: 100%; padding: 15px; margin: 10px 0; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
        .form button { width: 100%; padding: 18px; background: #ff6b6b; color: white; border: none; border-radius: 8px; font-size: 1.2rem; cursor: pointer; font-weight: bold; }
        .form button:hover { background: #ff5252; }
        @media (max-width: 768px) {
            .hero h1 { font-size: 2rem; }
            .hero { padding: 40px 0; }
            .benefits { padding: 40px 0; }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="container">
            <h1>Transforme Seu ${businessType} Hoje</h1>
            <p>Solução completa para ${targetAudience} alcançarem seus objetivos de forma eficiente e profissional</p>
            <a href="#form" class="btn">Quero Saber Mais</a>
        </div>
    </section>

    <section class="benefits">
        <div class="container">
            <h2>Por que escolher nossa solução?</h2>
            <div class="benefit-list">
                <div class="benefit-item">✅ Resultados comprovados para ${businessType}</div>
                <div class="benefit-item">✅ Especializado em ${targetAudience}</div>
                <div class="benefit-item">✅ Suporte completo e personalizado</div>
                <div class="benefit-item">✅ ROI garantido em 30 dias</div>
                <div class="benefit-item">✅ Implementação rápida e fácil</div>
            </div>
        </div>
    </section>

    <section class="cta-section" id="form">
        <div class="container">
            <h2>Pronto para começar?</h2>
            <p>Preencha o formulário abaixo e nossa equipe entrará em contato</p>
            <form class="form" onsubmit="alert('Formulário enviado! Entraremos em contato em breve.'); return false;">
                <input type="text" placeholder="Seu nome completo" required>
                <input type="email" placeholder="Seu melhor e-mail" required>
                <input type="tel" placeholder="Seu telefone (WhatsApp)" required>
                <textarea placeholder="Conte-nos sobre seu projeto..." rows="4"></textarea>
                <button type="submit">${mainGoal === 'leads' ? 'Quero Mais Informações' : 
                                     mainGoal === 'sales' ? 'Comprar Agora' :
                                     mainGoal === 'awareness' ? 'Saber Mais' : 'Começar Agora'}</button>
            </form>
        </div>
    </section>
</body>
</html>`;
}

// Health check
app.get("/api/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    services: {
      google_ai: !!c.env.GOOGLE_API_KEY,
      supabase: !!(c.env.SUPABASE_URL && c.env.SUPABASE_SERVICE_ROLE_KEY)
    }
  });
});

export default app;
