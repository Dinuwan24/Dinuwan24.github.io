'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Square,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

export interface CookingStepItem {
  number: number;
  sectionHeading?: string;
  text: string;
}

interface HandsFreeCookingModeProps {
  slug: string;
  title: string;
  steps: CookingStepItem[];
}

export default function HandsFreeCookingMode({
  slug,
  title,
  steps,
}: HandsFreeCookingModeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRead, setAutoRead] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSteps, setPlayedSteps] = useState<number[]>([]);
  const [audioNotice, setAudioNotice] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, [stopPlayback]);

  const playStepClip = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex];
      if (!step) return;

      stopPlayback();
      setAudioNotice(null);

      const clipUrl = `/audio/${slug}/step-${step.number}.mp3`;
      const audio = new Audio(clipUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setPlayedSteps((prev) =>
          prev.includes(stepIndex) ? prev : [...prev, stepIndex]
        );
      };

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setAudioNotice(
          'Audio clip for this step could not be played right now — keep following the large-print step below.'
        );
      };

      void audio.play().catch(() => {
        setIsPlaying(false);
        setAudioNotice('Tap "Read Aloud" to play Hyun’s audio for this step.');
      });
    },
    [slug, steps, stopPlayback]
  );

  const goToStep = useCallback(
    (nextIdx: number) => {
      if (nextIdx < 0 || nextIdx >= steps.length) return;
      stopPlayback();
      setCurrentIndex(nextIdx);
      setAudioNotice(null);
      if (autoRead) {
        playStepClip(nextIdx);
      }
    },
    [autoRead, playStepClip, steps.length, stopPlayback]
  );

  const handleOpen = () => {
    setIsOpen(true);
    setAudioNotice(null);
    if (steps.length > 0 && autoRead) {
      playStepClip(currentIndex);
    }
  };

  const handleClose = useCallback(() => {
    stopPlayback();
    setIsOpen(false);
  }, [stopPlayback]);

  // Lock body scroll & handle keyboard shortcuts while overlay is open
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Best-effort Screen Wake Lock so the screen doesn't sleep mid-recipe
    let wakeLock: { release: () => Promise<void> } | null = null;
    const navWithWakeLock = navigator as Navigator & {
      wakeLock?: {
        request: (type: 'screen') => Promise<{ release: () => Promise<void> }>;
      };
    };
    if (navWithWakeLock.wakeLock) {
      navWithWakeLock.wakeLock
        .request('screen')
        .then((sentinel) => {
          wakeLock = sentinel;
        })
        .catch(() => {
          // Ignore if browser denies wake lock
        });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowRight' && currentIndex < steps.length - 1) {
        goToStep(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        goToStep(currentIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (wakeLock) {
        void wakeLock.release().catch(() => {});
      }
    };
  }, [isOpen, currentIndex, steps.length, goToStep, handleClose]);

  const currentStep = steps[currentIndex];
  const progressPct =
    steps.length > 0 ? Math.round(((currentIndex + 1) / steps.length) * 100) : 0;

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="no-print inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#1D3B2B] px-5 py-2.5 text-[16px] font-semibold text-white whitespace-nowrap shrink-0 transition-colors duration-150 hover:bg-[#152D20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3B2B]"
      >
        <Volume2 className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>Hands-Free Cooking Mode</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hands-free-title"
          className="no-print fixed inset-0 z-50 flex flex-col bg-[#FAF6F0] text-[#211915]"
        >
          {/* Top bar */}
          <div className="border-b border-[#E5DDD2] bg-[#FFFDF9]">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-[#1D3B2B]">
                  Hands-Free Cooking Mode
                </p>
                <h2
                  id="hands-free-title"
                  className="truncate font-display text-xl font-semibold text-[#211915] sm:text-2xl"
                >
                  {title}
                </h2>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {steps.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setAutoRead((prev) => !prev)}
                    aria-pressed={autoRead}
                    className={`hidden min-h-[46px] items-center gap-2 rounded-xl border px-4 text-[15px] font-semibold whitespace-nowrap transition-colors sm:inline-flex ${
                      autoRead
                        ? 'border-[#1D3B2B] bg-[#EAF2EC] text-[#1D3B2B]'
                        : 'border-[#D4C5B4] bg-white text-[#4F443C]'
                    }`}
                  >
                    {autoRead ? (
                      <Volume2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : (
                      <VolumeX className="h-4 w-4 shrink-0" aria-hidden="true" />
                    )}
                    <span>Auto-read: {autoRead ? 'On' : 'Off'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Exit hands-free cooking mode"
                  className="inline-flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-[#D4C5B4] bg-white px-4 text-[16px] font-semibold text-[#211915] whitespace-nowrap transition-colors hover:border-[#B53D24] hover:text-[#B53D24]"
                >
                  <X className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>Exit</span>
                </button>
              </div>
            </div>

            {/* Step progress bar */}
            {steps.length > 0 && (
              <div className="h-1.5 w-full bg-[#EAE0D3]">
                <div
                  className="h-full bg-[#B53D24] transition-all duration-200"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            )}
          </div>

          {/* Center step reader */}
          <div className="flex flex-1 flex-col justify-center overflow-y-auto px-4 py-8 sm:px-8">
            <div className="mx-auto w-full max-w-3xl">
              {steps.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D6C8B8] bg-[#FFFDF9] p-8 text-center sm:p-12">
                  <p className="font-display text-2xl font-semibold text-[#211915] sm:text-3xl">
                    No steps available yet
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3 text-[16px] font-semibold tabular-nums">
                      <span className="text-[#B53D24]">
                        Step {currentStep.number} of {steps.length}
                      </span>
                      {currentStep.sectionHeading && (
                        <>
                          <span aria-hidden="true" className="text-[#A89A8E]">
                            ·
                          </span>
                          <span className="text-[#1D3B2B]">
                            {currentStep.sectionHeading}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Audio state indicator */}
                    <div className="text-[15px] font-medium text-[#5A4F47]">
                      {isPlaying ? (
                        <span className="inline-flex items-center gap-2 text-[#1D3B2B]">
                          <Volume2 className="h-4 w-4" aria-hidden="true" />
                          Playing Hyun&apos;s voice...
                        </span>
                      ) : (
                        <span>Ready</span>
                      )}
                    </div>
                  </div>

                  {/* Large-print real step text */}
                  <div className="rounded-2xl border border-[#E4DACE] bg-[#FFFDF9] p-6 sm:p-10">
                    <p className="font-display text-[24px] leading-[1.45] font-medium text-[#211915] sm:text-[32px] lg:text-[36px]">
                      {currentStep.text}
                    </p>
                  </div>

                  {/* Mobile auto-read toggle */}
                  <div className="flex justify-center sm:hidden">
                    <button
                      type="button"
                      onClick={() => setAutoRead((prev) => !prev)}
                      aria-pressed={autoRead}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 text-[15px] font-semibold ${
                        autoRead
                          ? 'border-[#1D3B2B] bg-[#EAF2EC] text-[#1D3B2B]'
                          : 'border-[#D4C5B4] bg-white text-[#4F443C]'
                      }`}
                    >
                      {autoRead ? (
                        <Volume2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      ) : (
                        <VolumeX className="h-4 w-4 shrink-0" aria-hidden="true" />
                      )}
                      <span>Auto-read on Next/Back: {autoRead ? 'On' : 'Off'}</span>
                    </button>
                  </div>

                  {audioNotice && (
                    <p
                      role="status"
                      className="text-center text-[15px] text-[#5E524A]"
                    >
                      {audioNotice}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Oversized messy-hand-friendly bottom control dock */}
          {steps.length > 0 && (
            <div className="border-t border-[#E5DDD2] bg-[#FFFDF9] px-4 py-4 sm:px-6 sm:py-5">
              <div className="mx-auto grid max-w-4xl grid-cols-3 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => goToStep(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border-2 border-[#D4C5B4] bg-white px-4 text-[18px] font-semibold text-[#211915] whitespace-nowrap transition-colors hover:border-[#211915] disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-[72px] sm:text-[20px]"
                >
                  <ChevronLeft className="h-6 w-6 shrink-0" aria-hidden="true" />
                  <span>Back</span>
                </button>

                {isPlaying ? (
                  <button
                    type="button"
                    onClick={stopPlayback}
                    className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border-2 border-[#1D3B2B] bg-[#1D3B2B] px-4 text-[18px] font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#152D20] sm:min-h-[72px] sm:text-[20px]"
                  >
                    <Square className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => playStepClip(currentIndex)}
                    className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl border-2 border-[#1D3B2B] bg-[#EAF2EC] px-4 text-[18px] font-semibold text-[#1D3B2B] whitespace-nowrap transition-colors hover:bg-[#1D3B2B] hover:text-white sm:min-h-[72px] sm:text-[20px]"
                  >
                    {playedSteps.includes(currentIndex) ? (
                      <RotateCcw className="h-5 w-5 shrink-0" aria-hidden="true" />
                    ) : (
                      <Volume2 className="h-6 w-6 shrink-0" aria-hidden="true" />
                    )}
                    <span className="hidden sm:inline">
                      {playedSteps.includes(currentIndex) ? 'Repeat Step' : 'Read Aloud'}
                    </span>
                    <span className="sm:hidden">Read</span>
                  </button>
                )}

                {currentIndex < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(currentIndex + 1)}
                    className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl bg-[#B53D24] px-4 text-[18px] font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#99311B] sm:min-h-[72px] sm:text-[20px]"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-6 w-6 shrink-0" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex min-h-[64px] items-center justify-center gap-2 rounded-2xl bg-[#1D3B2B] px-4 text-[18px] font-semibold text-white whitespace-nowrap transition-colors hover:bg-[#152D20] sm:min-h-[72px] sm:text-[20px]"
                  >
                    <span>Done</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
