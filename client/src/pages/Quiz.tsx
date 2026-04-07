import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  QUIZ_QUESTIONS,
  QUIZ_QUESTIONS_PT,
  calculateBlockTypeForLang,
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

export default function Quiz() {
  const [lang] = useState<Lang>(() => detectLang());
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{
    questionIndex: number;
    questionText: string;
    answerIndex: number;
    answerText: string;
  }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [, navigate] = useLocation();

  const questions = lang === "pt" ? QUIZ_QUESTIONS_PT : QUIZ_QUESTIONS;

  const startSession = trpc.quiz.startSession.useMutation();
  const saveAnswer = trpc.quiz.saveAnswer.useMutation();
  const completeQuiz = trpc.quiz.completeQuiz.useMutation();

  const t = useMemo(() => {
    if (lang === "pt") {
      return {
        badge: "Avaliação Metabólica Gratuita",
        headline: "Descubra qual Bloqueio Metabólico está impedindo você de emagrecer",
        headlineHighlight: "Bloqueio Metabólico",
        sub: "Mesmo comendo pouco e fazendo exercício.",
        meta: ["10 perguntas rápidas", "Resultado personalizado", "100% grátis"],
        bullet1: "Sem dietas restritivas",
        bullet2: "Sem passar fome",
        bullet3: "Só 3 minutos por dia",
        startBtn: "Iniciar Avaliação Gratuita",
        starting: "Iniciando...",
        privacy: "Seus dados estão seguros. Sem spam.",
        keyQuestion: "Pergunta mais importante da avaliação",
        optinTitle: "Análise Concluída!",
        optinSub: "Identificamos seu Bloqueio Metabólico. Insira seus dados para receber o diagnóstico personalizado.",
        nameLabel: "Seu nome",
        namePlaceholder: "Como você se chama?",
        emailLabel: "Seu e-mail",
        emailPlaceholder: "email@exemplo.com",
        submitBtn: "Ver meu diagnóstico →",
        submitting: "Processando...",
        salesPath: "/vendas-br",
        confidential: "Respostas 100% confidenciais",
        question: "Pergunta",
        of: "de",
        stat1: { num: "45.000+", label: "Perfis analisados" },
        stat2: { num: "87%", label: "Identificam o bloqueio" },
        stat3: { num: "< 2 min", label: "Para completar" },
      };
    }
    return {
      badge: "Evaluación Metabólica Gratuita",
      headline: "Descubre cuál Bloqueo Metabólico te impide bajar de peso",
      headlineHighlight: "Bloqueo Metabólico",
      sub: "Incluso comiendo poco y haciendo ejercicio.",
      meta: ["10 preguntas rápidas", "Resultado personalizado", "100% gratis"],
      bullet1: "Sin dietas restrictivas",
      bullet2: "Sin pasar hambre",
      bullet3: "Solo 3 minutos al día",
      startBtn: "Iniciar Evaluación Gratuita",
      starting: "Iniciando...",
      privacy: "Tus datos están seguros. Sin spam.",
      keyQuestion: "Pregunta más importante de la evaluación",
      optinTitle: "¡Análisis Completado!",
      optinSub: "Identificamos tu Bloqueo Metabólico. Ingresa tus datos para recibir tu diagnóstico personalizado.",
      nameLabel: "Tu nombre",
      namePlaceholder: "¿Cómo te llamas?",
      emailLabel: "Tu correo",
      emailPlaceholder: "correo@ejemplo.com",
      submitBtn: "Ver mi diagnóstico →",
      submitting: "Procesando...",
      salesPath: "/vendas",
      confidential: "Respuestas 100% confidenciales",
      question: "Pregunta",
      of: "de",
      stat1: { num: "45.000+", label: "Perfiles analizados" },
      stat2: { num: "87%", label: "Identifican el bloqueo" },
      stat3: { num: "< 2 min", label: "Para completar" },
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
          ? `Identificando seu padrão metabólico...`
          : "Identificando seu padrão metabólico...",
        regionAnswer
          ? `Cruzando com 45.000 perfis de mulheres...`
          : "Cruzando com 45.000 perfis metabólicos...",
        "Determinando seu Bloqueio Metabólico principal...",
        "Ajustando o Protocolo para o seu perfil...",
        "Seu diagnóstico está pronto! ✓",
      ];
    }
    return [
      "Analizando tus respuestas...",
      stressAnswer && stressAnswer.answerIndex <= 1
        ? "Detectando niveles elevados de cortisol..."
        : "Evaluando tu perfil hormonal...",
      "Identificando tu patrón metabólico...",
      "Cruzando con 45.000 perfiles metabólicos...",
      "Determinando tu Bloqueo Metabólico principal...",
      "Ajustando el Protocolo para tu perfil...",
      "¡Tu diagnóstico está listo! ✓",
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
      if (currentQ < questions.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        setPhase("optin");
      }
    }, 1100);
  };

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    if (sessionId) {
      await completeQuiz.mutateAsync({ sessionId, name, email });
    }
    setPhase("loading");
  };

  const progressPercent = phase === "questions"
    ? Math.round(((currentQ + 1) / questions.length) * 100)
    : phase === "optin" ? 95 : phase === "loading" ? 100 : 0;

  const loadingSteps = getLoadingSteps();

  return (
    <div className="qz-root">

      {/* ===== HEADER ===== */}
      <header className="qz-header">
        <div className="qz-header-inner">
          <div className="qz-logo">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{flexShrink:0}}>
              <circle cx="11" cy="11" r="11" fill="white" fillOpacity="0.2"/>
              <path d="M7 11l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="qz-logo-text">
              {lang === "pt" ? "Desbloqueio Metabólico" : "Desbloqueo Metabólico"}
            </span>
          </div>
          {phase === "questions" && (
            <span className="qz-step-pill">
              {t.question} {currentQ + 1}/{questions.length}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {(phase === "questions" || phase === "optin" || phase === "loading") && (
          <div className="qz-progress-wrap">
            <div className="qz-progress-track">
              <div
                className="qz-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="qz-progress-pct">{progressPercent}%</span>
          </div>
        )}
      </header>

      {/* ===== LANDING ===== */}
      {phase === "landing" && (
        <div className="qz-page">
          {/* Badge */}
          <div className="qz-badge-wrap">
            <span className="qz-badge">
              <span className="qz-badge-dot" />
              {t.badge}
            </span>
          </div>

          {/* Hero image */}
          <div className="qz-hero-img-wrap">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/hero_quiz-4yyjBHkD2a3bcnpKdnwqZj.webp"
              alt="Avaliação metabólica"
              className="qz-hero-img"
            />
            <div className="qz-hero-overlay" />
            <div className="qz-hero-bullets">
              {[t.bullet1, t.bullet2, t.bullet3].map((b, i) => (
                <span key={i} className="qz-hero-bullet">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="7" fill="#00BFA5" />
                    <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Headline */}
          <div className="qz-headline-wrap">
            <h1 className="qz-headline">
              {t.headline.split(t.headlineHighlight)[0]}
              <span className="qz-headline-hl">{t.headlineHighlight}</span>
              {t.headline.split(t.headlineHighlight)[1]}
            </h1>
            <p className="qz-sub">{t.sub}</p>
            <div className="qz-meta-row">
              {t.meta.map((m, i) => (
                <span key={i} className="qz-meta-item">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="6" fill="#00BFA5" opacity="0.15" />
                    <path d="M3.5 6l1.5 1.5 3.5-3" stroke="#00BFA5" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="qz-stats-row">
            {[t.stat1, t.stat2, t.stat3].map((s, i) => (
              <div key={i} className="qz-stat-card">
                <span className="qz-stat-num">{s.num}</span>
                <span className="qz-stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            disabled={startSession.isPending}
            className="qz-cta-btn"
          >
            {startSession.isPending ? t.starting : t.startBtn}
          </button>
          <p className="qz-privacy">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: "inline", marginRight: 4 }}>
              <path d="M6 1L2 3v3c0 2.2 1.7 4.2 4 4.7C8.3 10.2 10 8.2 10 6V3L6 1z" fill="#00BFA5" opacity="0.7" />
            </svg>
            {t.privacy}
          </p>
        </div>
      )}

      {/* ===== QUESTIONS ===== */}
      {phase === "questions" && (
        <div className="qz-page">
          <div key={currentQ} className="animate-in fade-in slide-in-from-right-3 duration-250">

            {/* Highlight */}
            {questions[currentQ].highlight && (
              <div className="qz-highlight">
                <span className="qz-highlight-icon">⭐</span>
                <span className="qz-highlight-text">{t.keyQuestion}</span>
              </div>
            )}

            {/* Pergunta */}
            <h2 className="qz-question">{questions[currentQ].question}</h2>

            {/* Feedback */}
            {feedbackText && (
              <div className="qz-feedback animate-in fade-in duration-200">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0">
                  <circle cx="9" cy="9" r="9" fill="#00BFA5" />
                  <path d="M5.5 9l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="qz-feedback-text">{feedbackText}</p>
              </div>
            )}

            {/* Opções */}
            <div className="qz-options">
              {questions[currentQ].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={animating}
                  className={`qz-option ${selectedOption === idx ? "qz-option--selected" : ""}`}
                >
                  <span className={`qz-option-letter ${selectedOption === idx ? "qz-option-letter--selected" : ""}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="qz-option-text">{option.text}</span>
                  {selectedOption === idx && (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 ml-auto">
                      <circle cx="10" cy="10" r="10" fill="#00BFA5" />
                      <path d="M6 10l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <p className="qz-confidential">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ display: "inline", marginRight: 4 }}>
                <path d="M5.5 1L2 2.5v3c0 2 1.5 3.8 3.5 4.3C7.5 9.3 9 7.5 9 5.5v-3L5.5 1z" fill="#94A3B8" />
              </svg>
              {t.confidential}
            </p>
          </div>
        </div>
      )}

      {/* ===== OPT-IN ===== */}
      {phase === "optin" && (
        <div className="qz-page">
          <div className="qz-optin-icon-wrap">
            <div className="qz-optin-icon">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M8 18l7 7 13-13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <h2 className="qz-optin-title">{t.optinTitle}</h2>
          <p className="qz-optin-sub">{t.optinSub}</p>

          <form onSubmit={handleOptIn} className="qz-form">
            <div className="qz-field">
              <label className="qz-label">{t.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                required
                className="qz-input"
              />
            </div>
            <div className="qz-field">
              <label className="qz-label">{t.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                className="qz-input"
              />
            </div>
            <button
              type="submit"
              disabled={completeQuiz.isPending || !name || !email}
              className="qz-cta-btn"
              style={{ marginTop: 8 }}
            >
              {completeQuiz.isPending ? t.submitting : t.submitBtn}
            </button>
            <p className="qz-privacy">{t.privacy}</p>
          </form>
        </div>
      )}

      {/* ===== LOADING ===== */}
      {phase === "loading" && (
        <div className="qz-loading-page">
          <div className="qz-spinner-wrap">
            <div className="qz-spinner">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20l7 7 13-13" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="qz-loading-steps">
            {loadingSteps.map((step, idx) => (
              <div
                key={idx}
                className={`qz-loading-step ${idx <= loadingStep ? "qz-loading-step--active" : ""}`}
              >
                <div className={`qz-loading-dot ${
                  idx < loadingStep ? "qz-loading-dot--done" :
                  idx === loadingStep ? "qz-loading-dot--current" : ""
                }`}>
                  {idx < loadingStep ? (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
                <p className="qz-loading-text">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
