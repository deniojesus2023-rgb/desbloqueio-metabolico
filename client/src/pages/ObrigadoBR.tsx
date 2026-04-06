import { useState, useEffect } from "react";

const KIWIFY_UPSELL2_BR = "https://pay.kiwify.com/jDz6Q6C";

export default function ObrigadoBR() {
  const [showUpsell2, setShowUpsell2] = useState(false);
  const [upsell2Dismissed, setUpsell2Dismissed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hasUpsell1 = params.get("upsell") === "1";
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
          Bem-vinda à sua transformação!
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Seu pedido foi confirmado com sucesso. Nos próximos minutos você receberá um e-mail com o acesso a todo o material. Verifique também sua caixa de spam.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6">
          <h3 className="font-bold text-emerald-800 mb-2">O que fazer agora?</h3>
          <ol className="text-left text-emerald-700 text-sm space-y-2">
            <li><strong>1.</strong> Verifique seu e-mail (inclusive o spam)</li>
            <li><strong>2.</strong> Baixe o Guia Mestre do Desbloqueio de 3 Minutos</li>
            <li><strong>3.</strong> Aplique o protocolo amanhã antes do café da manhã</li>
            <li><strong>4.</strong> Observe as mudanças nos primeiros 7 dias</li>
          </ol>
        </div>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
          alt="Desbloqueio Metabólico"
          className="h-8 object-contain mx-auto opacity-50"
        />
      </div>

      {/* UPSELL 2 POPUP — aparece 3s após a página carregar para quem comprou o Upsell1 */}
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
                ⚡ Oferta especial — Só para você
              </span>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2 leading-tight">
                Adicione o <span className="text-emerald-600">Mapa Corporal de Desbloqueio</span> por apenas R$47
              </h2>
              <p className="text-gray-500 text-sm">
                Um guia visual que mostra exatamente quais pontos do seu corpo ativar para acelerar a queima de gordura localizada — especialmente barriga, quadril e coxas.
              </p>
            </div>

            <div className="space-y-2 mb-5">
              {[
                "Pontos de pressão que ativam a queima de gordura localizada",
                "Sequência de 5 minutos para fazer em casa ou no trabalho",
                "Técnica específica para gordura abdominal pós-estresse",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                  <span className="text-gray-700 text-sm">{point}</span>
                </div>
              ))}
            </div>

            <div className="text-center mb-5">
              <p className="text-gray-400 line-through">R$97</p>
              <p className="text-3xl font-extrabold text-emerald-600">R$47</p>
            </div>

            <button
              onClick={() => {
                setUpsell2Dismissed(true);
                window.location.href = KIWIFY_UPSELL2_BR;
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base py-4 rounded-2xl transition-all active:scale-95 mb-3"
            >
              Sim, quero o Mapa Corporal por R$47 →
            </button>
            <button
              onClick={() => setUpsell2Dismissed(true)}
              className="w-full text-gray-400 text-xs py-2 hover:text-gray-500 transition-colors"
            >
              Não, obrigada.
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
