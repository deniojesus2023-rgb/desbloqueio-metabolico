import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { QUIZ_QUESTIONS } from "@/quizData";

type Phase = "landing" | "questions" | "optin" | "loading" | "done";

export default function Quiz() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ questionIndex: number; questionText: string; answerIndex: number; answerText: string }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [, navigate] = useLocation();

  const startSession = trpc.quiz.startSession.useMutation();
  const saveAnswer = trpc.quiz.saveAnswer.useMutation();
  const completeQuiz = trpc.quiz.completeQuiz.useMutation();

  const loadingSteps = [
    "Analizando tus respuestas...",
    "Cruzando datos con 45.000 perfiles metabólicos...",
    "Identificando tu Bloqueo Metabólico principal...",
    "Ajustando el Protocolo de Desbloqueo para tu perfil...",
    "¡LISTO!",
  ];

  useEffect(() => {
    if (phase === "loading") {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setLoadingStep(step);
        if (step >= loadingSteps.length - 1) {
          clearInterval(interval);
          setTimeout(() => navigate("/vendas"), 1200);
        }
      }, 900);
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

  const handleSelectOption = async (optionIndex: number, optionText: string) => {
    if (animating) return;
    setSelectedOption(optionIndex);
    setAnimating(true);

    const answer = {
      questionIndex: currentQ,
      questionText: QUIZ_QUESTIONS[currentQ].question,
      answerIndex: optionIndex,
      answerText: optionText,
    };

    if (sessionId) {
      await saveAnswer.mutateAsync({ sessionId, ...answer });
    }

    setAnswers(prev => [...prev, answer]);

    setTimeout(() => {
      setSelectedOption(null);
      setAnimating(false);
      if (currentQ < QUIZ_QUESTIONS.length - 1) {
        setCurrentQ(prev => prev + 1);
      } else {
        setPhase("optin");
      }
    }, 500);
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
    ? Math.round(((currentQ) / QUIZ_QUESTIONS.length) * 100)
    : phase === "optin" ? 95 : phase === "loading" ? 100 : 0;

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
              {currentQ + 1} / {QUIZ_QUESTIONS.length}
            </span>
          )}
        </div>
        {(phase === "questions" || phase === "optin") && (
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      {/* LANDING */}
      {phase === "landing" && (
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full mb-4 tracking-wide uppercase">
              Evaluación Metabólica Gratuita
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Descubre cuál de los 3{" "}
              <span className="text-emerald-600">"Bloqueos Metabólicos Silenciosos"</span>{" "}
              está impidiendo que pierdas la grasa abdominal
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Incluso si comes poco y haces ejercicio.
            </p>
            <p className="text-gray-500 text-sm">
              Responde 10 preguntas rápidas · Resultado personalizado · 100% gratis · Menos de 1 minuto
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/hero_quiz-4yyjBHkD2a3bcnpKdnwqZj.webp"
              alt="Mujer descubriendo su solución metabólica"
              className="w-full h-56 md:h-72 object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex gap-4 text-white text-sm">
                <div className="flex items-center gap-1">
                  <span className="text-emerald-400">✓</span> Sin dietas restrictivas
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-400">✓</span> Sin pasar hambre
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-emerald-400">✓</span> Solo 3 minutos al día
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { num: "45.000+", label: "Perfiles analizados" },
              { num: "87%", label: "Identifican su bloqueo" },
              { num: "< 1 min", label: "Para completar" },
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
            {startSession.isPending ? "Iniciando..." : "Iniciar Evaluación Gratuita →"}
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">
            🔒 Tus datos están seguros. No spam, nunca.
          </p>
        </div>
      )}

      {/* QUESTIONS */}
      {phase === "questions" && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div
            key={currentQ}
            className="animate-in fade-in slide-in-from-right-4 duration-300"
          >
            {QUIZ_QUESTIONS[currentQ].highlight && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                <span className="text-emerald-600 text-lg">🔬</span>
                <p className="text-emerald-800 text-sm font-medium">
                  Esta es la pregunta más importante de la evaluación.
                </p>
              </div>
            )}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-snug">
              {QUIZ_QUESTIONS[currentQ].question}
            </h2>
            <div className="space-y-3">
              {QUIZ_QUESTIONS[currentQ].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx, option)}
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
                  {option}
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              ¡Análisis completado!
            </h2>
            <p className="text-gray-600">
              Identificamos tu Bloqueo Metabólico principal. Ingresa tus datos para recibir tu diagnóstico personalizado y la solución exacta para tu perfil.
            </p>
          </div>

          <form onSubmit={handleOptIn} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tu nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="¿Cómo te llamas?"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tu correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={completeQuiz.isPending || !name || !email}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-200 disabled:opacity-60 active:scale-95"
            >
              {completeQuiz.isPending ? "Procesando..." : "Ver Mi Resultado Ahora →"}
            </button>
            <p className="text-center text-xs text-gray-400">
              🔒 Tus datos están 100% seguros. No compartimos tu información.
            </p>
          </form>
        </div>
      )}

      {/* LOADING */}
      {phase === "loading" && (
        <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_icon_only-Y4uyihxrkUSeNSRPEhwmSV.webp"
                alt="Logo"
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          <div className="space-y-3 w-full max-w-sm">
            {loadingSteps.map((step, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 transition-all duration-500 ${idx <= loadingStep ? "opacity-100" : "opacity-20"}`}
              >
                <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors duration-300
                  ${idx < loadingStep ? "bg-emerald-600" : idx === loadingStep ? "bg-emerald-400 animate-pulse" : "bg-gray-200"}`}>
                  {idx < loadingStep && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm font-medium ${idx <= loadingStep ? "text-gray-800" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
