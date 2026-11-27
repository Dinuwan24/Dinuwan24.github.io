'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  Loader2,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from 'lucide-react';

interface SuggestedRecipe {
  slug: string;
  title: string;
  url: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedRecipes?: SuggestedRecipe[];
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hey cutie! I'm Hyun's kitchen helper. Ask me anything about the 11 recipes on this site — ingredients, steps, times, or which cozy dish to cook next!",
};

const HOME_PROMPTS = [
  'Which cheesy recipes do you have?',
  'What no-bake sweets are on the site?',
  'Do you have a lasagna recipe?',
];

export default function AskHyunChat() {
  const pathname = usePathname();
  const currentRecipeSlug = pathname?.startsWith('/recipes/')
    ? pathname.replace('/recipes/', '').split('/')[0]
    : undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const listEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const msgIdRef = useRef<number>(0);

  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true);
    window.addEventListener('open-ask-hyun', handleOpenEvent);
    return () => window.removeEventListener('open-ask-hyun', handleOpenEvent);
  }, []);

  useEffect(() => {
    if (isOpen) {
      listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [isOpen, messages.length, isLoading]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    msgIdRef.current += 1;
    const userMsg: ChatMessage = {
      id: `user-${msgIdRef.current}`,
      role: 'user',
      content: trimmed,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const historyPayload = nextMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/ask-hyun', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          currentRecipeSlug,
        }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        reply?: string;
        suggestedRecipes?: SuggestedRecipe[];
        error?: string;
      };

      if (!res.ok) {
        throw new Error(
          data.error ||
            'Ask Hyun is currently unavailable. You can still browse all 11 recipes normally.'
        );
      }

      msgIdRef.current += 1;
      const assistantMsg: ChatMessage = {
        id: `assistant-${msgIdRef.current}`,
        role: 'assistant',
        content:
          data.reply ||
          'I could not generate a reply right now. Feel free to browse our 11 recipes directly!',
        suggestedRecipes: Array.isArray(data.suggestedRecipes)
          ? data.suggestedRecipes
          : [],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Ask Hyun is currently unavailable. You can still browse all 11 recipes normally.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendMessage(input);
  };

  const handleReset = () => {
    setMessages([INITIAL_MESSAGE]);
    setErrorMessage(null);
    setInput('');
  };

  const starterPrompts = currentRecipeSlug
    ? [
        'What ingredients do I need for this recipe?',
        'How long does this recipe take?',
        'What other recipe on the site is similar?',
      ]
    : HOME_PROMPTS;

  return (
    <div className="no-print">
      {/* Compact floating Ask Hyun trigger button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open Ask Hyun cooking assistant"
          className="fixed right-4 bottom-4 z-40 inline-flex min-h-[52px] items-center gap-2.5 rounded-full bg-[#B53D24] px-5 py-3 text-[16px] font-semibold text-white shadow-lg transition-transform duration-150 hover:scale-[1.02] hover:bg-[#99311B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24] sm:right-6 sm:bottom-6"
        >
          <MessageCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span className="whitespace-nowrap">Ask Hyun</span>
        </button>
      )}

      {/* Ask Hyun chat panel */}
      {isOpen && (
        <aside
          role="dialog"
          aria-label="Ask Hyun cooking assistant"
          className="fixed inset-x-3 bottom-3 z-50 flex max-h-[82vh] flex-col overflow-hidden rounded-2xl border border-[#D8CBB9] bg-[#FFFDF9] shadow-2xl sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] sm:max-h-[620px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-[#E8DFD3] bg-[#1D3B2B] px-5 py-4 text-white">
            <div className="min-w-0">
              <h2 className="font-display text-xl font-semibold leading-tight text-white">
                Ask Hyun
              </h2>
              <p className="mt-0.5 text-[13px] text-[#D7E6DC]">
                Answers strictly from our 11 kitchen recipes
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleReset}
                aria-label="Start a new chat"
                title="Start over"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#D7E6DC] transition-colors hover:bg-[#2B523C] hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close Ask Hyun chat"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#D7E6DC] transition-colors hover:bg-[#2B523C] hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#FAF6F0] px-4 py-4 sm:px-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-[16px] leading-relaxed whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-[#1D3B2B] text-white'
                      : 'border border-[#E5DDD2] bg-[#FFFDF9] text-[#211915]'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.suggestedRecipes && msg.suggestedRecipes.length > 0 && (
                  <div className="mt-2 flex w-full max-w-[88%] flex-col gap-1.5">
                    {msg.suggestedRecipes.map((rec) => (
                      <Link
                        key={rec.slug}
                        href={rec.url}
                        onClick={() => setIsOpen(false)}
                        className="flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-[#DFD3C3] bg-white px-3.5 py-2 text-[15px] font-semibold text-[#B53D24] transition-colors hover:border-[#B53D24] hover:bg-[#FDF6F3]"
                      >
                        <span className="truncate">{rec.title}</span>
                        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quick starter buttons before first user turn */}
            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 pt-1">
                <p className="text-[13px] font-semibold text-[#5E524A]">
                  Try asking:
                </p>
                <div className="flex flex-col gap-2">
                  {starterPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => void sendMessage(prompt)}
                      className="min-h-[44px] rounded-xl border border-[#DFD3C3] bg-white px-3.5 py-2.5 text-left text-[15px] font-medium text-[#211915] transition-colors hover:border-[#B53D24] hover:text-[#B53D24] focus-visible:outline-2 focus-visible:outline-[#B53D24]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center gap-2 text-[15px] text-[#574C44]">
                <Loader2 className="h-4 w-4 animate-spin text-[#B53D24]" aria-hidden="true" />
                <span>Hyun is checking the recipe notebook...</span>
              </div>
            )}

            {errorMessage && (
              <div
                role="alert"
                className="rounded-xl border border-[#E4B8AE] bg-[#FDF2EF] px-4 py-3 text-[15px] leading-relaxed text-[#7D2312]"
              >
                {errorMessage}
              </div>
            )}

            <div ref={listEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-[#E5DDD2] bg-[#FFFDF9] p-3"
          >
            <label htmlFor="ask-hyun-input" className="sr-only">
              Ask Hyun a question about our 11 recipes
            </label>
            <input
              ref={inputRef}
              id="ask-hyun-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our 11 recipes..."
              disabled={isLoading}
              className="min-h-[48px] flex-1 rounded-xl border border-[#D8CBB9] bg-white px-4 text-[16px] text-[#211915] placeholder:text-[#7A6D63] focus:border-[#B53D24] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl bg-[#B53D24] px-4 text-white transition-colors hover:bg-[#99311B] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
            >
              <Send className="h-5 w-5" aria-hidden="true" />
            </button>
          </form>
        </aside>
      )}
    </div>
  );
}
