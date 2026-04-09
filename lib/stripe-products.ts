/**
 * Stripe Products & Prices — Desbloqueio Metabólico
 * Valores em centavos (BRL)
 */

export const PRODUCTS = {
  main_offer: {
    name: "Protocolo Desbloqueio Metabólico",
    description: "Protocolo completo de 3 minutos para desbloquear seu metabolismo",
    amount: 4700, // R$47,00
    currency: "brl",
  },
  order_bump: {
    name: "Guia dos Chás Noturnos",
    description: "5 infusões que aceleram o desbloqueio enquanto você dorme",
    amount: 1990, // R$19,90
    currency: "brl",
  },
  upsell_1: {
    name: "Acelerador de Resultados",
    description: "Protocolo do Jejum Circadiano + Plano de 21 Dias + Grupo de Suporte",
    amount: 9700, // R$97,00
    currency: "brl",
  },
  downsell_1: {
    name: "Versão Essencial do Acelerador",
    description: "Guia Prático do Jejum Circadiano Brasileiro",
    amount: 3700, // R$37,00
    currency: "brl",
  },
  upsell_2: {
    name: "Mapa Corporal de Desbloqueio",
    description: "Guia visual dos pontos de ativação para queima localizada",
    amount: 5700, // R$57,00
    currency: "brl",
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
