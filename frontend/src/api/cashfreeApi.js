import { apiUrl } from "@/config/api";

async function parseJson(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export async function getCashfreeConfig() {
  const res = await fetch(apiUrl("/payments/config"));
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.message || "Could not load payment config.");
  }
  return data;
}

export async function createCashfreeOrder({ amountInr, items, coupon, customer }) {
  const res = await fetch(apiUrl("/payments/create-order"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amountInr, items, coupon, customer }),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.message || "Could not create payment order.");
  }
  return data;
}

export async function verifyCashfreePayment({ orderId }) {
  const res = await fetch(apiUrl("/payments/verify"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data?.message || "Payment verification failed.");
  }
  return data;
}

/** Load Cashfree JS SDK v3 (https://sdk.cashfree.com/js/v3/cashfree.js). */
export function loadCashfreeScript() {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && typeof window.Cashfree === "function") {
      resolve(true);
      return;
    }
    const src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => reject(new Error("Failed to load Cashfree")));
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Failed to load Cashfree Checkout"));
    document.body.appendChild(script);
  });
}
