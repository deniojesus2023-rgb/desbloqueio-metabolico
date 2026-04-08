import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import StripeCheckout from "@/components/StripeCheckout";
import { pixelViewContent, pixelInitiateCheckout, pixelPurchase } from "@/lib/pixel";

const PRODUCT_PRICE = 27;
const ORDER_BUMP_PRICE = 9.9;

// Block type content personalization
const BLOCK_CONTENT = {
  1: {
    badge: "Bloqueo Tipo 1 — Cortisol Elevado",
    headline: (name: string) =>
      `${name}, tu cuerpo está en modo "emergencia" y por eso no puede quemar grasa`,
    subheadline:
      "El estrés crónico eleva el cortisol, que le ordena a tu cuerpo almacenar grasa abdominal como 'reserva de emergencia'. No es tu culpa. Es biología.",
    color: "text-orange-600",
    badgeColor: "bg-orange-50 text-orange-700",
  },
  2: {
    badge: "Bloqueo Tipo 2 — Resistencia a la Insulina",
    headline: (name: string) =>
      `${name}, cada vez que haces dieta restrictiva, tu cuerpo aprende a acumular MÁS grasa`,
    subheadline:
      "Las dietas bajas en calorías disparan el mecanismo de supervivencia celular, que bloquea la quema de grasa y la almacena con más eficiencia. Cuanto más restringes, más retiene.",
    color: "text-emerald-600",
    badgeColor: "bg-emerald-50 text-emerald-700",
  },
  3: {
    badge: "Bloqueo Tipo 3 — Desregulación Hormonal Nocturna",
    headline: (name: string) =>
      `${name}, tus antojos nocturnos no son debilidad — son una señal hormonal que nadie te explicó`,
    subheadline:
      "La leptina y la grelina — las hormonas del hambre — se desregulan por el estrés y la restricción. Tu cuerpo literalmente te pide carbohidratos de noche para compensar. Es química, no voluntad.",
    color: "text-purple-600",
    badgeColor: "bg-purple-50 text-purple-700",
  },
};

