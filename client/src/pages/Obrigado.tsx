import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Obrigado() {
  const [showUpsell2, setShowUpsell2] = useState(false);
  const [upsell2Dismissed, setUpsell2Dismissed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const chargeUpsell = trpc.payment.chargeUpsell.useMutation();
  const trackConversion = trpc.quiz.trackConversion.useMutation();

  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  const sessionId = params.get("s") || undefined;
  const customerId = params.get("cid") || undefined;
  const hasUpsell1 = params.get("upsell") === "1";
  const hasBump = params.get("bump") === "1";
  const customerName = params.get("name") || "";
  const customerEmail = params.get("email") || "";

  const buildConfirmUrl = (extraParams: Record<string, string> = {}) => {
    const q = new URLSearchParams();
    if (customerName) q.set("name", customerName);
    if (customerEmail) q.set("email", customerEmail);
    if (hasBump) q.set("bump", "1");
    if (hasUpsell1) q.set("upsell", "1");
    Object.entries(extraParams).forEach(([k, v]) => q.set(k, v));
    return `/confirmacion?${q.toString()}`;
  };

  useEffect(() => {
    if (hasUpsell1 && customerId) {
      const timer = setTimeout(() => setShowUpsell2(true), 3000);
      return () => clearTimeout(timer);
    } else if (!hasUpsell1) {
      const timer = setTimeout(() => navigate(buildConfirmUrl()), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasUpsell1, customerId]);

  const handleUpsell2Accept = async () => {
    if (!customerId) return;
    setProcessing(true);
    setError(null);
    try {
      await chargeUpsell.mutateAsync({
        customerId,
        productKey: "upsell_2",
        sessionId,
      });
      await trackConversion.mutateAsync({ sessionId, type: "upsell_2", amount: 5700 });
      navigate(buildConfirmUrl({ upsell2: "1" }));
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago. Intenta de nuevo.");
      setProcessing(false);
    }
  };

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

      {/* UPSELL 2 POPUP — one-click Stripe */}
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
              <p className="text-gray-400 line-through text-base">$97</p>
              <p className="text-4xl font-extrabold text-emerald-600">$57</p>
              <p className="text-gray-400 text-xs mt-1">Un único pago · Acceso inmediato</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleUpsell2Accept}
              disabled={processing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg py-4 rounded-[5px] mb-2 transition-all active:scale-95 shadow-lg shadow-emerald-200 disabled:opacity-70"
            >
              {processing ? "Procesando pago..." : "Sí, quiero los Postres Desbloqueadores por $57 →"}
            </button>
            <p className="text-center text-[11px] text-gray-400 mb-3">
              Se cargará automáticamente a tu tarjeta registrada
            </p>
            <button
              onClick={() => navigate(buildConfirmUrl())}
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
