import { useEffect, useState } from "react";

const KIWIFY_UPSELL2 = "https://pay.kiwify.com/jDz6Q6C";

export default function Obrigado() {
  const [showUpsell2, setShowUpsell2] = useState(false);
  const [upsell2Dismissed, setUpsell2Dismissed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasUpsell1 = params.get("upsell") === "1";
    // Mostrar Upsell2 apenas para quem comprou o Upsell1
    if (hasUpsell1) {
      const timer = setTimeout(() => setShowUpsell2(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          ¡Bienvenida a tu transformación!
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Tu pedido fue confirmado con éxito. En los próximos minutos recibirás un correo con el acceso a todo el material. Revisa también tu carpeta de spam.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-emerald-800 mb-2">¿Qué hacer ahora?</h3>
          <ol className="text-left text-emerald-700 text-sm space-y-2">
            <li><strong>1.</strong> Revisa tu correo electrónico (también el spam)</li>
            <li><strong>2.</strong> Descarga la Guía Maestra del Desbloqueo de 3 Minutos</li>
            <li><strong>3.</strong> Aplica el protocolo mañana antes del desayuno</li>
            <li><strong>4.</strong> Observa los cambios en los primeros 7 días</li>
          </ol>
        </div>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
          alt="Desbloqueio Metabólico"
          className="h-8 object-contain mx-auto opacity-50"
        />
      </div>

      {/* UPSELL 2 POPUP — aparece 3s após a página carregar para quem comprou Upsell1 */}
      {showUpsell2 && !upsell2Dismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative">
            <button
              onClick={() => setUpsell2Dismissed(true)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>

            <div className="text-center mb-5">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase">
                ⚡ Oferta especial — Solo para ti
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                ¿Y si pudieras comer postres mientras pierdes grasa?
              </h2>
              <p className="text-gray-500 text-sm">
                Porque el placer no debería ser tu enemigo.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-5">
              <h3 className="font-bold text-gray-900 mb-2">Recetas de Postres Desbloqueadores</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                30 recetas de postres que activan las mismas enzimas lipolíticas del Protocolo. Chocolate, helados, pasteles — todos formulados para acelerar el desbloqueo, no para frenarlo.
              </p>
            </div>

            <div className="text-center mb-5">
              <p className="text-gray-400 line-through text-base">$47</p>
              <p className="text-4xl font-extrabold text-emerald-600">$27</p>
              <p className="text-gray-400 text-xs mt-1">Un único pago · Acceso inmediato</p>
            </div>

            <button
              onClick={() => {
                setUpsell2Dismissed(true);
                window.location.href = KIWIFY_UPSELL2;
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg py-4 rounded-2xl mb-3 transition-all active:scale-95 shadow-lg shadow-emerald-200"
            >
              Sí, quiero los Postres Desbloqueadores por $27 →
            </button>
            <button
              onClick={() => setUpsell2Dismissed(true)}
              className="w-full text-gray-400 text-xs py-2 hover:text-gray-500 transition-colors"
            >
              No gracias, no quiero postres que aceleren mis resultados.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
