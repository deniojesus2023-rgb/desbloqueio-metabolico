/* ─────────────────────────────────────────────────────────────────────────
   Meta Pixel helpers — ID 1291815882830987
   Uso:
     import { pixelViewContent, pixelInitiateCheckout, pixelPurchase } from "@/lib/pixel";
───────────────────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Dispara um evento padrão ou customizado no pixel do Meta */
function fbq(event: "track" | "trackCustom", name: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq(event, name, params);
    } else {
      window.fbq(event, name);
    }
  }
}

/** ViewContent — disparar ao entrar na página de vendas */
export function pixelViewContent(params?: { value?: number; currency?: string; content_name?: string }) {
  fbq("track", "ViewContent", {
    content_name: params?.content_name ?? "Protocolo Desbloqueio Metabólico",
    currency: params?.currency ?? "BRL",
    value: params?.value ?? 47,
  });
}

/** InitiateCheckout — disparar ao abrir o formulário de pagamento */
export function pixelInitiateCheckout(params?: { value?: number; currency?: string }) {
  fbq("track", "InitiateCheckout", {
    content_name: "Protocolo Desbloqueio Metabólico",
    currency: params?.currency ?? "BRL",
    value: params?.value ?? 47,
    num_items: 1,
  });
}

/** Purchase — disparar após pagamento confirmado */
export function pixelPurchase(params: { value: number; currency?: string; order_id?: string }) {
  fbq("track", "Purchase", {
    value: params.value,
    currency: params.currency ?? "BRL",
    content_name: "Protocolo Desbloqueio Metabólico",
    order_id: params.order_id ?? "",
  });
}

/** Lead — disparar após opt-in no quiz */
export function pixelLead() {
  fbq("track", "Lead");
}
