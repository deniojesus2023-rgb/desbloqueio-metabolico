import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { pixelLead } from "@/lib/pixel";
import {
  quizQuestionsPT,
  quizQuestionsES,
  blockProfilesPT,
  blockProfilesES,
  uiTextsPT,
  uiTextsES,
  calculateBlockType,
  type Language,
} from "@/quizData";

type Phase = "landing" | "questions" | "loading" | "result" | "optin";

function detectLang(): Language {
  const params = new URLSearchParams(window.location.search);
  const p = params.get("lang");
  if (p === "pt" || p === "es") return p;
  const nav = navigator.language || "";
  return nav.toLowerCase().startsWith("pt") ? "pt" : "es";
}

export default function Quiz() {
  const [, navigate] = useLocation();
  const [lang] = useState<Language>(() => detectLang());
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [multiSelected, setMultiSelected] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [blockType, setBlockType] = useState<"cortisol" | "insulina" | "hormonal">("insulina");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [optinTimer, setOptinTimer] = useState(900);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions = lang === "pt" ? quizQuestionsPT : quizQuestionsES;
  const t = lang === "pt" ? uiTextsPT : uiTextsES;
  const profiles = lang === "pt" ? blockProfilesPT : blockProfilesES;

  const startSession = trpc.quiz.startSession.useMutation();
  const saveAnswer = trpc.quiz.saveAnswer.useMutation();
  const completeQuiz = trpc.quiz.completeQuiz.useMutation();

  const currentQuestion = questions[currentQ];
  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
    if (currentQuestion.dynamicByAnswer) {
      const { questionId, variants, defaultOptions } = currentQuestion.dynamicByAnswer;
      const prevAnswer = answers[questionId];
      if (typeof prevAnswer === "string" && variants[prevAnswer]) {
        return variants[prevAnswer];
      }
      return defaultOptions;
    }
    return currentQuestion.options;
  }, [currentQuestion, answers]);

  useEffect(() => {
    if (phase === "result" || phase === "optin") {
      timerRef.current = setInterval(() => setOptinTimer(s => Math.max(0, s - 1)), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  useEffect(() => {
    if (phase !== "loading") return;
    setLoadingProgress(0);
    setLoadingMsgIdx(0);
    const loadingTexts = t.loadingTexts;
    const targets = [18, 38, 60, 82, 100];
    const delays = [600, 800, 700, 600, 900];
    let i = 0;
    const run = () => {
      if (i >= targets.length) {
        setTimeout(() => setPhase("result"), 500);
        return;
      }
      setTimeout(() => {
        setLoadingProgress(targets[i]);
        setLoadingMsgIdx(Math.min(i, loadingTexts.length - 1));
        i++;
        run();
      }, delays[i] || 700);
    };
    run();
  }, [phase]);

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleStart = async () => {
    const params = new URLSearchParams(window.location.search);
    const result = await startSession.mutateAsync({
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
    });
    setSessionId(result.sessionId);
    setPhase("questions");
  };

  const handleSelectOption = async (optionId: string) => {
    if (animating || currentQuestion.multiple) return;
    const opt = currentOptions.find(o => o.id === optionId);
    if (!opt) return;
    setSelectedOption(optionId);
    setAnimating(true);
    const newAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(newAnswers);
    if (sessionId) {
      await saveAnswer.mutateAsync({
        sessionId,
        questionIndex: currentQ,
        questionText: currentQuestion.question,
        answerIndex: currentOptions.indexOf(opt),
        answerText: opt.text,
      });
    }
    const feedbacks: Record<Language, Record<string, string>> = {
      pt: {
        a: "Entendemos. Isso vai ajudar a personalizar seu diagnóstico.",
        b: "Perfeito. Cada detalhe importa para identificar seu bloqueio.",
        c: "Obrigada pela honestidade. Isso é exatamente o que precisamos.",
        d: "Anotado. Continuando sua avaliação...",
        e: "Importante. Isso revela muito sobre seu perfil metabólico.",
        f: "Entendido. Isso confirma um padrão importante.",
      },
      es: {
        a: "Entendemos. Esto ayudará a personalizar tu diagnóstico.",
        b: "Perfecto. Cada detalle importa para identificar tu bloqueo.",
        c: "Gracias por la honestidad. Eso es exactamente lo que necesitamos.",
        d: "Anotado. Continuando tu evaluación...",
        e: "Importante. Esto revela mucho sobre tu perfil metabólico.",
        f: "Entendido. Esto confirma un patrón importante.",
      },
    };
    setFeedbackText(feedbacks[lang][optionId] || feedbacks[lang]["a"]);
    setTimeout(() => {
      setFeedbackText(null);
      setSelectedOption(null);
      setAnimating(false);
      advanceQuestion(newAnswers);
    }, 900);
  };

  const handleToggleMulti = (optionId: string) => {
    setMultiSelected(prev =>
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    );
  };

  const handleConfirmMulti = async () => {
    if (multiSelected.length === 0 || animating) return;
    setAnimating(true);
    const newAnswers = { ...answers, [currentQuestion.id]: multiSelected };
    setAnswers(newAnswers);
    if (sessionId) {
      await saveAnswer.mutateAsync({
        sessionId,
        questionIndex: currentQ,
        questionText: currentQuestion.question,
        answerIndex: 0,
        answerText: multiSelected.join(", "),
      });
    }
    setMultiSelected([]);
    setAnimating(false);
    advanceQuestion(newAnswers);
  };

  const advanceQuestion = (currentAnswers: Record<string, string | string[]>) => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1);
    } else {
      const block = calculateBlockType(currentAnswers);
      setBlockType(block);
      setPhase("loading");
    }
  };

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    if (sessionId) {
      await completeQuiz.mutateAsync({ sessionId, name, email });
    }
    // Meta Pixel — Lead após opt-in no quiz
    pixelLead();
    const salesPath = lang === "pt" ? "/vendas-br" : "/vendas";
    const blockNum = blockType === "cortisol" ? 1 : blockType === "insulina" ? 2 : 3;
    const dest = `${salesPath}?block=${blockNum}&n=${encodeURIComponent(name)}${sessionId ? `&s=${sessionId}` : ""}&lang=${lang}`;
    navigate(dest);
  };

  const progressPercent = phase === "questions"
    ? Math.round(((currentQ) / questions.length) * 100)
    : phase === "optin" ? 95 : phase === "loading" || phase === "result" ? 100 : 0;

  const profile = profiles[blockType];

  const phaseLabel = currentQuestion
    ? t.phaseLabels[currentQuestion.phase as keyof typeof t.phaseLabels] || ""
    : "";

  const phaseColors: Record<string, string> = {
    positive: "#2BAE8E",
    neutral: "#3EC9A7",
    negative: "#F59E0B",
    relief: "#6366F1",
  };
  const currentPhaseColor = currentQuestion ? (phaseColors[currentQuestion.phase] || "#2BAE8E") : "#2BAE8E";

  // ── Ícone checkmark SVG reutilizável ─────────────────────────────────────────
  const Check = ({ size = 16, color = "white" }: { size?: number; color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12l5 5L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  // ── Header compartilhado ──────────────────────────────────────────────────────
  const Header = ({ showTimer }: { showTimer?: boolean }) => (
    <header className="dm-header" style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}>
      <div className="flex items-center justify-between max-w-md mx-auto px-5 py-3.5">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25"/>
              <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-extrabold text-[15px] leading-tight tracking-tight" style={{ letterSpacing: "-0.025em" }}>
              {lang === "pt" ? "Desbloqueio Metabólico" : "Desbloqueo Metabólico"}
            </span>
            <span className="text-white/60 text-[10px] font-medium leading-none mt-0.5" style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {lang === "pt" ? "Diagnóstico Personalizado" : "Diagnóstico Personalizado"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {showTimer && (
            <div className="flex items-center gap-1.5 bg-red-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {formatTimer(optinTimer)}
            </div>
          )}
          {phase === "questions" && (
            <span className="text-white/80 text-[11px] font-semibold">
              {t.progressLabel(currentQ + 1, questions.length)}
            </span>
          )}
        </div>
      </div>
      {(phase === "questions" || phase === "optin" || phase === "loading" || phase === "result") && (
        <div className="max-w-md mx-auto px-5 pb-3">
          <div className="dm-progress-track">
            <div className="dm-progress-fill" style={{ width: `${progressPercent}%` }}/>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-white/60 text-[11px] font-medium">{progressPercent}% {lang === "pt" ? "concluído" : "completado"}</span>
            {phase === "questions" && (
              <span className="text-white/80 text-[11px] font-semibold">{phaseLabel}</span>
            )}
          </div>
        </div>
      )}
    </header>
  );

  // ══════════════════════════════════════════════════════════════════════════════
  // LANDING
  // ══════════════════════════════════════════════════════════════════════════════
  if (phase === "landing") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--teal-bg)" }}>
        <Header />
        <div className="flex-1 flex flex-col items-center px-5 pt-6 pb-10 max-w-md mx-auto w-full">

          {/* Pill badge */}
          <div className="dm-pill mb-5">
            <span className="dm-pill-dot"/>
            <span>{t.startBadge}</span>
          </div>

          {/* Hero card gradiente */}
          <div className="w-full rounded-[20px] overflow-hidden mb-6 p-6" style={{ background: "var(--grad)", boxShadow: "var(--shadow-lg)" }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25"/>
                  <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-extrabold text-[15px] leading-tight" style={{ letterSpacing: "-0.02em" }}>
                  {lang === "pt" ? "Diagnóstico Metabólico" : "Diagnóstico Metabólico"}
                </p>
                <p className="text-white/70 text-[11px] font-medium mt-0.5">
                  {lang === "pt" ? "Avaliação gratuita e personalizada" : "Evaluación gratuita y personalizada"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {t.startBenefits.map((b) => (
                <span key={b} className="dm-tag-dark">
                  <Check size={12} />
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[26px] font-extrabold leading-[1.25] text-left w-full mb-3" style={{ color: "var(--dm-text)", letterSpacing: "-0.025em" }}>
            {lang === "pt" ? (
              <>Descubra qual <span style={{ color: "var(--teal-dark)" }}>Bloqueio Metabólico</span> está impedindo você de emagrecer</>
            ) : (
              <>Descubre qué <span style={{ color: "var(--teal-dark)" }}>Bloqueo Metabólico</span> te está impidiendo adelgazar</>
            )}
          </h1>
          <p className="text-[15px] text-left w-full mb-5" style={{ color: "var(--dm-text-soft)", lineHeight: 1.75 }}>{t.startSubtitle}</p>

          {/* Tags de benefícios */}
          <div className="flex flex-wrap gap-2 w-full mb-6">
            {[
              lang === "pt" ? "7 perguntas rápidas" : "7 preguntas rápidas",
              lang === "pt" ? "Resultado personalizado" : "Resultado personalizado",
              lang === "pt" ? "100% grátis" : "100% gratis",
            ].map((item) => (
              <span key={item} className="dm-tag">
                <Check size={13} color="#1A8A6E" />
                {item}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full mb-7">
            {t.startStats.map((s) => (
              <div key={s.value} className="dm-stat">
                <div className="dm-stat-num">{s.value}</div>
                <div className="dm-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={startSession.isPending}
            className="dm-btn-primary"
          >
            {startSession.isPending ? (lang === "pt" ? "Iniciando..." : "Iniciando...") : t.startCta}
          </button>
          <p className="text-[11px] mt-4 flex items-center gap-1.5 justify-center" style={{ color: "var(--dm-grey-300)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/></svg>
            {t.startTrust}
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // QUESTIONS
  // ══════════════════════════════════════════════════════════════════════════════
  if (phase === "questions" && currentQuestion) {
    const isMultiple = currentQuestion.multiple === true;
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--teal-bg)" }}>
        <Header />
        <div className="flex-1 px-5 pt-6 pb-10 max-w-md mx-auto w-full">
          <div key={currentQ} className="animate-in fade-in slide-in-from-right-3 duration-250">

            {/* Indicador de fase */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-[11px] font-bold px-3 py-1.5 rounded-full"
                style={{ backgroundColor: `${currentPhaseColor}18`, color: currentPhaseColor }}
              >
                {phaseLabel}
              </span>
              {isMultiple && (
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: "var(--dm-grey-100)", color: "var(--dm-text-soft)" }}>
                  {t.multipleHint}
                </span>
              )}
            </div>

            <h2 className="text-[22px] font-extrabold leading-[1.3] mb-2" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>{currentQuestion.question}</h2>
            {currentQuestion.subtitle && (
              <p className="text-[15px] mb-5" style={{ color: "var(--dm-text-soft)", lineHeight: 1.75 }}>{currentQuestion.subtitle}</p>
            )}

            {/* Feedback */}
            {feedbackText && (
              <div className="dm-feedback mb-4 animate-in fade-in duration-200">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5">
                  <circle cx="9" cy="9" r="9" fill="#2BAE8E"/>
                  <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[13px] font-medium" style={{ color: "var(--teal-dark)" }}>{feedbackText}</p>
              </div>
            )}

            {/* Opções */}
            <div className="flex flex-col gap-3">
              {currentOptions.map((opt) => {
                const isSelected = isMultiple
                  ? multiSelected.includes(opt.id)
                  : selectedOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => isMultiple ? handleToggleMulti(opt.id) : handleSelectOption(opt.id)}
                    disabled={animating && !isMultiple}
                    className={`dm-option ${isSelected ? "dm-option--selected" : ""}`}
                  >
                    <span className="text-xl flex-shrink-0">{opt.emoji}</span>
                    <span className="flex-1 text-[14px] font-semibold leading-snug" style={{ color: isSelected ? "var(--teal-dark)" : "var(--dm-text)" }}>
                      {opt.text}
                    </span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal)" }}>
                        <Check size={12} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {isMultiple && (
              <button
                onClick={handleConfirmMulti}
                disabled={multiSelected.length === 0 || animating}
                className="dm-btn-primary mt-5"
              >
                {t.continueButton}
              </button>
            )}

            <p className="text-center text-[11px] mt-6 flex items-center justify-center gap-1.5" style={{ color: "var(--dm-grey-300)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/></svg>
              {lang === "pt" ? "Suas respostas são 100% confidenciais" : "Tus respuestas son 100% confidenciales"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // LOADING
  // ══════════════════════════════════════════════════════════════════════════════
  if (phase === "loading") {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--teal-bg)" }}>
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-5">
          <div className="w-full max-w-sm text-center">
            {/* Spinner */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full" style={{ border: "4px solid rgba(43,174,143,.15)" }}/>
              <div className="absolute inset-0 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "var(--teal-dark)" }}/>
              <div className="absolute inset-3 rounded-full border-4 border-transparent animate-spin" style={{ borderTopColor: "var(--teal-mid)", animationDirection: "reverse", animationDuration: "0.8s" }}/>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-extrabold" style={{ color: "var(--teal-dark)" }}>{loadingProgress}%</span>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-2" style={{ color: "var(--dm-text)" }}>
              {lang === "pt" ? "Calculando seu diagnóstico" : "Calculando tu diagnóstico"}
            </h3>
            <p className="text-[14px] mb-7 min-h-[20px]" style={{ color: "var(--dm-text-soft)" }}>{t.loadingTexts[loadingMsgIdx]}</p>

            <div className="h-3 rounded-full overflow-hidden mb-6" style={{ background: "var(--dm-grey-100)" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${loadingProgress}%`, background: "var(--grad)" }}/>
            </div>

            <div className="text-left space-y-3">
              {t.loadingTexts.map((m, i) => (
                <div key={i} className={`flex items-center gap-3 text-[13px] transition-all duration-300`} style={{ color: loadingProgress > (i / t.loadingTexts.length) * 100 ? "var(--teal-dark)" : "var(--dm-grey-300)" }}>
                  {loadingProgress > (i / t.loadingTexts.length) * 100
                    ? <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal)" }}><Check size={12}/></div>
                    : <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ border: "2px solid var(--dm-grey-300)" }}/>
                  }
                  <span className="font-medium">{m}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // RESULTADO
  // ══════════════════════════════════════════════════════════════════════════════
  if (phase === "result" && profile) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--teal-bg)" }}>
        <Header showTimer />
        <div className="flex-1 px-5 pt-6 pb-10 max-w-md mx-auto w-full">

          {/* Badge do tipo */}
          <div
            className="rounded-2xl px-5 py-3.5 mb-5 text-center"
            style={{ backgroundColor: `${profile.color}12`, border: `1.5px solid ${profile.color}35` }}
          >
            <span className="text-[11px] font-bold tracking-widest uppercase" style={{ color: profile.color, letterSpacing: "0.15em" }}>
              {profile.badge}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-[22px] font-extrabold leading-[1.25] mb-4" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
            {lang === "pt"
              ? `Seu metabolismo está travado pelo mecanismo de ${profile.mechanism}`
              : `Tu metabolismo está bloqueado por el mecanismo de ${profile.mechanism}`}
          </h2>

          {/* Absolvição */}
          <div className="dm-card mb-5">
            <p className="text-[15px] leading-[1.75]" style={{ color: "var(--dm-text-soft)" }}>{profile.absolution}</p>
          </div>

          {/* Insights */}
          <div className="dm-card mb-5">
            <p className="text-[10px] font-bold mb-4 uppercase" style={{ color: "var(--dm-text-soft)", letterSpacing: "0.2em" }}>
              {t.resultInsightsTitle}
            </p>
            <div className="space-y-3">
              {profile.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--teal)" }}>
                    <Check size={12} />
                  </div>
                  <p className="text-[14px] leading-[1.65]" style={{ color: "var(--dm-text-soft)" }}>{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Barra de bloqueio */}
          <div className="dm-card mb-7">
            <div className="flex justify-between text-[11px] mb-2" style={{ color: "var(--dm-text-soft)" }}>
              <span className="font-medium">{t.resultBlockLabel}</span>
              <span className="font-bold" style={{ color: profile.color }}>{profile.blockPercentage}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--dm-grey-100)" }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${profile.blockPercentage}%`,
                  background: `linear-gradient(to right, #F59E0B, ${profile.color})`,
                }}
              />
            </div>
            <p className="text-[11px] mt-2.5" style={{ color: "var(--dm-text-soft)" }}>
              {lang === "pt"
                ? "Quanto mais alto o bloqueio, mais difícil emagrecer sem tratar a causa raiz"
                : "Cuanto más alto el bloqueo, más difícil adelgazar sin tratar la causa raíz"}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setPhase("optin")}
            className="dm-btn-primary mb-3"
          >
            {lang === "pt" ? "Quero meu protocolo personalizado →" : "Quiero mi protocolo personalizado →"}
          </button>
          <p className="text-center text-[11px]" style={{ color: "var(--dm-grey-300)" }}>
            {lang === "pt" ? "Protocolo específico para o seu tipo de bloqueio" : "Protocolo específico para tu tipo de bloqueo"}
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // OPT-IN
  // ══════════════════════════════════════════════════════════════════════════════
  if (phase === "optin" && profile) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "var(--teal-bg)" }}>
        <Header showTimer />
        <div className="flex-1 px-5 pt-6 pb-10 max-w-md mx-auto w-full">

          <div
            className="rounded-2xl px-4 py-2.5 mb-5 text-center"
            style={{ backgroundColor: `${profile.color}12`, border: `1.5px solid ${profile.color}35` }}
          >
            <span className="text-[11px] font-bold" style={{ color: profile.color, letterSpacing: "0.15em", textTransform: "uppercase" }}>{profile.badge}</span>
          </div>

          <h2 className="text-[22px] font-extrabold leading-[1.25] mb-2" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>{t.optinTitle}</h2>
          <p className="text-[15px] mb-6" style={{ color: "var(--dm-text-soft)", lineHeight: 1.75 }}>{t.optinSubtitle}</p>

          <form onSubmit={handleOptIn} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold mb-2" style={{ color: "var(--dm-text)" }}>
                {lang === "pt" ? "Seu primeiro nome" : "Tu primer nombre"}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.optinNamePlaceholder}
                required
                className="dm-input"
              />
            </div>
            <div>
              <label className="block text-[13px] font-bold mb-2" style={{ color: "var(--dm-text)" }}>
                {lang === "pt" ? "Seu melhor e-mail" : "Tu mejor e-mail"}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.optinEmailPlaceholder}
                required
                className="dm-input"
              />
            </div>

            {/* O que vão receber */}
            <div className="dm-card">
              <p className="text-[10px] font-bold mb-3 uppercase" style={{ color: "var(--dm-text-soft)", letterSpacing: "0.2em" }}>
                {lang === "pt" ? "Você vai receber:" : "Vas a recibir:"}
              </p>
              {[
                lang === "pt"
                  ? `Protocolo específico para ${profile.name}`
                  : `Protocolo específico para ${profile.name}`,
                lang === "pt" ? "Mapa de alimentos desbloqueadores" : "Mapa de alimentos desbloqueadores",
                lang === "pt" ? "Guia de emergência para o antojo noturno" : "Guía de emergencia para el antojo nocturno",
                lang === "pt" ? "Acesso ao grupo privado de suporte" : "Acceso al grupo privado de soporte",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 py-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal)" }}>
                    <Check size={12} />
                  </div>
                  <span className="text-[14px] font-medium" style={{ color: "var(--dm-text)" }}>{item}</span>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={completeQuiz.isPending || !name || !email}
              className="dm-btn-primary"
            >
              {completeQuiz.isPending
                ? (lang === "pt" ? "Preparando..." : "Preparando...")
                : t.optinCta}
            </button>

            <p className="text-center text-[11px] flex items-center justify-center gap-1.5" style={{ color: "var(--dm-grey-300)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2"/></svg>
              {t.optinTrust}
            </p>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
