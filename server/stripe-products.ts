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
    name: "Guia de Receitas Termogênicas",
    description: "47 receitas que aceleram seu metabolismo enquanto você come",
    amount: 1990, // R$19,90
    currency: "brl",
  },
  upsell_1: {
    name: "Pacote Acelerador Metabólico",
    description: "Protocolo avançado + acompanhamento por 90 dias",
    amount: 9700, // R$97,00
    currency: "brl",
  },
  downsell_1: {
    name: "Guia Essencial de Desbloqueio",
    description: "Versão compacta do protocolo com os 3 pilares fundamentais",
    amount: 3700, // R$37,00
    currency: "brl",
  },
  upsell_2: {
    name: "Comunidade VIP + Suporte",
    description: "Acesso ao grupo exclusivo de suporte por 6 meses",
    amount: 5700, // R$57,00
    currency: "brl",
  },
  downsell_2: {
    name: "Guia PDF Protocolo de 3 Minutos",
    description: "Guia PDF essencial do Protocolo de 3 Minutos — acesso imediato",
    amount: 1700, // R$17,00
    currency: "brl",
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
