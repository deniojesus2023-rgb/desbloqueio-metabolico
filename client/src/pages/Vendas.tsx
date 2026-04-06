import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

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

export default function Vendas() {
  const [orderBump, setOrderBump] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [, navigate] = useLocation();
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
    navigate("/upsell");
  };

  const scrollToCta = () => {
    ctaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
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
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
            alt="Desbloqueio Metabólico"
            className="h-8 object-contain"
          />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* HERO — Personalizado por nome e tipo de bloqueo */}
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl text-base transition-all duration-200 shadow-lg shadow-emerald-200"
          >
            Ver mi solución personalizada ↓
          </button>
        </div>

        {/* PROBLEMA — MUP */}
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

        {/* SOLUÇÃO — MUS */}
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
              <div key={item.step} className="flex gap-4 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">{item.time}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
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
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-emerald-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{t.name}</span>
                        <span className="text-gray-400 text-xs ml-2">{t.location}</span>
                      </div>
                      <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-full">
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

          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-xl py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-200 disabled:opacity-70"
          >
            {trackConversion.isPending
              ? "Procesando..."
              : `Desbloquear mi Metabolismo por $${totalPrice.toFixed(2)} →`}
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">
            🔒 Pago 100% seguro · Acceso inmediato · Garantía de 30 días
          </p>
        </div>

        {/* GARANTIA */}
        <div className="border-2 border-emerald-200 rounded-2xl p-6 mb-10 flex gap-4 items-start">
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
        <div className="text-center bg-emerald-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Sigues aquí, {name}?
          </h2>
          <p className="text-gray-600 mb-6">
            Cada día que tu metabolismo permanece bloqueado es un día más de dietas que no funcionan. La solución está a un clic de distancia.
          </p>
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-200 disabled:opacity-70"
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
