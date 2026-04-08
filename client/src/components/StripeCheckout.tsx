import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { trpc } from "@/lib/trpc";

const stripePromise = loadStripe(
  (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

/* ─── Inner form that lives inside <Elements> ─── */
function CheckoutForm({
  amount,
  onSuccess,
  onError,
  buttonText,
}: {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (msg: string) => void;
  buttonText?: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setErrorMsg("");

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // fallback, we handle inline
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMsg(error.message || "Erro no pagamento. Tente novamente.");
      onError(error.message || "Erro no pagamento");
      setProcessing(false);
    } else if (paymentIntent && (paymentIntent.status === "succeeded" || paymentIntent.status === "processing")) {
      onSuccess(paymentIntent.id);
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "requires_action") {
      // PIX: Stripe handles the QR code display automatically
      // The PaymentElement will show the PIX QR code
      setProcessing(false);
    } else {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement
        options={{
          layout: "tabs",
          defaultValues: {
            billingDetails: {
              address: { country: "BR" },
            },
          },
        }}
      />
      {errorMsg && (
        <div
          className="mt-3 p-3 rounded-lg text-[13px] font-medium"
          style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
        >
          {errorMsg}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="dm-btn-primary mt-5"
        style={{ fontSize: "18px", padding: "20px 24px", opacity: processing ? 0.7 : 1 }}
      >
        {processing
          ? "Processando pagamento..."
          : buttonText || `Pagar R$${(amount / 100).toFixed(2).replace(".", ",")} →`}
      </button>
      <div className="flex items-center justify-center gap-3 mt-3">
        <LockIcon />
        <span className="text-[11px]" style={{ color: "var(--dm-grey-300)" }}>
          Pagamento 100% seguro · Criptografia SSL · Stripe
        </span>
      </div>
    </form>
  );
}

/* ─── Main wrapper that creates PaymentIntent and mounts Elements ─── */
export default function StripeCheckout({
  productKeys,
  customerEmail,
  customerName,
  sessionId,
  onSuccess,
  onError,
  buttonText,
}: {
  productKeys: string[];
  customerEmail?: string;
  customerName?: string;
  sessionId?: string;
  onSuccess: (data: { paymentIntentId: string; customerId?: string }) => void;
  onError?: (msg: string) => void;
  buttonText?: string;
}) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [customerId, setCustomerId] = useState<string | undefined>();
  const [initError, setInitError] = useState("");

  const createIntent = trpc.payment.createIntent.useMutation();

  useEffect(() => {
    let cancelled = false;
    createIntent
      .mutateAsync({
        productKeys: productKeys as any,
        customerEmail,
        customerName,
        sessionId,
      })
      .then((result) => {
        if (!cancelled) {
          setClientSecret(result.clientSecret);
          setAmount(result.amount);
          setCustomerId(result.customerId ?? undefined);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setInitError(err.message || "Erro ao iniciar pagamento");
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productKeys.join(",")]);

  if (initError) {
    return (
      <div className="p-5 rounded-2xl text-center" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
        <p className="text-[14px] font-semibold" style={{ color: "#B91C1C" }}>
          Erro ao carregar checkout
        </p>
        <p className="text-[12px] mt-1" style={{ color: "#DC2626" }}>{initError}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: "var(--teal-light)", borderTopColor: "var(--teal)" }} />
        <p className="text-[13px] mt-3" style={{ color: "var(--dm-text-soft)" }}>
          Preparando checkout seguro...
        </p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#1A8A6E",
            colorBackground: "#ffffff",
            colorText: "#1a1a1a",
            colorDanger: "#DC2626",
            fontFamily: "'Montserrat', sans-serif",
            borderRadius: "5px",
            spacingUnit: "4px",
          },
          rules: {
            ".Input": {
              border: "1.5px solid #e5e5e5",
              boxShadow: "none",
              padding: "12px 14px",
              fontSize: "14px",
            },
            ".Input:focus": {
              border: "1.5px solid #1A8A6E",
              boxShadow: "0 0 0 3px rgba(26,138,110,0.1)",
            },
            ".Label": {
              fontSize: "13px",
              fontWeight: "600",
              color: "#4a4a4a",
            },
            ".Tab": {
              border: "1.5px solid #e5e5e5",
              borderRadius: "5px",
            },
            ".Tab--selected": {
              border: "1.5px solid #1A8A6E",
              backgroundColor: "#E8F8F4",
            },
          },
        },
        locale: "pt-BR",
      }}
    >
      <CheckoutForm
        amount={amount}
        onSuccess={(paymentIntentId) => onSuccess({ paymentIntentId, customerId })}
        onError={onError || (() => {})}
        buttonText={buttonText}
      />
    </Elements>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#999" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#999" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
