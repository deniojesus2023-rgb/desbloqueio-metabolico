import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Upsell() {
  const [, navigate] = useLocation();
  const trackConversion = trpc.quiz.trackConversion.useMutation();
  const [declined, setDeclined] = useState(false);

  const sessionId = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("s") || undefined
    : undefined;

  const handleAccept = async () => {
    await trackConversion.mutateAsync({ sessionId, type: "upsell_1", amount: 4700 });
    navigate("/obrigado?upsell=1");
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  const handleDownsellAccept = async () => {
    await trackConversion.mutateAsync({ sessionId, type: "downsell_1", amount: 1700 });
    navigate("/obrigado?downsell=1");
  };

  const handleDownsellDecline = () => {
    navigate("/obrigado");
  };

  if (declined) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🤔</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Entendido. ¿El precio de $47 era un poco alto ahora?
            </h2>
            <p className="text-gray-600">
              No quiero que el dinero sea el motivo para que no tengas acceso al Acelerador. Por eso voy a hacer algo que mi equipo me prohibió hacer.
            </p>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide mb-2">
              ⚡ Oferta de rescate — Solo esta vez
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              La Versión Esencial del Acelerador de Resultados
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Voy a quitar los bonos y el soporte grupal. Solo el núcleo duro: <strong>La Guía Práctica del Ayuno Circadiano</strong>. El método que acelera la quema 3 veces más rápido cuando se combina con el Protocolo que ya compraste.
            </p>
            <div className="text-center">
              <p className="text-gray-400 line-through text-lg">$47</p>
              <p className="text-4xl font-extrabold text-emerald-600">$17</p>
              <p className="text-gray-500 text-sm">El precio de dos cafés</p>
            </div>
          </div>

          <button
            onClick={handleDownsellAccept}
            disabled={trackConversion.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-2xl mb-3 transition-all active:scale-95"
          >
            ¡Sí, quiero la versión esencial por $17! →
          </button>
          <button
            onClick={handleDownsellDecline}
            className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors"
          >
            No gracias, solo quiero el producto principal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Urgency Header */}
      <div className="bg-red-600 text-white text-center py-3 px-4">
        <p className="font-bold text-sm md:text-base">
          ⚠️ ¡ESPERA! Tu pedido aún no está completo. No cierres esta página.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase">
            Oferta exclusiva para nuevas clientas
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
            ¿Y si pudieras ver los resultados en la{" "}
            <span className="text-emerald-600">mitad del tiempo</span>?
          </h1>
          <p className="text-gray-600">
            Ya garantizaste tu Sistema de Desbloqueo. ¡Felicitaciones! Pero antes de que vayas, necesito hacerte una pregunta importante.
          </p>
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg mb-3">
            El Protocolo del Ayuno Circadiano para Mujeres
          </h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Mientras el Protocolo del Desbloqueo estabiliza tu insulina durante el día, existe una ventana específica de 4 horas por la mañana donde tu cuerpo está naturalmente predispuesto a derretir grasa almacenada.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            <strong>Atención:</strong> no es ese ayuno intermitente loco de 16 horas que te deja mareada y estresada. Es una técnica suave, alineada con el ciclo natural del sol, que haces casi sin darte cuenta.
          </p>
          <p className="text-gray-700 font-semibold">
            Cuando combinas el Desbloqueo (que ya compraste) con el Ayuno Circadiano, el efecto es multiplicador. Tu cuerpo usa la grasa del abdomen como combustible primario <strong>3 veces más rápido</strong>.
          </p>
        </div>

        <div className="bg-emerald-600 rounded-2xl p-6 text-white text-center mb-6">
          <p className="text-emerald-200 text-sm mb-1">Normalmente cuesta</p>
          <p className="text-2xl line-through text-emerald-300 mb-1">$147</p>
          <p className="text-emerald-200 text-sm mb-2">Solo en esta página</p>
          <p className="text-5xl font-extrabold">$47</p>
          <p className="text-emerald-200 text-sm mt-1">Un único pago · Garantía incluida</p>
        </div>

        <div className="space-y-3 mb-8">
          {[
            "Protocolo completo del Ayuno Circadiano para Mujeres",
            "Guía de 'Ventanas de Quema' (cuándo comer para maximizar resultados)",
            "Plan de 7 días para activar el 'Modo Turbo' metabólico",
            "Acceso al grupo privado de soporte por 30 días",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <span className="text-emerald-600 font-bold flex-shrink-0">✓</span>
              <span className="text-gray-700 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleAccept}
          disabled={trackConversion.isPending}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg py-5 rounded-2xl mb-4 transition-all active:scale-95 shadow-lg shadow-orange-200"
        >
          ¡Sí, agregar el Acelerador por $47! →
        </button>
        <button
          onClick={handleDecline}
          className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors"
        >
          No gracias, prefiero quemar grasa al ritmo normal y pierdo esta oferta exclusiva.
        </button>
      </div>
    </div>
  );
}
