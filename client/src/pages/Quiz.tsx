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

// Detecta idioma do navegador automaticamente
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
  const [answers, setAnswers] = useState<{ questionIndex: number; questionText: string; answerIndex: number; answerText: string }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [, navigate] = useLocation();

  const questions = lang === "pt" ? QUIZ_QUESTIONS_PT : QUIZ_QUESTIONS;
  const progressLabels = lang === "pt" ? PROGRESS_LABELS_PT : PROGRESS_LABELS;

  const startSession = trpc.quiz.startSession.useMutation();
  const saveAnswer = trpc.quiz.saveAnswer.useMutation();
  const completeQuiz = trpc.quiz.completeQuiz.useMutation();

  // Textos da UI por idioma
  const t = useMemo(() => {
    if (lang === "pt") {
      return {
        badge: "Avaliação Metabólica Gratuita",
        headline: <>Descubra qual dos 3{" "}<span className="text-emerald-600">"Bloqueios Metabólicos Silenciosos"</span>{" "}está impedindo você de perder a gordura abdominal</>,
        sub: "Mesmo que você coma pouco e faça exercício.",
        meta: "Responda 10 perguntas rápidas · Resultado personalizado · 100% grátis · Menos de 2 minutos",
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
      };
    }
    return {
      badge: "Evaluación Metabólica Gratuita",
      headline: <>Descubre cuál de los 3{" "}<span className="text-emerald-600">"Bloqueos Metabólicos Silenciosos"</span>{" "}está impidiendo que pierdas la grasa abdominal</>,
      sub: "Incluso si comes poco y haces ejercicio.",
      meta: "Responde 10 preguntas rápidas · Resultado personalizado · 100% gratis · Menos de 2 minutos",
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
    };
  }, [lang]);

  // Loading steps dinâmicos por idioma
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

  const getProgressLabel = () => {
    if (phase === "questions") {
      return questions[currentQ].progressLabel || (lang === "pt" ? "Você está no caminho certo..." : "Vas por buen camino...");
    }
    return "";
  };

  const loadingSteps = getLoadingSteps();

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
            alt="Desbloqueio Metabólico"
            className="h-8 object-contain"
          />
          {phase === "questions" && (
            <span className="text-sm text-gray-500 font-medium">
              {currentQ + 1} / {questions.length}
            </span>
          )}
        </div>
        {(phase === "questions" || phase === "optin") && (
          <div>
            <div className="h-1.5 bg-gray-100">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {phase === "questions" && (
              <div className="max-w-2xl mx-auto px-4 py-1">
                <p className="text-xs text-emerald-600 font-medium">{getProgressLabel()}</p>
              </div>
            )}
          </div>
        )}
      </header>

      {/* LANDING */}
      {phase === "landing" && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              {t.badge}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {t.headline}
            </h1>
            <p className="text-lg text-gray-600 mb-2">{t.sub}</p>
            <p className="text-gray-500 text-sm">{t.meta}</p>
          </div>

          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/hero_quiz-4yyjBHkD2a3bcnpKdnwqZj.webp"
              alt="Mulher descobrindo a solução metabólica"
              className="w-full h-56 md:h-72 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-4 text-white text-sm">
                <div className="flex items-center gap-1"><span className="text-emerald-400">✓</span> {t.bullet1}</div>
                <div className="flex items-center gap-1"><span className="text-emerald-400">✓</span> {t.bullet2}</div>
                <div className="flex items-center gap-1"><span className="text-emerald-400">✓</span> {t.bullet3}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { num: "45.000+", label: t.stat1 },
              { num: "87%", label: t.stat2 },
              { num: "< 2 min", label: t.stat3 },
            ].map((stat) => (
              <div key={stat.num} className="bg-gray-50 rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-emerald-600">{stat.num}</div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={startSession.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-200 disabled:opacity-70"
          >
            {startSession.isPending ? t.starting : t.startBtn}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">{t.privacy}</p>
        </div>
      )}

      {/* QUESTIONS */}
      {phase === "questions" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div key={currentQ} className="animate-in fade-in slide-in-from-right-4 duration-300">
            {questions[currentQ].highlight && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                <span className="text-emerald-600 text-lg">🔬</span>
                <p className="text-emerald-800 text-sm font-medium">{t.keyQuestion}</p>
              </div>
            )}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-snug">
              {questions[currentQ].question}
            </h2>

            {feedbackText && (
              <div className="mb-4 animate-in fade-in duration-200 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
                <span className="text-emerald-600 text-base flex-shrink-0">✓</span>
                <p className="text-emerald-800 text-sm font-medium">{feedbackText}</p>
              </div>
            )}

            <div className="space-y-3">
              {questions[currentQ].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={animating}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium text-gray-800
                    ${selectedOption === idx
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 scale-[0.99]"
                      : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 active:scale-[0.99]"
                    }`}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold mr-3 flex-shrink-0
                    ${selectedOption === idx ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OPT-IN */}
      {phase === "optin" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎯</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{t.optinTitle}</h2>
            <p className="text-gray-600">{t.optinSub}</p>
          </div>

          <form onSubmit={handleOptIn} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{t.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={completeQuiz.isPending || !name || !email}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-200 disabled:opacity-70"
            >
              {completeQuiz.isPending ? t.submitting : t.submitBtn}
            </button>
            <p className="text-center text-xs text-gray-400">{t.privacy}</p>
          </form>
        </div>
      )}

      {/* LOADING */}
      {phase === "loading" && (
        <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-8 relative">
            <span className="text-4xl">🧬</span>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          </div>
          <div className="w-full max-w-sm space-y-3">
            {loadingSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-all duration-500 ${
                  idx <= loadingStep ? "opacity-100" : "opacity-20"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-colors duration-300 ${
                  idx < loadingStep
                    ? "bg-emerald-600 text-white"
                    : idx === loadingStep
                    ? "bg-emerald-100 border-2 border-emerald-500 text-emerald-600"
                    : "bg-gray-100 text-gray-400"
                }`}>
                  {idx < loadingStep ? "✓" : idx + 1}
                </div>
                <p className={`text-sm font-medium ${idx <= loadingStep ? "text-gray-800" : "text-gray-400"}`}>
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
