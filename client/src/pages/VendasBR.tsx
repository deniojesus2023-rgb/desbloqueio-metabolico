import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import StripeCheckout from "@/components/StripeCheckout";
import { pixelViewContent, pixelInitiateCheckout, pixelPurchase } from "@/lib/pixel";

/* ── PREÇOS ──────────────────────────────────────────────────────────── */
const PRODUCT_PRICE = 47;
const ORDER_BUMP_PRICE = 19.9;

/* ── CONTEÚDO POR TIPO DE BLOQUEIO ───────────────────────────────────── */
const BLOCK_CONTENT = {
  1: {
    badge: "Bloqueio Tipo 1 — Cortisol Elevado",
    headline: (n: string) =>
      `${n}, seu corpo está em modo de emergência — e isso trava a queima de gordura`,
    sub: "O estresse crônico eleva o cortisol e ordena ao seu corpo armazenar gordura abdominal como reserva. Não é falta de disciplina. É biologia pura.",
    color: "#EA580C",
    badgeBg: "#FFF7ED",
    badgeBorder: "#FED7AA",
  },
  2: {
    badge: "Bloqueio Tipo 2 — Resistência à Insulina",
    headline: (n: string) =>
      `${n}, cada dieta restritiva ensina seu corpo a acumular mais gordura`,
    sub: "As dietas de restrição calórica ativam o mecanismo de sobrevivência celular, que bloqueia a queima de gordura. Quanto mais você restringe, mais o corpo retém.",
    color: "#1A8A6E",
    badgeBg: "#E8F8F4",
    badgeBorder: "#6DDFC4",
  },
  3: {
    badge: "Bloqueio Tipo 3 — Desregulação Hormonal",
    headline: (n: string) =>
      `${n}, sua vontade de doce à noite não é fraqueza — é um sinal hormonal`,
    sub: "A leptina e a grelina se desregulam pelo estresse e pela restrição. Seu corpo pede carboidratos à noite para compensar. É química, não falta de vontade.",
    color: "#7C3AED",
    badgeBg: "#F5F3FF",
    badgeBorder: "#C4B5FD",
  },
};

/* ── COUNTDOWN ───────────────────────────────────────────────────────── */
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
      setTimeLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  return { minutes, seconds, expired: timeLeft === 0 };
}

/* ── DEPOIMENTOS ─────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Fernanda O.",
    loc: "São Paulo, SP",
    result: "−7 kg em 5 semanas",
    text: "Fiz todas as dietas que existem. Quando entendi que meu corpo estava com a Trava Metabólica do Estresse, tudo fez sentido. Em 5 semanas perdi 7 kg sem abrir mão do arroz com feijão.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_valentina_3cb09301.png",
  },
  {
    name: "Camila S.",
    loc: "Belo Horizonte, MG",
    result: "−9 kg em 7 semanas",
    text: "Sempre achei que a culpa era minha. Quando li sobre o Bloqueio Metabólico, chorei de alívio. O protocolo de 3 minutos é tão simples que parece impossível funcionar — mas funciona.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_carolina_4fa4b365.png",
  },
  {
    name: "Juliana P.",
    loc: "Curitiba, PR",
    result: "−5 kg em 3 semanas",
    text: "Continuo comendo meu churrasco de fim de semana, meu pão de queijo no café. Só adicionei o ritual de 3 minutos. Na terceira semana já senti a barriga mais chapada.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_daniela_2ce81877.png",
  },
];

/* ── FAQ ──────────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "Funciona se já tentei de tudo?",
    a: "Sim — especialmente para você. O Protocolo foi desenvolvido para mulheres que já tentaram dietas convencionais sem resultado permanente. Se as dietas normais não funcionaram, é porque seu bloqueio metabólico nunca foi tratado.",
  },
  {
    q: "Preciso cortar arroz, feijão ou churrasco?",
    a: "Não. O protocolo funciona adicionando um ritual de 3 minutos antes das suas refeições habituais. Você não elimina nada — o protocolo prepara seu metabolismo para processar os alimentos sem acumular gordura.",
  },
  {
    q: "É seguro?",
    a: "Completamente. O protocolo se baseia em técnicas de ativação enzimática e regulação hormonal natural — sem remédios, sem suplementos, sem procedimentos.",
  },
  {
    q: "Em quanto tempo verei resultados?",
    a: "A maioria das usuárias relata sentir a barriga mais desinchada nos primeiros 7 dias. Resultados na balança aparecem entre a semana 2 e 3. Resultados completos em 4 a 8 semanas.",
  },
  {
    q: "E se não funcionar?",
    a: "Você tem 30 dias de garantia incondicional. Devolvemos 100% do seu investimento — sem perguntas, sem formulários. O risco é completamente nosso.",
  },
];

/* ── NOMES FAKE PARA NOTIFICAÇÕES ─────────────────────────────────── */
const FAKE_NAMES = [
  { name: "Maria S.", city: "São Paulo, SP" },
  { name: "Juliana R.", city: "Rio de Janeiro, RJ" },
  { name: "Patrícia M.", city: "Belo Horizonte, MG" },
  { name: "Fernanda L.", city: "Curitiba, PR" },
  { name: "Camila A.", city: "Porto Alegre, RS" },
  { name: "Ana C.", city: "Salvador, BA" },
  { name: "Luciana F.", city: "Brasília, DF" },
  { name: "Renata P.", city: "Recife, PE" },
  { name: "Tatiane B.", city: "Fortaleza, CE" },
  { name: "Adriana G.", city: "Goiânia, GO" },
  { name: "Carla D.", city: "Florianópolis, SC" },
  { name: "Simone V.", city: "Manaus, AM" },
  { name: "Débora N.", city: "Campinas, SP" },
  { name: "Priscila T.", city: "Vitória, ES" },
  { name: "Elaine K.", city: "Belém, PA" },
];

