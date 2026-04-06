import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const PRODUCT_PRICE = 27;
const ORDER_BUMP_PRICE = 9.9;

export default function Vendas() {
  const [orderBump, setOrderBump] = useState(false);
  const [, navigate] = useLocation();
  const trackConversion = trpc.quiz.trackConversion.useMutation();

  const sessionId = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("s") || undefined
    : undefined;

  const handleBuy = async () => {
    await trackConversion.mutateAsync({
      sessionId,
      type: "main_offer",
      amount: Math.round((PRODUCT_PRICE + (orderBump ? ORDER_BUMP_PRICE : 0)) * 100),
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

  return (
    <div className="min-h-screen bg-white font-sans">
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

      {/* Urgency Bar */}
      <div className="bg-amber-500 text-white text-center py-2 px-4 text-sm font-semibold">
        ⚡ Oferta especial disponible solo por tiempo limitado · Precio normal: $97
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* HERO */}
        <div className="text-center mb-10">
          <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            Tu diagnóstico está listo
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            Tu cuerpo no está roto.<br />
            <span className="text-emerald-600">Está bloqueado.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Descubrimos que tienes el <strong>Bloqueo Metabólico Tipo 2</strong>: tu cerebro activa el "modo supervivencia" cada vez que intentas hacer dieta, ordenando a tus células que almacenen grasa en lugar de quemarla.
          </p>
        </div>

        {/* MUP SECTION */}
        <div className="bg-gray-50 rounded-2xl p-6 md:p-8 mb-10 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔬</span> La verdad que nadie te dijo
          </h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            No es falta de fuerza de voluntad. No es porque seas perezosa. La verdadera razón por la que la balanza no baja es un error de comunicación silencioso entre tu cerebro y tus células, que los científicos llaman <strong className="text-emerald-700">Síndrome de Supervivencia Celular (SSC)</strong>.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Cuando cortas carbohidratos o pasas el día estresada, tu cerebro entra en pánico. Inunda tu cuerpo de Cortisol y manda una orden clara a tus células: <em>"¡Peligro! Almacena cada caloría como grasa, especialmente en el abdomen, para sobrevivir."</em>
          </p>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-amber-800 text-sm font-semibold">
              ⚠️ Por eso puedes pasar el día comiendo solo ensalada y aun así no adelgazar. Tu cuerpo funciona como una caja fuerte cerrada. Y cuanto más intentas forzarla comiendo menos, más se cierra.
            </p>
          </div>
        </div>

        {/* MUS SECTION */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            La solución que la industria farmacéutica no quiere que conozcas
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Medicamentos como Mounjaro y Ozempic cuestan miles de dólares al mes porque "hackean" los mismos mecanismos hormonales que bloquean tu metabolismo. Pero existe una forma natural de lograr el mismo efecto.
          </p>

          <div className="bg-emerald-600 rounded-2xl p-6 md:p-8 text-white mb-6">
            <h3 className="text-xl font-bold mb-3">
              El Protocolo del Desbloqueo de 3 Minutos
            </h3>
            <p className="text-emerald-50 leading-relaxed mb-4">
              No es una pastilla. No es un té detox. Es un truco biológico que haces exactamente <strong>3 minutos antes</strong> de tus comidas principales. Al consumir una combinación específica de fibras solubles (que encuentras en cualquier supermercado), creas un "escudo protector" natural en tu estómago.
            </p>
            <p className="text-emerald-50 leading-relaxed">
              Cuando comes tu plato de pasta, tu dulce o la comida de tu mamá justo después, ese escudo bloquea el pico brutal de insulina. Tu cerebro recibe la señal: <strong>"Estamos seguros. Suelta la grasa almacenada."</strong> El SSC se apaga. Comes lo que quieres, pero tu cuerpo reacciona como si hubieras comido un plato de vegetales.
            </p>
          </div>

          <div className="flex justify-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/resultado_quiz-EpCQyo2KrUPpsjZoWcAzcK.webp"
              alt="Activación metabólica"
              className="w-48 md:w-64 object-contain rounded-2xl"
            />
          </div>
        </div>

        {/* VALUE STACK */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Lo que recibes hoy
          </h2>

          <div className="space-y-4 mb-8">
            {[
              {
                icon: "📖",
                title: "Guía Maestra del Desbloqueo de 3 Minutos",
                desc: "El paso a paso exacto para crear tu 'escudo' antes de las comidas, con ingredientes que cuestan centavos.",
                value: "$97",
              },
              {
                icon: "🗺️",
                title: "Mapa de Combinaciones de Alimentos LATAM",
                desc: "Cómo comer tacos, empanadas, arepas y todos tus platos favoritos sin engordar.",
                value: "$67",
              },
              {
                icon: "🎧",
                title: "SOS Hambre Emocional (Audios de 2 min)",
                desc: "Audios diseñados para calmar el sistema nervioso cuando el antojo nocturno ataca.",
                value: "$47",
              },
              {
                icon: "📋",
                title: "Rastreador de Desbloqueo Diario",
                desc: "Un checklist visual simple para garantizar que activas la quema de grasa cada día.",
                value: "$27",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.title}</h4>
                    <span className="text-emerald-600 font-bold text-sm whitespace-nowrap">{item.value}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-white text-center mb-6">
            <p className="text-emerald-200 text-sm mb-1">Valor total del sistema</p>
            <p className="text-3xl font-bold line-through text-emerald-300 mb-1">$238</p>
            <p className="text-emerald-200 text-sm mb-3">Hoy, solo por tiempo limitado</p>
            <p className="text-6xl font-extrabold mb-1">$27</p>
            <p className="text-emerald-200 text-sm">Un único pago · Acceso de por vida</p>
          </div>
        </div>

        {/* ORDER BUMP */}
        <div
          className={`border-2 rounded-2xl p-5 mb-8 cursor-pointer transition-all duration-200 ${orderBump ? "border-emerald-500 bg-emerald-50" : "border-dashed border-gray-300 bg-gray-50 hover:border-emerald-300"}`}
          onClick={() => setOrderBump(!orderBump)}
        >
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded flex-shrink-0 mt-0.5 flex items-center justify-center border-2 transition-colors ${orderBump ? "bg-emerald-600 border-emerald-600" : "border-gray-300 bg-white"}`}>
              {orderBump && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wide mb-1">
                ⚡ Sí, agrega esto a mi pedido por solo +$9,90
              </p>
              <h4 className="font-bold text-gray-900 mb-1">
                Guía de Tés Aceleradores Nocturnos
              </h4>
              <p className="text-gray-600 text-sm">
                5 recetas secretas de tés que, tomados 30 minutos antes de dormir, duplican tu quema metabólica nocturna. Tu cuerpo quema grasa mientras duermes.
              </p>
            </div>
          </div>
        </div>

        {/* GUARANTEE */}
        <div className="flex items-start gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
          <span className="text-4xl flex-shrink-0">🛡️</span>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Garantía de Quema de Grasa de 30 Días</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              Aplica el truco de 3 minutos mañana. Si no sientes tu abdomen desinflarse en la primera semana, o si simplemente no te gusta, envíame un email y te devuelvo el 100% de tu dinero. Sin preguntas. Sin burocracia.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={handleBuy}
            disabled={trackConversion.isPending}
            className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-extrabold text-xl py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-orange-200 disabled:opacity-70 mb-3"
          >
            {trackConversion.isPending
              ? "Procesando..."
              : `¡Quiero el Protocolo por $${(PRODUCT_PRICE + (orderBump ? ORDER_BUMP_PRICE : 0)).toFixed(2)}! →`}
          </button>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-2">
            <span>🔒 Pago 100% seguro</span>
            <span>·</span>
            <span>Acceso inmediato</span>
            <span>·</span>
            <span>Garantía 30 días</span>
          </p>
        </div>

        {/* Social Proof */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="text-center font-bold text-gray-700 mb-6">Lo que dicen nuestras clientas</h3>
          <div className="space-y-4">
            {[
              {
                name: "Valentina R.",
                country: "México",
                text: "Llevaba 3 años intentando bajar de peso. En la primera semana con el protocolo, mi ropa ya me quedaba diferente. No puedo creer que algo tan simple funcione tan bien.",
                stars: 5,
              },
              {
                name: "Carolina M.",
                country: "Colombia",
                text: "Pensé que era otra de esas cosas de internet. Pero el concepto del 'escudo' tiene sentido científico. Bajé 4 kilos en el primer mes sin dejar de comer mis arepas.",
                stars: 5,
              },
              {
                name: "Daniela F.",
                country: "Argentina",
                text: "Lo mejor es que no tengo que contar calorías ni pesarme todos los días. Solo hago los 3 minutos y listo. Mi nivel de estrés con la comida bajó muchísimo.",
                stars: 5,
              },
            ].map((review) => (
              <div key={review.name} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-gray-400 text-xs">{review.country}</p>
                  </div>
                  <div className="ml-auto text-amber-400 text-sm">{"★".repeat(review.stars)}</div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky CTA Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-20">
        <button
          onClick={handleBuy}
          disabled={trackConversion.isPending}
          className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl text-base active:scale-95 transition-all"
        >
          ¡Quiero el Protocolo por ${(PRODUCT_PRICE + (orderBump ? ORDER_BUMP_PRICE : 0)).toFixed(2)}! →
        </button>
      </div>
      <div className="h-20 md:hidden" />
    </div>
  );
}
