"use client"

import { useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripeEmbeddedCheckoutProps {
    courseId: string;
}

const StripeEmbeddedCheckout = ({ courseId }: StripeEmbeddedCheckoutProps) => {
    const fetchClientSecret = useCallback(async () => {
        const response = await fetch(`/api/koszyk/kurs/${courseId}/embeded`, {
            method: "POST",
        });
        
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        return data.clientSecret;
  }, [courseId]);

  const options = { fetchClientSecret };

  return (
      <div id="checkout">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
        </div>
    );
};

export default StripeEmbeddedCheckout;
