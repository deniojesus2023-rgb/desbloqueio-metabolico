import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  QUIZ_QUESTIONS,
  QUIZ_QUESTIONS_PT,
  calculateBlockTypeForLang,
  PROGRESS_LABELS,
  PROGRESS_LABELS_PT,
} from "@/quizData";

type Phase = "landing" | "questions" | "optin" | "loading" | "done";
type Lang = "pt" | "es";

function detectLang(): Lang {
  const params = new URLSearchParams(window.location.search);
  const langParam = params.get("lang");
  if (langParam === "pt" || langParam === "es") return langParam;
  const nav = navigator.language || (navigator as any).userLanguage || "";
  if (nav.toLowerCase().startsWith("pt")) return "pt";
  return "es";
}

// Ícones por letra de opção
const OPTION_ICONS = ["🎯", "⚡", "✨", "💪", "🌿", "🔥"];

export default function Quiz() {
  const [lang] = useState<Lang>(() => detectLang());
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ questionIndex: number; questionText: string; answerIndex: number; answerText: string }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [slideDir, setSlideDir] = useState<"right" | "left">("right");
  const [, navigate] = useLocation();

  const questions = lang === "pt" ? QUIZ_QUESTIONS_PT : QUIZ_QUESTIONS;
  const progressLabels = lang === "pt" ? PROGRESS_LABELS_PT : PROGRESS_LABELS;

  const startSession = trpc.quiz.startSession.useMutation();
  const saveAnswer = trpc.quiz.saveAnswer.useMutation();
  const completeQuiz = trpc.quiz.completeQuiz.useMutation();

  const t = useMemo(() => {
    if (lang === "pt") {
      return {
        badge: "Avaliação Metabólica Gratuita",
        headline: <>Descubra qual dos 3{" "}<span className="text-amber-400">"Bloqueios Metabólicos Silenciosos"</span>{" "}está impedindo você de perder a gordura abdominal</>,
        sub: "Mesmo que você coma pouco e faça exercício.",
        meta: "10 perguntas rápidas · Resultado personalizado · 100% grátis · Menos de 2 minutos",
        stat1: "Perfis analisados",
        stat2: "Identificam seu bloqueio",
        stat3: "Para completar",
        bullet1: "Sem dietas restritivas",
        bullet2: "Sem passar fome",
        bullet3: "Só 3 minutos por dia",
        startBtn: "Iniciar Avaliação Gratuita →",
        starting: "Iniciando...",
        privacy: "🔒 Seus dados estão seguros. Sem spam, nunca.",
        keyQuestion: "Essa é a pergunta mais importante da avaliação.",
        optinTitle: "Análise concluída!",
        optinSub: "Identificamos seu Bloqueio Metabólico principal. Insira seus dados para receber seu diagnóstico personalizado e a solução exata para o seu perfil.",
        nameLabel: "Seu nome",
        namePlaceholder: "Como você se chama?",
        emailLabel: "Seu e-mail",
        emailPlaceholder: "email@exemplo.com",
        submitBtn: "Ver meu diagnóstico personalizado →",
        submitting: "Processando...",
        salesPath: "/vendas-br",
        confidential: "Suas respostas são 100% confidenciais",
        question: "Pergunta",
        of: "de",
      };
    }
    return {
      badge: "Evaluación Metabólica Gratuita",
      headline: <>Descubre cuál de los 3{" "}<span className="text-amber-400">"Bloqueos Metabólicos Silenciosos"</span>{" "}está impidiendo que pierdas la grasa abdominal</>,
      sub: "Incluso si comes poco y haces ejercicio.",
      meta: "10 preguntas rápidas · Resultado personalizado · 100% gratis · Menos de 2 minutos",
      stat1: "Perfiles analizados",
      stat2: "Identifican su bloqueo",
      stat3: "Para completar",
      bullet1: "Sin dietas restrictivas",
      bullet2: "Sin pasar hambre",
      bullet3: "Solo 3 minutos al día",
      startBtn: "Iniciar Evaluación Gratuita →",
      starting: "Iniciando...",
      privacy: "🔒 Tus datos están seguros. No spam, nunca.",
      keyQuestion: "Esta es la pregunta más importante de la evaluación.",
      optinTitle: "¡Análisis completado!",
      optinSub: "Identificamos tu Bloqueo Metabólico principal. Ingresa tus datos para recibir tu diagnóstico personalizado y la solución exacta para tu perfil.",
      nameLabel: "Tu nombre",
      namePlaceholder: "¿Cómo te llamas?",
      emailLabel: "Tu correo electrónico",
      emailPlaceholder: "correo@ejemplo.com",
      submitBtn: "Ver mi diagnóstico personalizado →",
      submitting: "Procesando...",
      salesPath: "/vendas",
      confidential: "Tus respuestas son 100% confidenciales",
      question: "Pregunta",
      of: "de",
    };
  }, [lang]);

  const getLoadingSteps = () => {
    const stressAnswer = answers.find(a => a.questionIndex === 4);
    const frustrationAnswer = answers.find(a => a.questionIndex === 2);
    const regionAnswer = answers.find(a => a.questionIndex === 1);

    if (lang === "pt") {
      return [
        "Analisando suas respostas...",
        stressAnswer && stressAnswer.answerIndex <= 1
          ? "Detectando níveis elevados de cortisol..."
          : "Avaliando seu perfil hormonal...",
        frustrationAnswer
          ? `Identificando seu padrão: "${frustrationAnswer.answerText.slice(0, 35)}..."`
          : "Identificando seu padrão metabólico...",
        regionAnswer
          ? `Cruzando com 45.000 perfis de mulheres ${regionAnswer.answerText.replace(/[^\w\s]/g, "").trim()}...`
          : "Cruzando com 45.000 perfis metabólicos...",
        "Determinando seu Bloqueio Metabólico principal...",
        "Ajustando o Protocolo de Desbloqueio para o seu perfil...",
        "Seu diagnóstico está pronto! 🎯",
      ];
    }
    return [
      "Analizando tus respuestas...",
      stressAnswer && stressAnswer.answerIndex <= 1
        ? "Detectando niveles elevados de cortisol..."
        : "Evaluando tu perfil hormonal...",
      frustrationAnswer
        ? `Identificando tu patrón: "${frustrationAnswer.answerText.slice(0, 35)}..."`
        : "Identificando tu patrón metabólico...",
      regionAnswer
        ? `Cruzando con 45.000 perfiles de ${regionAnswer.answerText.replace(/[^\w\s]/g, "").trim()}...`
        : "Cruzando con 45.000 perfiles metabólicos...",
      "Determinando tu Bloqueo Metabólico principal...",
      "Ajustando el Protocolo de Desbloqueo para tu perfil...",
      "¡Tu diagnóstico está listo! 🎯",
    ];
  };

  useEffect(() => {
    if (phase === "loading") {
      const steps = getLoadingSteps();
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setLoadingStep(step);
        if (step >= steps.length - 1) {
          clearInterval(interval);
          const blockType = calculateBlockTypeForLang(answers, lang);
          const nameParam = encodeURIComponent(name);
          const langParam = `&lang=${lang}`;
          setTimeout(() => navigate(`${t.salesPath}?block=${blockType}&n=${nameParam}${sessionId ? `&s=${sessionId}` : ""}${langParam}`), 1200);
        }
      }, 950);
      return () => clearInterval(interval);
    }
  }, [phase]);

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

  const handleSelectOption = async (optionIndex: number) => {
    if (animating) return;
    const option = questions[currentQ].options[optionIndex];
    if (!option) return;

    setSelectedOption(optionIndex);
    setFeedbackText(option.feedback);
    setAnimating(true);

    const answer = {
      questionIndex: currentQ,
      questionText: questions[currentQ].question,
      answerIndex: optionIndex,
      answerText: option.text,
    };

    if (sessionId) {
      await saveAnswer.mutateAsync({ sessionId, ...answer });
    }

    setAnswers(prev => [...prev, answer]);

    setTimeout(() => {
      setFeedbackText(null);
      setSelectedOption(null);
      setAnimating(false);
      setSlideDir("right");
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        setPhase("optin");
      }
    }, 1200);
  };

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    if (sessionId) {
      await completeQuiz.mutateAsync({ sessionId, name, email });
    }
    setPhase("loading");
  };

  const progress = phase === "questions"
    ? Math.round(((currentQ) / questions.length) * 100)
    : phase === "optin" ? 95 : phase === "loading" ? 100 : 0;

  const progressPercent = phase === "questions"
    ? Math.round(((currentQ + 1) / questions.length) * 100)
    : phase === "optin" ? 95 : 0;

  const loadingSteps = getLoadingSteps();

  return (
    <div className="min-h-screen quiz-bg font-sans">

      {/* ===== HEADER ===== */}
      <header className="quiz-header sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
            alt="Desbloqueio Metabólico"
            className="h-8 object-contain brightness-0 invert"
          />
          {phase === "questions" && (
            <div className="flex items-center gap-2">
              <span className="quiz-step-badge">
                {t.question} {currentQ + 1} {t.of} {questions.length}
              </span>
            </div>
          )}
        </div>

        {/* Barra de progresso */}
        {(phase === "questions" || phase === "optin") && (
          <div className="px-4 pb-3 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-emerald-300 font-medium">
                {phase === "questions"
                  ? (questions[currentQ].progressLabel || (lang === "pt" ? "Você está no caminho certo..." : "Vas por buen camino..."))
                  : (lang === "pt" ? "Quase lá! Só mais um passo..." : "¡Casi listo! Solo un paso más...")
                }
              </p>
              <span className="text-xs font-bold text-amber-400">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full quiz-progress-bar rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ===== LANDING ===== */}
      {phase === "landing" && (
        <div className="max-w-2xl mx-auto px-4 py-10">

          {/* Badge */}
          <div className="text-center mb-6">
            <span className="quiz-badge">
              <span className="quiz-badge-dot" />
              {t.badge}
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight">
              {t.headline}
            </h1>
            <p className="text-lg text-emerald-200 mb-2 font-medium">{t.sub}</p>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-3">
              {t.meta.split(" · ").map((item, i) => (
                <span key={i} className="text-xs text-white/60 flex items-center gap-1">
                  <span className="text-amber-400">·</span> {item}
                </span>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="relative rounded-2xl overflow-hidden mb-6 shadow-2xl ring-1 ring-white/10">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/hero_quiz-4yyjBHkD2a3bcnpKdnwqZj.webp"
              alt="Mulher descobrindo a solução metabólica"
              className="w-full h-56 md:h-72 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex flex-wrap gap-3 text-white text-sm font-semibold">
                {[t.bullet1, t.bullet2, t.bullet3].map((b, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-emerald-400 text-base">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { num: "45.000+", label: t.stat1, icon: "👥" },
              { num: "87%", label: t.stat2, icon: "🎯" },
              { num: "< 2 min", label: t.stat3, icon: "⚡" },
            ].map((stat) => (
              <div key={stat.num} className="quiz-stat-card">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-xl font-extrabold text-amber-400">{stat.num}</div>
                <div className="text-xs text-white/60 mt-0.5 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={startSession.isPending}
            className="quiz-cta-btn w-full"
          >
            <span>{startSession.isPending ? t.starting : t.startBtn}</span>
          </button>
          <p className="text-center text-xs text-white/40 mt-3">{t.privacy}</p>
        </div>
      )}

      {/* ===== QUESTIONS ===== */}
      {phase === "questions" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div key={currentQ} className="animate-in fade-in slide-in-from-right-4 duration-300">

            {/* Highlight badge */}
            {questions[currentQ].highlight && (
              <div className="quiz-highlight-badge mb-5">
                <span className="text-amber-400 text-lg">🔬</span>
                <p className="text-amber-200 text-sm font-semibold">{t.keyQuestion}</p>
              </div>
            )}

            {/* Pergunta */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 leading-snug tracking-tight">
              {questions[currentQ].question}
            </h2>

            {/* Feedback */}
            {feedbackText && (
              <div className="quiz-feedback mb-5 animate-in fade-in duration-200">
                <span className="text-emerald-400 text-lg flex-shrink-0">✓</span>
                <p className="text-emerald-200 text-sm font-medium">{feedbackText}</p>
              </div>
            )}

            {/* Cards de opção */}
            <div className="space-y-3">
              {questions[currentQ].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={animating}
                  className={`quiz-option-card w-full text-left ${
                    selectedOption === idx ? "quiz-option-selected" : "quiz-option-default"
                  }`}
                >
                  <span className={`quiz-option-letter flex-shrink-0 ${
                    selectedOption === idx ? "quiz-option-letter-selected" : "quiz-option-letter-default"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`flex-1 font-semibold text-sm md:text-base leading-snug ${
                    selectedOption === idx ? "text-white" : "text-white/90"
                  }`}>
                    {option.text}
                  </span>
                  {selectedOption === idx && (
                    <span className="text-emerald-400 text-lg flex-shrink-0">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Badge de confiança */}
            <p className="text-center text-xs text-white/30 mt-6 flex items-center justify-center gap-1.5">
              <span>🔒</span> {t.confidential}
            </p>
          </div>
        </div>
      )}

      {/* ===== OPT-IN ===== */}
      {phase === "optin" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Ícone de sucesso */}
          <div className="text-center mb-8">
            <div className="quiz-optin-icon mx-auto mb-5">
              <span className="text-4xl">🎯</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">{t.optinTitle}</h2>
            <p className="text-emerald-200 text-base leading-relaxed max-w-md mx-auto">{t.optinSub}</p>
          </div>

          {/* Formulário */}
          <div className="quiz-optin-card">
            <form onSubmit={handleOptIn} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white/80 mb-2">{t.nameLabel}</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  required
                  className="quiz-input w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white/80 mb-2">{t.emailLabel}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  required
                  className="quiz-input w-full"
                />
              </div>
              <button
                type="submit"
                disabled={completeQuiz.isPending || !name || !email}
                className="quiz-cta-btn w-full mt-2"
              >
                <span>{completeQuiz.isPending ? t.submitting : t.submitBtn}</span>
              </button>
              <p className="text-center text-xs text-white/30">{t.privacy}</p>
            </form>
          </div>
        </div>
      )}

      {/* ===== LOADING ===== */}
      {phase === "loading" && (
        <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          {/* Spinner */}
          <div className="quiz-loading-spinner mb-10">
            <span className="text-4xl relative z-10">🧬</span>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-amber-400/30 border-b-transparent animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
          </div>

          {/* Steps */}
          <div className="w-full max-w-sm space-y-3">
            {loadingSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  idx <= loadingStep ? "opacity-100 translate-x-0" : "opacity-20 translate-x-2"
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  idx < loadingStep
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : idx === loadingStep
                    ? "bg-amber-400/20 border-2 border-amber-400 text-amber-400"
                    : "bg-white/5 border border-white/10 text-white/30"
                }`}>
                  {idx < loadingStep ? "✓" : idx + 1}
                </div>
                <p className={`text-sm font-medium transition-colors duration-300 ${
                  idx < loadingStep ? "text-emerald-300" : idx === loadingStep ? "text-white" : "text-white/30"
                }`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
