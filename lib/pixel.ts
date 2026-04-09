/**
 * Meta Pixel tracking utilities
 */

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function pixelViewContent(params: { value: number; currency: string }) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", params);
  }
}

export function pixelInitiateCheckout(params: {
  value: number;
  currency: string;
}) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "InitiateCheckout", params);
  }
}

export function pixelPurchase(params: {
  value: number;
  currency: string;
  order_id?: string;
}) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Purchase", params);
  }
}
