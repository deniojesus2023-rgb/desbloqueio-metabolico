"use client";

import { useState, useEffect } from "react";

interface UpsellPopupProps {
  isOpen: boolean;
  onAccept: () => Promise<void>;
  onDecline: () => void;
  type: "upsell1" | "downsell1" | "upsell2";
}

const UPSELL_CONTENT = {
  upsell1: {
    badge: "PARE! OFERTA ÚNICA",
    badgeColor: "#DC2626",
    title: "Você acabou de desbloquear seu metabolismo...",
    highlight: "Agora TRIPLIQUE seus resultados nas próximas 3 semanas",
    subtitle:
      "Esta é a ÚNICA chance de adicionar o Acelerador de Resultados. Quando fechar este popup, o preço volta para R$197.",
    price: "R$97",
    originalPrice: "R$197",
    discount: "51% OFF",
    benefits: [
      {
        icon: "🌙",
        title: "Protocolo do Jejum Circadiano Brasileiro",
        desc: "Queime gordura 3x mais rápido sincronizando suas refeições com seu relógio biológico — sem abrir mão do café da manhã nem do almoço brasileiro.",
      },
      {
        icon: "📊",
        title: "Plano de 21 Dias Acelerado",
        desc: "Roteiro dia a dia para resultados VISÍVEIS em 3 semanas. Cardápio completo com comidas típicas brasileiras.",
      },
      {
        icon: "💬",
        title: "Grupo VIP de Suporte (R$97/mês → GRÁTIS)",
        desc: "Acesso VITALÍCIO à comunidade de mulheres que estão transformando seus corpos. Suporte, motivação e dicas exclusivas.",
      },
    ],
    ctaText: "SIM! Quero TRIPLICAR meus resultados →",
    declineText: "Não, prefiro resultados 3x mais lentos",
    urgencyText: "Apenas 7 vagas restantes com este preço",
  },
  downsell1: {
    badge: "ESPERA! ÚLTIMA CHANCE",
    badgeColor: "#EA580C",
    title: "Entendo, R$97 pode parecer muito agora...",
    highlight: "Que tal a versão ESSENCIAL por apenas R$37?",
    subtitle:
      "Vou tirar os bônus e o grupo de suporte. Só o núcleo duro: O Guia Prático do Jejum Circadiano Brasileiro que acelera seus resultados 3x.",
    price: "R$37",
    originalPrice: "R$97",
    discount: "62% OFF",
    benefits: [
      {
        icon: "⚡",
        title: "O Método Completo do Jejum Circadiano",
        desc: "O mesmo protocolo que acelera a queima em 3x — só sem os bônus extras.",
      },
      {
        icon: "🍽️",
        title: "Guia de Horários Brasileiros",
        desc: "Adaptado para a realidade brasileira: café da manhã às 7h, almoço ao meio-dia, jantar às 19h.",
      },
      {
        icon: "📱",
        title: "Acesso Vitalício",
        desc: "Consulte quando quiser, para sempre. Sem mensalidades, sem renovações.",
      },
    ],
    ctaText: "SIM! Quero a versão essencial por R$37 →",
    declineText: "Não, obrigada. Vou continuar só com o básico.",
    urgencyText: "Oferta de resgate — disponível apenas agora",
  },
  upsell2: {
    badge: "BÔNUS ESPECIAL DESBLOQUEADO",
    badgeColor: "#7C3AED",
    title: "Parabéns pela decisão inteligente!",
    highlight: "Adicione o Mapa Corporal de Desbloqueio por R$57",
    subtitle:
      "Um guia visual que mostra EXATAMENTE quais pontos do seu corpo ativar para acelerar a queima de gordura localizada — especialmente barriga, quadril e coxas.",
    price: "R$57",
    originalPrice: "R$147",
    discount: "61% OFF",
    benefits: [
      {
        icon: "🎯",
        title: "Pontos de Pressão Estratégicos",
        desc: "Locais exatos que ativam a queima de gordura localizada. Funciona mesmo enquanto você assiste TV.",
      },
      {
        icon: "⏱️",
        title: "Sequência de 5 Minutos",
        desc: "Faça em casa ou no trabalho. Não precisa de equipamento, roupa especial ou espaço.",
      },
      {
        icon: "🔥",
        title: "Técnica Anti-Barriga de Estresse",
        desc: "Método específico para aquela gordura abdominal teimosa causada pelo cortisol elevado.",
      },
    ],
    ctaText: "SIM! Quero o Mapa Corporal por R$57 →",
    declineText: "Não, obrigada. Vou sem o mapa.",
    urgencyText: "Oferta exclusiva — só aparece uma vez",
  },
};