const FAKE_TIMES = ["agora", "há 1 min", "há 2 min", "há 3 min", "há 5 min", "há 8 min", "há 12 min"];

/* ── HOOK: NOTIFICAÇÕES FAKE ─────────────────────────────────────────── */
function useFakeNotifications() {
  const [current, setCurrent] = useState<{ name: string; city: string; time: string } | null>(null);
  const [visible, setVisible] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    // Shuffle order on mount
    const shuffled = [...FAKE_NAMES].sort(() => Math.random() - 0.5);
    const firstDelay = 5000 + Math.random() * 5000; // 5-10s first notification

    const showNext = () => {
      const person = shuffled[indexRef.current % shuffled.length];
      const time = FAKE_TIMES[Math.floor(Math.random() * FAKE_TIMES.length)];
      setCurrent({ name: person.name, city: person.city, time });
      setVisible(true);
      indexRef.current++;

      // Hide after 4s
      setTimeout(() => setVisible(false), 4000);
    };

    const firstTimer = setTimeout(() => {
      showNext();
      // Then repeat every 8-15s
      const interval = setInterval(showNext, 8000 + Math.random() * 7000);
      return () => clearInterval(interval);
    }, firstDelay);

    return () => clearTimeout(firstTimer);
  }, []);

  return { current, visible };
}

/* ── HOOK: VAGAS DINÂMICAS ───────────────────────────────────────────── */
function useDynamicVagas(initial: number) {
  const KEY = "dm_br_vagas";
  const KEY_TS = "dm_br_vagas_ts";

  const getStored = (): number => {
    if (typeof window === "undefined") return initial;
    const stored = localStorage.getItem(KEY);
    const storedTs = localStorage.getItem(KEY_TS);
    if (stored && storedTs) {
      const elapsed = (Date.now() - parseInt(storedTs, 10)) / 1000;
      // Reduce 1 vaga every 45-90 seconds of real elapsed time
      const reduction = Math.floor(elapsed / 60);
      const val = Math.max(3, parseInt(stored, 10) - reduction);
      return val;
    }
    localStorage.setItem(KEY, String(initial));
    localStorage.setItem(KEY_TS, String(Date.now()));
    return initial;
  };

  const [vagas, setVagas] = useState(getStored);

  useEffect(() => {
    const interval = setInterval(() => {
      setVagas((prev) => {
        if (prev <= 3) return 3;
        // Random chance to decrease
        if (Math.random() < 0.35) {
          const next = prev - 1;
          localStorage.setItem(KEY, String(next));
          localStorage.setItem(KEY_TS, String(Date.now()));
          return next;
        }
        return prev;
      });
    }, 25000 + Math.random() * 20000); // every 25-45s
    return () => clearInterval(interval);
  }, []);

  return vagas;
}

