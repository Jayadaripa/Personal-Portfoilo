import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Bot,
  MessageSquare,
  Mic,
  MicOff,
  Send,
  Sparkles,
  User,
  Volume2,
  X,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

type ChatModel = 'gemini-4-hydrogen' | 'gemini-3.1-flash-lite';
type AssistantMode = 'chat' | 'voice';
type VoiceStatus = 'idle' | 'connecting' | 'live';

const STARTER_QUESTIONS = [
  'Why should we hire Jaya for a SWE internship?',
  'Walk me through Life Receipt & GRANTLY.',
  'Summarize her Java, Python & SQL internships.',
  'What is her DSA and LeetCode readiness?',
];

function float32ToPcm16Base64(float32: Float32Array): string {
  const pcm16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  const bytes = new Uint8Array(pcm16.buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function base64Pcm16ToFloat32(base64: string): Float32Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 0x8000;
  }
  return float32;
}

interface PortfolioAssistantProps {
  open: boolean;
  onClose: () => void;
  initialPrompt?: string | null;
  onClearInitialPrompt?: () => void;
}

export default function PortfolioAssistant({
  open,
  onClose,
  initialPrompt,
  onClearInitialPrompt,
}: PortfolioAssistantProps) {
  const [mode, setMode] = useState<AssistantMode>('chat');
  const [selectedModel, setSelectedModel] = useState<ChatModel>('gemini-4-hydrogen');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm Jaya Daripa's Portfolio AI Assistant. Ask me anything about her projects (Foodie, Life Receipt, GRANTLY, VESTORA, GrowMates), internships, certifications, or switch to Voice Mode for a live conversation.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Voice conversation state & refs
  const [voiceStatus, setVoiceStatus] = useState<VoiceStatus>('idle');
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<ChatMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const stopScheduledAudio = () => {
    for (const src of activeSourcesRef.current) {
      try {
        src.stop();
      } catch {
        // ignore
      }
    }
    activeSourcesRef.current = [];
    if (outputCtxRef.current) {
      nextStartTimeRef.current = outputCtxRef.current.currentTime;
    } else {
      nextStartTimeRef.current = 0;
    }
  };

  const stopVoiceSession = () => {
    stopScheduledAudio();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current.onaudioprocess = null;
      processorRef.current = null;
    }
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }
      streamRef.current = null;
    }
    if (inputCtxRef.current) {
      void inputCtxRef.current.close();
      inputCtxRef.current = null;
    }
    if (outputCtxRef.current) {
      void outputCtxRef.current.close();
      outputCtxRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    }
    setVoiceStatus('idle');
  };

  useEffect(() => {
    if (!open) {
      stopVoiceSession();
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    return () => stopVoiceSession();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, voiceTranscript]);

  const sendQuestion = async (questionText: string) => {
    const trimmed = questionText.trim();
    if (!trimmed || loading) return;

    setError(null);
    const nextUserMessage: ChatMessage = { role: 'user', content: trimmed };
    const priorHistory = messages.slice(1);
    setMessages((prev) => [...prev, nextUserMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: priorHistory,
          model: selectedModel,
        }),
      });

      const rawText = await response.text();
      let data: { reply?: string; error?: string } = {};
      try {
        data = JSON.parse(rawText) as { reply?: string; error?: string };
      } catch {
        throw new Error(
          response.ok
            ? 'Received an unexpected non-JSON response from the server.'
            : `Server returned status ${response.status}. Ensure the Express API server is running.`
        );
      }

      if (!response.ok || !data.reply) {
        throw new Error(data.error || 'Could not get a response from the assistant.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply! }]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Unable to connect to the assistant right now.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && initialPrompt) {
      const promptToRun = initialPrompt;
      onClearInitialPrompt?.();
      setMode('chat');
      void sendQuestion(promptToRun);
    }
  }, [open, initialPrompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendQuestion(input);
  };

  const playPcmChunk = (base64Audio: string) => {
    const ctx = outputCtxRef.current;
    if (!ctx) return;

    const samples = base64Pcm16ToFloat32(base64Audio);
    const buffer = ctx.createBuffer(1, samples.length, 24000);
    buffer.getChannelData(0).set(samples);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;

    activeSourcesRef.current.push(source);
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
    };
  };

  const startVoiceSession = async () => {
    if (voiceStatus !== 'idle') return;
    setVoiceError(null);
    setVoiceStatus('connecting');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inputCtx = new AudioContext({ sampleRate: 16000 });
      const outputCtx = new AudioContext({ sampleRate: 24000 });
      inputCtxRef.current = inputCtx;
      outputCtxRef.current = outputCtx;
      nextStartTimeRef.current = outputCtx.currentTime;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/api/live`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as {
            ready?: boolean;
            audio?: string;
            inputTranscript?: string;
            outputTranscript?: string;
            interrupted?: boolean;
            error?: string;
            closed?: boolean;
          };

          if (msg.ready) {
            setVoiceStatus('live');
          }
          if (msg.audio) {
            playPcmChunk(msg.audio);
          }
          if (msg.interrupted) {
            stopScheduledAudio();
          }
          if (msg.inputTranscript) {
            const text = msg.inputTranscript;
            setVoiceTranscript((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'user') {
                return [
                  ...prev.slice(0, -1),
                  { role: 'user', content: `${last.content} ${text}`.trim() },
                ];
              }
              return [...prev, { role: 'user', content: text }];
            });
          }
          if (msg.outputTranscript) {
            const text = msg.outputTranscript;
            setVoiceTranscript((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant') {
                return [
                  ...prev.slice(0, -1),
                  { role: 'assistant', content: `${last.content}${text}` },
                ];
              }
              return [...prev, { role: 'assistant', content: text }];
            });
          }
          if (msg.error) {
            setVoiceError(msg.error);
            stopVoiceSession();
          }
          if (msg.closed) {
            stopVoiceSession();
          }
        } catch {
          // ignore malformed frames
        }
      };

      ws.onerror = () => {
        setVoiceError('Could not establish live voice connection.');
        stopVoiceSession();
      };

      ws.onclose = () => {
        setVoiceStatus('idle');
      };

      ws.onopen = () => {
        const source = inputCtx.createMediaStreamSource(stream);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const channelData = e.inputBuffer.getChannelData(0);
          const audioBase64 = float32ToPcm16Base64(channelData);
          ws.send(JSON.stringify({ audio: audioBase64 }));
        };

        source.connect(processor);
        processor.connect(inputCtx.destination);
      };
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Microphone access is required for real-time voice conversation.';
      setVoiceError(msg);
      stopVoiceSession();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Ask AI About Jaya Daripa"
            onClick={(e) => e.stopPropagation()}
            className="flex h-full w-full max-w-lg flex-col border-l border-white/[0.1] bg-[#080B12]"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA]">
                  <Sparkles size={17} />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                    Recruiter AI Assistant
                  </h3>
                  <p className="text-xs text-[#8C95A8]">
                    Text chat &amp; live voice interview Q&amp;A
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close AI Assistant"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#9CA3B4] transition-colors hover:border-white/25 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#0B0F18] px-6 py-2.5">
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#06080C] p-1">
                <button
                  type="button"
                  onClick={() => {
                    stopVoiceSession();
                    setMode('chat');
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    mode === 'chat'
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-[#9CA3B4] hover:text-white'
                  }`}
                >
                  <MessageSquare size={13} />
                  Text Chat
                </button>
                <button
                  type="button"
                  onClick={() => setMode('voice')}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    mode === 'voice'
                      ? 'bg-[#3B82F6] text-white'
                      : 'text-[#9CA3B4] hover:text-white'
                  }`}
                >
                  <Mic size={13} />
                  Voice Live
                </button>
              </div>

              {mode === 'chat' && (
                <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#06080C] p-1">
                  <button
                    type="button"
                    onClick={() => setSelectedModel('gemini-4-hydrogen')}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                      selectedModel === 'gemini-4-hydrogen'
                        ? 'bg-white/10 text-white'
                        : 'text-[#8C95A8] hover:text-white'
                    }`}
                  >
                    Balanced
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap ${
                      selectedModel === 'gemini-3.1-flash-lite'
                        ? 'bg-white/10 text-white'
                        : 'text-[#8C95A8] hover:text-white'
                    }`}
                  >
                    Fast
                  </button>
                </div>
              )}
            </div>

            {mode === 'chat' ? (
              <>
                <div className="border-b border-white/[0.06] bg-[#0B0F18] px-6 py-3">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-[#7E889C]">
                    Quick Recruiter Prompts
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        disabled={loading}
                        onClick={() => void sendQuestion(q)}
                        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-left text-xs text-[#CBD2E1] transition-colors hover:border-[#3B82F6]/50 hover:text-white disabled:opacity-50"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA]">
                          <Bot size={14} />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                          msg.role === 'user'
                            ? 'bg-[#3B82F6] text-white'
                            : 'border border-white/[0.08] bg-[#0E131E] text-[#D9DFEB]'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {msg.role === 'user' && (
                        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-[#CBD2E1]">
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-3 text-xs text-[#8C95A8]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA]">
                        <Bot size={14} />
                      </div>
                      <span>Reviewing Jaya's portfolio...</span>
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-200">
                      {error}
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="border-t border-white/[0.08] bg-[#0B0F18] p-4"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about Java, React, internships, or LeetCode..."
                      disabled={loading}
                      className="flex-1 rounded-lg border border-white/10 bg-[#06080C] px-3.5 py-2.5 text-sm text-white placeholder-[#6E778B] focus:border-[#3B82F6] focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={loading || !input.trim()}
                      aria-label="Send question"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#3B82F6] text-white transition-colors hover:bg-[#2563EB] disabled:opacity-40"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col justify-between overflow-hidden">
                <div className="border-b border-white/[0.06] bg-[#0B0F18] px-6 py-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-[#60A5FA]">
                    {voiceStatus === 'live' ? (
                      <Volume2 size={28} />
                    ) : (
                      <Mic size={28} />
                    )}
                  </div>

                  <h4 className="mt-4 font-display text-lg font-semibold text-[#F8FAFC]">
                    {voiceStatus === 'idle' && 'Real-Time Voice Interview Assistant'}
                    {voiceStatus === 'connecting' && 'Connecting Live Audio Session...'}
                    {voiceStatus === 'live' && 'Live Voice Connected — Speak Now'}
                  </h4>

                  <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-[#9CA3B4]">
                    Have a real-time spoken conversation about Jaya Daripa's technical
                    skills, projects, internships, and 2026 hackathons.
                  </p>

                  <div className="mt-5 flex justify-center">
                    {voiceStatus === 'idle' ? (
                      <button
                        type="button"
                        onClick={() => void startVoiceSession()}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]"
                      >
                        <Mic size={16} />
                        Start Voice Conversation
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopVoiceSession}
                        className="inline-flex items-center gap-2 rounded-lg border border-rose-500/40 bg-rose-500/15 px-5 py-2.5 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-500/25"
                      >
                        <MicOff size={16} />
                        End Voice Session
                      </button>
                    )}
                  </div>

                  {voiceError && (
                    <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-200">
                      {voiceError}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
                  {voiceTranscript.length === 0 ? (
                    <p className="text-center text-xs text-[#6E778B]">
                      Live conversation transcripts will appear here once you begin speaking.
                    </p>
                  ) : (
                    voiceTranscript.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2.5 ${
                          item.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                            item.role === 'user'
                              ? 'bg-[#3B82F6] text-white'
                              : 'border border-white/[0.08] bg-[#0E131E] text-[#D9DFEB]'
                          }`}
                        >
                          {item.content}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={bottomRef} />
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
