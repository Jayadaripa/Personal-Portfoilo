import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, type WebSocket } from 'ws';
import {
  GoogleGenAI,
  Modality,
  ThinkingLevel,
  type LiveServerMessage,
} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const PORTFOLIO_CONTEXT = `
You are Jaya Daripa's official Portfolio AI Assistant, designed specifically to help technical recruiters, HR managers, and hiring engineers evaluate Jaya Daripa for Software Engineering / Frontend / Full-Stack / Java internships and entry-level interviews.

Be concise, structured, factual, and strictly grounded in Jaya Daripa's real portfolio and resume data below. Never invent companies, metrics, or technologies she has not listed.

=== CANDIDATE PROFILE ===
- Name: Jaya Daripa
- Location: Faridabad, Haryana, India
- Role: B.Tech Computer Science Engineering Student (3rd Year, Class of 2028) & Aspiring Software Developer
- Availability: Open to Software / Frontend / Full-Stack Developer Internship Opportunities
- Email: jayadaripa04@gmail.com
- GitHub: https://github.com/Jayadaripa
- LinkedIn: https://www.linkedin.com/in/jaya-daripa-9a3502383/
- LeetCode: https://leetcode.com/u/Jaya_Daripa/

=== EDUCATION ===
1. Gurugram University — B.Tech, Computer Science and Engineering (2025 – 2028, currently 3rd Year)
2. Government Polytechnic for Women, Faridabad — Diploma in Computer Science Engineering (Oct 2022 – Jun 2024, Score: 85%)
3. St. Peter Convent School — Class X (2022 – 2023, Score: 93%)

=== INTERNSHIPS & INDUSTRY EXPOSURE ===
1. AssistFlow Pvt Ltd — Java Developer Intern (Jun 2026 – Aug 2026, Internship)
   - Developed, debugged, and maintained Java-based backend modules and application logic.
   - Hands-on experience integrating application workflows with relational databases.
2. Deloitte (via Forage) — Data Analytics Job Simulation (Jul 2026, Virtual Simulation)
   - Completed practical tasks in structured data analysis, interpretation, and forensic technology workflows.
3. RVM CAD — Python Intern Trainee (Jul 2024 – Aug 2024, Internship)
   - Applied Python concepts, OOP, functions, and libraries to develop scripts and solve practical programming problems.
4. Imperial Auto Industries Pvt. Ltd. — Database Management Intern Trainee (Aug 2023 – Sep 2023, Industrial Training)
   - Applied SQL and database management concepts to assist in creating and maintaining enterprise databases.

=== PROJECTS ===
// 1. Foodie (React Project, 2026): Responsive food ordering and discovery web application built with React, Vite, JavaScript, and Tailwind CSS.
1. Life Receipt (2026 Hackathon Project): Interactive hackathon web application transforming daily habits, milestones, and reflections into a custom formatted printable receipt summary.
2. GRANTLY (2026): Scholarship discovery and application-management experience built with React, JavaScript, and Tailwind CSS.
3. VESTORA (2026, In Progress): Paper trading and stock-market learning simulator built with React and JavaScript.
4. GrowMates (2026, In Progress): Student and developer collaboration platform for finding coding partners and hackathon teammates.
5. Timetable Management System (Academic Project): Developed a timetable management application with authentication, scheduling, and SQL database integration.

=== TECHNICAL SKILLS ===
- Languages: Java, Python, JavaScript, SQL
- Frontend: HTML5, CSS3, React.js, Tailwind CSS, Vite
- Backend & Database: Node.js, Express.js, REST APIs, SQL, NoSQL
- Tools: Git, GitHub, VS Code
- Core Concepts: Data Structures & Algorithms (Sigma DSA, LeetCode practice), OOP, Responsive Web Design, DBMS, Computer Networks

=== CERTIFICATIONS & HACKATHONS (2026) ===
- Hackathons (All in 2026): WebRush (6-Hour Hackathon), Adobe Hackathon, Build with Bharat Hackathon, Aspire for Her Hackathon (LogiTech), The Outpost — WebRush, Vivekananda Hackathon.
- Certifications: Deloitte Data Analytics Job Simulation (Forage, 2026), Programming in Java (Infosys Springboard, 2026), Database Management System Part 1 & Part 2 (Infosys Springboard, 2026), Python Coder Badge (Kaggle, Nov 2025), Generative AI (IIT), Sigma DSA (Apna College), NoSQL Database, Software & Agile Engineering, AI & Robotics.

Keep answers helpful, conversational, and recruiter-friendly. In voice mode, keep spoken answers crisp and natural (2-4 sentences unless asked to elaborate).
`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type AllowedModel = 'gemini-4-hydrogen' | 'gemini-3.1-flash-lite';

function createGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(err: unknown): boolean {
  const raw = err instanceof Error ? err.message : String(err);
  return (
    raw.includes('503') ||
    raw.includes('UNAVAILABLE') ||
    raw.includes('high demand') ||
    raw.includes('429') ||
    raw.includes('RESOURCE_EXHAUSTED')
  );
}

function formatFriendlyError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  if (raw.includes('503') || raw.includes('UNAVAILABLE') || raw.includes('high demand')) {
    return 'The AI model is experiencing a temporary demand spike right now. Please try again in a few seconds.';
  }
  if (raw.includes('429') || raw.includes('RESOURCE_EXHAUSTED')) {
    return 'Rate limit reached momentarily. Please wait a few seconds and try again.';
  }
  if (raw.includes('API_KEY_INVALID') || raw.includes('PERMISSION_DENIED')) {
    return 'Please check your GEMINI_API_KEY configuration in Settings > Secrets.';
  }
  return raw || 'Unable to reach the AI assistant right now.';
}