/* ── ÍCONES ──────────────────────────────────────────────────────────── */
const Check = ({ s = 14, c = "white" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
    <path d="M5 12l5 5L19 7" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════════════════════ */
export default function VendasBR() {
  const [orderBump, setOrderBump] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitDismissed, setExitDismissed] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { minutes, seconds } = useCountdown();
  const fakeNotif = useFakeNotifications();
  const vagas = useDynamicVagas(37);
  const [, navigate] = useLocation();
  const trackConversion = trpc.quiz.trackConversion.useMutation();

  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const sessionId = params.get("s") || undefined;
  const rawName = params.get("n") || "";
  const email = params.get("e") ? decodeURIComponent(params.get("e")!) : undefined;
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

  // Meta Pixel — ViewContent ao entrar na página de vendas
  useEffect(() => {
    pixelViewContent({ value: PRODUCT_PRICE, currency: "BRL" });
  }, []);

  const handleBuy = () => {
    // Meta Pixel — InitiateCheckout ao abrir o checkout
    pixelInitiateCheckout({ value: totalPrice, currency: "BRL" });
    setShowCheckout(true);
    setTimeout(() => ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
  };

  const handlePaymentSuccess = (data: { paymentIntentId: string; customerId?: string }) => {
    // Meta Pixel — Purchase após pagamento confirmado
    pixelPurchase({ value: totalPrice, currency: "BRL", order_id: data.paymentIntentId });
    trackConversion.mutate({ sessionId, type: "main_offer", amount: Math.round(PRODUCT_PRICE * 100) });
    if (orderBump) trackConversion.mutate({ sessionId, type: "order_bump", amount: Math.round(ORDER_BUMP_PRICE * 100) });
    const custParam = data.customerId ? `&cid=${data.customerId}` : "";
    navigate(`/upsell-br?s=${sessionId || ""}${custParam}`);
  };

  const scrollToCta = () => ctaRef.current?.scrollIntoView({ behavior: "smooth" });

  /* ── ESTILOS REUTILIZÁVEIS ──────────────────────────────────────────── */
  const sectionCls = "max-w-2xl mx-auto px-5";
  const headingCls = "text-center mb-10";
  const h2Cls = "text-[clamp(22px,4.5vw,32px)] font-extrabold leading-[1.25] tracking-tight";
  const subCls = "text-sm mt-2 leading-relaxed";

  return (
    <div className="min-h-screen" style={{ background: "#FAFBFC", fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── EXIT-INTENT POPUP ─────────────────────────────────────────── */}
      {showExitIntent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-sm w-full p-7 relative animate-in fade-in zoom-in duration-300" style={{ boxShadow: "var(--shadow-lg)" }}>
            <button
              onClick={() => { setShowExitIntent(false); setExitDismissed(true); }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-base font-bold"
              style={{ color: "var(--dm-grey-300)", background: "var(--dm-grey-50)" }}
            >&times;</button>
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "var(--teal-pale)" }}>
                <span className="text-2xl">⏳</span>
              </div>
              <h2 className="text-xl font-extrabold leading-tight mb-1.5" style={{ color: "var(--dm-text)" }}>
                {name}, vai deixar seu metabolismo travado?
              </h2>
              <p className="text-xs" style={{ color: "var(--dm-text-soft)" }}>
                Se fechar essa página, o preço de R$47 desaparece.
              </p>
            </div>
            <div className="space-y-2.5 mb-5">
              {["Seu bloqueio metabólico foi identificado", "O protocolo de 3 minutos é a solução", "Garantia de 30 dias sem risco"].map((p) => (
                <div key={p} className="flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal)", width: 18, height: 18 }}>
                    <Check s={10} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: "var(--dm-text)" }}>{p}</span>
                </div>
              ))}
            </div>
            <button onClick={() => { setShowExitIntent(false); setExitDismissed(true); handleBuy(); }} className="dm-btn-primary text-sm">
              Sim, quero desbloquear →
            </button>
            <button onClick={() => { setShowExitIntent(false); setExitDismissed(true); }} className="w-full text-[10px] py-2 mt-1" style={{ color: "var(--dm-grey-300)" }}>
              Não, prefiro continuar sem resultado.
            </button>
          </div>
        </div>
      )}

      {/* ── NOTIFICAÇÃO DE VENDA FAKE ────────────────────────────────── */}
      {fakeNotif.current && (
        <div
          className="fixed bottom-4 left-4 z-40 max-w-[280px] transition-all duration-500 ease-out"
          style={{
            transform: fakeNotif.visible ? "translateX(0)" : "translateX(-120%)",
            opacity: fakeNotif.visible ? 1 : 0,
          }}
        >
          <div
            className="rounded-lg p-3 flex items-center gap-3"
            style={{
              background: "white",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--teal-pale)" }}
            >
              <span className="text-sm">✅</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold leading-tight truncate" style={{ color: "var(--dm-text)" }}>
                {fakeNotif.current.name}
              </p>
              <p className="text-[9px] leading-tight mt-0.5" style={{ color: "var(--dm-text-soft)" }}>
                {fakeNotif.current.city} — comprou {fakeNotif.current.time}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── BARRA DE URGÊNCIA ─────────────────────────────────────────── */}
      <div className="text-white text-center py-2.5 px-4" style={{ background: "#DC2626" }}>
        <p className="text-xs font-bold tracking-wide">
          Oferta expira em{" "}
          <span className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ background: "#991B1B" }}>
            {minutes}:{seconds}
          </span>
          {" "}— Preço normal: <span className="line-through opacity-70">R$197</span>
        </p>
      </div>

      {/* ── HEADER ────────────────────────────────────────────────────── */}
      <header className="dm-header">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo-dm-final_ded01597.png"
            alt="Desbloqueio Metab\u00f3lico"
            className="h-10 w-auto object-contain"
            
          />
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 1 — HERO
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pt-10 pb-12`}>
        <div className="text-center">
          <span
            className="inline-block text-[9px] font-bold px-4 py-1.5 rounded-full mb-5"
            style={{ background: block.badgeBg, color: block.color, border: `1.5px solid ${block.badgeBorder}`, letterSpacing: "0.12em", textTransform: "uppercase" }}
          >
            {block.badge}
          </span>

          <h1
            className="text-[clamp(24px,5.5vw,36px)] font-extrabold leading-[1.18] mb-4"
            style={{ color: "var(--dm-text)", letterSpacing: "-0.03em", textWrap: "balance" }}
          >
            {block.headline(name).split(name).map((part, i, arr) =>
              i < arr.length - 1
                ? <span key={i}>{part}<span style={{ color: block.color }}>{name}</span></span>
                : <span key={i}>{part}</span>
            )}
          </h1>

          <p className="text-sm max-w-lg mx-auto mb-8 leading-relaxed" style={{ color: "var(--dm-text-soft)", textWrap: "pretty" }}>
            {block.sub}
          </p>

          {/* Mini produto */}
          <div className="inline-flex items-center gap-3 rounded-lg px-4 py-3 mb-8" style={{ background: "var(--teal-pale)", border: "1px solid var(--teal-light)" }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--grad)" }}>
              <Check s={18} />
            </div>
            <div className="text-left">
              <p className="font-bold text-[13px] leading-tight" style={{ color: "var(--teal-dark)" }}>Protocolo do Desbloqueio de 3 Minutos</p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--dm-text-soft)" }}>Acesso digital imediato · Funciona com qualquer comida</p>
            </div>
          </div>

          <div>
            <button onClick={scrollToCta} className="dm-btn-primary max-w-sm mx-auto text-[15px]">
              Ver minha solução personalizada ↓
            </button>
            <p className="text-[10px] mt-3" style={{ color: "var(--dm-grey-300)" }}>
              Pagamento seguro · Acesso imediato · Garantia 30 dias
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 2 — BENEFÍCIOS
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pb-14`}>
        <div className={headingCls}>
          <h2 className={h2Cls} style={{ color: "var(--dm-text)" }}>
            O que acontece quando o bloqueio é removido
          </h2>
          <p className={subCls} style={{ color: "var(--dm-text-soft)" }}>Três transformações reais no seu corpo</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: "🔥", title: "Metabolismo ativo", desc: "Seu corpo volta a queimar gordura naturalmente — em repouso, depois do churrasco, depois do pão de queijo.", tag: "Sem dieta restritiva" },
            { icon: "😴", title: "Compulsão eliminada", desc: "A vontade de doce à noite desaparece quando os hormônios da fome voltam ao equilíbrio.", tag: "Sem força de vontade extra" },
            { icon: "⚡", title: "Energia restaurada", desc: "Com o cortisol regulado, você acorda disposta, dorme profundo e tem energia para a rotina.", tag: "Desde a primeira semana" },
          ].map((b) => (
            <div key={b.title} className="dm-card flex items-start gap-4" style={{ padding: "20px" }}>
              <span className="text-2xl flex-shrink-0 mt-0.5">{b.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm mb-1" style={{ color: "var(--dm-text)" }}>{b.title}</h3>
                <p className="text-xs leading-relaxed mb-2.5" style={{ color: "var(--dm-text-soft)" }}>{b.desc}</p>
                <span className="dm-tag text-[10px]">
                  <Check s={11} c="#1A8A6E" />
                  {b.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 3 — COMO FUNCIONA
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pb-14`}>
        <div className="rounded-xl p-6 md:p-8" style={{ background: "var(--teal-bg)" }}>
          <div className={headingCls}>
            <p className="text-[9px] font-bold mb-2 tracking-widest uppercase" style={{ color: "var(--teal-dark)" }}>Como funciona</p>
            <h2 className={h2Cls} style={{ color: "var(--dm-text)" }}>
              3 passos. 3 minutos. Antes de cada refeição.
            </h2>
            <p className={subCls} style={{ color: "var(--dm-text-soft)" }}>
              Funciona com arroz com feijão, churrasco, feijoada — qualquer comida brasileira.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { n: "01", title: "Ativação Enzimática", desc: "Uma combinação de alimentos comuns que ativa as enzimas lipolíticas — responsáveis por desbloquear as células de gordura.", time: "1 min", bg: "var(--teal-dark)" },
              { n: "02", title: "Saciedade Antecipada", desc: "Uma técnica de respiração de 60 segundos que reduz o cortisol e ativa o modo queima de gordura do seu corpo.", time: "1 min", bg: "var(--teal)" },
              { n: "03", title: "Calibração de Insulina", desc: "Um ritual alimentar que estabiliza a glicose antes de comer, evitando o pico de insulina que converte carboidratos em gordura.", time: "1 min", bg: "var(--teal-mid)" },
            ].map((s) => (
              <div key={s.n} className="dm-card flex items-start gap-3.5" style={{ padding: "16px 20px" }}>
                <div className="w-10 h-10 text-white rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0" style={{ background: s.bg }}>
                  {s.n}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-bold text-sm" style={{ color: "var(--dm-text)" }}>{s.title}</h3>
                    <span className="text-[10px] font-bold flex-shrink-0 px-2 py-0.5 rounded-full" style={{ background: "var(--teal-pale)", color: "var(--teal-dark)" }}>{s.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--dm-text-soft)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 text-center">
            <button onClick={scrollToCta} className="dm-btn-primary max-w-sm mx-auto text-[15px]">
              Quero começar hoje →
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 4 — QUEM CRIOU
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pb-14`}>
        <p className="text-[9px] font-bold mb-5 tracking-widest uppercase text-center" style={{ color: "var(--teal-dark)" }}>Quem criou este protocolo</p>
        <div className="dm-card" style={{ padding: "24px" }}>
          <div className="flex items-center gap-4 mb-5">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/ana_paula_ferreira-mjHRev2Yaie3xqQuHV2EXb.webp"
              alt="Ana Paula Ferreira"
              className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              style={{ border: "2.5px solid var(--teal)" }}
            />
            <div>
              <h3 className="font-extrabold text-base" style={{ color: "var(--dm-text)" }}>Ana Paula Ferreira</h3>
              <p className="text-xs" style={{ color: "var(--dm-text-soft)" }}>Professora · 47 anos · Belo Horizonte, MG</p>
            </div>
          </div>
          <div className="space-y-3 text-[13px] leading-[1.75]" style={{ color: "var(--dm-text-soft)" }}>
            <p>
              Em setembro de 2021, no aniversário de 15 anos da filha Laura, o marido tirou uma foto das duas abraçadas. Quando ele mostrou, Ana Paula não se reconheceu. Estava usando um vestido largo para esconder a barriga — e mesmo assim dava para ver.
            </p>
            <p>
              <strong style={{ color: "var(--dm-text)" }}>"Eu achava que era fraqueza minha"</strong>, ela conta. <em>"Que eu não tinha disciplina suficiente. Chorei muito me culpando por isso."</em>
            </p>
            <p>
              A virada aconteceu por acidente. Em uma noite de insônia em 2022, pesquisando sobre cortisol e sono, encontrou um estudo sobre como o estresse crônico literalmente bloqueia a queima de gordura — como um <strong style={{ color: "var(--dm-text)" }}>termostato travado</strong>.
            </p>
            <p>
              O resultado: <strong style={{ color: "var(--teal-dark)" }}>14 kg em 5 meses</strong>, sem abrir mão do arroz com feijão, do churrasco de domingo ou do pão de queijo no café.
            </p>
          </div>
          <div className="mt-5 rounded-lg p-3.5 text-center" style={{ background: "var(--teal-pale)", border: "1px solid var(--teal-light)" }}>
            <p className="text-xs font-semibold" style={{ color: "var(--teal-dark)" }}>
              "Se funcionou para mim depois de 11 anos tentando, vai funcionar para você."
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 5 — DEPOIMENTOS
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pb-14`}>
        <div className={headingCls}>
          <h2 className={h2Cls} style={{ color: "var(--dm-text)" }}>
            Resultados reais de mulheres brasileiras
          </h2>
          <p className={subCls} style={{ color: "var(--dm-text-soft)" }}>Mulheres com os 3 tipos de bloqueio metabólico</p>
        </div>

        {/* Carrossel de depoimentos antes/depois */}
        {(() => {
          const slides = [
            {
              img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/depo1_ddc1eae5.webp",
              name: "Ana Paula M.",
              loc: "Belo Horizonte, MG · Bloqueio Tipo 2",
              result: "−18 kg em 11 semanas",
              text: "Passei 6 anos tentando emagrecer. Fiz low carb, jejum intermitente, contagem de calorias. Perdia 3 kg e voltava 5. Quando descobri que tinha o Bloqueio de Resistência à Insulina, foi a primeira vez que alguém me explicou por que as dietas não funcionavam — não era fraqueza, era biologia. Em 11 semanas, sem cortar o arroz com feijão, perdi 18 kg.",
            },
            {
              img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/depo2_c6d61a9b.jpg",
              name: "Cláudia R.",
              loc: "São Paulo, SP · Bloqueio Tipo 1",
              result: "−22 kg em 14 semanas",
              text: "Sempre fui aquela pessoa que comia pouco e não emagrecia. Minha médica dizia que era 'genética'. Quando entendi que meu cortisol elevado estava travando meu metabolismo, tudo mudou. O protocolo de 3 minutos parece simples demais — mas foi exatamente isso que meu corpo precisava.",
            },
            {
              img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/depo3_d1a34b81.jpg",
              name: "Patrícia L.",
              loc: "Recife, PE · Bloqueio Tipo 3",
              result: "−14 kg em 9 semanas",
              text: "Tinha vergonha de contar que comia bem durante o dia e desmontava tudo à noite. Achava que era fraqueza de caráter. Quando li sobre a desregulação da leptina e grelina, chorei. Era química, não falta de vontade. Hoje durmo sem aquela fome ansiosa e já perdi 14 kg.",
            },
            {
              img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/depo4_c5c8abfc.jpg",
              name: "Renata S.",
              loc: "Porto Alegre, RS · Bloqueio Tipo 2",
              result: "−11 kg em 7 semanas",
              text: "Depois dos 40, parecia que meu corpo tinha travado. Cada quilo era uma batalha enorme. O quiz identificou meu bloqueio exato e o protocolo foi cirúrgico — atacou exatamente o ponto que nenhuma dieta tinha tocado antes. Em 7 semanas perdi 11 kg e minha energia voltou do zero.",
            },
          ];
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const [idx, setIdx] = useState(0);
          const prev = () => setIdx((i) => (i === 0 ? slides.length - 1 : i - 1));
          const next = () => setIdx((i) => (i === slides.length - 1 ? 0 : i + 1));
          const slide = slides[idx];
          return (
            <div className="dm-card mb-5 overflow-hidden" style={{ padding: 0 }}>
              {/* Foto */}
              <div className="relative">
                <img
                  src={slide.img}
                  alt="Transformação real — antes e depois"
                  className="w-full object-cover"
                  style={{ maxHeight: 320 }}
                />
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-3 pb-2">
                  <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.55)" }}>ANTES</span>
                  <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.55)" }}>DEPOIS</span>
                </div>
                {/* Botões de navegação */}
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.45)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              {/* Texto */}
              <div style={{ padding: "20px" }}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold text-[14px]" style={{ color: "var(--dm-text)" }}>{slide.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "var(--teal-pale)", color: "var(--teal-dark)" }}>{slide.result}</span>
                </div>
                <span className="text-[10px] block mb-3" style={{ color: "var(--dm-grey-300)" }}>{slide.loc}</span>
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
                </div>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--dm-text-soft)" }}>"{ slide.text}"</p>
                {/* Dots */}
                <div className="flex justify-center gap-1.5 mt-4">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => setIdx(i)}
                      className="w-2 h-2 rounded-full transition-all"
                      style={{ background: i === idx ? "var(--teal-dark)" : "var(--teal-light)" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Selo de avaliação */}
        <div className="flex justify-center mb-6">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/4.8estrela_ade7735d.webp"
            alt="4.8 estrelas — 50 milhões de downloads"
            className="w-48 object-contain"
          />
        </div>

        {/* Depoimentos em texto */}
        <div className="space-y-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="dm-card" style={{ padding: "20px" }}>
              <div className="flex items-center gap-3 mb-3">
                <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover flex-shrink-0" style={{ border: "2px solid var(--teal-light)" }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-[13px]" style={{ color: "var(--dm-text)" }}>{t.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "var(--teal-pale)", color: "var(--teal-dark)" }}>{t.result}</span>
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--dm-grey-300)" }}>{t.loc}</span>
                </div>
              </div>
              <div className="flex mb-2">
                {Array.from({ length: 5 }).map((_, i) => <span key={i} className="text-amber-400 text-xs">★</span>)}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--dm-text-soft)" }}>"{ t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 6 — URGÊNCIA
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pb-10`}>
        <div className="rounded-xl p-5 flex items-start gap-3.5" style={{ background: "#FEF2F2", border: "1.5px solid #FECACA" }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#FEE2E2" }}>
            <span className="text-base">🔴</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-sm mb-1" style={{ color: "#B91C1C" }}>
              Apenas <span className="tabular-nums">{vagas}</span> vagas no Grupo de Suporte
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#DC2626" }}>
              Cada compra inclui acesso ao grupo privado com acompanhamento pessoal. Capacidade limitada para garantir atenção individual.
            </p>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="flex-1 h-1.5 rounded-full" style={{ background: "#FECACA" }}>
                <div className="h-1.5 rounded-full transition-all duration-1000" style={{ background: "#DC2626", width: `${vagas}%` }} />
              </div>
              <span className="text-[10px] font-bold whitespace-nowrap tabular-nums" style={{ color: "#B91C1C" }}>{vagas}/100</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 7 — OFERTA + CHECKOUT
         ════════════════════════════════════════════════════════════════ */}
      <section ref={ctaRef} className={`${sectionCls} pb-10`}>
        {/* Value Stack */}
        <div className="rounded-xl p-6 mb-5" style={{ background: "var(--dm-text)", color: "white" }}>
          <h2 className="text-xl font-extrabold text-center mb-1.5 tracking-tight">
            Tudo que você recebe hoje
          </h2>
          <p className="text-xs text-center mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
            Valor total: <span className="line-through">R$465</span> — Hoje: <span className="font-extrabold text-base" style={{ color: "var(--teal-mid)" }}>R$47</span>
          </p>
          <div className="space-y-0">
            {[
              { item: "Protocolo do Desbloqueio de 3 Minutos", val: "R$197" },
              { item: "Mapa de Alimentos Desbloqueadores", val: "R$97" },
              { item: "Guia de Emergência Anti-Compulsão", val: "R$67" },
              { item: "Protocolo de Resgate para o Fim de Semana", val: "R$47" },
              { item: "Atualizações vitalícias", val: "R$57" },
            ].map((r, i) => (
              <div key={r.item} className="flex items-center justify-between py-3" style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal)" }}>
                    <Check s={10} />
                  </div>
                  <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.85)" }}>{r.item}</span>
                </div>
                <span className="text-xs line-through flex-shrink-0 ml-3" style={{ color: "rgba(255,255,255,0.3)" }}>{r.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Bump */}
        <div
          className="rounded-xl p-4 mb-5 cursor-pointer transition-all duration-200"
          style={{
            border: orderBump ? "2px solid var(--teal)" : "2px dashed var(--dm-grey-200)",
            background: orderBump ? "var(--teal-pale)" : "white",
          }}
          onClick={() => setOrderBump(!orderBump)}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors"
              style={{
                background: orderBump ? "var(--teal-dark)" : "transparent",
                border: orderBump ? "2px solid var(--teal-dark)" : "2px solid var(--dm-grey-200)",
              }}
            >
              {orderBump && <Check s={10} />}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[13px] leading-snug" style={{ color: "var(--dm-text)" }}>
                Adicionar <span style={{ color: "var(--teal-dark)" }}>Guia dos Chás Noturnos</span> por +R$19,90
              </p>
              <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "var(--dm-text-soft)" }}>
                5 infusões que aceleram o desbloqueio enquanto você dorme. Chás fáceis de encontrar em qualquer mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Âncora de preço */}
        <div className="rounded-lg p-3.5 mb-5 text-center" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
          <p className="text-xs" style={{ color: "#92400E" }}>
            Uma consulta com nutricionista custa entre R$150 e R$400.
            <strong> Hoje você paga menos que um jantar fora.</strong>
          </p>
        </div>

        {/* CTA / Checkout */}
        {!showCheckout ? (
          <div className="text-center">
            <button onClick={handleBuy} className="dm-btn-primary text-base" style={{ padding: "18px 24px" }}>
              Desbloquear meu Metabolismo por R${totalPrice.toFixed(2).replace(".", ",")} →
            </button>
            <p className="text-[10px] mt-2.5" style={{ color: "var(--dm-grey-300)" }}>
              Pagamento 100% seguro · Acesso imediato · Garantia 30 dias
            </p>
          </div>
        ) : (
          <div className="rounded-xl p-5 md:p-6" style={{ background: "white", boxShadow: "var(--shadow-lg)", border: "1.5px solid var(--teal-light)" }}>
            <div className="text-center mb-4">
              <h3 className="font-extrabold text-base mb-1" style={{ color: "var(--dm-text)" }}>Finalize seu pedido</h3>
              <p className="text-xs" style={{ color: "var(--dm-text-soft)" }}>
                Total: <strong style={{ color: "var(--teal-dark)" }}>R${totalPrice.toFixed(2).replace(".", ",")}</strong>
                {orderBump && <span> (Protocolo + Guia de Chás)</span>}
              </p>
            </div>
            <StripeCheckout
              productKeys={orderBump ? ["main_offer", "order_bump"] : ["main_offer"]}
              customerEmail={email}
              customerName={name !== "Amiga" ? name : undefined}
              sessionId={sessionId}
              onSuccess={handlePaymentSuccess}
              onError={(msg) => console.error("Payment error:", msg)}
              buttonText={`Pagar R$${totalPrice.toFixed(2).replace(".", ",")} com segurança →`}
            />
            <div className="mt-3 flex items-center justify-center gap-1.5">
              <span className="text-xl">🛡️</span>
              <span className="text-[10px]" style={{ color: "var(--dm-grey-300)" }}>Garantia incondicional de 30 dias</span>
            </div>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 8 — GARANTIA
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pb-10`}>
        <div className="rounded-xl p-5 flex items-start gap-4" style={{ background: "var(--teal-bg)", border: "1.5px solid var(--teal-light)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--teal-pale)" }}>
            <span className="text-2xl">🛡️</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm mb-1" style={{ color: "var(--dm-text)" }}>Garantia Incondicional de 30 Dias</h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--dm-text-soft)" }}>
              Se por qualquer motivo não estiver satisfeita nos próximos 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas. O risco é completamente nosso.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 9 — FAQ
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pb-14`}>
        <h2 className={`${h2Cls} text-center mb-7`} style={{ color: "var(--dm-text)" }}>
          Perguntas frequentes
        </h2>
        <div className="space-y-2.5">
          {FAQ.map((item, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden" style={{ background: "white", boxShadow: "var(--shadow-sm)" }}>
              <button
                className="w-full text-left px-4 py-3.5 flex items-center justify-between font-semibold"
                style={{ color: "var(--dm-text)" }}
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="text-[13px] pr-3">{item.q}</span>
                <span className="text-base flex-shrink-0 transition-transform duration-200" style={{ color: "var(--teal-dark)", transform: openFaq === idx ? "rotate(45deg)" : "none" }}>+</span>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-3.5 text-xs leading-relaxed pt-0.5" style={{ color: "var(--dm-text-soft)", borderTop: "1px solid var(--dm-grey-100)" }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
         SEÇÃO 10 — CTA FINAL
         ════════════════════════════════════════════════════════════════ */}
      <section className={`${sectionCls} pb-16`}>
        <div className="text-center rounded-xl p-8" style={{ background: "var(--grad)" }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(255,255,255,0.18)" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-white mb-2 tracking-tight">
            Ainda aqui, {name}?
          </h2>
          <p className="text-white/75 text-[13px] mb-1.5">Você tem duas opções agora.</p>
          <p className="text-white/65 text-xs mb-6 max-w-sm mx-auto leading-relaxed">
            <strong className="text-white/90">Opção 1:</strong> Fechar essa página e continuar tentando as mesmas dietas.<br />
            <strong className="text-white">Opção 2:</strong> Investir R$47, remover o bloqueio e ver resultados em 7 dias.
          </p>
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="dm-btn-white max-w-sm mx-auto text-base"
          >
            Sim, quero desbloquear →
          </button>
          <p className="text-[10px] mt-3 text-white/45">
            Garantia de 30 dias · Acesso imediato · Só R$47
          </p>
        </div>
      </section>

    </div>
  );
}
