import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

const KIWIFY_UPSELL1_BR = "https://pay.kiwify.com/sodA6jl";
const KIWIFY_DOWNSELL_BR = "https://pay.kiwify.com/rB4iy3r";

export default function UpsellBR() {
  const [, navigate] = useLocation();
  const trackConversion = trpc.quiz.trackConversion.useMutation();
  const [declined, setDeclined] = useState(false);

  const sessionId = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("s") || undefined
    : undefined;

  const handleAccept = async () => {
    await trackConversion.mutateAsync({ sessionId, type: "upsell_1", amount: 9700 });
    const obrigadoUrl = encodeURIComponent(`${window.location.origin}/obrigado-br?upsell=1`);
    window.location.href = `${KIWIFY_UPSELL1_BR}?redirect_to=${obrigadoUrl}`;
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  const handleDownsellAccept = async () => {
    await trackConversion.mutateAsync({ sessionId, type: "downsell_1", amount: 3700 });
    const obrigadoUrl = encodeURIComponent(`${window.location.origin}/obrigado-br?downsell=1`);
    window.location.href = `${KIWIFY_DOWNSELL_BR}?redirect_to=${obrigadoUrl}`;
  };

  const handleDownsellDecline = () => {
    navigate("/obrigado-br");
  };

  if (declined) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🤔</span>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Entendido. O preço de R$97 estava um pouco alto agora?
            </h2>
            <p className="text-gray-600">
              Não quero que o dinheiro seja o motivo para você não ter acesso ao Acelerador. Por isso vou fazer algo que minha equipe me proibiu de fazer.
            </p>
          </div>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 mb-6">
            <p className="text-sm font-bold text-emerald-700 uppercase tracking-wide mb-2">
              ⚡ Oferta de resgate — Só desta vez
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              A Versão Essencial do Acelerador de Resultados
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Vou tirar os bônus e o suporte em grupo. Só o núcleo duro: <strong>O Guia Prático do Jejum Circadiano Brasileiro</strong>. O método que acelera a queima 3 vezes mais rápido quando combinado com o Protocolo que você já comprou.
            </p>
            <div className="text-center">
              <p className="text-gray-400 line-through text-lg">R$97</p>
              <p className="text-4xl font-extrabold text-emerald-600">R$37</p>
              <p className="text-gray-500 text-sm">O preço de um lanche</p>
            </div>
          </div>

          <button
            onClick={handleDownsellAccept}
            disabled={trackConversion.isPending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-2xl mb-3 transition-all active:scale-95"
          >
            Sim, quero a versão essencial por R$37! →
          </button>
          <button
            onClick={handleDownsellDecline}
            className="w-full text-gray-400 text-sm py-2 hover:text-gray-600 transition-colors"
          >
            Não, prefiro continuar sem o acelerador.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
            alt="Desbloqueio Metabólico"
            className="h-8 object-contain"
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Confirmação de compra */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
          <span className="text-emerald-600 text-2xl">✅</span>
          <div>
            <p className="font-bold text-emerald-800 text-sm">Pagamento confirmado!</p>
            <p className="text-emerald-700 text-xs">Seu acesso ao Protocolo de Desbloqueio está garantido.</p>
          </div>
        </div>

        {/* Headline do upsell */}
        <div className="text-center mb-8">
          <span className="inline-block bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
            ⚡ Oferta exclusiva — Só aparece uma vez
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight mb-4">
            Você desbloqueou o metabolismo. Agora{" "}
            <span className="text-emerald-600">acelere os resultados 3x mais rápido</span>{" "}
            com o Acelerador de Resultados
          </h1>
          <p className="text-gray-600">
            O Protocolo de 3 Minutos vai desbloquear seu metabolismo. O Acelerador vai fazer ele queimar gordura no ritmo máximo — especialmente nas primeiras semanas, quando a motivação é mais alta.
          </p>
        </div>

        {/* O que está incluído */}
        <div className="space-y-4 mb-8">
          {[
            {
              icon: "🌙",
              title: "Protocolo do Jejum Circadiano Brasileiro",
              desc: "Um sistema de alimentação sincronizado com seu ritmo biológico que acelera a queima de gordura em 3x — sem abrir mão do café da manhã caprichado nem do almoço com arroz e feijão.",
            },
            {
              icon: "📊",
              title: "Plano de 21 Dias de Desbloqueio Acelerado",
              desc: "Um roteiro semana a semana que combina o Protocolo de 3 Minutos com o Jejum Circadiano para resultados visíveis em 3 semanas. Inclui cardápio com comidas típicas brasileiras.",
            },
            {
              icon: "💬",
              title: "Acesso ao Grupo de Suporte Privado",
              desc: "Comunidade de mulheres brasileiras que estão no mesmo processo. Suporte, motivação e dicas exclusivas direto de quem já passou por isso.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="text-3xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Preço */}
        <div className="text-center mb-6">
          <p className="text-gray-400 line-through text-xl mb-1">R$197</p>
          <p className="text-5xl font-extrabold text-emerald-600 mb-1">R$97</p>
          <p className="text-gray-500 text-sm">Pagamento único · Acesso vitalício</p>
        </div>

        <button
          onClick={handleAccept}
          disabled={trackConversion.isPending}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xl py-5 rounded-2xl transition-all duration-200 shadow-xl shadow-orange-200 active:scale-[0.99] mb-4"
        >
          {trackConversion.isPending ? "Processando..." : "Sim! Quero o Acelerador por R$97 →"}
        </button>

        <button
          onClick={handleDecline}
          className="w-full text-gray-400 text-sm py-3 hover:text-gray-600 transition-colors"
        >
          Não, obrigada. Prefiro resultados mais lentos sem o acelerador.
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          🔒 Pagamento 100% seguro · Acesso imediato · Garantia de 30 dias
        </p>
      </div>
    </div>
  );
}