export default function UpsellPopup({
  isOpen,
  onAccept,
  onDecline,
  type,
}: UpsellPopupProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 minutes

  const content = UPSELL_CONTENT[type];

  useEffect(() => {
    if (!isOpen) return;
    setCountdown(300);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleAccept = async () => {
    setProcessing(true);
    setError("");
    try {
      await onAccept();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao processar. Tente novamente."
      );
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative animate-slideUp"
        style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.4)" }}
      >
        {/* Urgency Bar */}
        <div
          className="sticky top-0 text-white text-center py-2.5 px-4 rounded-t-2xl"
          style={{ background: content.badgeColor }}
        >
          <p className="text-xs font-bold tracking-wide">
            {content.urgencyText} · Expira em{" "}
            <span className="font-mono bg-black/20 px-1.5 py-0.5 rounded">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </p>
        </div>

        <div className="p-6">
          {/* Badge */}
          <div className="text-center mb-4">
            <span
              className="inline-block text-[10px] font-extrabold px-4 py-2 rounded-full tracking-widest"
              style={{
                background: `${content.badgeColor}15`,
                color: content.badgeColor,
                border: `2px solid ${content.badgeColor}`,
              }}
            >
              {content.badge}
            </span>
          </div>

          {/* Title */}
          <h2
            className="text-[18px] font-bold text-center mb-2 leading-tight"
            style={{ color: "var(--dm-text)" }}
          >
            {content.title}
          </h2>
          <h3
            className="text-[20px] font-extrabold text-center mb-3 leading-tight"
            style={{ color: "var(--teal-dark)" }}
          >
            {content.highlight}
          </h3>
          <p
            className="text-[13px] text-center mb-5 leading-relaxed"
            style={{ color: "var(--dm-text-soft)" }}
          >
            {content.subtitle}
          </p>

          {/* Price */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-3">
              <span
                className="text-lg line-through"
                style={{ color: "var(--dm-grey-300)" }}
              >
                {content.originalPrice}
              </span>
              <span
                className="text-xs font-bold px-2 py-1 rounded"
                style={{ background: "#FEF2F2", color: "#DC2626" }}
              >
                {content.discount}
              </span>
            </div>
            <p
              className="text-4xl font-extrabold mt-1"
              style={{ color: "var(--teal-dark)" }}
            >
              {content.price}
            </p>
            <p className="text-[11px] mt-1" style={{ color: "var(--dm-text-soft)" }}>
              Pagamento único · Acesso vitalício
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-5">
            {content.benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-xl"
                style={{ background: "var(--teal-bg)" }}
              >
                <span className="text-2xl flex-shrink-0">{benefit.icon}</span>
                <div>
                  <h4
                    className="font-bold text-[13px] mb-0.5"
                    style={{ color: "var(--dm-text)" }}
                  >
                    {benefit.title}
                  </h4>
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ color: "var(--dm-text-soft)" }}
                  >
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 p-3 rounded-lg text-[13px] font-medium"
              style={{
                background: "#FEF2F2",
                color: "#B91C1C",
                border: "1px solid #FECACA",
              }}
            >
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleAccept}
            disabled={processing}
            className="dm-btn-primary mb-3"
            style={{
              fontSize: "16px",
              padding: "18px 20px",
              opacity: processing ? 0.7 : 1,
            }}
          >
            {processing ? "Processando pagamento..." : content.ctaText}
          </button>

          <p
            className="text-center text-[10px] mb-3"
            style={{ color: "var(--dm-grey-300)" }}
          >
            Cobrança automática no mesmo cartão — sem digitar novamente
          </p>

          {/* Decline */}
          <button
            onClick={onDecline}
            disabled={processing}
            className="w-full text-[11px] py-2 transition-opacity hover:opacity-70"
            style={{ color: "var(--dm-grey-300)" }}
          >
            {content.declineText}
          </button>

          {/* Trust badges */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-[10px]" style={{ color: "var(--dm-grey-300)" }}>
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Seguro
              </span>
              <span>·</span>
              <span>Garantia 30 dias</span>
              <span>·</span>
              <span>Acesso imediato</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
