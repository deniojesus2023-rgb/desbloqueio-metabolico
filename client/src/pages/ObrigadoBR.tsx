import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ObrigadoBR() {
  const [showUpsell2, setShowUpsell2] = useState(false);
  const [upsell2Dismissed, setUpsell2Dismissed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [, navigate] = useLocation();
  const chargeUpsell = trpc.payment.chargeUpsell.useMutation();
  const trackConversion = trpc.quiz.trackConversion.useMutation();

  const params = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  const hasUpsell1 = params.get("upsell") === "1";
  const hasBump = params.get("bump") === "1";
  const customerId = params.get("cid") || undefined;
  const sessionId = params.get("s") || undefined;
  const customerName = params.get("name") || "";
  const customerEmail = params.get("email") || "";

  const buildConfirmUrl = (extraParams: Record<string, string> = {}) => {
    const q = new URLSearchParams();
    if (customerName) q.set("name", customerName);
    if (customerEmail) q.set("email", customerEmail);
    if (hasBump) q.set("bump", "1");
    if (hasUpsell1) q.set("upsell", "1");
    Object.entries(extraParams).forEach(([k, v]) => q.set(k, v));
    return `/confirmacao-br?${q.toString()}`;
  };

  useEffect(() => {
    if (hasUpsell1 && customerId) {
      const timer = setTimeout(() => setShowUpsell2(true), 3000);
      return () => clearTimeout(timer);
    } else if (!hasUpsell1) {
      // No upsell 1 — redirect to confirmation directly after 2s
      const timer = setTimeout(() => navigate(buildConfirmUrl()), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasUpsell1, customerId]);

  const handleUpsell2Accept = async () => {
    if (!customerId) {
      setError("Erro: dados de pagamento não encontrados.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      await chargeUpsell.mutateAsync({
        customerId,
        productKey: "upsell_2" as any,
        sessionId,
      });
      await trackConversion.mutateAsync({ sessionId, type: "upsell_2", amount: 5700 });
      navigate(buildConfirmUrl({ upsell2: "1" }));
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento.");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--dm-white)", fontFamily: "'Montserrat', sans-serif" }}>
      {/* Logo Header */}
      <header className="dm-header">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo-dm-horizontal-n9a8yuvGoTiJrKpUzYtKBQ.png"
            alt="Desbloqueio Metab\u00f3lico"
            className="h-10 w-auto object-contain"
            
          />
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--teal-pale)" }}>
          <span className="text-4xl">🎉</span>
        </div>
        <h1 className="text-[28px] font-extrabold mb-3" style={{ color: "var(--dm-text)", letterSpacing: "-0.025em" }}>
          Bem-vinda à sua transformação!
        </h1>
        <p className="text-[14px] mb-6 leading-[1.65]" style={{ color: "var(--dm-text-soft)" }}>
          Seu pedido foi confirmado com sucesso. Nos próximos minutos você receberá um e-mail com o acesso a todo o material. Verifique também sua caixa de spam.
        </p>
        <div className="rounded-2xl p-5 mb-6 text-left" style={{ background: "var(--teal-bg)", border: "1.5px solid var(--teal-light)" }}>
          <h3 className="font-bold text-[15px] mb-3" style={{ color: "var(--teal-dark)" }}>O que fazer agora?</h3>
          <ol className="text-[13px] space-y-2" style={{ color: "var(--dm-text-soft)" }}>
            <li><strong style={{ color: "var(--dm-text)" }}>1.</strong> Verifique seu e-mail (inclusive o spam)</li>
            <li><strong style={{ color: "var(--dm-text)" }}>2.</strong> Baixe o Guia Mestre do Desbloqueio de 3 Minutos</li>
            <li><strong style={{ color: "var(--dm-text)" }}>3.</strong> Aplique o protocolo amanhã antes do café da manhã</li>
            <li><strong style={{ color: "var(--dm-text)" }}>4.</strong> Observe as mudanças nos primeiros 7 dias</li>
          </ol>
        </div>
        <div className="flex items-center justify-center gap-3 opacity-50">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "var(--teal-pale)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 12l3.5 3.5L17 8" stroke="var(--teal-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-extrabold text-[13px]" style={{ color: "var(--dm-text)" }}>Desbloqueio Metabólico</span>
        </div>
      </div>

      {/* UPSELL 2 POPUP — aparece 3s após a página carregar para quem comprou o Upsell1 */}
      {showUpsell2 && !upsell2Dismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[20px] max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300" style={{ boxShadow: "var(--shadow-lg)" }}>
            <button
              onClick={() => setUpsell2Dismissed(true)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors"
              style={{ color: "var(--dm-grey-300)", background: "var(--dm-grey-50)" }}
            >
              &times;
            </button>

            <div className="text-center mb-5">
              <span className="inline-block text-[10px] font-bold px-4 py-2 rounded-full mb-3" style={{ background: "#FFFBEB", color: "#92400E", border: "1.5px solid #FDE68A", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                ⚡ Oferta especial — Só para você
              </span>
              <h2 className="text-[20px] font-extrabold mb-2 leading-tight" style={{ color: "var(--dm-text)", letterSpacing: "-0.02em" }}>
                Adicione o <span style={{ color: "var(--teal-dark)" }}>Mapa Corporal de Desbloqueio</span> por apenas R$57
              </h2>
              <p className="text-[13px]" style={{ color: "var(--dm-text-soft)" }}>
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
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "var(--teal)" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[13px]" style={{ color: "var(--dm-text-soft)" }}>{point}</span>
                </div>
              ))}
            </div>

            <div className="text-center mb-5">
              <p className="line-through" style={{ color: "var(--dm-grey-300)" }}>R$97</p>
              <p className="text-3xl font-extrabold" style={{ color: "var(--teal-dark)" }}>R$57</p>
            </div>

            {error && (
              <div className="mb-3 p-3 rounded-lg text-[13px] font-medium" style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>
                {error}
              </div>
            )}

            <button
              onClick={handleUpsell2Accept}
              disabled={processing}
              className="dm-btn-primary mb-3"
              style={{ opacity: processing ? 0.7 : 1 }}
            >
              {processing ? "Processando..." : "Sim, quero o Mapa Corporal por R$57 →"}
            </button>
            <p className="text-center text-[11px] mb-3" style={{ color: "var(--dm-grey-300)" }}>
              ⚡ Cobrança automática no mesmo cartão
            </p>
            <button
              onClick={() => navigate(buildConfirmUrl())}
              className="w-full text-[11px] py-2 transition-colors" style={{ color: "var(--dm-grey-300)" }}
            >
              Não, obrigada.
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
