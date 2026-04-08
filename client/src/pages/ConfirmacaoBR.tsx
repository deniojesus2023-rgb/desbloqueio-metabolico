import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";

const PRODUCT_INFO: Record<string, { name: string; price: string; emoji: string }> = {
  main_offer: { name: "Protocolo Desbloqueio Metabólico", price: "R$47,00", emoji: "📋" },
  order_bump: { name: "Guia de Receitas Termogênicas", price: "R$19,90", emoji: "🍽️" },
  upsell_1: { name: "Pacote Acelerador Metabólico", price: "R$97,00", emoji: "⚡" },
  downsell_1: { name: "Guia Essencial de Desbloqueio", price: "R$37,00", emoji: "📖" },
  upsell_2: { name: "Comunidade VIP + Suporte", price: "R$57,00", emoji: "👥" },
};

export default function ConfirmacaoBR() {
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cartão");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const items: string[] = ["main_offer"];
    let total = 4700;

    if (params.get("bump") === "1") {
      items.push("order_bump");
      total += 1990;
    }
    if (params.get("upsell") === "1") {
      items.push("upsell_1");
      total += 9700;
    }
    if (params.get("downsell") === "1") {
      items.push("downsell_1");
      total += 3700;
    }
    if (params.get("upsell2") === "1") {
      items.push("upsell_2");
      total += 5700;
    }

    setPurchasedItems(items);
    setTotalAmount(total);
    setCustomerName(params.get("name") || "");
    setCustomerEmail(params.get("email") || "");
    if (params.get("pix") === "1") setPaymentMethod("PIX");
  }, []);

  const formatPrice = (cents: number) =>
    `R$${(cents / 100).toFixed(2).replace(".", ",")}`;

  return (
    <div className="min-h-screen font-sans" style={{ background: "var(--dm-bg)" }}>
      {/* Header */}
      <div
        className="w-full py-4 px-4 text-center"
        style={{ background: "var(--dm-gradient)", color: "#fff" }}
      >
        <div className="flex items-center justify-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold text-sm tracking-wide">PEDIDO CONFIRMADO</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--teal-lightest)" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold mb-2" style={{ color: "var(--dm-text)" }}>
            {customerName ? `Parabéns, ${customerName.split(" ")[0]}!` : "Parabéns!"}
          </h1>
          <p className="text-sm" style={{ color: "var(--dm-text-soft)" }}>
            Seu pedido foi processado com sucesso.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="dm-card mb-6" style={{ padding: "24px" }}>
          <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid var(--dm-grey-100)" }}>
            <h2 className="font-bold text-base" style={{ color: "var(--dm-text)" }}>
              Resumo do Pedido
            </h2>
            <span
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: "var(--teal-lightest)", color: "var(--teal)" }}
            >
              Pago via {paymentMethod}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            {purchasedItems.map((key) => {
              const item = PRODUCT_INFO[key];
              if (!item) return null;
              return (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium" style={{ color: "var(--dm-text)" }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--dm-text)" }}>
                    {item.price}
                  </span>
                </div>
              );
            })}
          </div>

          <div
            className="flex items-center justify-between pt-3"
            style={{ borderTop: "2px solid var(--teal)", color: "var(--teal-dark)" }}
          >
            <span className="font-bold text-base">Total</span>
            <span className="font-extrabold text-xl">{formatPrice(totalAmount)}</span>
          </div>
        </div>

        {/* Customer Info */}
        {customerEmail && (
          <div className="dm-card mb-6" style={{ padding: "20px" }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: "var(--dm-text)" }}>
              Dados do Comprador
            </h3>
            <div className="space-y-2">
              {customerName && (
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="var(--dm-grey-300)" strokeWidth="2" />
                    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="var(--dm-grey-300)" strokeWidth="2" />
                  </svg>
                  <span className="text-sm" style={{ color: "var(--dm-text-soft)" }}>{customerName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="var(--dm-grey-300)" strokeWidth="2" />
                  <path d="M2 8l10 6 10-6" stroke="var(--dm-grey-300)" strokeWidth="2" />
                </svg>
                <span className="text-sm" style={{ color: "var(--dm-text-soft)" }}>{customerEmail}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="dm-card mb-6" style={{ padding: "24px" }}>
          <h3 className="font-bold text-base mb-4" style={{ color: "var(--dm-text)" }}>
            Próximos Passos
          </h3>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Verifique seu e-mail",
                desc: "Enviamos o acesso ao material para o e-mail cadastrado. Verifique também a pasta de spam.",
                icon: "📧",
              },
              {
                step: "2",
                title: "Baixe o Protocolo",
                desc: "Faça o download da Guia Mestra do Desbloqueio de 3 Minutos e salve no seu celular.",
                icon: "📱",
              },
              {
                step: "3",
                title: "Comece amanhã de manhã",
                desc: "Aplique o protocolo antes do café da manhã. São apenas 3 minutos. Simples e direto.",
                icon: "☀️",
              },
              {
                step: "4",
                title: "Observe os resultados",
                desc: "Nos primeiros 7 dias você já vai notar diferença na disposição e na cintura.",
                icon: "📊",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--teal-lightest)" }}
                >
                  <span className="text-lg">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-1" style={{ color: "var(--dm-text)" }}>
                    {item.title}
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--dm-text-soft)" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guarantee Reminder */}
        <div
          className="rounded-xl p-4 mb-6 text-center"
          style={{ background: "var(--teal-lightest)", border: "1px solid var(--teal-light)" }}
        >
          <p className="text-sm font-semibold mb-1" style={{ color: "var(--teal-dark)" }}>
            Garantia de 30 dias
          </p>
          <p className="text-xs" style={{ color: "var(--dm-text-soft)" }}>
            Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do seu investimento. Sem perguntas.
          </p>
        </div>

        {/* Support */}
        <div className="text-center mb-8">
          <p className="text-xs mb-2" style={{ color: "var(--dm-grey-300)" }}>
            Dúvidas sobre seu pedido?
          </p>
          <a
            href="mailto:suporte@desbloqueiomet.com"
            className="text-xs font-semibold underline"
            style={{ color: "var(--teal)" }}
          >
            suporte@desbloqueiomet.com
          </a>
        </div>

        {/* Logo */}
        <div className="text-center">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663097145516/g4z5oQrNVVJn7M3uTpF5hp/logo_desbloqueio_metabolico-XXWBHTmoyhnmkSeSUASCTv.webp"
            alt="Desbloqueio Metabólico"
            className="h-6 object-contain mx-auto opacity-40"
          />
        </div>
      </div>
    </div>
  );
}
