import { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { calculateBlockTypeForLang } from "@/quizData";

type Phase = "landing" | "questions" | "loading" | "result" | "optin";
type Lang = "pt" | "es";
type BlockType = 1 | 2 | 3;

function detectLang(): Lang {
  const params = new URLSearchParams(window.location.search);
  const p = params.get("lang");
  if (p === "pt" || p === "es") return p;
  const nav = navigator.language || "";
  return nav.toLowerCase().startsWith("pt") ? "pt" : "es";
}

// ─── 4 Perguntas com Arco Emocional ──────────────────────────────────────────
const QUESTIONS_PT = [
  {
    id: 0,
    phase: "identity" as const,
    phaseLabel: "Sobre você",
    phaseColor: "#00BFA5",
    question: "Este ano, eu sou alguém que...",
    sub: "Escolha a opção que mais combina com você agora",
    emoji: ["🌟", "💪", "🔍", "💭"],
    options: [
      { text: "Está finalmente pronta para priorizar minha saúde e me sentir incrível", feedback: "Essa disposição é tudo que você precisa. O protocolo faz o resto.", score: 3 },
      { text: "Merece acordar com energia e se sentir confiante no meu corpo", feedback: "Você merece sim. E vamos descobrir exatamente o que está bloqueando isso.", score: 2 },
      { text: "Está comprometida a descobrir o que realmente funciona para mim", feedback: "Perfeito. Você está no lugar certo para isso.", score: 2 },
      { text: "Quer entender por que meu corpo não responde como antes", feedback: "Essa é a pergunta certa. E a resposta está no seu perfil metabólico.", score: 3 },
    ],
  },
  {
    id: 1,
    phase: "behavior" as const,
    phaseLabel: "Seus hábitos",
    phaseColor: "#26C6DA",
    question: "Quando o assunto é alimentação, eu costumo...",
    sub: "Seja honesta — isso é confidencial e vai personalizar seu diagnóstico",
    emoji: ["🥗", "🔄", "😤", "🤷"],
    options: [
      { text: "Comer bem durante a semana, mas perco o controle no fim de semana", feedback: "Isso é o ciclo restrição-compulsão. Um sinal claro da Trava Tipo 2.", score: 2 },
      { text: "Fazer dieta, perder alguns quilos e recuperar tudo em pouco tempo", feedback: "O efeito sanfona é a resposta do corpo ao modo de sobrevivência. Vamos reverter isso.", score: 2 },
      { text: "Comer pouco e mesmo assim não consigo emagrecer — parece injusto", feedback: "Exatamente. Isso é a Trava Metabólica do Estresse Crônico agindo em tempo real.", score: 3 },
      { text: "Já tentei de tudo: low carb, jejum, detox... nada funciona por muito tempo", feedback: "Isso confirma que o problema não é a dieta — é o bloqueio metabólico subjacente.", score: 3 },
    ],
  },
  {
    id: 2,
    phase: "problem" as const,
    phaseLabel: "Sua situação",
    phaseColor: "#F59E0B",
    question: "Estou frustrada porque...",
    sub: "Marque a situação que mais te representa — seja honesta",
    emoji: ["😔", "🔒", "😡", "💔"],
    options: [
      { text: "Me esforcei muito, mas a balança simplesmente não se move — é como se meu corpo tivesse travado", feedback: "Isso é exatamente o que a ciência chama de Bloqueio Metabólico por Cortisol. Não é falta de esforço.", score: 3 },
      { text: "A gordura foi para lugares que nunca esteve antes: barriga, quadril, costas", feedback: "Isso é um sinal claro de desequilíbrio hormonal — especialmente após os 35 anos.", score: 3 },
      { text: "Sinto que meu metabolismo ficou mais lento com a idade e não sei como reverter isso", feedback: "O metabolismo lento é reversível. Não é envelhecimento — é um sinal bioquímico.", score: 2 },
      { text: "Fico com fome o tempo todo mesmo comendo — e quando como, parece que vira gordura na hora", feedback: "Isso é resistência à insulina. O corpo não consegue usar a energia dos alimentos corretamente.", score: 2 },
    ],
  },
  {
    id: 3,
    phase: "urgency" as const,
    phaseLabel: "Sua decisão",
    phaseColor: "#EF4444",
    question: "Se você descobrisse exatamente o que está travando seu metabolismo...",
    sub: "Seja honesta com você mesma — essa resposta define seu protocolo",
    emoji: ["⚡", "📅", "💰", "😨"],
    options: [
      { text: "Aplicaria a solução hoje mesmo — estou pronta para agir agora", feedback: "Essa é a mentalidade certa. Vamos te dar exatamente o que você precisa.", score: 3 },
      { text: "Precisaria de uma semana para me organizar, mas faria com certeza", feedback: "Perfeito. O protocolo é simples o suficiente para começar em qualquer momento.", score: 2 },
      { text: "Dependeria do quanto custaria — tenho orçamento limitado", feedback: "Entendemos. A solução que encontramos para você é acessível e definitiva.", score: 2 },
      { text: "Teria medo de tentar mais uma coisa que não funciona", feedback: "Esse medo é completamente válido. É por isso que temos uma garantia de 30 dias.", score: 1 },
    ],
  },
];

const QUESTIONS_ES = [
  {
    id: 0,
    phase: "identity" as const,
    phaseLabel: "Sobre ti",
    phaseColor: "#00BFA5",
    question: "Este año, yo soy alguien que...",
    sub: "Elige la opción que más te representa ahora",
    emoji: ["🌟", "💪", "🔍", "💭"],
    options: [
      { text: "Finalmente está lista para priorizar mi salud y sentirme increíble", feedback: "Esa disposición es todo lo que necesitas. El protocolo hace el resto.", score: 3 },
      { text: "Merece despertar con energía y sentirse segura en mi cuerpo", feedback: "Lo mereces. Y vamos a descubrir exactamente qué está bloqueando eso.", score: 2 },
      { text: "Está comprometida a descubrir qué realmente funciona para mí", feedback: "Perfecto. Estás en el lugar correcto para eso.", score: 2 },
      { text: "Quiere entender por qué mi cuerpo ya no responde como antes", feedback: "Esa es la pregunta correcta. Y la respuesta está en tu perfil metabólico.", score: 3 },
    ],
  },
  {
    id: 1,
    phase: "behavior" as const,
    phaseLabel: "Tus hábitos",
    phaseColor: "#26C6DA",
    question: "Cuando se trata de alimentación, yo suelo...",
    sub: "Sé honesta — esto es confidencial y personalizará tu diagnóstico",
    emoji: ["🥗", "🔄", "😤", "🤷"],
    options: [
      { text: "Comer bien durante la semana, pero pierdo el control en el fin de semana", feedback: "Eso es el ciclo de restricción-atracón. Una señal clara del Bloqueo Tipo 2.", score: 2 },
      { text: "Hacer dieta, perder algunos kilos y recuperar todo en poco tiempo", feedback: "El efecto rebote es la respuesta del cuerpo al modo supervivencia. Lo vamos a revertir.", score: 2 },
      { text: "Comer poco y aun así no logro bajar de peso — parece injusto", feedback: "Exactamente. Eso es el Síndrome de Supervivencia Celular actuando en tiempo real.", score: 3 },
      { text: "Ya probé todo: low carb, ayuno, detox... nada funciona por mucho tiempo", feedback: "Eso confirma que el problema no es la dieta — es el bloqueo metabólico subyacente.", score: 3 },
    ],
  },
  {
    id: 2,
    phase: "problem" as const,
    phaseLabel: "Tu situación",
    phaseColor: "#F59E0B",
    question: "Estoy frustrada porque...",
    sub: "Marca la situación que más te representa — sé honesta",
    emoji: ["😔", "🔒", "😡", "💔"],
    options: [
      { text: "Me esforcé mucho, pero la balanza simplemente no se mueve — como si mi cuerpo estuviera bloqueado", feedback: "Eso es exactamente lo que la ciencia llama Bloqueo Metabólico por Cortisol. No es falta de esfuerzo.", score: 3 },
      { text: "La grasa fue a lugares que nunca estuvo antes: barriga, caderas, espalda", feedback: "Eso es una señal clara de desequilibrio hormonal — especialmente después de los 35 años.", score: 3 },
      { text: "Siento que mi metabolismo se volvió más lento con la edad y no sé cómo revertirlo", feedback: "El metabolismo lento es reversible. No es envejecimiento — es una señal bioquímica.", score: 2 },
      { text: "Tengo hambre todo el tiempo aunque coma — y cuando como, parece que se convierte en grasa", feedback: "Eso es resistencia a la insulina. El cuerpo no puede usar la energía de los alimentos correctamente.", score: 2 },
    ],
  },
  {
    id: 3,
    phase: "urgency" as const,
    phaseLabel: "Tu decisión",
    phaseColor: "#EF4444",
    question: "Si descubrieras exactamente qué está bloqueando tu metabolismo...",
    sub: "Sé honesta contigo misma — esta respuesta define tu protocolo",
    emoji: ["⚡", "📅", "💰", "😨"],
    options: [
      { text: "Aplicaría la solución hoy mismo — estoy lista para actuar ahora", feedback: "Esa es la mentalidad correcta. Te daremos exactamente lo que necesitas.", score: 3 },
      { text: "Necesitaría una semana para organizarme, pero lo haría con certeza", feedback: "Perfecto. El protocolo es lo suficientemente simple para empezar en cualquier momento.", score: 2 },
      { text: "Dependería de cuánto costaría — tengo presupuesto limitado", feedback: "Entendemos. La solución que encontramos para ti es accesible y definitiva.", score: 2 },
      { text: "Tendría miedo de intentar una cosa más que no funcione", feedback: "Ese miedo es completamente válido. Por eso tenemos una garantía de 30 días.", score: 1 },
    ],
  },
];

// ─── Perfis de Resultado ──────────────────────────────────────────────────────
const PROFILES = {
  1: {
    pt: {
      tag: "🧠 BLOQUEIO TIPO 1 — CORTISOL ELEVADO",
      headline: "Seu metabolismo está travado pelo cortisol — não pela falta de disciplina",
      absolution: "Quando o cortisol fica cronicamente alto, seu corpo entra em modo de sobrevivência e ordena às células de gordura que não liberem energia. Você pode comer pouco, fazer exercício e ainda assim não emagrecer. Não é fraqueza. É bioquímica.",
      stat: "91% das mulheres com Bloqueio Tipo 1 desbloquearam o metabolismo em menos de 3 semanas",
      blockMeter: 72,
      blockLevel: "Alto",
      cta: "Quero desbloquear meu metabolismo agora",
    },
    es: {
      tag: "🧠 BLOQUEO TIPO 1 — CORTISOL ELEVADO",
      headline: "Tu metabolismo está bloqueado por el cortisol — no por falta de disciplina",
      absolution: "Cuando el cortisol se mantiene crónicamente alto, tu cuerpo entra en modo supervivencia y ordena a las células de grasa que no liberen energía. Puedes comer poco, hacer ejercicio y aún así no adelgazar. No es debilidad. Es bioquímica.",
      stat: "91% de las mujeres con Bloqueo Tipo 1 desbloquearon el metabolismo en menos de 3 semanas",
      blockMeter: 72,
      blockLevel: "Alto",
      cta: "Quiero desbloquear mi metabolismo ahora",
    },
  },
  2: {
    pt: {
      tag: "🔒 BLOQUEIO TIPO 2 — RESISTÊNCIA À INSULINA",
      headline: "Cada dieta restritiva ensina seu corpo a acumular MAIS gordura",
      absolution: "As dietas de restrição calórica ativam a Trava Metabólica do Estresse Crônico — um mecanismo evolutivo que interpreta a restrição como ameaça de fome. O cortisol sobe, o metabolismo cai, e as células de gordura ficam resistentes a liberar energia. O problema não é você.",
      stat: "87% das mulheres com Bloqueio Tipo 2 identificaram o gatilho e reverteram em 21 dias",
      blockMeter: 85,
      blockLevel: "Muito Alto",
      cta: "Ver minha solução personalizada",
    },
    es: {
      tag: "🔒 BLOQUEO TIPO 2 — RESISTENCIA A LA INSULINA",
      headline: "Cada dieta restrictiva le enseña a tu cuerpo a acumular MÁS grasa",
      absolution: "Las dietas de restricción calórica activan la Trampa Metabólica del Estrés Crónico — un mecanismo evolutivo que interpreta la restricción como amenaza de hambre. El cortisol sube, el metabolismo baja, y las células de grasa se vuelven resistentes a liberar energía. El problema no eres tú.",
      stat: "87% de las mujeres con Bloqueo Tipo 2 identificaron el gatillo y lo revirtieron en 21 días",
      blockMeter: 85,
      blockLevel: "Muy Alto",
      cta: "Ver mi solución personalizada",
    },
  },
  3: {
    pt: {
      tag: "⚡ BLOQUEIO TIPO 3 — DESEQUILÍBRIO HORMONAL",
      headline: "A gordura que apareceu depois dos 35 tem um nome — e tem solução em 3 minutos por dia",
      absolution: "Após os 35 anos, a queda do estrogênio e da progesterona muda completamente onde e como o corpo armazena gordura. A barriga, o quadril e as costas passam a acumular gordura mesmo sem mudança na alimentação. Isso não é envelhecimento inevitável — é um sinal bioquímico que pode ser revertido.",
      stat: "83% das mulheres com Bloqueio Tipo 3 notaram redução de medidas em 2 semanas",
      blockMeter: 93,
      blockLevel: "Crítico",
      cta: "Descobrir como reverter meu bloqueio hormonal",
    },
    es: {
      tag: "⚡ BLOQUEO TIPO 3 — DESEQUILIBRIO HORMONAL",
      headline: "La grasa que apareció después de los 35 tiene un nombre — y tiene solución en 3 minutos al día",
      absolution: "Después de los 35 años, la caída del estrógeno y la progesterona cambia completamente dónde y cómo el cuerpo almacena grasa. La barriga, las caderas y la espalda acumulan grasa incluso sin cambios en la alimentación. Esto no es envejecimiento inevitable — es una señal bioquímica que puede revertirse.",
      stat: "83% de las mujeres con Bloqueo Tipo 3 notaron reducción de medidas en 2 semanas",
      blockMeter: 93,
      blockLevel: "Crítico",
      cta: "Descubrir cómo revertir mi bloqueo hormonal",
    },
  },
};

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function Quiz() {
  const [, navigate] = useLocation();
  const [lang] = useState<Lang>(() => detectLang());
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ questionIndex: number; questionText: string; answerIndex: number; answerText: string }[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [blockType, setBlockType] = useState<BlockType>(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [optinTimer, setOptinTimer] = useState(900);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const questions = lang === "pt" ? QUESTIONS_PT : QUESTIONS_ES;
  const startSession = trpc.quiz.startSession.useMutation();
  const saveAnswer = trpc.quiz.saveAnswer.useMutation();
  const completeQuiz = trpc.quiz.completeQuiz.useMutation();

  const t = useMemo(() => lang === "pt" ? {
    badge: "Avaliação Metabólica Gratuita",
    headline: "Descubra qual Bloqueio Metabólico está impedindo você de emagrecer",
    headlineHl: "Bloqueio Metabólico",
    sub: "Mesmo comendo pouco e fazendo exercício.",
    meta: ["4 perguntas rápidas", "Resultado personalizado", "100% grátis"],
    b1: "Sem dietas restritivas", b2: "Sem passar fome", b3: "Só 3 minutos por dia",
    startBtn: "Iniciar Avaliação Gratuita",
    privacy: "Seus dados estão seguros. Sem spam.",
    confidential: "Suas respostas são 100% confidenciais",
    question: "Pergunta", of: "de",
    stat1: { num: "45.000+", label: "Perfis analisados" },
    stat2: { num: "87%", label: "Identificam o bloqueio" },
    stat3: { num: "< 2 min", label: "Para completar" },
    loadingMsgs: ["Analisando suas respostas...", "Identificando padrões de bloqueio...", "Cruzando com 45.000+ perfis...", "Calculando seu diagnóstico..."],
    loadingTitle: "Calculando seu diagnóstico",
    resultTitle: "Seu Diagnóstico",
    blockLabel: "Nível do seu bloqueio",
    optinTitle: "Onde enviar seu protocolo?",
    optinSub: "Preparamos uma solução específica para o seu tipo de bloqueio. Informe seus dados para acessar agora.",
    nameLabel: "Seu primeiro nome", namePlaceholder: "Ex: Maria",
    emailLabel: "Seu melhor e-mail", emailPlaceholder: "Ex: maria@gmail.com",
    youWillGet: "Você vai receber:",
    submitBtn: "Acessar meu protocolo agora →",
    submitting: "Preparando...",
    salesPath: "/vendas-br",
    completed: "concluído",
  } : {
    badge: "Evaluación Metabólica Gratuita",
    headline: "Descubre cuál Bloqueo Metabólico te impide bajar de peso",
    headlineHl: "Bloqueo Metabólico",
    sub: "Incluso comiendo poco y haciendo ejercicio.",
    meta: ["4 preguntas rápidas", "Resultado personalizado", "100% gratis"],
    b1: "Sin dietas restrictivas", b2: "Sin pasar hambre", b3: "Solo 3 minutos al día",
    startBtn: "Iniciar Evaluación Gratuita",
    privacy: "Tus datos están seguros. Sin spam.",
    confidential: "Tus respuestas son 100% confidenciales",
    question: "Pregunta", of: "de",
    stat1: { num: "45.000+", label: "Perfiles analizados" },
    stat2: { num: "87%", label: "Identifican el bloqueo" },
    stat3: { num: "< 2 min", label: "Para completar" },
    loadingMsgs: ["Analizando tus respuestas...", "Identificando patrones de bloqueo...", "Cruzando con 45.000+ perfiles...", "Calculando tu diagnóstico..."],
    loadingTitle: "Calculando tu diagnóstico",
    resultTitle: "Tu Diagnóstico",
    blockLabel: "Nivel de tu bloqueo",
    optinTitle: "¿Dónde enviamos tu protocolo?",
    optinSub: "Preparamos una solución específica para tu tipo de bloqueo. Ingresa tus datos para acceder ahora.",
    nameLabel: "Tu primer nombre", namePlaceholder: "Ej: María",
    emailLabel: "Tu mejor e-mail", emailPlaceholder: "Ej: maria@gmail.com",
    youWillGet: "Vas a recibir:",
    submitBtn: "Acceder a mi protocolo ahora →",
    submitting: "Preparando...",
    salesPath: "/vendas",
    completed: "completado",
  }, [lang]);

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
    const targets = [20, 45, 70, 90, 100];
    const delays = [500, 700, 600, 500, 800];
    let i = 0;
    const run = () => {
      if (i >= targets.length) {
        setTimeout(() => setPhase("result"), 400);
        return;
      }
      setTimeout(() => {
        setLoadingProgress(targets[i]);
        setLoadingMsgIdx(Math.min(i, t.loadingMsgs.length - 1));
        i++;
        run();
      }, delays[i] || 600);
    };
    run();
  }, [phase]);

  const formatTimer = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

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
    const q = questions[currentQ];
    const opt = q.options[optionIndex];
    if (!opt) return;

    setSelectedOption(optionIndex);
    setFeedbackText(opt.feedback);
    setAnimating(true);

    const answer = {
      questionIndex: currentQ,
      questionText: q.question,
      answerIndex: optionIndex,
      answerText: opt.text,
    };
    if (sessionId) {
      await saveAnswer.mutateAsync({ sessionId, ...answer });
    }
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    setTimeout(() => {
      setFeedbackText(null);
      setSelectedOption(null);
      setAnimating(false);
      if (currentQ < questions.length - 1) {
        setCurrentQ(q => q + 1);
      } else {
        // Calcular bloqueio e ir para loading
        const block = calculateBlockTypeForLang(newAnswers, lang);
        setBlockType(block);
        setPhase("loading");
      }
    }, 1100);
  };

  const handleOptIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    if (sessionId) {
      await completeQuiz.mutateAsync({ sessionId, name, email });
    }
    const dest = `${t.salesPath}?block=${blockType}&n=${encodeURIComponent(name)}${sessionId ? `&s=${sessionId}` : ""}&lang=${lang}`;
    navigate(dest);
  };

  const progressPercent = phase === "questions"
    ? Math.round((currentQ / questions.length) * 100)
    : phase === "optin" ? 95 : phase === "loading" || phase === "result" ? 100 : 0;

  const profile = PROFILES[blockType][lang];

  // ── Header compartilhado ──────────────────────────────────────────────────────
  const Header = ({ title, showTimer }: { title?: string; showTimer?: boolean }) => (
    <header className="bg-[#00BFA5] px-4 shadow-sm" style={{ paddingTop: "env(safe-area-inset-top, 12px)", paddingBottom: "12px" }}>
      <div className="flex items-center justify-between max-w-md mx-auto mb-2">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2"/>
            <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white font-bold text-sm">
            {title || (lang === "pt" ? "Desbloqueio Metabólico" : "Desbloqueo Metabólico")}
          </span>
        </div>
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
            {t.question} {currentQ + 1}/{questions.length}
          </span>
        )}
      </div>
      {(phase === "questions" || phase === "optin" || phase === "loading" || phase === "result") && (
        <div className="max-w-md mx-auto">
          <div className="h-2 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}/>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/70 text-xs">{progressPercent}% {t.completed}</span>
            {phase === "questions" && (
              <span className="text-white/80 text-xs font-medium">{questions[currentQ]?.phaseLabel}</span>
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
            <span className="text-[#00BFA5] text-xs font-semibold tracking-widest uppercase">{t.badge}</span>
          </div>

          {/* Imagem hero */}
          <div className="relative w-full rounded-2xl overflow-hidden mb-5 shadow-md" style={{aspectRatio:"16/9"}}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/hero_quiz-4yyjBHkD2a3bcnpKdnwqZj.webp"
              alt="Avaliação metabólica"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"/>
            <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
              {[t.b1, t.b2, t.b3].map((b) => (
                <span key={b} className="flex items-center gap-1 bg-white/95 text-[#00BFA5] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="#00BFA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-[#1A1A2E] text-2xl font-extrabold leading-tight text-left w-full mb-2">
            {t.headline.split(t.headlineHl)[0]}
            <span className="text-[#00BFA5]">{t.headlineHl}</span>
            {t.headline.split(t.headlineHl)[1]}
          </h1>
          <p className="text-[#6B7280] text-sm text-left w-full mb-4">{t.sub}</p>

          {/* Checklist */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 w-full mb-5">
            {t.meta.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-[#374151] text-sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l4 4L19 7" stroke="#00BFA5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {item}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 w-full mb-5">
            {[t.stat1, t.stat2, t.stat3].map((s) => (
              <div key={s.num} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
                <div className="text-[#00BFA5] text-lg font-extrabold">{s.num}</div>
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
            {startSession.isPending ? (lang === "pt" ? "Iniciando..." : "Iniciando...") : t.startBtn}
          </button>
          <p className="text-[#9CA3AF] text-xs mt-3 flex items-center gap-1 justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#9CA3AF" strokeWidth="2"/></svg>
            {t.privacy}
          </p>
        </div>
      </div>
    );
  }

  // ── QUESTIONS ─────────────────────────────────────────────────────────────────
  if (phase === "questions") {
    const q = questions[currentQ];
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
        <Header />
        <div className="flex-1 px-4 pt-5 pb-8 max-w-md mx-auto w-full">
          <div key={currentQ} className="animate-in fade-in slide-in-from-right-3 duration-250">
            <h2 className="text-[#1A1A2E] text-xl font-extrabold leading-tight mb-2">{q.question}</h2>
            {q.sub && <p className="text-[#6B7280] text-sm mb-4">{q.sub}</p>}

            {/* Feedback */}
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
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={animating}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 ${
                    selectedOption === idx
                      ? "border-[#00BFA5] bg-[#E0F7F4] shadow-md scale-[0.98]"
                      : "border-gray-200 bg-white hover:border-[#00BFA5]/50 hover:shadow-sm active:scale-[0.98]"
                  }`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">{q.emoji[idx]}</span>
                  <span className={`flex-1 text-sm font-semibold leading-snug ${selectedOption === idx ? "text-[#00796B]" : "text-[#1A1A2E]"}`}>
                    {opt.text}
                  </span>
                  {selectedOption === idx && (
                    <svg className="flex-shrink-0 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#00BFA5"/>
                      <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>

            <p className="text-center text-[#9CA3AF] text-xs mt-5 flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#9CA3AF" strokeWidth="2"/></svg>
              {t.confidential}
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

            <h3 className="text-[#1A1A2E] text-lg font-bold mb-2">{t.loadingTitle}</h3>
            <p className="text-[#6B7280] text-sm mb-6 min-h-[20px]">{t.loadingMsgs[loadingMsgIdx]}</p>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-5">
              <div className="h-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] rounded-full transition-all duration-500" style={{ width: `${loadingProgress}%` }}/>
            </div>

            <div className="text-left space-y-2">
              {t.loadingMsgs.map((m, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm transition-all duration-300 ${loadingProgress > (i / t.loadingMsgs.length) * 100 ? "text-[#00BFA5]" : "text-gray-300"}`}>
                  {loadingProgress > (i / t.loadingMsgs.length) * 100
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
  if (phase === "result") {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
        <Header title={t.resultTitle} showTimer />
        <div className="flex-1 px-4 pt-5 pb-8 max-w-md mx-auto w-full">
          {/* Badge do tipo */}
          <div className="bg-[#E0F7F4] border border-[#00BFA5]/30 rounded-xl px-4 py-3 mb-4 text-center">
            <span className="text-[#00796B] text-xs font-bold tracking-widest uppercase">{profile.tag}</span>
          </div>

          {/* Headline */}
          <h2 className="text-[#1A1A2E] text-xl font-extrabold leading-tight mb-3">{profile.headline}</h2>

          {/* Absolvição */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            <p className="text-[#374151] text-sm leading-relaxed">{profile.absolution}</p>
          </div>

          {/* Prova social */}
          <div className="bg-[#00BFA5] rounded-2xl p-4 mb-4 text-center">
            <p className="text-white text-sm font-bold leading-snug">✅ {profile.stat}</p>
          </div>

          {/* Barra de bloqueio */}
          <div className="bg-white rounded-2xl p-4 mb-5 shadow-sm border border-gray-100">
            <div className="flex justify-between text-xs text-[#6B7280] mb-2">
              <span>{t.blockLabel}</span>
              <span className="font-bold text-red-500">{profile.blockLevel}</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-red-500 transition-all duration-1000"
                style={{ width: `${profile.blockMeter}%` }}
              />
            </div>
            <p className="text-[#6B7280] text-xs mt-2">
              {lang === "pt"
                ? "Quanto mais alto o bloqueio, mais difícil emagrecer sem tratar a causa raiz"
                : "Cuanto más alto el bloqueo, más difícil adelgazar sin tratar la causa raíz"
              }
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => setPhase("optin")}
            className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-[#00BFA5]/30 active:scale-95 transition-transform mb-3"
          >
            {profile.cta} →
          </button>
          <p className="text-center text-[#9CA3AF] text-xs">
            {lang === "pt" ? "Protocolo personalizado para o seu tipo de bloqueio" : "Protocolo personalizado para tu tipo de bloqueo"}
          </p>
        </div>
      </div>
    );
  }

  // ── OPT-IN ────────────────────────────────────────────────────────────────────
  if (phase === "optin") {
    return (
      <div className="min-h-screen bg-[#F0F4F8] flex flex-col">
        <Header title={lang === "pt" ? "Sua Solução Personalizada" : "Tu Solución Personalizada"} showTimer />
        <div className="flex-1 px-4 pt-5 pb-8 max-w-md mx-auto w-full">
          <div className="bg-[#E0F7F4] border border-[#00BFA5]/30 rounded-xl px-4 py-2 mb-4 text-center">
            <span className="text-[#00796B] text-xs font-bold">{profile.tag}</span>
          </div>

          <h2 className="text-[#1A1A2E] text-xl font-extrabold leading-tight mb-2">{t.optinTitle}</h2>
          <p className="text-[#6B7280] text-sm mb-5">{t.optinSub}</p>

          <form onSubmit={handleOptIn} className="space-y-4">
            <div>
              <label className="block text-[#374151] text-sm font-semibold mb-1.5">{t.nameLabel}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                required
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A2E] text-sm placeholder-gray-400 focus:outline-none focus:border-[#00BFA5] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#374151] text-sm font-semibold mb-1.5">{t.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                required
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3.5 text-[#1A1A2E] text-sm placeholder-gray-400 focus:outline-none focus:border-[#00BFA5] transition-colors"
              />
            </div>

            {/* O que vão receber */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <p className="text-[#374151] text-xs font-bold mb-2 uppercase tracking-wide">{t.youWillGet}</p>
              {[
                lang === "pt" ? `✅ Protocolo específico para ${profile.tag.split("—")[1]?.trim() || "seu bloqueio"}` : `✅ Protocolo específico para ${profile.tag.split("—")[1]?.trim() || "tu bloqueo"}`,
                lang === "pt" ? "✅ Mapa de alimentos desbloqueadores" : "✅ Mapa de alimentos desbloqueadores",
                lang === "pt" ? "✅ Guia de emergência para o antojo noturno" : "✅ Guía de emergencia para el antojo nocturno",
              ].map((item) => (
                <p key={item} className="text-[#374151] text-sm py-1">{item}</p>
              ))}
            </div>

            <button
              type="submit"
              disabled={completeQuiz.isPending || !name || !email}
              className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] text-white font-bold text-base py-4 rounded-full shadow-lg shadow-[#00BFA5]/30 disabled:opacity-60 active:scale-95 transition-all"
            >
              {completeQuiz.isPending ? t.submitting : t.submitBtn}
            </button>

            <p className="text-center text-[#9CA3AF] text-xs flex items-center justify-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#9CA3AF" strokeWidth="2"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#9CA3AF" strokeWidth="2"/></svg>
              {lang === "pt" ? "100% seguro. Sem spam. Cancele quando quiser." : "100% seguro. Sin spam. Cancela cuando quieras."}
            </p>
          </form>
        </div>
      </div>
    );
  }

  return null;
}
