import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";

const PRODUCT_PRICE = 47;
const ORDER_BUMP_PRICE = 19.9;

const BLOCK_CONTENT = {
  1: {
    badge: "Bloqueio Tipo 1 — Cortisol Elevado",
    headline: (name: string) =>
      `${name}, seu corpo está em modo "emergência" e por isso não consegue queimar gordura`,
    subheadline:
      "O estresse crônico eleva o cortisol, que ordena ao seu corpo armazenar gordura abdominal como 'reserva de emergência'. Não é falta de força de vontade. É biologia.",
    color: "#EA580C",
    badgeBg: "#FFF7ED",
    badgeBorder: "#FED7AA",
  },
  2: {
    badge: "Bloqueio Tipo 2 — Resistência à Insulina",
    headline: (name: string) =>
      `${name}, cada vez que você faz dieta restritiva, seu corpo aprende a acumular MAIS gordura`,
    subheadline:
      "As dietas de restrição calórica ativam o mecanismo de sobrevivência celular, que bloqueia a queima de gordura e a armazena com mais eficiência. Quanto mais você restringe, mais o corpo retém.",
    color: "#1A8A6E",
    badgeBg: "#E8F8F4",
    badgeBorder: "#6DDFC4",
  },
  3: {
    badge: "Bloqueio Tipo 3 — Desregulação Hormonal Noturna",
    headline: (name: string) =>
      `${name}, sua vontade de doce à noite não é fraqueza — é um sinal hormonal que ninguém te explicou`,
    subheadline:
      "A leptina e a grelina — os hormônios da fome — se desregulam pelo estresse e pela restrição. Seu corpo literalmente pede carboidratos à noite para compensar. É química, não falta de vontade.",
    color: "#7C3AED",
    badgeBg: "#F5F3FF",
    badgeBorder: "#C4B5FD",
  },
};

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

const KIWIFY_BR_MAIN = "https://pay.kiwify.com/JTSj9Qi";
const VAGAS_GRUPO = 37;