async function generateChatReply(
  ai: GoogleGenAI,
  preferredModel: AllowedModel,
  history: ChatMessage[],
  userMessage: string
): Promise<{ reply: string; modelUsed: string }> {
  const modelOrder: AllowedModel[] =
    preferredModel === 'gemini-3.1-flash-lite'
      ? ['gemini-3.1-flash-lite', 'gemini-4-hydrogen']
      : ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'];

  let lastError: unknown;

  for (const model of modelOrder) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const chat = ai.chats.create({
          model,
          history: history.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
          })),
          config:
            model === 'gemini-4-hydrogen'
              ? {
                  systemInstruction: PORTFOLIO_CONTEXT,
                  thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
                }
              : {
                  systemInstruction: PORTFOLIO_CONTEXT,
                },
        });

        const response = await chat.sendMessage({ message: userMessage });
        const reply = response.text?.trim();
        if (reply) {
          return { reply, modelUsed: model };
        }
      } catch (err: unknown) {
        lastError = err;
        if (!isRetryableError(err)) {
          throw err;
        }
        if (attempt === 0) {
          await sleep(650);
        }
      }
    }
  }

  throw lastError ?? new Error('Unable to generate a response.');
}

const app = express();
app.use(express.json({ limit: '1mb' }));

app.post('/api/assistant', async (req: Request, res: Response) => {
  const ai = createGeminiClient();
  if (!ai) {
    res.status(500).json({
      error:
        'GEMINI_API_KEY is not configured. Add it in Settings > Secrets to enable the portfolio AI assistant.',
    });
    return;
  }

  const body = req.body as {
    message?: string;
    history?: ChatMessage[];
    model?: string;
  };
  const userMessage = typeof body?.message === 'string' ? body.message.trim() : '';

  if (!userMessage) {
    res.status(400).json({ error: 'Please enter a question for the assistant.' });
    return;
  }

  const preferredModel: AllowedModel =
    body?.model === 'gemini-3.1-flash-lite'
      ? 'gemini-3.1-flash-lite'
      : 'gemini-4-hydrogen';

  const safeHistory = Array.isArray(body.history)
    ? body.history
        .slice(-10)
        .filter(
          (m): m is ChatMessage =>
            (m?.role === 'user' || m?.role === 'assistant') &&
            typeof m?.content === 'string' &&
            m.content.trim().length > 0
        )
    : [];

  try {
    const result = await generateChatReply(ai, preferredModel, safeHistory, userMessage);
    res.json(result);
  } catch (err: unknown) {
    console.error('Assistant API error:', err);
    res.status(isRetryableError(err) ? 503 : 500).json({
      error: formatFriendlyError(err),
    });
  }
});

// Prevent unmatched /api/* requests from returning SPA HTML
app.all('/api/*', (_req: Request, res: Response) => {
  res.status(404).json({ error: 'API endpoint not found.' });
});

async function startServer() {
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/api/live' });

  wss.on('connection', async (clientWs: WebSocket) => {
    const ai = createGeminiClient();
    if (!ai) {
      clientWs.send(
        JSON.stringify({
          error:
            'GEMINI_API_KEY is not configured. Add it in Settings > Secrets to enable Live Voice.',
        })
      );
      clientWs.close();
      return;
    }

    let session: Awaited<ReturnType<typeof ai.live.connect>> | null = null;

    try {
      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: PORTFOLIO_CONTEXT,
        },
        callbacks: {
          onopen: () => {
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ ready: true }));
            }
          },
          onmessage: (message: LiveServerMessage) => {
            if (clientWs.readyState !== clientWs.OPEN) return;

            const serverContent = message.serverContent;
            if (serverContent?.inputTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  inputTranscript: serverContent.inputTranscription.text,
                })
              );
            }
            if (serverContent?.outputTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  outputTranscript: serverContent.outputTranscription.text,
                })
              );
            }
            for (const part of serverContent?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) {
                clientWs.send(JSON.stringify({ audio: part.inlineData.data }));
              }
            }
            if (serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
            if (serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ turnComplete: true }));
            }
          },
          onerror: (event: unknown) => {
            console.error('Gemini Live error:', event);
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(
                JSON.stringify({
                  error: 'Live voice session encountered an upstream error.',
                })
              );
            }
          },
          onclose: () => {
            if (clientWs.readyState === clientWs.OPEN) {
              clientWs.send(JSON.stringify({ closed: true }));
              clientWs.close();
            }
          },
        },
      });
    } catch (err: unknown) {
      console.error('Failed to connect Gemini Live:', err);
      if (clientWs.readyState === clientWs.OPEN) {
        clientWs.send(JSON.stringify({ error: formatFriendlyError(err) }));
        clientWs.close();
      }
      return;
    }

    clientWs.on('message', (raw) => {
      if (!session) return;
      try {
        const msg = JSON.parse(raw.toString()) as {
          audio?: string;
          text?: string;
        };
        if (msg.audio) {
          session.sendRealtimeInput({
            audio: { data: msg.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (msg.text) {
          session.sendRealtimeInput({ text: msg.text });
        }
      } catch (err) {
        console.error('Live client message error:', err);
      }
    });

    clientWs.on('close', () => {
      try {
        session?.close();
      } catch {
        // ignore close errors
      }
    });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server running at http://localhost:${PORT}`);
  });
}

startServer();
