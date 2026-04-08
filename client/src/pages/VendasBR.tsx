import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

const PRODUCT_PRICE = 47; // R$47
const ORDER_BUMP_PRICE = 19.9; // R$19,90

// Personalização por tipo de bloqueio — versão brasileira
const BLOCK_CONTENT = {
  1: {
    badge: "Bloqueio Tipo 1 — Cortisol Elevado",
    headline: (name: string) =>
      `${name}, seu corpo está em modo "emergência" e por isso não consegue queimar gordura`,
    subheadline:
      "O estresse crônico eleva o cortisol, que ordena ao seu corpo armazenar gordura abdominal como 'reserva de emergência'. Não é falta de força de vontade. É biologia.",
    color: "text-orange-600",
    badgeColor: "bg-orange-50 text-orange-700 border border-orange-200",
  },
  2: {
    badge: "Bloqueio Tipo 2 — Resistência à Insulina",
    headline: (name: string) =>
      `${name}, cada vez que você faz dieta restritiva, seu corpo aprende a acumular MAIS gordura`,
    subheadline:
      "As dietas de restrição calórica ativam o mecanismo de sobrevivência celular, que bloqueia a queima de gordura e a armazena com mais eficiência. Quanto mais você restringe, mais o corpo retém.",
    color: "text-emerald-600",
    badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  3: {
    badge: "Bloqueio Tipo 3 — Desregulação Hormonal Noturna",
    headline: (name: string) =>
      `${name}, sua vontade de doce à noite não é fraqueza — é um sinal hormonal que ninguém te explicou`,
    subheadline:
      "A leptina e a grelina — os hormônios da fome — se desregulam pelo estresse e pela restrição. Seu corpo literalmente pede carboidratos à noite para compensar. É química, não falta de vontade.",
    color: "text-purple-600",
    badgeColor: "bg-purple-50 text-purple-700 border border-purple-200",
  },
};

// Countdown de 15 minutos
function useCountdown() {
  const KEY = "dm_br_countdown_end";
  const getEnd = () => {
    if (typeof window === "undefined") return Date.now() + 15 * 60 * 1000;
    const stored = localStorage.getItem(KEY);
    if (stored) {
      const end = parseInt(stored, 10);
      if (end > Date.now()) return end;
    }
    const newEnd = Date.now() + 15 * 60 * 1000;
    localStorage.setItem(KEY, String(newEnd));
    return newEnd;
  };

  const [timeLeft, setTimeLeft] = useState(() => {
    const end = getEnd();
    return Math.max(0, Math.floor((end - Date.now()) / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const end = getEnd();
      const left = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setTimeLeft(left);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  return { minutes, seconds, expired: timeLeft === 0 };
}

const TESTIMONIALS_BR = [
  {
    name: "Fernanda O.",
    location: "São Paulo, SP",
    result: "−7 kg em 5 semanas",
    text: "Fiz todas as dietas que existem. Low carb, jejum intermitente, dieta da proteína... Perdia uns quilinhos e voltava tudo. Quando entendi que meu corpo estava com a Trava Metabólica do Estresse, tudo fez sentido. Em 5 semanas perdi 7 kg sem abrir mão do arroz com feijão.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_valentina_3cb09301.png",
    stars: 5,
  },
  {
    name: "Camila S.",
    location: "Belo Horizonte, MG",
    result: "−9 kg em 7 semanas",
    text: "Sempre achei que a culpa era minha, que eu não tinha disciplina. Quando li sobre o Bloqueio Metabólico, chorei de alívio. Finalmente tinha uma explicação real. O protocolo de 3 minutos é tão simples que parece impossível funcionar — mas funciona. 9 quilos em 7 semanas.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_carolina_4fa4b365.png",
    stars: 5,
  },
  {
    name: "Juliana P.",
    location: "Curitiba, PR",
    result: "−5 kg em 3 semanas",
    text: "O que mais me surpreendeu foi não ter que abrir mão de nada. Continuo comendo meu churrasco de fim de semana, meu pão de queijo no café. Só adicionei o ritual de 3 minutos antes das refeições. Na terceira semana já senti a barriga mais chapada e a calça mais folgada.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_daniela_2ce81877.png",
    stars: 5,
  },
];

const FAQ_BR = [
  {
    q: "Funciona para mim se já tentei de tudo sem resultado?",
    a: "Sim — especialmente para você. O Protocolo de Desbloqueio foi desenvolvido para mulheres que já tentaram dietas convencionais e não tiveram resultado permanente. Se as dietas normais não funcionaram, é porque seu bloqueio metabólico nunca foi tratado. Este protocolo ataca exatamente isso.",
  },
  {
    q: "Preciso deixar de comer arroz, feijão, pão de queijo ou churrasco?",
    a: "Não. O protocolo funciona ADICIONANDO um ritual de 3 minutos antes das suas refeições habituais. Você não elimina nada. Pode continuar comendo seus pratos favoritos — o protocolo prepara seu metabolismo para processá-los sem acumular gordura.",
  },
  {
    q: "É seguro? Tem efeitos colaterais?",
    a: "Completamente seguro. O protocolo se baseia em técnicas de ativação enzimática e regulação hormonal natural — sem remédios, sem suplementos, sem procedimentos. É simplesmente uma sequência de ações que sinaliza ao seu corpo que ele pode 'desbloquear' a queima de gordura.",
  },
  {
    q: "Em quanto tempo verei resultados?",
    a: "A maioria das usuárias relata sentir a barriga mais desinchada nos primeiros 7 dias. Os resultados na balança costumam aparecer entre a semana 2 e 3. Os resultados completos se consolidam em 4 a 8 semanas de uso consistente.",
  },
  {
    q: "E se não funcionar para mim?",
    a: "Você tem 30 dias de garantia incondicional. Se por qualquer motivo não estiver satisfeita com os resultados, devolvemos 100% do seu investimento — sem perguntas, sem formulários complicados. O risco é completamente nosso.",
  },
];

// Link Kiwify para o produto BR (R$47)
const KIWIFY_BR_MAIN = "https://pay.kiwify.com/JTSj9Qi";

// Vagas restantes no grupo de suporte (urgência real)
const VAGAS_GRUPO = 37;

export default function VendasBR() {
  const [orderBump, setOrderBump] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitDismissed, setExitDismissed] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { minutes, seconds } = useCountdown();
  const trackConversion = trpc.quiz.trackConversion.useMutation();

  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  const sessionId = params.get("s") || undefined;
  const rawName = params.get("n") || "";
  const name = rawName ? decodeURIComponent(rawName) : "Amiga";
  const blockType = (parseInt(params.get("block") || "2") || 2) as 1 | 2 | 3;
  const block = BLOCK_CONTENT[blockType] || BLOCK_CONTENT[2];

  const totalPrice = PRODUCT_PRICE + (orderBump ? ORDER_BUMP_PRICE : 0);

  // Exit-intent
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !exitDismissed) {
        setShowExitIntent(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitDismissed]);

  const handleBuy = async () => {
    await trackConversion.mutateAsync({
      sessionId,
      type: "main_offer",
      amount: Math.round(PRODUCT_PRICE * 100),
    });
    if (orderBump) {
      await trackConversion.mutateAsync({
        sessionId,
        type: "order_bump",
        amount: Math.round(ORDER_BUMP_PRICE * 100),
      });
    }
    const upsellUrl = encodeURIComponent(`${window.location.origin}/upsell-br?s=${sessionId || ""}`);
    window.location.href = `${KIWIFY_BR_MAIN}?redirect_to=${upsellUrl}`;
  };

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* EXIT-INTENT POPUP */}
      {showExitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => { setShowExitIntent(false); setExitDismissed(true); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">⏳</div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                {name}, vai deixar seu metabolismo continuar travado?
              </h2>
              <p className="text-gray-500 text-sm">
                Você já tentou tanto. Essa pode ser a última vez que vê essa oferta.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
              <p className="text-red-700 text-sm font-semibold text-center">
                🚨 Se fechar essa página, o preço de R$47 desaparece.
              </p>
              <p className="text-red-600 text-xs text-center mt-1">
                Na próxima vez que ver isso, o preço será R$197.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                "Seu bloqueio metabólico NÃO se resolve sozinho com o tempo",
                "Cada dieta restritiva que você fizer vai piorar ainda mais",
                "O Protocolo de 3 Minutos é a única solução que ataca a raiz",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700 text-sm">{point}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowExitIntent(false); setExitDismissed(true); handleBuy(); }}
              className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] hover:from-[#00A896] hover:to-[#1EBDD0] text-white font-extrabold text-lg py-4 rounded-full transition-all active:scale-95 shadow-lg shadow-teal-200 mb-3"
            >
              Sim, quero desbloquear meu metabolismo por R$47 →
            </button>
            <button
              onClick={() => { setShowExitIntent(false); setExitDismissed(true); }}
              className="w-full text-gray-400 text-xs py-2 hover:text-gray-500 transition-colors"
            >
              Não, prefiro continuar sem resultado e perder essa oferta.
            </button>
          </div>
        </div>
      )}

      {/* ── BARRA DE URGÊNCIA ─────────────────────────────────────────────────── */}
      <div className="bg-red-600 text-white text-center py-2.5 px-4">
        <p className="text-sm font-bold">
          ⚡ Oferta especial expira em:{" "}
          <span className="font-mono text-base bg-red-800 px-2 py-0.5 rounded">
            {minutes}:{seconds}
          </span>
          {" "}— Preço normal: <span className="line-through opacity-70">R$197</span>
        </p>
      </div>

      {/* ── HEADER COM LOGO DESTACADA ─────────────────────────────────────────── */}
      <header className="bg-[#00BFA5] sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.3"/>
              <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-extrabold text-base leading-tight tracking-tight">Desbloqueio Metabólico</span>
            <span className="text-white/70 text-[10px] font-medium leading-none">Protocolo de 3 Minutos</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── SEÇÃO 1: HERO — Personalizado por nome e tipo de bloqueio ─────────── */}
        <div className="text-center mb-10">
          <span className={`inline-block text-xs font-bold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wide ${block.badgeColor}`}>
            🔬 {block.badge}
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {block.headline(name).split(name).map((part, i, arr) => (
              i < arr.length - 1
                ? <span key={i}>{part}<span className={block.color}>{name}</span></span>
                : <span key={i}>{part}</span>
            ))}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            {block.subheadline}
          </p>
          {/* Mini produto visual */}
          <div className="inline-flex items-center gap-3 bg-[#E0F7F4] border border-[#B2DFDB] rounded-2xl px-5 py-3 mb-6">
            <div className="w-10 h-10 bg-[#00BFA5] rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
              </svg>
            </div>
            <div className="text-left">
              <p className="text-[#00897B] font-extrabold text-sm leading-tight">Protocolo do Desbloqueio de 3 Minutos</p>
              <p className="text-[#00897B]/70 text-xs">Acesso digital imediato · Funciona com qualquer comida brasileira</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={scrollToCta}
              className="bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] text-white font-extrabold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg shadow-teal-200 hover:scale-105 active:scale-95"
            >
              Ver minha solução personalizada ↓
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-3">🔒 Pagamento seguro · Acesso imediato · Garantia 30 dias</p>
        </div>

        {/* ── SEÇÃO 2: BENEFÍCIOS — 3 principais (modelo SwipeFile) ─────────────── */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">
              O que o Protocolo faz pelo seu corpo
            </h2>
            <p className="text-gray-500 text-sm mt-2">Três transformações que acontecem quando o bloqueio é removido</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: "🔥",
                title: "Metabolismo desbloqueado",
                desc: "Seu corpo volta a queimar gordura naturalmente — em repouso, depois do churrasco, depois do pão de queijo. Sem restrição, sem sofrimento.",
                highlight: "Sem dieta restritiva",
              },
              {
                icon: "😴",
                title: "Compulsão noturna eliminada",
                desc: "A vontade de doce à noite desaparece quando os hormônios da fome voltam ao equilíbrio. Você para de lutar contra o próprio corpo.",
                highlight: "Sem força de vontade extra",
              },
              {
                icon: "⚡",
                title: "Energia e disposição de volta",
                desc: "Com o cortisol regulado, você acorda disposta, dorme profundo e tem energia para a sua rotina — sem precisar de café extra.",
                highlight: "Desde a primeira semana",
              },
            ].map((b) => (
              <div key={b.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-extrabold text-gray-900 text-base mb-2">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{b.desc}</p>
                <span className="inline-block bg-[#E0F7F4] text-[#00897B] text-xs font-bold px-3 py-1 rounded-full">
                  ✓ {b.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEÇÃO 3: COMO FUNCIONA — 3 passos simples (modelo SwipeFile) ──────── */}
        <div className="mb-12 bg-gray-50 rounded-3xl p-6 md:p-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#E0F7F4] text-[#00897B] text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wide">
              Como funciona
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              3 passos. 3 minutos. Antes de cada refeição.
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              Funciona com arroz com feijão, churrasco, feijoada, pão de queijo — qualquer comida brasileira.
            </p>
          </div>
          <div className="space-y-5">
            {[
              {
                step: "01",
                title: "Ativação Enzimática",
                desc: "Uma combinação específica de alimentos comuns que ativa as enzimas lipolíticas — as responsáveis por 'desbloquear' as células de gordura para que liberem energia.",
                time: "1 minuto",
                color: "bg-[#00BFA5]",
              },
              {
                step: "02",
                title: "Sinal de Saciedade Antecipada",
                desc: "Uma técnica de respiração de 60 segundos que reduz o cortisol em tempo real e ativa o sistema nervoso parassimpático — o 'modo queima de gordura' do seu corpo.",
                time: "1 minuto",
                color: "bg-[#26C6DA]",
              },
              {
                step: "03",
                title: "Calibração de Insulina",
                desc: "Um ritual alimentar de 60 segundos que estabiliza a glicose antes de comer, evitando o pico de insulina que converte os carboidratos em gordura armazenada.",
                time: "1 minuto",
                color: "bg-[#00897B]",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className={`flex-shrink-0 w-11 h-11 ${item.color} text-white rounded-full flex items-center justify-center font-extrabold text-sm shadow-md`}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <h3 className="font-extrabold text-gray-900">{item.title}</h3>
                    <span className="text-xs text-[#00897B] font-bold bg-[#E0F7F4] px-3 py-1 rounded-full">{item.time}</span>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={scrollToCta}
              className="bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] text-white font-extrabold px-8 py-4 rounded-full text-base shadow-lg shadow-teal-200 hover:scale-105 transition-all active:scale-95"
            >
              Quero começar hoje →
            </button>
          </div>
        </div>

        {/* ── SEÇÃO 4: QUEM CRIOU — Ana Paula Ferreira ──────────────────────────── */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <span className="inline-block bg-[#E0F7F4] text-[#00897B] text-xs font-bold px-4 py-1.5 rounded-full mb-3 uppercase tracking-wide">
              Quem criou este protocolo
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-5 mb-5">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/ana_paula_ferreira-mjHRev2Yaie3xqQuHV2EXb.webp"
                alt="Ana Paula Ferreira"
                className="flex-shrink-0 w-20 h-20 rounded-full object-cover border-4 border-[#00BFA5] shadow-md"
              />
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Ana Paula Ferreira</h3>
                <p className="text-gray-500 text-sm">Professora · 47 anos · Belo Horizonte, MG</p>
                <p className="text-gray-400 text-xs mt-0.5">Mãe de José (19) e Laura (16)</p>
              </div>
            </div>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Em setembro de 2021, no aniversário de 15 anos da minha filha Laura, meu marido tirou uma foto nossa abraçadas. Quando ele me mostrou, eu não me reconheci. Estava usando um vestido largo justamente para esconder a barriga — e mesmo assim dava para ver.
              </p>
              <p>
                Nos 11 anos anteriores, eu tinha tentado de tudo. Low carb por 4 meses — perdi 5kg, engordei 8kg. Jejum intermitente por 3 meses — fiquei irritada, não dormi direito, desisti. Academia 5 vezes por semana por 8 meses — emagreci 3kg, fiquei com dor no joelho, parei.
              </p>
              <p>
                <strong className="text-gray-900">"Eu achava que era fraqueza minha"</strong>, ela conta. <em>"Que eu não tinha disciplina suficiente. Que todo mundo conseguia emagrecer menos eu. Chorei muito me culpando por isso."</em>
              </p>
              <p>
                A virada aconteceu por acidente. Em uma noite de insônia em 2022, pesquisando sobre cortisol e sono, Ana Paula encontrou um estudo sobre como o estresse crônico literalmente bloqueia a queima de gordura em nível celular — como um <strong className="text-gray-900">termostato travado</strong>.
              </p>
              <p>
                O resultado: <strong className="text-[#00897B]">14 kg em 5 meses</strong>, sem abrir mão do arroz com feijão, do churrasco de domingo ou do pão de queijo no café da manhã.
              </p>
            </div>
            <div className="mt-5 bg-[#F0FDFB] rounded-xl p-4 border border-[#B2DFDB]">
              <p className="text-[#00897B] text-sm font-semibold text-center">
                ✦ "Se funcionou para mim depois de 11 anos tentando, vai funcionar para você."
              </p>
            </div>
          </div>
        </div>

        {/* ── SEÇÃO 5: DEPOIMENTOS — Prova social com resultados reais ─────────── */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Mulheres brasileiras que já desbloquearam o metabolismo
            </h2>
            <p className="text-gray-500 text-sm mt-2">Resultados reais de mulheres com os 3 tipos de bloqueio</p>
          </div>
          <div className="space-y-4">
            {TESTIMONIALS_BR.map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-[#B2DFDB]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                        <span className="text-gray-400 text-xs ml-2">{t.location}</span>
                      </div>
                      <span className="text-[#00897B] font-bold text-sm bg-[#E0F7F4] px-2 py-0.5 rounded-full">
                        {t.result}
                      </span>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <span key={i} className="text-amber-400 text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">"{t.text}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEÇÃO 6: URGÊNCIA ─────────────────────────────────────────────────── */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-10">
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">🔴</div>
            <div>
              <h3 className="font-extrabold text-red-700 text-base mb-1">
                Apenas {VAGAS_GRUPO} vagas restantes no Grupo de Suporte Privado
              </h3>
              <p className="text-red-600 text-sm leading-relaxed">
                Cada compra inclui acesso ao grupo privado onde Ana Paula acompanha pessoalmente as participantes. O grupo tem capacidade limitada para garantir atenção individual — quando as {VAGAS_GRUPO} vagas acabarem, o acesso ao grupo será removido da oferta.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-red-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.round((VAGAS_GRUPO / 100) * 100)}%` }}></div>
                </div>
                <span className="text-red-700 font-bold text-xs whitespace-nowrap">{VAGAS_GRUPO} de 100 vagas</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEÇÃO 7: OFERTA — Value Stack + CTA ──────────────────────────────── */}
        <div ref={ctaRef} className="mb-10">
          {/* Value Stack */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 md:p-8 mb-6">
            <h2 className="text-xl font-extrabold text-center mb-2">
              Tudo que você recebe hoje
            </h2>
            <p className="text-gray-400 text-sm text-center mb-6">Valor total: <span className="line-through">R$465</span> — Seu investimento: <span className="text-emerald-400 font-extrabold text-lg">Só R$47</span></p>
            <div className="space-y-3 mb-6">
              {[
                { item: "Protocolo do Desbloqueio de 3 Minutos (Guia Principal)", value: "R$197" },
                { item: "Mapa de Alimentos Desbloqueadores para o Brasil", value: "R$97" },
                { item: "Guia de Emergência: O que fazer quando a vontade de doce ataca", value: "R$67" },
                { item: "Protocolo de Resgate para o Fim de Semana (churrasco, feijoada e mais)", value: "R$47" },
                { item: "Acesso a atualizações vitalício", value: "R$57" },
              ].map((row) => (
                <div key={row.item} className="flex items-center justify-between py-2 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 text-sm flex-shrink-0">✓</span>
                    <span className="text-gray-200 text-sm">{row.item}</span>
                  </div>
                  <span className="text-gray-500 text-sm line-through flex-shrink-0 ml-4">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Bump */}
          <div
            className={`border-2 rounded-xl p-4 mb-4 cursor-pointer transition-all duration-200 ${orderBump ? "border-emerald-500 bg-emerald-50" : "border-dashed border-gray-300 bg-gray-50"}`}
            onClick={() => setOrderBump(!orderBump)}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-colors ${orderBump ? "bg-emerald-600 border-emerald-600" : "border-gray-400"}`}>
                {orderBump && <span className="text-white text-xs font-bold">✓</span>}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  ✨ SIM, quero adicionar o <span className="text-emerald-600">Guia dos Chás Noturnos Desbloqueadores</span> por apenas +R$19,90
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  5 infusões específicas que aceleram o desbloqueio metabólico enquanto você dorme. Funciona em sinergia com o protocolo principal. Inclui chás fáceis de encontrar em qualquer mercado brasileiro.
                </p>
              </div>
            </div>
          </div>

          {/* Âncora de preço */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-center">
            <p className="text-amber-800 text-sm font-medium">
              💡 Para referência: uma consulta com nutricionista custa entre R$150 e R$400 — e não vai te dar o Protocolo de Desbloqueio.
              <strong> Hoje você paga menos que um jantar fora.</strong>
            </p>
          </div>

          {/* Botão CTA principal */}
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] hover:from-[#00A896] hover:to-[#1EBDD0] active:scale-[0.99] text-white font-extrabold text-xl py-5 rounded-full transition-all duration-200 shadow-xl shadow-teal-200 disabled:opacity-70"
          >
            {trackConversion.isPending
              ? "Processando..."
              : `Desbloquear meu Metabolismo por R$${totalPrice.toFixed(2).replace(".", ",")} →`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            🔒 Pagamento 100% seguro · Acesso imediato · Garantia de 30 dias
          </p>
        </div>

        {/* ── SEÇÃO 8: GARANTIA ─────────────────────────────────────────────────── */}
        <div className="border-2 border-[#B2DFDB] rounded-2xl p-6 mb-10 flex gap-4 items-start bg-[#F0FDFB]">
          <div className="text-4xl flex-shrink-0">🛡️</div>
          <div>
            <h3 className="font-extrabold text-gray-900 mb-1">Garantia Incondicional de 30 Dias</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Se por qualquer motivo você não estiver satisfeita com os resultados nos próximos 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas. Sem formulários complicados. O risco é completamente nosso.
            </p>
          </div>
        </div>

        {/* ── SEÇÃO 9: FAQ ──────────────────────────────────────────────────────── */}
        <div className="mb-10">
          <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">
            Perguntas frequentes
          </h2>
          <div className="space-y-3">
            {FAQ_BR.map((item, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="text-sm pr-4">{item.q}</span>
                  <span className={`text-emerald-600 text-lg flex-shrink-0 transition-transform duration-200 ${openFaq === idx ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── SEÇÃO 10: CTA FINAL ───────────────────────────────────────────────── */}
        <div className="text-center bg-gradient-to-br from-[#E0F7F4] to-[#F0FDFB] rounded-3xl p-8 border border-[#B2DFDB]">
          <div className="w-16 h-16 bg-[#00BFA5] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Ainda aqui, {name}?
          </h2>
          <p className="text-gray-600 mb-2 text-sm max-w-md mx-auto">
            Você tem duas opções agora.
          </p>
          <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
            <strong className="text-gray-700">Opção 1:</strong> Fechar essa página, continuar tentando as mesmas dietas que não funcionaram, e esperar que algo mude.<br/>
            <strong className="text-[#00897B]">Opção 2:</strong> Investir R$47 hoje, remover o bloqueio metabólico que está impedindo seu corpo de emagrecer, e começar a ver resultados em 7 dias.
          </p>
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="w-full max-w-md mx-auto block bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] hover:from-[#00A896] hover:to-[#1EBDD0] text-white font-extrabold text-xl py-5 rounded-full transition-all duration-200 shadow-xl shadow-teal-200 disabled:opacity-70 active:scale-95"
          >
            Sim, quero desbloquear meu metabolismo →
          </button>
          <p className="text-xs text-gray-400 mt-3">
            🔒 Garantia de 30 dias · Acesso imediato · Só R$47
          </p>
        </div>

      </div>
    </div>
  );
}