const Check = ({ size = 16, color = "white" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12l5 5L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !exitDismissed) setShowExitIntent(true);
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitDismissed]);

  const handleBuy = async () => {
    await trackConversion.mutateAsync({ sessionId, type: "main_offer", amount: Math.round(PRODUCT_PRICE * 100) });
    if (orderBump) {
      await trackConversion.mutateAsync({ sessionId, type: "order_bump", amount: Math.round(ORDER_BUMP_PRICE * 100) });
    }
    const upsellUrl = encodeURIComponent(`${window.location.origin}/upsell-br?s=${sessionId || ""}`);
    window.location.href = `${KIWIFY_BR_MAIN}?redirect_to=${upsellUrl}`;
  };

  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" style={{ background: "var(--dm-white)", fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── EXIT-INTENT POPUP ─────────────────────────────────────────────── */}
      {showExitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300" style={{ boxShadow: "var(--shadow-lg)" }}>
            <button
              onClick={() => { setShowExitIntent(false); setExitDismissed(true); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors" style={{ color: "var(--dm-grey-300)", background: "var(--dm-grey-50)" }}
            >
              &times;
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "var(--teal-pale)" }}>
                <span className="text-3xl">⏳</span>
              </div>
              <h2 className="text-[22px] font-extrabold mb-2 leading-tight" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
                {name}, vai deixar seu metabolismo continuar travado?
              </h2>
              <p className="text-[13px]" style={{ color: "var(--dm-text-soft)" }}>
                Você já tentou tanto. Essa pode ser a última vez que vê essa oferta.
              </p>
            </div>
            <div className="rounded-2xl p-4 mb-5" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
              <p className="text-[13px] font-semibold text-center" style={{ color: "#B91C1C" }}>
                Se fechar essa página, o preço de R$47 desaparece.
              </p>
              <p className="text-[11px] text-center mt-1" style={{ color: "#DC2626" }}>
                Na próxima vez que ver isso, o preço será R$197.
              </p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                "Seu bloqueio metabólico NÃO se resolve sozinho com o tempo",
                "Cada dieta restritiva que você fizer vai piorar ainda mais",
                "O Protocolo de 3 Minutos é a única solução que ataca a raiz",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--teal)" }}>
                    <Check size={12} />
                  </div>
                  <span className="text-[13px] font-medium" style={{ color: "var(--dm-text)" }}>{point}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => { setShowExitIntent(false); setExitDismissed(true); handleBuy(); }}
              className="dm-btn-primary mb-3"
            >
              Sim, quero desbloquear meu metabolismo →
            </button>
            <button
              onClick={() => { setShowExitIntent(false); setExitDismissed(true); }}
              className="w-full text-[11px] py-2 transition-colors" style={{ color: "var(--dm-grey-300)" }}
            >
              Não, prefiro continuar sem resultado e perder essa oferta.
            </button>
          </div>
        </div>
      )}

      {/* ── BARRA DE URGÊNCIA ─────────────────────────────────────────────── */}
      <div className="text-white text-center py-3 px-4" style={{ background: "#DC2626" }}>
        <p className="text-[13px] font-bold">
          Oferta especial expira em:{" "}
          <span className="font-mono text-[15px] px-2 py-0.5 rounded" style={{ background: "#991B1B" }}>
            {minutes}:{seconds}
          </span>
          {" "}— Preço normal: <span className="line-through opacity-70">R$197</span>
        </p>
      </div>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header className="dm-header">
        <div className="max-w-3xl mx-auto px-5 py-3.5 flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.18)" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.25"/>
              <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white font-extrabold text-[15px] leading-tight" style={{ letterSpacing: "-0.025em" }}>Desbloqueio Metabólico</span>
            <span className="text-white/60 text-[10px] font-medium leading-none mt-0.5" style={{ letterSpacing: "0.15em", textTransform: "uppercase" }}>Protocolo de 3 Minutos</span>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-10">

        {/* ── SEÇÃO 1: HERO ───────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-[10px] font-bold px-5 py-2 rounded-full mb-5"
            style={{ background: block.badgeBg, color: block.color, border: `1.5px solid ${block.badgeBorder}`, letterSpacing: "0.15em", textTransform: "uppercase" }}
          >
            {block.badge}
          </span>
          <h1 className="text-[clamp(26px,5vw,38px)] font-extrabold leading-[1.2] mb-5" style={{ color: "var(--dm-text)", letterSpacing: "-0.025em" }}>
            {block.headline(name).split(name).map((part, i, arr) => (
              i < arr.length - 1
                ? <span key={i}>{part}<span style={{ color: block.color }}>{name}</span></span>
                : <span key={i}>{part}</span>
            ))}
          </h1>
          <p className="text-[15px] max-w-2xl mx-auto mb-7" style={{ color: "var(--dm-text-soft)", lineHeight: 1.75 }}>
            {block.subheadline}
          </p>

          {/* Mini produto */}
          <div className="inline-flex items-center gap-3 rounded-2xl px-5 py-3.5 mb-7" style={{ background: "var(--teal-pale)", border: `1.5px solid var(--teal-light)` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--grad)" }}>
              <Check size={22} />
            </div>
            <div className="text-left">
              <p className="font-bold text-[14px] leading-tight" style={{ color: "var(--teal-dark)" }}>Protocolo do Desbloqueio de 3 Minutos</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--dm-text-soft)" }}>Acesso digital imediato · Funciona com qualquer comida brasileira</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={scrollToCta} className="dm-btn-primary max-w-md mx-auto">
              Ver minha solução personalizada ↓
            </button>
          </div>
          <p className="text-[11px] mt-4" style={{ color: "var(--dm-grey-300)" }}>
            Pagamento seguro · Acesso imediato · Garantia 30 dias
          </p>
        </div>

        {/* ── SEÇÃO 2: BENEFÍCIOS ─────────────────────────────────────────── */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <span className="dm-tag mb-3 inline-flex">
              <Check size={13} color="#1A8A6E" />
              Benefícios comprovados
            </span>
            <h2 className="text-[clamp(22px,4vw,30px)] font-extrabold" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
              O que o Protocolo faz pelo seu corpo
            </h2>
            <p className="text-[13px] mt-2" style={{ color: "var(--dm-text-soft)" }}>Três transformações que acontecem quando o bloqueio é removido</p>
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
              <div key={b.title} className="dm-card hover:shadow-md transition-shadow" style={{ padding: "var(--space-6)" }}>
                <div className="text-4xl mb-4">{b.icon}</div>
                <h3 className="font-bold text-[15px] mb-2" style={{ color: "var(--dm-text)" }}>{b.title}</h3>
                <p className="text-[13px] mb-4" style={{ color: "var(--dm-text-soft)", lineHeight: 1.65 }}>{b.desc}</p>
                <span className="dm-tag">
                  <Check size={13} color="#1A8A6E" />
                  {b.highlight}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEÇÃO 3: COMO FUNCIONA ──────────────────────────────────────── */}
        <div className="mb-14 rounded-[20px] p-6 md:p-10" style={{ background: "var(--teal-bg)" }}>
          <div className="text-center mb-8">
            <span className="dm-tag mb-3 inline-flex" style={{ letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "10px", fontWeight: 700 }}>
              Como funciona
            </span>
            <h2 className="text-[clamp(22px,4vw,30px)] font-extrabold" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
              3 passos. 3 minutos. Antes de cada refeição.
            </h2>
            <p className="text-[13px] mt-3 max-w-xl mx-auto" style={{ color: "var(--dm-text-soft)", lineHeight: 1.65 }}>
              Funciona com arroz com feijão, churrasco, feijoada, pão de queijo — qualquer comida brasileira.
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Ativação Enzimática",
                desc: "Uma combinação específica de alimentos comuns que ativa as enzimas lipolíticas — as responsáveis por 'desbloquear' as células de gordura para que liberem energia.",
                time: "1 minuto",
                bg: "var(--teal-dark)",
              },
              {
                step: "02",
                title: "Sinal de Saciedade Antecipada",
                desc: "Uma técnica de respiração de 60 segundos que reduz o cortisol em tempo real e ativa o sistema nervoso parassimpático — o 'modo queima de gordura' do seu corpo.",
                time: "1 minuto",
                bg: "var(--teal)",
              },
              {
                step: "03",
                title: "Calibração de Insulina",
                desc: "Um ritual alimentar de 60 segundos que estabiliza a glicose antes de comer, evitando o pico de insulina que converte os carboidratos em gordura armazenada.",
                time: "1 minuto",
                bg: "var(--teal-mid)",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 dm-card" style={{ padding: "var(--space-5)" }}>
                <div className="flex-shrink-0 w-11 h-11 text-white rounded-full flex items-center justify-center font-extrabold text-[13px]" style={{ background: item.bg, boxShadow: "var(--shadow-md)" }}>
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <h3 className="font-bold text-[15px]" style={{ color: "var(--dm-text)" }}>{item.title}</h3>
                    <span className="dm-tag" style={{ fontSize: "11px", fontWeight: 700 }}>{item.time}</span>
                  </div>
                  <p className="text-[13px]" style={{ color: "var(--dm-text-soft)", lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <button onClick={scrollToCta} className="dm-btn-primary max-w-md mx-auto">
              Quero começar hoje →
            </button>
          </div>
        </div>

        {/* ── SEÇÃO 4: QUEM CRIOU ─────────────────────────────────────────── */}
        <div className="mb-14">
          <div className="text-center mb-6">
            <span className="dm-tag inline-flex" style={{ letterSpacing: "0.15em", textTransform: "uppercase", fontSize: "10px", fontWeight: 700 }}>
              Quem criou este protocolo
            </span>
          </div>
          <div className="dm-card" style={{ padding: "var(--space-6)" }}>
            <div className="flex items-start gap-5 mb-5">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/ana_paula_ferreira-mjHRev2Yaie3xqQuHV2EXb.webp"
                alt="Ana Paula Ferreira"
                className="flex-shrink-0 w-20 h-20 rounded-full object-cover"
                style={{ border: "3px solid var(--teal)", boxShadow: "var(--shadow-sm)" }}
              />
              <div>
                <h3 className="font-extrabold text-lg" style={{ color: "var(--dm-text)" }}>Ana Paula Ferreira</h3>
                <p className="text-[13px]" style={{ color: "var(--dm-text-soft)" }}>Professora · 47 anos · Belo Horizonte, MG</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--dm-grey-300)" }}>Mãe de José (19) e Laura (16)</p>
              </div>
            </div>
            <div className="space-y-3 text-[14px] leading-[1.75]" style={{ color: "var(--dm-text-soft)" }}>
              <p>
                Em setembro de 2021, no aniversário de 15 anos da minha filha Laura, meu marido tirou uma foto nossa abraçadas. Quando ele me mostrou, eu não me reconheci. Estava usando um vestido largo justamente para esconder a barriga — e mesmo assim dava para ver.
              </p>
              <p>
                <strong style={{ color: "var(--dm-text)" }}>"Eu achava que era fraqueza minha"</strong>, ela conta. <em>"Que eu não tinha disciplina suficiente. Que todo mundo conseguia emagrecer menos eu. Chorei muito me culpando por isso."</em>
              </p>
              <p>
                A virada aconteceu por acidente. Em uma noite de insônia em 2022, pesquisando sobre cortisol e sono, Ana Paula encontrou um estudo sobre como o estresse crônico literalmente bloqueia a queima de gordura em nível celular — como um <strong style={{ color: "var(--dm-text)" }}>termostato travado</strong>.
              </p>
              <p>
                O resultado: <strong style={{ color: "var(--teal-dark)" }}>14 kg em 5 meses</strong>, sem abrir mão do arroz com feijão, do churrasco de domingo ou do pão de queijo no café da manhã.
              </p>
            </div>
            <div className="mt-5 rounded-2xl p-4" style={{ background: "var(--teal-pale)", border: "1px solid var(--teal-light)" }}>
              <p className="text-[13px] font-semibold text-center" style={{ color: "var(--teal-dark)" }}>
                "Se funcionou para mim depois de 11 anos tentando, vai funcionar para você."
              </p>
            </div>
          </div>
        </div>

        {/* ── SEÇÃO 5: DEPOIMENTOS ────────────────────────────────────────── */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-[clamp(22px,4vw,30px)] font-extrabold" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
              Mulheres brasileiras que já desbloquearam o metabolismo
            </h2>
            <p className="text-[13px] mt-2" style={{ color: "var(--dm-text-soft)" }}>Resultados reais de mulheres com os 3 tipos de bloqueio</p>
          </div>
          <div className="space-y-4">
            {TESTIMONIALS_BR.map((t) => (
              <div key={t.name} className="dm-card" style={{ padding: "var(--space-5)" }}>
                <div className="flex items-start gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                    style={{ border: "2px solid var(--teal-light)" }}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                      <div>
                        <span className="font-bold text-[14px]" style={{ color: "var(--dm-text)" }}>{t.name}</span>
                        <span className="text-[11px] ml-2" style={{ color: "var(--dm-grey-300)" }}>{t.location}</span>
                      </div>
                      <span className="dm-tag" style={{ fontSize: "12px", fontWeight: 700 }}>
                        {t.result}
                      </span>
                    </div>
                    <div className="flex mb-2">
                      {Array.from({ length: t.stars }).map((_, i) => (
                        <span key={i} className="text-amber-400 text-[14px]">★</span>
                      ))}
                    </div>
                    <p className="text-[13px] leading-[1.65]" style={{ color: "var(--dm-text-soft)" }}>"{t.text}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SEÇÃO 6: URGÊNCIA ───────────────────────────────────────────── */}
        <div className="rounded-[20px] p-5 mb-12" style={{ background: "#FEF2F2", border: "2px solid #FECACA" }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FEE2E2" }}>
              <span className="text-lg">🔴</span>
            </div>
            <div>
              <h3 className="font-extrabold text-[15px] mb-1" style={{ color: "#B91C1C" }}>
                Apenas {VAGAS_GRUPO} vagas restantes no Grupo de Suporte Privado
              </h3>
              <p className="text-[13px] leading-[1.65]" style={{ color: "#DC2626" }}>
                Cada compra inclui acesso ao grupo privado onde Ana Paula acompanha pessoalmente as participantes. O grupo tem capacidade limitada para garantir atenção individual — quando as {VAGAS_GRUPO} vagas acabarem, o acesso ao grupo será removido da oferta.
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full" style={{ background: "#FECACA" }}>
                  <div className="h-2 rounded-full" style={{ background: "#DC2626", width: `${Math.round((VAGAS_GRUPO / 100) * 100)}%` }}/>
                </div>
                <span className="text-[11px] font-bold whitespace-nowrap" style={{ color: "#B91C1C" }}>{VAGAS_GRUPO} de 100 vagas</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── SEÇÃO 7: OFERTA ─────────────────────────────────────────────── */}
        <div ref={ctaRef} className="mb-12">
          {/* Value Stack */}
          <div className="rounded-[20px] p-6 md:p-8 mb-6" style={{ background: "var(--dm-text)", color: "white" }}>
            <h2 className="text-[22px] font-extrabold text-center mb-2" style={{ letterSpacing: "-0.02em" }}>
              Tudo que você recebe hoje
            </h2>
            <p className="text-[13px] text-center mb-7" style={{ color: "var(--dm-grey-300)" }}>
              Valor total: <span className="line-through">R$465</span> — Seu investimento: <span className="font-extrabold text-lg" style={{ color: "var(--teal-mid)" }}>Só R$47</span>
            </p>
            <div className="space-y-3 mb-6">
              {[
                { item: "Protocolo do Desbloqueio de 3 Minutos (Guia Principal)", value: "R$197" },
                { item: "Mapa de Alimentos Desbloqueadores para o Brasil", value: "R$97" },
                { item: "Guia de Emergência: O que fazer quando a vontade de doce ataca", value: "R$67" },
                { item: "Protocolo de Resgate para o Fim de Semana (churrasco, feijoada e mais)", value: "R$47" },
                { item: "Acesso a atualizações vitalício", value: "R$57" },
              ].map((row) => (
                <div key={row.item} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal)" }}>
                      <Check size={12} />
                    </div>
                    <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.85)" }}>{row.item}</span>
                  </div>
                  <span className="text-[13px] line-through flex-shrink-0 ml-4" style={{ color: "rgba(255,255,255,0.35)" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Bump */}
          <div
            className="rounded-2xl p-5 mb-5 cursor-pointer transition-all duration-200"
            style={{
              border: orderBump ? "2px solid var(--teal)" : "2px dashed var(--dm-grey-300)",
              background: orderBump ? "var(--teal-pale)" : "var(--dm-grey-50)",
            }}
            onClick={() => setOrderBump(!orderBump)}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors"
                style={{
                  background: orderBump ? "var(--teal-dark)" : "transparent",
                  border: orderBump ? "2px solid var(--teal-dark)" : "2px solid var(--dm-grey-300)",
                }}
              >
                {orderBump && <Check size={12} />}
              </div>
              <div>
                <p className="font-bold text-[14px]" style={{ color: "var(--dm-text)" }}>
                  SIM, quero adicionar o <span style={{ color: "var(--teal-dark)" }}>Guia dos Chás Noturnos Desbloqueadores</span> por apenas +R$19,90
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--dm-text-soft)" }}>
                  5 infusões específicas que aceleram o desbloqueio metabólico enquanto você dorme. Funciona em sinergia com o protocolo principal. Inclui chás fáceis de encontrar em qualquer mercado brasileiro.
                </p>
              </div>
            </div>
          </div>

          {/* Âncora de preço */}
          <div className="rounded-2xl p-4 mb-6 text-center" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
            <p className="text-[13px] font-medium" style={{ color: "#92400E" }}>
              Para referência: uma consulta com nutricionista custa entre R$150 e R$400 — e não vai te dar o Protocolo de Desbloqueio.
              <strong> Hoje você paga menos que um jantar fora.</strong>
            </p>
          </div>

          {/* CTA principal */}
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="dm-btn-primary"
            style={{ fontSize: "18px", padding: "22px 24px" }}
          >
            {trackConversion.isPending
              ? "Processando..."
              : `Desbloquear meu Metabolismo por R$${totalPrice.toFixed(2).replace(".", ",")} →`}
          </button>
          <p className="text-center text-[11px] mt-3" style={{ color: "var(--dm-grey-300)" }}>
            Pagamento 100% seguro · Acesso imediato · Garantia de 30 dias
          </p>
        </div>

        {/* ── SEÇÃO 8: GARANTIA ───────────────────────────────────────────── */}
        <div className="rounded-[20px] p-6 mb-12 flex gap-4 items-start" style={{ background: "var(--teal-bg)", border: "2px solid var(--teal-light)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal-pale)" }}>
            <span className="text-3xl">🛡️</span>
          </div>
          <div>
            <h3 className="font-extrabold text-[15px] mb-1.5" style={{ color: "var(--dm-text)" }}>Garantia Incondicional de 30 Dias</h3>
            <p className="text-[13px] leading-[1.65]" style={{ color: "var(--dm-text-soft)" }}>
              Se por qualquer motivo você não estiver satisfeita com os resultados nos próximos 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas. Sem formulários complicados. O risco é completamente nosso.
            </p>
          </div>
        </div>

        {/* ── SEÇÃO 9: FAQ ────────────────────────────────────────────────── */}
        <div className="mb-12">
          <h2 className="text-[clamp(22px,4vw,30px)] font-extrabold text-center mb-8" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
            Perguntas frequentes
          </h2>
          <div className="space-y-3">
            {FAQ_BR.map((item, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "var(--shadow-sm)" }}>
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between font-semibold transition-colors"
                  style={{ color: "var(--dm-text)" }}
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="text-[14px] pr-4">{item.q}</span>
                  <span
                    className="text-lg flex-shrink-0 transition-transform duration-200"
                    style={{ color: "var(--teal-dark)", transform: openFaq === idx ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-[13px] leading-[1.65] pt-1" style={{ color: "var(--dm-text-soft)", borderTop: "1px solid var(--dm-grey-100)" }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── SEÇÃO 10: CTA FINAL ─────────────────────────────────────────── */}
        <div className="text-center rounded-[20px] p-8 md:p-10" style={{ background: "var(--grad)" }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(255,255,255,0.18)" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <h2 className="text-[22px] font-extrabold text-white mb-3" style={{ letterSpacing: "-0.02em" }}>
            Ainda aqui, {name}?
          </h2>
          <p className="text-white/80 text-[14px] mb-2 max-w-md mx-auto">
            Você tem duas opções agora.
          </p>
          <p className="text-white/70 text-[13px] mb-7 max-w-md mx-auto leading-[1.65]">
            <strong className="text-white/90">Opção 1:</strong> Fechar essa página, continuar tentando as mesmas dietas que não funcionaram, e esperar que algo mude.<br/>
            <strong className="text-white">Opção 2:</strong> Investir R$47 hoje, remover o bloqueio metabólico que está impedindo seu corpo de emagrecer, e começar a ver resultados em 7 dias.
          </p>
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="dm-btn-white max-w-md mx-auto"
            style={{ fontSize: "18px" }}
          >
            Sim, quero desbloquear meu metabolismo →
          </button>
          <p className="text-[11px] mt-4 text-white/50">
            Garantia de 30 dias · Acesso imediato · Só R$47
          </p>
        </div>

      </div>
    </div>
  );
}
