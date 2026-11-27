'use client';

import { useId, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface EmailSignupFormProps {
  variant: 'section' | 'footer';
}

export default function EmailSignupForm({ variant }: EmailSignupFormProps) {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Front-end slot only — stores nothing; MailerLite will be connected at launch.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmail('');
    setSubmitted(true);
  };

  if (variant === 'footer') {
    return (
      <div className="mt-10 border-t border-[#2E543E] pt-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-display text-xl font-semibold text-white">
              A new recipe in your inbox, every week
            </p>
          </div>

          {submitted ? (
            <p
              role="status"
              className="inline-flex min-h-[46px] items-center gap-2.5 text-[16px] font-medium text-[#E5F2E9]"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#9AD6AF]" aria-hidden="true" />
              <span>You&apos;re in! Thanks for joining Hyun&apos;s kitchen.</span>
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-center lg:max-w-md"
            >
              <label htmlFor={inputId} className="sr-only">
                Email address
              </label>
              <input
                id={inputId}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-h-[46px] flex-1 rounded-xl border border-[#3E6A51] bg-[#FFFDF9] px-4 text-[16px] text-[#211915] placeholder:text-[#75675D] focus:border-[#F4D5C6] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#C84B31] px-5 py-2.5 text-[16px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#B53D24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Join free
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="border-t border-[#E5DDD2] bg-[#F4EDE2] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#DFD3C3] bg-[#FFFDF9] px-6 py-10 sm:px-10 sm:py-12">
          <h2
            id="newsletter-heading"
            className="font-display text-3xl font-semibold tracking-tight text-[#211915] sm:text-4xl [text-wrap:balance]"
          >
            A new recipe in your inbox, every week
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[17px] leading-relaxed text-[#4F443C]">
            Cozy, simple comfort food recipes sent straight from Hyun&apos;s kitchen. Always free, no fuss.
          </p>

          {submitted ? (
            <div
              role="status"
              className="mx-auto mt-7 inline-flex items-center gap-3 rounded-xl border border-[#C6DEC9] bg-[#EEF7F0] px-6 py-4 text-[17px] font-semibold text-[#1D3B2B]"
            >
              <CheckCircle2 className="h-6 w-6 shrink-0 text-[#1D3B2B]" aria-hidden="true" />
              <span>You&apos;re in! Thanks for joining Hyun&apos;s kitchen.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-7 flex max-w-lg flex-col gap-3 sm:flex-row sm:items-stretch"
            >
              <label htmlFor={inputId} className="sr-only">
                Email address
              </label>
              <input
                id={inputId}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="min-h-[52px] flex-1 rounded-xl border border-[#D4C5B4] bg-white px-4 text-[17px] text-[#211915] placeholder:text-[#786A60] focus:border-[#B53D24] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-[#B53D24] px-7 py-3 text-[17px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#99311B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B53D24]"
              >
                Join free
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
