import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { pixelPurchase } from "@/lib/pixel";

/* ── Timer regressivo ─────────────────────────────────────────────────── */
function useTimer(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return { display: `${m}:${s}`, expired: seconds === 0 };
}

interface Props {
  customerId?: string;
  sessionId?: string;
}

/* ══════════════════════════════════════════════════════════════════════
   UPSELL POPUP (R$97)
══════════════════════════════════════════════════════════════════════ */
function UpsellContent({
  onAccept,
  onDecline,
  processing,
  error,
}: {
  onAccept: () => void;
  onDecline: () => void;
  processing: boolean;
  error: string;
}) {
  const { display, expired } = useTimer(12 * 60);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "rgba(0,0,0,0.85)" }}>
      <div className="overflow-y-auto flex-1 flex flex-col items-center py-6 px-4">
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ background: "#fff", boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}
        >
          {/* Barra de urgência */}
          <div
            className="w-full py-3 px-4 text-center text-white font-extrabold text-sm flex items-center justify-center gap-2"
            style={{ background: expired ? "#DC2626" : "#EA580C" }}
          >
            <span className="animate-pulse">🔥</span>
            <span>
              {expired
                ? "OFERTA EXPIRADA — Última chance!"
                : `OFERTA EXPIRA EM ${display} — Fechar = perder para sempre`}
            </span>
            <span className="animate-pulse">🔥</span>
          </div>

          <div className="p-6">
            {/* Confirmação de compra */}
            <div
              className="flex items-center gap-3 rounded-xl p-3 mb-6"
              style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#22C55E" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-[13px]" style={{ color: "#166534" }}>
                  Pagamento confirmado — seu acesso está garantido!
                </p>
                <p className="text-[11px]" style={{ color: "#15803D" }}>
                  Agora você tem 1 janela de oportunidade para ir ainda mais longe.
                </p>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-5">
              <p
                className="text-[11px] font-extrabold uppercase tracking-widest mb-3 px-3 py-1.5 rounded-full inline-block"
                style={{ background: "#FFF7ED", color: "#EA580C", border: "1.5px solid #FED7AA" }}
              >
                ⚡ Disponível só agora — nunca vai aparecer de novo
              </p>
              <h2
                className="text-[clamp(20px,4vw,26px)] font-extrabold leading-[1.2] mb-3"
                style={{ color: "#111827", letterSpacing: "-0.025em" }}
              >
                Você desbloqueou o metabolismo.
                <br />
                <span style={{ color: "#0F766E" }}>Mas sem o Acelerador, vai demorar 3x mais para ver resultado no espelho.</span>
              </h2>
              <p className="text-[13px] leading-[1.7]" style={{ color: "#6B7280" }}>
                Os <strong style={{ color: "#111827" }}>primeiros 21 dias após o desbloqueio</strong> são a janela de ouro do seu metabolismo — ele está no pico da resposta hormonal. <strong style={{ color: "#0F766E" }}>Quem aproveita agora acelera 3x mais.</strong> Quem não aproveita perde essa janela e leva meses até ver diferença na balança.
              </p>
            </div>

            {/* Itens */}
            <div className="space-y-3 mb-6">
              {[
                {
                  icon: "🌙",
                  title: "Protocolo do Jejum Circadiano Brasileiro",
                  desc: "Sincroniza sua alimentação com o ritmo biológico e triplica a queima de gordura — sem cortar arroz com feijão.",
                },
                {
                  icon: "📊",
                  title: "Plano de 21 Dias de Desbloqueio Acelerado",
                  desc: "Roteiro semana a semana que combina os dois protocolos. Resultados visíveis na 1ª semana.",
                },
                {
                  icon: "💬",
                  title: "Grupo de Suporte Privado — Acesso Vitalício",
                  desc: "Comunidade de mulheres que já estão no processo. Accountability, dicas e motivação todo dia.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-3 rounded-xl p-3.5"
                  style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
                >
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-bold text-[13px] mb-0.5" style={{ color: "#111827" }}>
                      {item.title}
                    </p>
                    <p className="text-[12px]" style={{ color: "#6B7280", lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Preço */}
            <div
              className="rounded-xl p-4 mb-5 text-center"
              style={{ background: "#F0FDF4", border: "2px solid #86EFAC" }}
            >
              <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "#15803D" }}>
                Só disponível agora nesta tela
              </p>
              <p
                className="text-lg line-through mb-0.5"
                style={{ color: "#9CA3AF" }}
              >
                De R$197
              </p>
              <p
                className="text-5xl font-extrabold leading-none"
                style={{ color: "#0F766E" }}
              >
                R$97
              </p>
              <p className="text-[11px] mt-1" style={{ color: "#6B7280" }}>
                Pagamento único · Acesso vitalício · ⚡ No mesmo cartão — sem digitar nada
              </p>
            </div>

            {error && (
              <div
                className="mb-4 p-3 rounded-lg text-[13px] font-medium"
                style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
              >
                {error}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={onAccept}
              disabled={processing}
              className="w-full rounded-xl font-extrabold text-white py-5 text-[18px] leading-tight transition-all active:scale-95"
              style={{
                background: processing ? "#9CA3AF" : "linear-gradient(135deg, #059669, #0F766E)",
                boxShadow: processing ? "none" : "0 8px 32px rgba(15,118,110,0.45)",
                animation: processing ? "none" : "pulse-glow 2s infinite",
              }}
            >
              {processing ? (
                "Processando pagamento..."
              ) : (
                <>
                  SIM! Quero acelerar 3x mais rápido por R$97 →
                  <br />
                  <span className="text-[12px] font-medium opacity-90">
                    Cobrança automática no mesmo cartão
                  </span>
                </>
              )}
            </button>

            {/* Decline */}
            <button
              onClick={onDecline}
              disabled={processing}
              className="w-full mt-3 py-3 text-[11px] text-center transition-colors"
              style={{ color: "#9CA3AF" }}
            >
              Não. Prefiro demorar 3x mais para ver resultado no espelho.
            </button>

            <p className="text-center text-[10px] mt-2" style={{ color: "#D1D5DB" }}>
              🔒 Pagamento 100% seguro · Garantia de 30 dias sem perguntas
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 8px 32px rgba(15,118,110,0.45); }
          50% { box-shadow: 0 8px 48px rgba(15,118,110,0.75), 0 0 0 4px rgba(15,118,110,0.15); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   DOWNSELL POPUP (R$37)
══════════════════════════════════════════════════════════════════════ */
function DownsellContent({
  onAccept,
  onDecline,
  processing,
  error,
}: {
  onAccept: () => void;
  onDecline: () => void;
  processing: boolean;
  error: string;
}) {
  const { display, expired } = useTimer(8 * 60);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "rgba(0,0,0,0.9)" }}>
      <div className="overflow-y-auto flex-1 flex flex-col items-center py-6 px-4">
        <div
          className="w-full max-w-lg rounded-2xl overflow-hidden"
          style={{ background: "#fff", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}
        >
          {/* Barra de urgência vermelha */}
          <div
            className="w-full py-3 px-4 text-center text-white font-extrabold text-sm"
            style={{ background: "#DC2626" }}
          >
            🚨{" "}
            {expired
              ? "ÚLTIMA CHANCE — Oferta expirando agora"
              : `ATENÇÃO: ${display} para decidir — depois disso, acabou`}{" "}
            🚨
          </div>

          <div className="p-6">
            {/* Headline */}
            <div className="text-center mb-6">
              <p
                className="text-[11px] font-extrabold uppercase tracking-widest mb-3 px-3 py-1.5 rounded-full inline-block"
                style={{ background: "#FEF2F2", color: "#DC2626", border: "1.5px solid #FECACA" }}
              >
                🚨 Estou abrindo uma exceção por você
              </p>
              <h2
                className="text-[clamp(19px,4vw,24px)] font-extrabold leading-[1.2] mb-3"
                style={{ color: "#111827", letterSpacing: "-0.02em" }}
              >
                Minha equipe vai me matar por isso.
                <br />
                <span style={{ color: "#DC2626" }}>
                  Vou dar a versão essencial do Acelerador por R$37
                  — só porque você já comprou.
                </span>
              </h2>
              <p className="text-[13px] leading-[1.7]" style={{ color: "#6B7280" }}>
                Tirei os bônus e o suporte em grupo. Ficou só o núcleo que faz a diferença:{" "}
                <strong style={{ color: "#111827" }}>
                  o Guia Prático do Jejum Circadiano Brasileiro + o Plano de 21 Dias.
                </strong>{" "}
                O método que <strong style={{ color: "#DC2626" }}>acelera seu resultado em 3x</strong> quando combinado com o Protocolo que você já tem.
              </p>
            </div>

            {/* O que está incluído */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: "#FFF7ED", border: "2px solid #FED7AA" }}
            >
              <p className="font-bold text-[13px] mb-3" style={{ color: "#92400E" }}>
                O que você recebe por R$37:
              </p>
              <div className="space-y-2">
                {[
                  "🌙 Guia Prático do Jejum Circadiano Brasileiro",
                  "📊 Plano de 21 Dias de Desbloqueio Acelerado",
                  "⚡ Acesso imediato — sem esperar nada",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <svg
                      className="flex-shrink-0 mt-0.5"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12l5 5L19 7"
                        stroke="#D97706"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[13px] font-medium" style={{ color: "#78350F" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preço */}
            <div className="text-center mb-5">
              <p className="text-base line-through mb-0.5" style={{ color: "#9CA3AF" }}>
                De R$97 (que você acabou de recusar)
              </p>
              <p className="text-5xl font-extrabold" style={{ color: "#DC2626" }}>
                R$37
              </p>
              <p className="text-[12px] mt-1" style={{ color: "#6B7280" }}>
                O preço de um lanche ruim que não te deixa mais magra
              </p>
            </div>

            {/* Social proof */}
            <div
              className="rounded-lg p-3 mb-5 text-center"
              style={{ background: "#F8FAFC", border: "1px solid #E2E8F0" }}
            >
              <p className="text-[12px] font-semibold" style={{ color: "#374151" }}>
                🔥 <strong>89 mulheres</strong> aceitaram essa oferta nas últimas 24h
              </p>
            </div>

            {error && (
              <div
                className="mb-4 p-3 rounded-lg text-[13px] font-medium"
                style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
              >
                {error}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={onAccept}
              disabled={processing}
              className="w-full rounded-xl font-extrabold text-white py-5 text-[17px] leading-tight transition-all active:scale-95"
              style={{
                background: processing ? "#9CA3AF" : "linear-gradient(135deg, #DC2626, #B91C1C)",
                boxShadow: processing ? "none" : "0 8px 32px rgba(220,38,38,0.45)",
                animation: processing ? "none" : "pulse-glow-red 2s infinite",
              }}
            >
              {processing ? (
                "Processando..."
              ) : (
                <>
                  Sim! Aceito a versão essencial por R$37 →
                  <br />
                  <span className="text-[11px] font-medium opacity-90">
                    ⚡ Cobrança no mesmo cartão — sem digitar nada
                  </span>
                </>
              )}
            </button>

            {/* Decline definitivo */}
            <button
              onClick={onDecline}
              disabled={processing}
              className="w-full mt-3 py-3 text-[11px] text-center transition-colors"
              style={{ color: "#9CA3AF" }}
            >
              Não. Abro mão de acelerar meu resultado e sigo sem o acelerador.
            </button>

            <p className="text-center text-[10px] mt-2" style={{ color: "#D1D5DB" }}>
              🔒 Garantia de 30 dias · Acesso imediato após confirmação
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow-red {
          0%, 100% { box-shadow: 0 8px 32px rgba(220,38,38,0.45); }
          50% { box-shadow: 0 8px 48px rgba(220,38,38,0.75), 0 0 0 4px rgba(220,38,38,0.15); }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   3º DOWNSELL POPUP (R$17)
══════════════════════════════════════════════════════════════════════ */
function ThirdOfferContent({
  onAccept,
  onDecline,
  processing,
  error,
}: {
  onAccept: () => void;
  onDecline: () => void;
  processing: boolean;
  error: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col" style={{ background: "rgba(0,0,0,0.92)" }}>
      <div className="overflow-y-auto flex-1 flex flex-col items-center py-6 px-4">
        <div className="w-full max-w-lg rounded-2xl overflow-hidden" style={{ background: "#fff", boxShadow: "0 25px 80px rgba(0,0,0,0.6)" }}>
          <div className="w-full py-3 px-4 text-center text-white font-extrabold text-sm" style={{ background: "#7C3AED" }}>
            ⚡ Última oportunidade antes de ir para o material ⚡
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <p className="text-[11px] font-extrabold uppercase tracking-widest mb-3 px-3 py-1.5 rounded-full inline-block" style={{ background: "#F5F3FF", color: "#7C3AED", border: "1.5px solid #DDD6FE" }}>
                📖 Apenas o guia essencial
              </p>
              <h2 className="text-[clamp(18px,4vw,22px)] font-extrabold leading-[1.2] mb-3" style={{ color: "#111827", letterSpacing: "-0.02em" }}>
                Ok. Respeito sua decisão.
                <br />
                <span style={{ color: "#7C3AED" }}>Mas deixa eu te dar uma última chance por R$17.</span>
              </h2>
              <p className="text-[13px] leading-[1.7]" style={{ color: "#6B7280" }}>
                Só o <strong style={{ color: "#111827" }}>Guia PDF do Protocolo de 3 Minutos</strong> — sem bônus, sem suporte, sem grupo. O essencial puro para você aplicar hoje mesmo. <strong style={{ color: "#7C3AED" }}>R$17. Menos que um almoço.</strong>
              </p>
            </div>
            <div className="rounded-xl p-4 mb-5 text-center" style={{ background: "#F5F3FF", border: "2px solid #DDD6FE" }}>
              <p className="text-base line-through mb-0.5" style={{ color: "#9CA3AF" }}>De R$37</p>
              <p className="text-5xl font-extrabold" style={{ color: "#7C3AED" }}>R$17</p>
              <p className="text-[11px] mt-1" style={{ color: "#6B7280" }}>⚡ Cobrança no mesmo cartão — acesso imediato</p>
            </div>
            {error && (
              <div className="mb-4 p-3 rounded-lg text-[13px] font-medium" style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}>{error}</div>
            )}
            <button
              onClick={onAccept}
              disabled={processing}
              className="w-full rounded-xl font-extrabold text-white py-5 text-[17px] leading-tight transition-all active:scale-95"
              style={{ background: processing ? "#9CA3AF" : "#7C3AED", boxShadow: processing ? "none" : "0 8px 32px rgba(124,58,237,0.4)" }}
            >
              {processing ? "Processando..." : "Sim, quero o guia por R$17 →"}
            </button>
            <button
              onClick={onDecline}
              disabled={processing}
              className="w-full mt-3 py-3 text-[11px] text-center"
              style={{ color: "#9CA3AF" }}
            >
              Não, vou sem nenhum acelerador.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════════════════ */
export default function UpsellModal({ customerId, sessionId }: Props) {
  const [, navigate] = useLocation();
  const [declined, setDeclined] = useState(false);
  const [secondDeclined, setSecondDeclined] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const chargeUpsell = trpc.payment.chargeUpsell.useMutation();
  const trackConversion = trpc.quiz.trackConversion.useMutation();

  const handleAccept = async () => {
    if (!customerId) {
      setError("Erro: dados de pagamento não encontrados. Entre em contato com o suporte.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      await chargeUpsell.mutateAsync({ customerId, productKey: "upsell_1", sessionId });
      await trackConversion.mutateAsync({ sessionId, type: "upsell_1", amount: 9700 });
      pixelPurchase({ value: 97, currency: "BRL", content_type: "upsell_1" });
      navigate(`/obrigado-br?upsell=1&cid=${customerId}`);
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
      setProcessing(false);
    }
  };

  const handleDecline = () => setDeclined(true);

  const handleDownsellAccept = async () => {
    if (!customerId) {
      setError("Erro: dados de pagamento não encontrados. Entre em contato com o suporte.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      await chargeUpsell.mutateAsync({ customerId, productKey: "downsell_1", sessionId });
      await trackConversion.mutateAsync({ sessionId, type: "downsell_1", amount: 3700 });
      pixelPurchase({ value: 37, currency: "BRL", content_type: "downsell_1" });
      navigate(`/obrigado-br?downsell=1&cid=${customerId}`);
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
      setProcessing(false);
    }
  };

  const handleDownsellDecline = () => setSecondDeclined(true);

  const handleThirdOfferAccept = async () => {
    if (!customerId) {
      setError("Erro: dados de pagamento não encontrados. Entre em contato com o suporte.");
      return;
    }
    setProcessing(true);
    setError("");
    try {
      await chargeUpsell.mutateAsync({ customerId, productKey: "downsell_2", sessionId });
      await trackConversion.mutateAsync({ sessionId, type: "downsell_2", amount: 1700 });
      pixelPurchase({ value: 17, currency: "BRL", content_type: "downsell_2" });
      navigate(`/obrigado-br?downsell2=1`);
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
      setProcessing(false);
    }
  };

  const handleThirdOfferDecline = () => navigate("/obrigado-br");

  if (declined && secondDeclined) {
    return (
      <ThirdOfferContent
        onAccept={handleThirdOfferAccept}
        onDecline={handleThirdOfferDecline}
        processing={processing}
        error={error}
      />
    );
  }

  if (declined) {
    return (
      <DownsellContent
        onAccept={handleDownsellAccept}
        onDecline={handleDownsellDecline}
        processing={processing}
        error={error}
      />
    );
  }

  return (
    <UpsellContent
      onAccept={handleAccept}
      onDecline={handleDecline}
      processing={processing}
      error={error}
    />
  );
}
