import z from "zod";

// Post generation
export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  hashtags: z.array(z.string()),
  magicPrompt: z.string().optional(),
});

export type Post = z.infer<typeof PostSchema>;

export const GeneratePostsRequest = z.object({
  subject: z.string().min(1, "Assunto é obrigatório"),
});

export type GeneratePostsRequestType = z.infer<typeof GeneratePostsRequest>;

// Art generation
export const ArtGenerationRequest = z.object({
  referenceImage: z.string().optional(),
  palette: z.enum(["vibrant", "pastel", "dark", "minimal", "warm", "cool"]),
  attributes: z.array(z.string()),
  prompt: z.string(),
});

export type ArtGenerationRequestType = z.infer<typeof ArtGenerationRequest>;

// Video generation
export const VideoGenerationRequest = z.object({
  duration: z.enum(["15s", "30s", "60s"]),
  brief: z.string().min(1, "Brief é obrigatório"),
  prompt: z.string().optional(),
});

export type VideoGenerationRequestType = z.infer<typeof VideoGenerationRequest>;

// Landing page generation
export const LandingPageRequest = z.object({
  briefing: z.string().min(1, "Briefing é obrigatório"),
  businessType: z.string(),
  targetAudience: z.string(),
  mainGoal: z.enum(["leads", "sales", "awareness", "engagement"]),
});

export type LandingPageRequestType = z.infer<typeof LandingPageRequest>;

export const LandingPageResponse = z.object({
  headline: z.string(),
  subheadline: z.string(),
  bullets: z.array(z.string()),
  cta: z.string(),
  html: z.string(),
});

export type LandingPageResponseType = z.infer<typeof LandingPageResponse>;
