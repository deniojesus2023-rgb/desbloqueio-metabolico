"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import UpsellPopup from "@/components/UpsellPopup";
import { pixelPurchase } from "@/lib/pixel";

type UpsellState = "idle" | "upsell1" | "downsell1" | "upsell2" | "complete";

export default function ObrigadoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [upsellState, setUpsellState] = useState<UpsellState>("idle");
  const [purchasedUpsells, setPurchasedUpsells] = useState<string[]>([]);

  const sessionId = searchParams.get("s") || undefined;
  const customerId = searchParams.get("cid") || undefined;
  const hasBump = searchParams.get("bump") === "1";
  const customerName = searchParams.get("name") || "";
  const customerEmail = searchParams.get("email") || "";

  // Start the upsell flow after a short delay
  useEffect(() => {
    if (customerId) {
      const timer = setTimeout(() => {
        setUpsellState("upsell1");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      // No customer ID = redirect to confirmation
      const timer = setTimeout(() => {
        navigateToConfirmation();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [customerId]);

  const chargeUpsell = async (productKey: string) => {
    const response = await fetch("/api/stripe/charge-upsell", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId,
        productKey,
        sessionId,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erro ao processar pagamento");
    }
    return data;
  };

  const navigateToConfirmation = () => {
    const params = new URLSearchParams();
    if (customerName) params.set("name", customerName);
    if (customerEmail) params.set("email", customerEmail);
    if (hasBump) params.set("bump", "1");
    purchasedUpsells.forEach((u) => params.set(u, "1"));
    router.push(`/confirmacao?${params.toString()}`);
  };

  // Upsell 1 handlers
  const handleUpsell1Accept = async () => {
    await chargeUpsell("upsell_1");
    pixelPurchase({ value: 97, currency: "BRL" });
    setPurchasedUpsells((prev) => [...prev, "upsell1"]);
    setUpsellState("upsell2"); // Go to upsell 2 if they accepted
  };

  const handleUpsell1Decline = () => {
    setUpsellState("downsell1"); // Show downsell
  };

  // Downsell 1 handlers
  const handleDownsell1Accept = async () => {
    await chargeUpsell("downsell_1");
    pixelPurchase({ value: 37, currency: "BRL" });
    setPurchasedUpsells((prev) => [...prev, "downsell1"]);
    setUpsellState("complete");
    setTimeout(() => navigateToConfirmation(), 500);
  };

  const handleDownsell1Decline = () => {
    setUpsellState("complete");
    setTimeout(() => navigateToConfirmation(), 500);
  };

  // Upsell 2 handlers
  const handleUpsell2Accept = async () => {
    await chargeUpsell("upsell_2");
    pixelPurchase({ value: 57, currency: "BRL" });
    setPurchasedUpsells((prev) => [...prev, "upsell2"]);
    setUpsellState("complete");
    setTimeout(() => navigateToConfirmation(), 500);
  };

  const handleUpsell2Decline = () => {
    setUpsellState("complete");
    setTimeout(() => navigateToConfirmation(), 500);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--dm-white)" }}
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
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="max-w-lg w-full text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: "var(--teal-pale)" }}
          >
            <span className="text-4xl">&#127881;</span>
          </div>
          <h1
            className="text-[28px] font-extrabold mb-3"
            style={{ color: "var(--dm-text)", letterSpacing: "-0.025em" }}
          >
            Bem-vinda à sua transformação!
          </h1>
          <p
            className="text-[14px] mb-6 leading-[1.65]"
            style={{ color: "var(--dm-text-soft)" }}
          >
            Seu pedido foi confirmado com sucesso. Nos próximos minutos você
            receberá um e-mail com o acesso a todo o material. Verifique também
            sua caixa de spam.
          </p>
          <div
            className="rounded-2xl p-5 mb-6 text-left"
            style={{
              background: "var(--teal-bg)",
              border: "1.5px solid var(--teal-light)",
            }}
          >
            <h3
              className="font-bold text-[15px] mb-3"
              style={{ color: "var(--teal-dark)" }}
            >
              O que fazer agora?
            </h3>
            <ol
              className="text-[13px] space-y-2"
              style={{ color: "var(--dm-text-soft)" }}
            >
              <li>
                <strong style={{ color: "var(--dm-text)" }}>1.</strong> Verifique
                seu e-mail (inclusive o spam)
              </li>
              <li>
                <strong style={{ color: "var(--dm-text)" }}>2.</strong> Baixe o
                Guia Mestre do Desbloqueio de 3 Minutos
              </li>
              <li>
                <strong style={{ color: "var(--dm-text)" }}>3.</strong> Aplique o
                protocolo amanhã antes do café da manhã
              </li>
              <li>
                <strong style={{ color: "var(--dm-text)" }}>4.</strong> Observe as
                mudanças nos primeiros 7 dias
              </li>
            </ol>
          </div>
          <div className="flex items-center justify-center gap-3 opacity-50">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: "var(--teal-pale)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 12l3.5 3.5L17 8"
                  stroke="var(--teal-dark)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="font-extrabold text-[13px]"
              style={{ color: "var(--dm-text)" }}
            >
              Desbloqueio Metabólico
            </span>
          </div>
        </div>
      </div>

      {/* Upsell Popups */}
      <UpsellPopup
        isOpen={upsellState === "upsell1"}
        onAccept={handleUpsell1Accept}
        onDecline={handleUpsell1Decline}
        type="upsell1"
      />

      <UpsellPopup
        isOpen={upsellState === "downsell1"}
        onAccept={handleDownsell1Accept}
        onDecline={handleDownsell1Decline}
        type="downsell1"
      />

      <UpsellPopup
        isOpen={upsellState === "upsell2"}
        onAccept={handleUpsell2Accept}
        onDecline={handleUpsell2Decline}
        type="upsell2"
      />
    </div>
  );
}
