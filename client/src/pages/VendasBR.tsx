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
    badgeColor: "bg-orange-50 text-orange-700",
  },
  2: {
    badge: "Bloqueio Tipo 2 — Resistência à Insulina",
    headline: (name: string) =>
      `${name}, cada vez que você faz dieta restritiva, seu corpo aprende a acumular MAIS gordura`,
    subheadline:
      "As dietas de restrição calórica ativam o mecanismo de sobrevivência celular, que bloqueia a queima de gordura e a armazena com mais eficiência. Quanto mais você restringe, mais o corpo retém.",
    color: "text-emerald-600",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
  3: {
    badge: "Bloqueio Tipo 3 — Desregulação Hormonal Noturna",
    headline: (name: string) =>
      `${name}, sua vontade de doce à noite não é fraqueza — é um sinal hormonal que ninguém te explicou`,
    subheadline:
      "A leptina e a grelina — os hormônios da fome — se desregulam pelo estresse e pela restrição. Seu corpo literalmente pede carboidratos à noite para compensar. É química, não falta de vontade.",
    color: "text-purple-600",
    badgeColor: "bg-purple-50 text-purple-700",
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

      {/* Barra de urgência */}
      <div className="bg-red-600 text-white text-center py-2.5 px-4">
        <p className="text-sm font-bold">
          ⚡ Oferta especial expira em:{" "}
          <span className="font-mono text-base bg-red-800 px-2 py-0.5 rounded">
            {minutes}:{seconds}
          </span>
          {" "}— Preço normal: <span className="line-through opacity-70">R$197</span>
        </p>
      </div>

      {/* Header */}
      <header className="bg-[#00BFA5] sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center justify-center gap-2">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="11" fill="white" fillOpacity="0.2"/>
            <path d="M7 11l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-white font-extrabold text-base tracking-tight">Desbloqueio Metabólico</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* HERO — Personalizado por nome e tipo de bloqueio */}
        <div className="text-center mb-10">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide ${block.badgeColor}`}>
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
          <button
            onClick={scrollToCta}
            className="bg-[#00BFA5] hover:bg-[#00A896] text-white font-bold px-8 py-3 rounded-full text-base transition-all duration-200 shadow-lg shadow-teal-200"
          >
            Ver minha solução personalizada ↓
          </button>
        </div>

        {/* PROBLEMA — MUP Brasileiro */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Por que as dietas convencionais fazem seu corpo acumular <span className="text-red-500">mais gordura</span>
          </h2>
          <p className="text-gray-700 mb-4">
            Quando você reduz calorias drasticamente, seu corpo ativa a <strong>Trava Metabólica do Estresse Crônico</strong> — um mecanismo evolutivo que interpreta a restrição como uma ameaça de fome.
          </p>
          <p className="text-gray-700 mb-4">
            Em resposta, o cortisol sobe, o metabolismo cai, e as células de gordura ficam <strong>resistentes a liberar energia</strong>. É literalmente o oposto do que você quer.
          </p>
          <p className="text-gray-700">
            Isso explica por que você pode comer "certinho" a semana toda e não perder nada — ou perder e recuperar tudo rapidinho. O problema não é você — é que seu metabolismo está travado no modo sobrevivência.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🧠", title: "Cortisol elevado", desc: "Ordena ao corpo armazenar gordura abdominal como 'reserva'" },
              { icon: "🔒", title: "Células bloqueadas", desc: "As células de gordura se recusam a liberar energia" },
              { icon: "📉", title: "Metabolismo lento", desc: "O corpo queima até 40% menos calorias em repouso" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-bold text-gray-900 text-sm mb-1">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SOLUÇÃO — MUS Brasileiro */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              A Solução
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              O <span className="text-emerald-600">Protocolo do Desbloqueio de 3 Minutos</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Uma sequência de 3 passos simples que, realizados antes das suas refeições principais, envia um sinal bioquímico às suas células para que saiam do modo sobrevivência e voltem a queimar gordura normalmente.
            </p>
          </div>
          <div className="space-y-4">
            {[
              {
                step: "01",
                title: "Ativação Enzimática",
                desc: "Uma combinação específica de alimentos comuns que ativa as enzimas lipolíticas — as responsáveis por 'desbloquear' as células de gordura para que liberem energia. Funciona com arroz, feijão, pão de queijo e qualquer comida brasileira.",
                time: "1 minuto",
              },
              {
                step: "02",
                title: "Sinal de Saciedade Antecipada",
                desc: "Uma técnica de respiração de 60 segundos que reduz o cortisol em tempo real e ativa o sistema nervoso parassimpático — o 'modo queima de gordura' do seu corpo. Pode ser feita em qualquer lugar, inclusive no trabalho.",
                time: "1 minuto",
              },
              {
                step: "03",
                title: "Calibração de Insulina",
                desc: "Um ritual alimentar de 60 segundos que estabiliza a glicose antes de comer, evitando o pico de insulina que converte os carboidratos em gordura armazenada. Funciona mesmo com feijoada e churrasco.",
                time: "1 minuto",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-5 bg-[#E0F7F4] rounded-xl border border-[#B2DFDB]">
                <div className="flex-shrink-0 w-10 h-10 bg-[#00BFA5] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <span className="text-xs text-[#00897B] font-semibold bg-[#E0F7F4] px-2 py-0.5 rounded-full">{item.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PERSONA — Ana Paula Ferreira */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <span className="inline-block bg-[#E0F7F4] text-[#00897B] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              Quem criou este protocolo
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-5 mb-5">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#00BFA5] to-[#26C6DA] flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
                AP
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Ana Paula Ferreira</h3>
                <p className="text-gray-500 text-sm">Professora · 47 anos · Belo Horizonte, MG</p>
                <p className="text-gray-400 text-xs mt-0.5">Mãe de José (19) e Laura (16)</p>
              </div>
            </div>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Durante 11 anos, Ana Paula tentou de tudo para emagrecer. Low carb, jejum intermitente, dieta dos pontos, detox de 21 dias, shake substituto de refeição. Perdia 4 quilos, recuperava 6. Perdia 3, recuperava 5. O ciclo nunca parava.
              </p>
              <p>
                <strong className="text-gray-900">"Eu achava que era fraqueza minha"</strong>, ela conta. <em>"Que eu não tinha disciplina suficiente. Que todo mundo conseguia emagrecer menos eu. Chorei muito me culpando por isso."</em>
              </p>
              <p>
                A virada aconteceu por acidente. Em 2022, durante uma crise de ansiedade intensa no trabalho, Ana Paula começou a pesquisar sobre cortisol e estresse crônico. Foi aí que encontrou estudos sobre como o estresse de longo prazo literalmente bloqueia a queima de gordura em nível celular — independente de dieta ou exercício.
              </p>
              <p>
                <em>"Quando li aquilo, caí em prantos. Não era falta de força de vontade. Era biologia. Meu corpo estava em modo de sobrevivência há anos e eu ficava tentando forçar ele a emagrecer com mais restrição — que era exatamente o que piorava o bloqueio."</em>
              </p>
              <p>
                Ela passou os 8 meses seguintes testando combinações de técnicas de regulação do cortisol, ativação enzimática e calibração de insulina — todas baseadas em estudos científicos, mas adaptadas para a rotina real de uma professora com dois filhos, marido e casa para cuidar.
              </p>
              <p>
                O resultado: <strong className="text-[#00897B]">14 kg em 5 meses</strong>, sem abrir mão do arroz com feijão, do churrasco de domingo ou do pão de queijo no café da manhã. Hoje ela compartilha o protocolo com outras mulheres que passaram pelo mesmo que ela.
              </p>
            </div>
            <div className="mt-5 bg-[#F0FDFB] rounded-xl p-4 border border-[#B2DFDB]">
              <p className="text-[#00897B] text-sm font-semibold text-center">
                ✦ "Se funcionou para mim depois de 11 anos tentando, vai funcionar para você."
              </p>
            </div>
          </div>
        </div>

        {/* DEPOIMENTOS BR */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Mulheres brasileiras que já desbloquearam o metabolismo
          </h2>
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
                    <div className="flex items-center justify-between mb-1">
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

        {/* URGÊNCIA — 37 vagas no grupo */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-8">
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

        {/* VALUE STACK BR */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-center mb-6">
            Tudo que você recebe hoje
          </h2>
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
                <span className="text-gray-400 text-sm line-through flex-shrink-0 ml-4">{row.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-lg font-bold border-t border-gray-600 pt-4">
            <span className="text-gray-300">Valor total:</span>
            <span className="text-gray-400 line-through">R$465</span>
          </div>
          <div className="flex items-center justify-between text-2xl font-extrabold mt-1">
            <span className="text-white">Seu investimento hoje:</span>
            <span className="text-emerald-400">Só R$47</span>
          </div>
        </div>

        {/* CTA PRINCIPAL */}
        <div ref={ctaRef} className="mb-8">
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
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-amber-800 text-sm font-medium">
              💡 Para referência: uma consulta com nutricionista custa entre R$150 e R$400 — e não vai te dar o Protocolo de Desbloqueio.
              <strong> Hoje você paga menos que um jantar fora.</strong>
            </p>
          </div>

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

        {/* GARANTIA */}
        <div className="border-2 border-[#B2DFDB] rounded-2xl p-6 mb-10 flex gap-4 items-start bg-[#F0FDFB]">
          <div className="text-4xl flex-shrink-0">🛡️</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Garantia Incondicional de 30 Dias</h3>
            <p className="text-gray-600 text-sm">
              Se por qualquer motivo você não estiver satisfeita com os resultados nos próximos 30 dias, devolvemos 100% do seu dinheiro. Sem perguntas. Sem formulários complicados. O risco é completamente nosso.
            </p>
          </div>
        </div>

        {/* FAQ BR */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
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

        {/* CTA FINAL */}
        <div className="text-center bg-[#E0F7F4] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ainda aqui, {name}?
          </h2>
          <p className="text-gray-600 mb-6">
            Cada dia que seu metabolismo continua travado é mais um dia de dietas que não funcionam. A solução está a um clique de distância.
          </p>
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] hover:from-[#00A896] hover:to-[#1EBDD0] text-white font-extrabold text-xl py-5 rounded-full transition-all duration-200 shadow-xl shadow-teal-200 disabled:opacity-70"
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
