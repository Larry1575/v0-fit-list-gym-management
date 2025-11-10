"use client";

import { useCallback, useState } from "react";
import type { Payment, PaymentFormData } from "@/lib/types";

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments");
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Error fetching payments");
      setPayments(json.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPayment = useCallback(async (payload: PaymentFormData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Error creating payment");
      setPayments((p) => [json.data, ...p]);
      return json.data;
    } catch (err: any) {
      setError(err?.message || "Failed to create payment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePayment = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Error deleting payment");
      setPayments((p) => p.filter((x) => x.id !== id));
      return json.data;
    } catch (err: any) {
      setError(err?.message || "Failed to delete payment");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayment = useCallback(
    async (id: string, body: Partial<Payment>) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/payments/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.message || "Error updating payment");
        setPayments((p) => p.map((x) => (x.id === id ? json.data : x)));
        return json.data;
      } catch (err: any) {
        setError(err?.message || "Failed to update payment");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    payments,
    loading,
    error,
    load,
    createPayment,
    deletePayment,
    updatePayment,
  } as const;
}

export default usePayments;
