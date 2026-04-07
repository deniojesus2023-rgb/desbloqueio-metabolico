import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
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

// ─── Componente Principal ─────────────────────────────────────────────────────
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

  // Obter as opções da pergunta atual (com suporte a perguntas dinâmicas)
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

  // Timer de escassez
  useEffect(() => {
    if (phase === "result" || phase === "optin") {
      timerRef.current = setInterval(() => setOptinTimer(s => Math.max(0, s - 1)), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // Loading animado
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

  // Seleção de opção única
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

    // Mostrar feedback por 900ms antes de avançar
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

  // Toggle de opção múltipla
  const handleToggleMulti = (optionId: string) => {
    setMultiSelected(prev =>
      prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]
    );
  };

  // Confirmar seleção múltipla
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
    const salesPath = lang === "pt" ? "/vendas-br" : "/vendas";
    const blockNum = blockType === "cortisol" ? 1 : blockType === "insulina" ? 2 : 3;
    const dest = `${salesPath}?block=${blockNum}&n=${encodeURIComponent(name)}${sessionId ? `&s=${sessionId}` : ""}&lang=${lang}`;
    navigate(dest);
  };

  const progressPercent = phase === "questions"
    ? Math.round(((currentQ) / questions.length) * 100)
    : phase === "optin" ? 95 : phase === "loading" || phase === "result" ? 100 : 0;

  const profile = profiles[blockType];

  // ── Fase Label ────────────────────────────────────────────────────────────────
  const phaseLabel = currentQuestion
    ? t.phaseLabels[currentQuestion.phase as keyof typeof t.phaseLabels] || ""
    : "";

  // ── Indicadores de fase ───────────────────────────────────────────────────────
  const phaseColors: Record<string, string> = {
    positive: "#00BFA5",
    neutral: "#26C6DA",
    negative: "#F59E0B",
    relief: "#6366F1",
  };
  const currentPhaseColor = currentQuestion ? (phaseColors[currentQuestion.phase] || "#00BFA5") : "#00BFA5";

  // ── Header compartilhado ──────────────────────────────────────────────────────
  const Header = ({ showTimer }: { showTimer?: boolean }) => (
    <header className="bg-[#00BFA5] px-4 shadow-sm" style={{ paddingTop: "env(safe-area-inset-top, 12px)", paddingBottom: "12px" }}>
      <div className="flex items-center justify-between max-w-md mx-auto mb-2">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25"/>
            <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white font-bold text-sm">
            {lang === "pt" ? "Desbloqueio Metabólico" : "Desbloqueo Metabólico"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {showTimer && (
            <div className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                <path d="M12 7v5l3 3" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              {formatTimer(optinTimer)}
            </div>
          )}
          {phase === "questions" && (
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              {t.progressLabel(currentQ + 1, questions.length)}
            </span>
          )}
        </div>
      </div>
      {(phase === "questions" || phase === "optin" || phase === "loading" || phase === "result") && (
        <div className="max-w-md mx-auto">
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}/>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/70 text-xs">{progressPercent}% {lang === "pt" ? "concluído" : "completado"}</span>
            {phase === "questions" && (
              <span className="text-white/80 text-xs font-semibold">{phaseLabel}</span>
            )}
          </div>
        </div>
      )}
    </header>
  );

  // ── LANDING ───────────────────────────────────────────────────────────────────
  if (phase === "landing") {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center px-4 pt-5 pb-8 max-w-md mx-auto w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-[#00BFA5]/30 rounded-full px-4 py-2 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00BFA5] animate-pulse"/>
            <span className="text-[#00BFA5] text-xs font-semibold tracking-widest uppercase">{t.startBadge}</span>
          </div>

          {/* Imagem hero */}
          <div className="relative w-full rounded-2xl overflow-hidden mb-5 shadow-md" style={{aspectRatio:"16/9"}}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/hero_quiz-4yyjBHkD2a3bcnpKdnwqZj.webp"
              alt={lang === "pt" ? "Avaliação metabólica" : "Evaluación metabólica"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              {t.startBenefits.map((b) => (
                <span key={b} className="flex items-center gap-1 bg-white/95 text-[#00BFA5] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="#00BFA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[#1A1A2E] text-2xl font-extrabold leading-tight text-left w-full mb-2">
            {lang === "pt" ? (
              <>Descubra qual <span className="text-[#00BFA5]">Bloqueio Metabólico</span> está impedindo você de emagrecer</>
            ) : (
              <>Descubre qué <span className="text-[#00BFA5]">Bloqueo Metabólico</span> te está impidiendo adelgazar</>
            )}
          </h1>
          <p className="text-[#6B7280] text-sm text-left w-full mb-4">{t.startSubtitle}</p>

          {/* Checklist */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 w-full mb-5">
            {[
              lang === "pt" ? "7 perguntas rápidas" : "7 preguntas rápidas",
              lang === "pt" ? "Resultado personalizado" : "Resultado personalizado",
              lang === "pt" ? "100% grátis" : "100% gratis",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-[#374151] text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="#00BFA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {item}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full mb-5">
            {t.startStats.map((s) => (
              <div key={s.value} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-[#00BFA5] text-lg font-extrabold">{s.value}</div>
                <div className="text-[#6B7280] text-xs mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={startSession.isPending}
            className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-[#00BFA5]/30 active:scale-95 transition-transform disabled:opacity-60"
          >
            {startSession.isPending ? (lang === "pt" ? "Iniciando..." : "Iniciando...") : t.startCta}
          </button>
          <p className="text-[#9CA3AF] text-xs mt-3 flex items-center gap-1 justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#9CA3AF" strokeWidth="2"/></svg>
            {t.startTrust}
          </p>
        </div>
      </div>
    );
  }

  // ── QUESTIONS ─────────────────────────────────────────────────────────────────
  if (phase === "questions" && currentQuestion) {
    const isMultiple = currentQuestion.multiple === true;
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
        <Header />
        <div className="flex-1 px-4 pt-5 pb-8 max-w-md mx-auto w-full">
          <div key={currentQ} className="animate-in fade-in slide-in-from-right-3 duration-250">

            {/* Indicador de fase */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: `${currentPhaseColor}20`, color: currentPhaseColor }}
              >
                {phaseLabel}
              </span>
              {isMultiple && (
                <span className="text-xs text-[#6B7280] bg-gray-100 px-2 py-1 rounded-full">
                  {t.multipleHint}
                </span>
              )}
            </div>

            <h2 className="text-[#1A1A2E] text-xl font-extrabold leading-tight mb-2">{currentQuestion.question}</h2>
            {currentQuestion.subtitle && (
              <p className="text-[#6B7280] text-sm mb-4">{currentQuestion.subtitle}</p>
            )}

            {/* Feedback de seleção única */}
            {feedbackText && (
              <div className="flex items-start gap-2 bg-[#E0F7F4] border border-[#00BFA5]/30 rounded-xl px-4 py-3 mb-4 animate-in fade-in duration-200">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 mt-0.5">
                  <circle cx="9" cy="9" r="9" fill="#00BFA5"/>
                  <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[#00796B] text-sm font-medium">{feedbackText}</p>
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
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 ${
                      isSelected
                        ? "border-[#00BFA5] bg-[#E0F7F4] shadow-md scale-[0.98]"
                        : "border-gray-200 bg-white hover:border-[#00BFA5]/50 hover:shadow-sm active:scale-[0.98]"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0 mt-0.5">{opt.emoji}</span>
                    <span className={`flex-1 text-sm font-semibold leading-snug ${isSelected ? "text-[#00796B]" : "text-[#1A1A2E]"}`}>
                      {opt.text}
                    </span>
                    {isSelected && (
                      <svg className="flex-shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" fill="#00BFA5"/>
                        <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Botão de confirmar para múltipla escolha */}
            {isMultiple && (
              <button
                onClick={handleConfirmMulti}
                disabled={multiSelected.length === 0 || animating}
                className="w-full mt-4 bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-[#00BFA5]/30 disabled:opacity-40 active:scale-95 transition-all"
              >
                {t.continueButton}
              </button>
            )}

            <p className="text-center text-[#9CA3AF] text-xs mt-5 flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#9CA3AF" strokeWidth="2"/></svg>
              {lang === "pt" ? "Suas respostas são 100% confidenciais" : "Tus respuestas son 100% confidenciales"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── LOADING ───────────────────────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-sm text-center">
            {/* Spinner duplo */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-[#00BFA5]/20"/>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00BFA5] animate-spin"/>
              <div className="absolute inset-3 rounded-full border-4 border-transparent border-t-[#26C6DA] animate-spin" style={{animationDirection:"reverse", animationDuration:"0.8s"}}/>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#00BFA5] font-extrabold text-lg">{loadingProgress}%</span>
              </div>
            </div>

            <h3 className="text-[#1A1A2E] text-lg font-bold mb-2">
              {lang === "pt" ? "Calculando seu diagnóstico" : "Calculando tu diagnóstico"}
            </h3>
            <p className="text-[#6B7280] text-sm mb-6 min-h-[20px]">{t.loadingTexts[loadingMsgIdx]}</p>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-5">
              <div className="h-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] rounded-full transition-all duration-500" style={{ width: `${loadingProgress}%` }}/>
            </div>

            <div className="text-left space-y-2">
              {t.loadingTexts.map((m, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm transition-all duration-300 ${loadingProgress > (i / t.loadingTexts.length) * 100 ? "text-[#00BFA5]" : "text-gray-300"}`}>
                  {loadingProgress > (i / t.loadingTexts.length) * 100
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#00BFA5"/><path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <div className="w-4 h-4 rounded-full border-2 border-gray-300"/>
                  }
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RESULTADO ─────────────────────────────────────────────────────────────────
  if (phase === "result" && profile) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
        <Header showTimer />
        <div className="flex-1 px-4 pt-5 pb-8 max-w-md mx-auto w-full">

          {/* Badge do tipo */}
          <div
            className="rounded-xl px-4 py-3 mb-4 text-center"
            style={{ backgroundColor: `${profile.color}15`, border: `1px solid ${profile.color}40` }}
          >
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: profile.color }}>
              {profile.badge}
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-[#1A1A2E] text-xl font-extrabold leading-tight mb-3">
            {lang === "pt"
              ? `Seu metabolismo está travado pelo mecanismo de ${profile.mechanism}`
              : `Tu metabolismo está bloqueado por el mecanismo de ${profile.mechanism}`}
          </h2>

          {/* Absolvição */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <p className="text-[#374151] text-sm leading-relaxed">{profile.absolution}</p>
          </div>

          {/* Insights personalizados */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <p className="text-[#374151] text-xs font-bold mb-3 uppercase tracking-wide">
              {t.resultInsightsTitle}
            </p>
            <div className="space-y-2">
              {profile.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" fill="#00BFA5"/>
                    <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-[#374151] text-sm">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Barra de bloqueio */}
          <div className="bg-white rounded-2xl p-4 mb-5 shadow-sm border border-gray-100">
            <div className="flex justify-between text-xs text-[#6B7280] mb-2">
              <span>{t.resultBlockLabel}</span>
              <span className="font-bold" style={{ color: profile.color }}>{profile.blockPercentage}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${profile.blockPercentage}%`,
                  background: `linear-gradient(to right, #F59E0B, ${profile.color})`,
                }}
              />
            </div>
            <p className="text-[#6B7280] text-xs mt-2">
              {lang === "pt"
                ? "Quanto mais alto o bloqueio, mais difícil emagrecer sem tratar a causa raiz"
                : "Cuanto más alto el bloqueo, más difícil adelgazar sin tratar la causa raíz"}
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setPhase("optin")}
            className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-[#00BFA5]/30 active:scale-95 transition-transform mb-3"
          >
            {lang === "pt" ? "Quero meu protocolo personalizado →" : "Quiero mi protocolo personalizado →"}
          </button>
          <p className="text-center text-[#9CA3AF] text-xs">
            {lang === "pt" ? "Protocolo específico para o seu tipo de bloqueio" : "Protocolo específico para tu tipo de bloqueo"}
          </p>
        </div>
      </div>
    );
  }

  // ── OPT-IN ────────────────────────────────────────────────────────────────────
  if (phase === "optin" && profile) {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
        <Header showTimer />
        <div className="flex-1 px-4 pt-5 pb-8 max-w-md mx-auto w-full">

          <div
            className="rounded-xl px-4 py-2 mb-4 text-center"
            style={{ backgroundColor: `${profile.color}15`, border: `1px solid ${profile.color}40` }}
          >
            <span className="text-xs font-bold" style={{ color: profile.color }}>{profile.badge}</span>
          </div>

          <h2 className="text-[#1A1A2E] text-xl font-extrabold leading-tight mb-2">{t.optinTitle}</h2>
          <p className="text-[#6B7280] text-sm mb-5">{t.optinSubtitle}</p>

          <form onSubmit={handleOptIn} className="space-y-4">
            <div>
              <label className="block text-[#374151] text-sm font-semibold mb-1.5">
                {lang === "pt" ? "Seu primeiro nome" : "Tu primer nombre"}
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.optinNamePlaceholder}
                required
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A2E] text-sm placeholder-gray-400 focus:outline-none focus:border-[#00BFA5] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#374151] text-sm font-semibold mb-1.5">
                {lang === "pt" ? "Seu melhor e-mail" : "Tu mejor e-mail"}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.optinEmailPlaceholder}
                required
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A2E] text-sm placeholder-gray-400 focus:outline-none focus:border-[#00BFA5] transition-colors"
              />
            </div>

            {/* O que vão receber */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-[#374151] text-xs font-bold mb-2 uppercase tracking-wide">
                {lang === "pt" ? "Você vai receber:" : "Vas a recibir:"}
              </p>
              {[
                lang === "pt"
                  ? `✅ Protocolo específico para ${profile.name}`
                  : `✅ Protocolo específico para ${profile.name}`,
                lang === "pt" ? "✅ Mapa de alimentos desbloqueadores" : "✅ Mapa de alimentos desbloqueadores",
                lang === "pt" ? "✅ Guia de emergência para o antojo noturno" : "✅ Guía de emergencia para el antojo nocturno",
                lang === "pt" ? "✅ Acesso ao grupo privado de suporte" : "✅ Acceso al grupo privado de soporte",
              ].map((item) => (
                <p key={item} className="text-[#374151] text-sm py-1">{item}</p>
              ))}
            </div>

            <button
              type="submit"
              disabled={completeQuiz.isPending || !name || !email}
              className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-[#00BFA5]/30 disabled:opacity-60 active:scale-95 transition-all"
            >
              {completeQuiz.isPending
                ? (lang === "pt" ? "Preparando..." : "Preparando...")
                : t.optinCta}
            </button>

            <p className="text-center text-[#9CA3AF] text-xs flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#9CA3AF" strokeWidth="2"/></svg>
              {t.optinTrust}
            </p>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
