import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { pixelPurchase } from "@/lib/pixel";

export default function UpsellBR() {
  const [, navigate] = useLocation();
  const trackConversion = trpc.quiz.trackConversion.useMutation();
  const chargeUpsell = trpc.payment.chargeUpsell.useMutation();
  const [declined, setDeclined] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  const sessionId = params.get("s") || undefined;
  const customerId = params.get("cid") || undefined;

  const handleAccept = async () => {
    if (!customerId) {
      setError("Erro: dados de pagamento não encontrados. Entre em contato com o suporte.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      await chargeUpsell.mutateAsync({
        customerId,
        productKey: "upsell_1",
        sessionId,
      });
      await trackConversion.mutateAsync({ sessionId, type: "upsell_1", amount: 9700 });
      pixelPurchase({ value: 97, currency: "BRL" });
      navigate(`/obrigado-br?upsell=1&cid=${customerId}`);
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
      setProcessing(false);
    }
  };

  const handleDecline = () => {
    setDeclined(true);
  };

  const handleDownsellAccept = async () => {
    if (!customerId) {
      setError("Erro: dados de pagamento não encontrados. Entre em contato com o suporte.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      await chargeUpsell.mutateAsync({
        customerId,
        productKey: "downsell_1",
        sessionId,
      });
      await trackConversion.mutateAsync({ sessionId, type: "downsell_1", amount: 3700 });
      pixelPurchase({ value: 37, currency: "BRL" });
      navigate(`/obrigado-br?downsell=1&cid=${customerId}`);
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
      setProcessing(false);
    }
  };

  const handleDownsellDecline = () => {
    navigate("/obrigado-br");
  };

  if (declined) {
    return (
      <div className="min-h-screen" style={{ background: "var(--dm-white)", fontFamily: "'Montserrat', sans-serif" }}>
        <div className="max-w-2xl mx-auto px-5 py-12">
          <div className="text-center mb-8">
            <span className="text-4xl mb-4 block">🤔</span>
            <h2 className="text-[22px] font-extrabold mb-3" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
              Entendido. O preço de R$97 estava um pouco alto agora?
            </h2>
            <p className="text-[14px]" style={{ color: "var(--dm-text-soft)" }}>
              Não quero que o dinheiro seja o motivo para você não ter acesso ao Acelerador. Por isso vou fazer algo que minha equipe me proibiu de fazer.
            </p>
          </div>

          <div className="rounded-2xl p-6 mb-6" style={{ background: "var(--teal-bg)", border: "2px solid var(--teal-light)" }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--teal-dark)", letterSpacing: "0.15em" }}>
              ⚡ Oferta de resgate — Só desta vez
            </p>
            <h3 className="text-[20px] font-extrabold mb-3" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
              A Versão Essencial do Acelerador de Resultados
            </h3>
            <p className="text-[14px] mb-4 leading-[1.65]" style={{ color: "var(--dm-text-soft)" }}>
              Vou tirar os bônus e o suporte em grupo. Só o núcleo duro: <strong style={{ color: "var(--dm-text)" }}>O Guia Prático do Jejum Circadiano Brasileiro</strong>. O método que acelera a queima 3 vezes mais rápido quando combinado com o Protocolo que você já comprou.
            </p>
            <div className="text-center">
              <p className="line-through text-lg" style={{ color: "var(--dm-grey-300)" }}>R$97</p>
              <p className="text-4xl font-extrabold" style={{ color: "var(--teal-dark)" }}>R$37</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--dm-text-soft)" }}>O preço de um lanche</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg text-[13px] font-medium" style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleDownsellAccept}
            disabled={processing}
            className="dm-btn-primary mb-3"
            style={{ fontSize: "18px", padding: "20px 24px", opacity: processing ? 0.7 : 1 }}
          >
            {processing ? "Processando pagamento..." : "Sim, quero a versão essencial por R$37! →"}
          </button>
          <p className="text-center text-[11px] mb-4" style={{ color: "var(--dm-grey-300)" }}>
            ⚡ Cobrança automática no mesmo cartão — sem digitar novamente
          </p>
          <button
            onClick={handleDownsellDecline}
            className="w-full text-[12px] py-2 transition-colors" style={{ color: "var(--dm-grey-300)" }}
          >
            Não, prefiro continuar sem o acelerador.
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--dm-white)", fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header */}
      <header className="dm-header">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo-dm-final_ded01597.png"
            alt="Desbloqueio Metab\u00f3lico"
            className="h-10 w-auto object-contain"
            
          />
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-5 py-10">

        {/* Confirmação de compra */}
        <div className="rounded-2xl p-4 mb-8 flex items-center gap-3" style={{ background: "var(--teal-bg)", border: "1.5px solid var(--teal-light)" }}>
          <span className="text-2xl" style={{ color: "var(--teal-dark)" }}>✅</span>
          <div>
            <p className="font-bold text-[14px]" style={{ color: "var(--teal-dark)" }}>Pagamento confirmado!</p>
            <p className="text-[12px]" style={{ color: "var(--dm-text-soft)" }}>Seu acesso ao Protocolo de Desbloqueio está garantido.</p>
          </div>
        </div>

        {/* Headline do upsell */}
        <div className="text-center mb-8">
          <span className="inline-block text-[10px] font-bold px-4 py-2 rounded-full mb-4" style={{ background: "#FFF7ED", color: "#EA580C", border: "1.5px solid #FED7AA", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            ⚡ Oferta exclusiva — Só aparece uma vez
          </span>
          <h1 className="text-[clamp(22px,4.5vw,32px)] font-extrabold leading-[1.2] mb-4" style={{ color: "var(--dm-text)", letterSpacing: "-0.025em" }}>
            Você desbloqueou o metabolismo. Agora{" "}
            <span style={{ color: "var(--teal-dark)" }}>acelere os resultados 3x mais rápido</span>{" "}
            com o Acelerador de Resultados
          </h1>
          <p className="text-[14px]" style={{ color: "var(--dm-text-soft)", lineHeight: 1.65 }}>
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
            <div key={item.title} className="flex gap-4 dm-card" style={{ padding: "var(--space-5)" }}>
              <div className="text-3xl flex-shrink-0">{item.icon}</div>
              <div>
                <h3 className="font-bold text-[15px] mb-1" style={{ color: "var(--dm-text)" }}>{item.title}</h3>
                <p className="text-[13px]" style={{ color: "var(--dm-text-soft)", lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Preço */}
        <div className="text-center mb-6">
          <p className="line-through text-xl" style={{ color: "var(--dm-grey-300)" }}>R$197</p>
          <p className="text-5xl font-extrabold" style={{ color: "var(--teal-dark)" }}>R$97</p>
          <p className="text-[12px] mt-1" style={{ color: "var(--dm-text-soft)" }}>Pagamento único · Acesso vitalício</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-[13px] font-medium" style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>
            {error}
          </div>
        )}

        <button
          onClick={handleAccept}
          disabled={processing}
          className="dm-btn-primary mb-3"
          style={{ fontSize: "20px", padding: "22px 24px", opacity: processing ? 0.7 : 1 }}
        >
          {processing ? "Processando pagamento..." : "Sim! Quero o Acelerador por R$97 →"}
        </button>
        <p className="text-center text-[11px] mb-4" style={{ color: "var(--dm-grey-300)" }}>
          ⚡ Cobrança automática no mesmo cartão — sem digitar novamente
        </p>

        <button
          onClick={handleDecline}
          className="w-full text-[12px] py-3 transition-colors" style={{ color: "var(--dm-grey-300)" }}
        >
          Não, obrigada. Prefiro resultados mais lentos sem o acelerador.
        </button>

        <p className="text-center text-[11px] mt-4" style={{ color: "var(--dm-grey-300)" }}>
          🔒 Pagamento 100% seguro · Acesso imediato · Garantia de 30 dias
        </p>
      </div>
    </div>
  );
}
