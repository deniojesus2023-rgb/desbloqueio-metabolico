"use client";

import { useSearchParams } from "next/navigation";

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams();

  const customerName = searchParams.get("name") || "";
  const customerEmail = searchParams.get("email") || "";
  const hasBump = searchParams.get("bump") === "1";
  const hasUpsell1 = searchParams.get("upsell1") === "1";
  const hasDownsell1 = searchParams.get("downsell1") === "1";
  const hasUpsell2 = searchParams.get("upsell2") === "1";

  const products = [
    {
      name: "Protocolo do Desbloqueio de 3 Minutos",
      included: true,
    },
    {
      name: "Guia dos Chás Noturnos",
      included: hasBump,
    },
    {
      name: "Acelerador de Resultados",
      included: hasUpsell1,
    },
    {
      name: "Versão Essencial do Acelerador",
      included: hasDownsell1,
    },
    {
      name: "Mapa Corporal de Desbloqueio",
      included: hasUpsell2,
    },
  ].filter((p) => p.included);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#FAFBFC" }}
    >
      {/* Header */}
      <header className="dm-header">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo-dm-final_ded01597.png"
            alt="Desbloqueio Metabólico"
            className="h-10 w-auto object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-5 py-12">
        <div className="max-w-lg w-full">
          {/* Success Banner */}
          <div
            className="rounded-2xl p-6 mb-8 text-center"
            style={{ background: "var(--grad)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12l5 5L19 7"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-[24px] font-extrabold text-white mb-2">
              Pedido Confirmado!
            </h1>
            <p className="text-white/80 text-[14px]">
              Seu acesso foi liberado com sucesso.
            </p>
          </div>

          {/* Order Summary */}
          <div
            className="dm-card mb-6"
            style={{ padding: "24px" }}
          >
            <h2
              className="font-extrabold text-[16px] mb-4"
              style={{ color: "var(--dm-text)" }}
            >
              Resumo do Pedido
            </h2>

            {customerEmail && (
              <div
                className="rounded-lg p-3 mb-4"
                style={{ background: "var(--teal-bg)" }}
              >
                <p
                  className="text-[12px]"
                  style={{ color: "var(--dm-text-soft)" }}
                >
                  Enviamos os detalhes para:
                </p>
                <p
                  className="font-bold text-[14px]"
                  style={{ color: "var(--teal-dark)" }}
                >
                  {customerEmail}
                </p>
              </div>
            )}

            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.name}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--teal)" }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M5 12l5 5L19 7"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span
                    className="text-[14px]"
                    style={{ color: "var(--dm-text)" }}
                  >
                    {product.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div
            className="dm-card mb-6"
            style={{ padding: "24px" }}
          >
            <h2
              className="font-extrabold text-[16px] mb-4"
              style={{ color: "var(--dm-text)" }}
            >
              Próximos Passos
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-[12px]"
                  style={{ background: "var(--teal-dark)" }}
                >
                  1
                </div>
                <div>
                  <h3
                    className="font-bold text-[14px] mb-1"
                    style={{ color: "var(--dm-text)" }}
                  >
                    Verifique seu e-mail
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--dm-text-soft)" }}
                  >
                    Enviamos um e-mail com o link de acesso à área de membros.
                    Verifique também a caixa de spam.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-[12px]"
                  style={{ background: "var(--teal)" }}
                >
                  2
                </div>
                <div>
                  <h3
                    className="font-bold text-[14px] mb-1"
                    style={{ color: "var(--dm-text)" }}
                  >
                    Acesse o Guia Mestre
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--dm-text-soft)" }}
                  >
                    Comece lendo o Protocolo do Desbloqueio de 3 Minutos. É a
                    base de toda a sua transformação.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-[12px]"
                  style={{ background: "var(--teal-mid)" }}
                >
                  3
                </div>
                <div>
                  <h3
                    className="font-bold text-[14px] mb-1"
                    style={{ color: "var(--dm-text)" }}
                  >
                    Aplique amanhã de manhã
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "var(--dm-text-soft)" }}
                  >
                    Faça o ritual de 3 minutos antes do café da manhã. Você vai
                    sentir a diferença nos primeiros 7 dias.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Box */}
          <div
            className="rounded-xl p-5 text-center"
            style={{
              background: "var(--teal-bg)",
              border: "1.5px solid var(--teal-light)",
            }}
          >
            <p
              className="text-[13px] mb-2"
              style={{ color: "var(--dm-text-soft)" }}
            >
              Alguma dúvida? Entre em contato:
            </p>
            <a
              href="mailto:suporte@desbloqueio.com"
              className="font-bold text-[14px] hover:underline"
              style={{ color: "var(--teal-dark)" }}
            >
              suporte@desbloqueio.com
            </a>
          </div>

          {/* Reminder */}
          <div
            className="mt-8 p-4 rounded-xl flex items-start gap-3"
            style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}
          >
            <span className="text-xl flex-shrink-0">&#128161;</span>
            <div>
              <p
                className="text-[12px] font-bold mb-1"
                style={{ color: "#92400E" }}
              >
                Lembrete importante
              </p>
              <p
                className="text-[12px] leading-relaxed"
                style={{ color: "#B45309" }}
              >
                A consistência é a chave. Aplique o protocolo de 3 minutos antes
                de TODAS as suas refeições principais por 21 dias seguidos para
                resultados máximos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-[11px]" style={{ color: "var(--dm-grey-300)" }}>
          Desbloqueio Metabólico · Todos os direitos reservados
        </p>
      </footer>
    </div>
  );
}