// Countdown hook — 15 minutes, resets on revisit
function useCountdown() {
  const KEY = "dm_countdown_end";
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

const TESTIMONIALS = [
  {
    name: "Valentina R.",
    location: "Guadalajara, México",
    result: "−6 kg en 5 semanas",
    text: "Llevaba 3 años intentando bajar de peso. Hacía dieta toda la semana y lo arruinaba el fin de semana. Con el Protocolo de Desbloqueo entendí por qué mi cuerpo hacía eso — y en 5 semanas perdí 6 kilos sin dejar de comer mis tacos.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_valentina_3cb09301.png",
    stars: 5,
  },
  {
    name: "Carolina M.",
    location: "Bogotá, Colombia",
    result: "−8 kg en 7 semanas",
    text: "Siempre creí que era mi falta de voluntad. Cuando leí sobre el Síndrome de Supervivencia Celular, lloré de alivio. Por fin tenía una explicación real. El protocolo es tan simple que no puedo creer que funcione, pero funciona.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_carolina_4fa4b365.png",
    stars: 5,
  },
  {
    name: "Daniela F.",
    location: "Buenos Aires, Argentina",
    result: "−4 kg en 3 semanas",
    text: "Lo que más me sorprendió fue que no tuve que dejar nada. Solo agregué el ritual de 3 minutos antes de las comidas. En la tercera semana ya noté el vientre más plano y la ropa más holgada. Increíble.",
    avatar: "https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/avatar_daniela_2ce81877.png",
    stars: 5,
  },
];

const FAQ = [
  {
    q: "¿Funciona para mí si ya probé todo sin resultado?",
    a: "Sí — especialmente para ti. El Protocolo de Desbloqueo fue diseñado para mujeres que ya intentaron dietas convencionales y no funcionaron. Si las dietas normales no te funcionaron, es porque tu bloqueo metabólico nunca fue tratado. Este protocolo ataca exactamente eso.",
  },
  {
    q: "¿Tengo que dejar de comer mis comidas favoritas?",
    a: "No. El protocolo funciona AÑADIENDO un ritual de 3 minutos antes de tus comidas habituales. No eliminas nada. Puedes seguir comiendo tus platos típicos — el protocolo prepara tu metabolismo para procesarlos sin acumular grasa.",
  },
  {
    q: "¿Es seguro? ¿Tiene efectos secundarios?",
    a: "Completamente seguro. El protocolo se basa en técnicas de activación enzimática y regulación hormonal natural — sin pastillas, sin suplementos, sin procedimientos. Es simplemente una secuencia de acciones que le indica a tu cuerpo que puede 'desbloquear' la quema de grasa.",
  },
  {
    q: "¿En cuánto tiempo veré resultados?",
    a: "La mayoría de las usuarias reportan sentir el vientre más desinflado en los primeros 7 días. Los resultados en la balanza suelen aparecer entre la semana 2 y 3. Los resultados completos se consolidan en 4-8 semanas de uso consistente.",
  },
  {
    q: "¿Qué pasa si no funciona para mí?",
    a: "Tienes 30 días de garantía incondicional. Si por cualquier motivo no estás satisfecha, te devolvemos el 100% de tu inversión — sin preguntas, sin formularios complicados. El riesgo es completamente nuestro.",
  },
];

// Kiwify removed — using Stripe embedded checkout

// Cupos restantes en el grupo de soporte (urgencia real)
const CUPOS_GRUPO = 37;

export default function Vendas() {
  const [orderBump, setOrderBump] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [exitDismissed, setExitDismissed] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [, navigate] = useLocation();
  const ctaRef = useRef<HTMLDivElement>(null);
  const { minutes, seconds } = useCountdown();
  const trackConversion = trpc.quiz.trackConversion.useMutation();

  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  const sessionId = params.get("s") || undefined;
  const rawName = params.get("n") || "";
  const email = params.get("e") ? decodeURIComponent(params.get("e")!) : undefined;
  const name = rawName ? decodeURIComponent(rawName) : "Amiga";
  const blockType = (parseInt(params.get("block") || "2") || 2) as 1 | 2 | 3;
  const block = BLOCK_CONTENT[blockType] || BLOCK_CONTENT[2];

  const totalPrice = PRODUCT_PRICE + (orderBump ? ORDER_BUMP_PRICE : 0);

  // Exit-intent: detecta quando o mouse sai pelo topo da página
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 5 && !exitDismissed) {
        setShowExitIntent(true);
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [exitDismissed]);

  // Meta Pixel — ViewContent ao entrar na página de vendas
  useEffect(() => {
    pixelViewContent({ value: PRODUCT_PRICE, currency: "USD" });
  }, []);

  const handleBuy = () => {
    // Meta Pixel — InitiateCheckout ao abrir o checkout
    pixelInitiateCheckout({ value: totalPrice, currency: "USD" });
    setShowCheckout(true);
    setTimeout(() => {
      ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  };

  const handlePaymentSuccess = (data: { paymentIntentId: string; customerId?: string }) => {
    // Meta Pixel — Purchase após pagamento confirmado
    pixelPurchase({ value: totalPrice, currency: "USD", order_id: data.paymentIntentId });
    trackConversion.mutate({ sessionId, type: "main_offer", amount: Math.round(PRODUCT_PRICE * 100) });
    if (orderBump) {
      trackConversion.mutate({ sessionId, type: "order_bump", amount: Math.round(ORDER_BUMP_PRICE * 100) });
    }
    const custParam = data.customerId ? `&cid=${data.customerId}` : "";
    navigate(`/upsell?s=${sessionId || ""}${custParam}`);
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
                {name}, ¿vas a dejar que tu metabolismo siga bloqueado?
              </h2>
              <p className="text-gray-500 text-sm">
                Llevas años intentando. Esta puede ser la última vez que veas esta oferta.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5">
              <p className="text-red-700 text-sm font-semibold text-center">
                🚨 Si cierras esta página, el precio de $27 desaparece.
              </p>
              <p className="text-red-600 text-xs text-center mt-1">
                La próxima vez que veas esto, el precio será $97.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {[
                "Tu bloqueo metabólico NO se resuelve solo con el tiempo",
                "Cada dieta restrictiva que hagas lo empeora más",
                "El Protocolo de 3 Minutos es la única solución que ataca la raíz",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700 text-sm">{point}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                setShowExitIntent(false);
                setExitDismissed(true);
                handleBuy();
              }}
              className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] hover:from-[#00A896] hover:to-[#1EBDD0] text-white font-extrabold text-lg py-4 rounded-[5px] transition-all active:scale-95 shadow-lg shadow-teal-200 mb-3"
            >
              Sí, quiero desbloquear mi metabolismo por $27 →
            </button>
            <button
              onClick={() => { setShowExitIntent(false); setExitDismissed(true); }}
              className="w-full text-gray-400 text-xs py-2 hover:text-gray-500 transition-colors"
            >
              No gracias, prefiero seguir sin resultados y perder esta oferta.
            </button>
          </div>
        </div>
      )}

      {/* Countdown urgency bar */}
      <div className="bg-red-600 text-white text-center py-2.5 px-4">
        <p className="text-sm font-bold">
          ⚡ Oferta especial expira en:{" "}
          <span className="font-mono text-base bg-red-800 px-2 py-0.5 rounded">
            {minutes}:{seconds}
          </span>
          {" "}— Precio normal: <span className="line-through opacity-70">$97</span>
        </p>
      </div>

      {/* Header */}
      <header className="bg-[#00BFA5] sticky top-0 z-10 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo-dm-horizontal-n9a8yuvGoTiJrKpUzYtKBQ.png"
            alt="Desbloqueo Metab\u00f3lico"
            className="h-10 w-auto object-contain"
            
          />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* HERO - Personalizado por nome e tipo de bloqueo */}
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
            className="bg-[#00BFA5] hover:bg-[#00A896] text-white font-bold px-8 py-3 rounded-[5px] text-base transition-all duration-200 shadow-lg shadow-teal-200"
          >
            Ver mi solución personalizada ↓
          </button>
        </div>

        {/* PROBLEMA - MUP */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Por qué las dietas convencionales hacen que tu cuerpo acumule <span className="text-red-500">más grasa</span>
          </h2>
          <p className="text-gray-700 mb-4">
            Cuando reduces calorías drásticamente, tu cuerpo activa el <strong>Síndrome de Supervivencia Celular</strong> — un mecanismo evolutivo que interpreta la restricción como una amenaza de hambruna.
          </p>
          <p className="text-gray-700 mb-4">
            En respuesta, el cortisol sube, el metabolismo baja, y las células grasas se vuelven <strong>resistentes a liberar energía</strong>. Es literalmente el opuesto de lo que quieres.
          </p>
          <p className="text-gray-700">
            Esto explica por qué puedes comer 1.200 calorías al día y no perder nada. El problema no eres tú — es que tu metabolismo está bloqueado en modo supervivencia.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🧠", title: "Cortisol elevado", desc: "Ordena al cuerpo almacenar grasa abdominal como 'reserva'" },
              { icon: "🔒", title: "Células bloqueadas", desc: "Las células grasas se niegan a liberar energía" },
              { icon: "📉", title: "Metabolismo lento", desc: "El cuerpo quema hasta 40% menos calorías en reposo" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-bold text-gray-900 text-sm mb-1">{item.title}</div>
                <div className="text-gray-500 text-xs">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SOLUCAO - MUS */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              La Solución
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              El <span className="text-emerald-600">Protocolo del Desbloqueo de 3 Minutos</span>
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Una secuencia de 3 pasos simples que, realizados antes de tus comidas principales, le envían una señal bioquímica a tus células para que salgan del modo supervivencia y vuelvan a quemar grasa normalmente.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { step: "01", title: "Activación Enzimática", desc: "Una combinación específica de alimentos comunes que activa las enzimas lipolíticas — las responsables de 'desbloquear' las células grasas para que liberen energía.", time: "1 minuto" },
              { step: "02", title: "Señal de Saciedad Anticipada", desc: "Una técnica de respiración de 60 segundos que reduce el cortisol en tiempo real y activa el sistema nervioso parasimpático — el 'modo quema de grasa' de tu cuerpo.", time: "1 minuto" },
              { step: "03", title: "Calibración de Insulina", desc: "Un ritual alimentario de 60 segundos que estabiliza la glucosa antes de comer, evitando el pico de insulina que convierte los carbohidratos en grasa almacenada.", time: "1 minuto" },
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

        {/* PERSONA - Ana Paula Ferreira */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <span className="inline-block bg-[#E0F7F4] text-[#00897B] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              Quién creó este protocolo
            </span>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-5 mb-5">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/ana_paula_ferreira-mjHRev2Yaie3xqQuHV2EXb.webp"
                alt="Ana Paula Ferreira"
                className="flex-shrink-0 w-20 h-20 rounded-full object-cover border-3 border-[#00BFA5] shadow-md"
              />
              <div className="hidden">
                AP
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Ana Paula Ferreira</h3>
                <p className="text-gray-500 text-sm">Profesora · 47 años · Belo Horizonte, Brasil</p>
                <p className="text-gray-400 text-xs mt-0.5">Madre de José (19) y Laura (16)</p>
              </div>
            </div>
            <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
              <p>
                Durante 11 años, Ana Paula probó todo para adelgazar. Keto, ayuno intermitente, dieta de puntos, detox de 21 días, batidos sustitutos. Perdía 4 kilos, recuperaba 6. Perdía 3, recuperaba 5. El ciclo nunca terminaba.
              </p>
              <p>
                <strong className="text-gray-900">"Creía que era mi falta de voluntad"</strong>, cuenta ella. <em>"Que yo no tenía la disciplina suficiente. Que todo el mundo podía adelgazar menos yo. Lloré mucho culpándome por eso."</em>
              </p>
              <p>
                El cambio llegó por accidente. En 2022, durante una crisis de ansiedad intensa en el trabajo, Ana Paula empezó a investigar sobre el cortisol y el estrés crónico. Fue ahí donde encontró estudios sobre cómo el estrés prolongado literalmente bloquea la quema de grasa a nivel celular, independientemente de la dieta o el ejercicio.
              </p>
              <p>
                <em>"Cuando leí eso, me puse a llorar. No era falta de fuerza de voluntad. Era biología. Mi cuerpo llevaba años en modo supervivencia y yo intentaba forzarlo a adelgazar con más restricción, que era exactamente lo que empeoraba el bloqueo."</em>
              </p>
              <p>
                Pasó los siguientes 8 meses probando combinaciones de técnicas de regulación del cortisol, activación enzimática y calibración de insulina, todas basadas en estudios científicos pero adaptadas a la rutina real de una profesora con dos hijos, esposo y casa que atender.
              </p>
              <p>
                El resultado: <strong className="text-[#00897B]">14 kg en 5 meses</strong>, sin renunciar a sus comidas favoritas. Hoy comparte el protocolo con otras mujeres que pasaron por lo mismo.
              </p>
            </div>
            <div className="mt-5 bg-[#F0FDFB] rounded-xl p-4 border border-[#B2DFDB]">
              <p className="text-[#00897B] text-sm font-semibold text-center">
                ✦ "Si funcionó para mí después de 11 años intentándolo, va a funcionar para ti."
              </p>
            </div>
          </div>
        </div>

        {/* DEPOIMENTOS com fotos */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Mujeres que ya desbloquearon su metabolismo
          </h2>
          <div className="space-y-4">
            {TESTIMONIALS.map((t) => (
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

        {/* ANTES Y DESPUES */}
        <div className="mb-10">
          <div className="text-center mb-6">
            <span className="inline-block bg-[#E0F7F4] text-[#00897B] text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              Resultados reales
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              Lo que pasa cuando el bloqueo se libera
            </h2>
            <p className="text-gray-500 text-sm mt-2">Resultados de mujeres con cada tipo de bloqueo metabólico</p>
          </div>
          <div className="space-y-4">
            {[
              {
                tipo: "Bloqueo Tipo 1 — Cortisol",
                nombre: "Valentina R., 44 años · México",
                antes: ["Se despertaba agotada cada día", "Barriga que no bajaba con ninguna dieta", "Ansiedad y compulsión nocturna"],
                despues: ["Duerme profundo y amanece con energía", "Perdió 7 kg en 5 semanas", "Compulsión nocturna desapareció en semana 2"],
                cor: "from-orange-50 to-orange-100",
                badge: "bg-orange-100 text-orange-700",
              },
              {
                tipo: "Bloqueo Tipo 2 — Insulina",
                nombre: "Carolina M., 51 años · Colombia",
                antes: ["Engordaba aunque comía poco", "Antojo de dulce incontrolable", "Energía baja después de comer"],
                despues: ["Metabolismo se aceleró visiblemente", "Perdió 9 kg en 7 semanas", "Antojo de dulce se redujo 80%"],
                cor: "from-blue-50 to-blue-100",
                badge: "bg-blue-100 text-blue-700",
              },
              {
                tipo: "Bloqueo Tipo 3 — Hormonal",
                nombre: "Daniela S., 48 años · Argentina",
                antes: ["Peso que oscilaba sin razón", "Retención de líquidos constante", "Sensación de hinchazón permanente"],
                despues: ["Estabilizó el peso por primera vez", "Perdió 5 kg en 3 semanas", "Hinchazón desapareció en semana 1"],
                cor: "from-purple-50 to-purple-100",
                badge: "bg-purple-100 text-purple-700",
              },
            ].map((card) => (
              <div key={card.tipo} className={`bg-gradient-to-br ${card.cor} rounded-2xl p-5 border border-gray-100`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${card.badge}`}>{card.tipo}</span>
                </div>
                <p className="text-gray-500 text-xs mb-3 font-medium">{card.nombre}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-bold text-red-600 mb-2 uppercase tracking-wide">Antes</p>
                    <ul className="space-y-1">
                      {card.antes.map((item) => (
                        <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#00897B] mb-2 uppercase tracking-wide">Después</p>
                    <ul className="space-y-1">
                      {card.despues.map((item) => (
                        <li key={item} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <span className="text-[#00BFA5] mt-0.5 flex-shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* URGENCIA - 37 cupos en el grupo */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">🔴</div>
            <div>
              <h3 className="font-extrabold text-red-700 text-base mb-1">
                Solo {CUPOS_GRUPO} cupos disponibles en el Grupo de Soporte Privado
              </h3>
              <p className="text-red-600 text-sm leading-relaxed">
                Cada compra incluye acceso al grupo privado donde Ana Paula acompaña personalmente a las participantes. El grupo tiene capacidad limitada para garantizar atención individual. Cuando se agoten los {CUPOS_GRUPO} cupos, el acceso al grupo será eliminado de la oferta.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 bg-red-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.round((CUPOS_GRUPO / 100) * 100)}%` }}></div>
                </div>
                <span className="text-red-700 font-bold text-xs whitespace-nowrap">{CUPOS_GRUPO} de 100 cupos</span>
              </div>
            </div>
          </div>
        </div>

        {/* VALUE STACK */}
        <div className="bg-gray-900 text-white rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-bold text-center mb-6">
            Todo lo que recibes hoy
          </h2>
          <div className="space-y-3 mb-6">
            {[
              { item: "Protocolo del Desbloqueo de 3 Minutos (Guía Principal)", value: "$97" },
              { item: "Mapa de Alimentos Desbloqueadores para tu País", value: "$47" },
              { item: "Guía de Emergencia: Qué hacer cuando el antojo ataca", value: "$37" },
              { item: "Protocolo de Rescate para el Fin de Semana", value: "$27" },
              { item: "Acceso a actualizaciones de por vida", value: "$30" },
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
            <span className="text-gray-400 line-through">$238</span>
          </div>
          <div className="flex items-center justify-between text-2xl font-extrabold mt-1">
            <span className="text-white">Tu inversión hoy:</span>
            <span className="text-emerald-400">Solo $27</span>
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
                  ✨ SÍ, quiero agregar el <span className="text-emerald-600">Guía de Tés Nocturnos Desbloqueadores</span> por solo +$9.90
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  5 infusiones específicas que aceleran el desbloqueo metabólico mientras duermes. Funciona en sinergia con el protocolo principal.
                </p>
              </div>
            </div>
          </div>

          {/* Price anchor */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-amber-800 text-sm font-medium">
              💡 Por referencia: una consulta con nutricionista cuesta entre $50 y $150 — y no te dará el Protocolo de Desbloqueo.
              <strong> Hoy pagas menos que un café por semana.</strong>
            </p>
          </div>

          {!showCheckout ? (
            <>
              <button
                onClick={handleBuy}
                className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] hover:from-[#00A896] hover:to-[#1EBDD0] active:scale-[0.99] text-white font-extrabold text-xl py-5 rounded-[5px] transition-all duration-200 shadow-xl shadow-teal-200"
              >
                {`Desbloquear mi Metabolismo por $${totalPrice.toFixed(2)} →`}
              </button>
              <p className="text-center text-xs text-gray-400 mt-2">
                🔒 Pago 100% seguro · Acceso inmediato · Garantía de 30 días
              </p>
            </>
          ) : (
            <div className="rounded-2xl p-5 md:p-7 bg-white" style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "2px solid #B2DFDB" }}>
              <div className="text-center mb-5">
                <h3 className="font-extrabold text-[18px] text-gray-900 mb-1">
                  Finaliza tu pedido
                </h3>
                <p className="text-[13px] text-gray-500">
                  Total: <strong className="text-emerald-600">${totalPrice.toFixed(2)}</strong>
                  {orderBump && <span className="text-[11px]"> (Protocolo + Guía de Tés)</span>}
                </p>
              </div>
              <StripeCheckout
                productKeys={orderBump ? ["main_offer", "order_bump"] : ["main_offer"]}
                customerEmail={email}
                customerName={name !== "Amiga" ? name : undefined}
                sessionId={sessionId}
                onSuccess={handlePaymentSuccess}
                onError={(msg) => console.error("Payment error:", msg)}
                buttonText={`Pagar $${totalPrice.toFixed(2)} con seguridad →`}
              />
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="text-3xl">🛡️</span>
                <span className="text-[11px] text-gray-400">Garantía incondicional de 30 días</span>
              </div>
            </div>
          )}
        </div>

        {/* GARANTIA */}
        <div className="border-2 border-[#B2DFDB] rounded-2xl p-6 mb-10 flex gap-4 items-start bg-[#F0FDFB]">
          <div className="text-4xl flex-shrink-0">🛡️</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Garantía Incondicional de 30 Días</h3>
            <p className="text-gray-600 text-sm">
              Si por cualquier motivo no estás satisfecha con los resultados en los próximos 30 días, te devolvemos el 100% de tu dinero. Sin preguntas. Sin formularios complicados. El riesgo es completamente nuestro.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Preguntas frecuentes
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, idx) => (
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
            ¿Sigues aquí, {name}?
          </h2>
          <p className="text-gray-600 mb-6">
            Cada día que tu metabolismo permanece bloqueado es un día más de dietas que no funcionan. La solución está a un clic de distancia.
          </p>
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="w-full bg-gradient-to-r from-[#00BFA5] to-[#26C6DA] hover:from-[#00A896] hover:to-[#1EBDD0] text-white font-extrabold text-xl py-5 rounded-[5px] transition-all duration-200 shadow-xl shadow-teal-200 disabled:opacity-70"
          >
            Sí, quiero desbloquear mi metabolismo →
          </button>
          <p className="text-xs text-gray-400 mt-3">
            🔒 Garantía de 30 días · Acceso inmediato · Solo $27
          </p>
        </div>
      </div>
    </div>
  );
}
