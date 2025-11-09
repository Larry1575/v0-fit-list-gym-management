"use client";

import { useEffect, useState } from "react";

type AttendanceAny = any;

export default function useAttendance() {
  const [attendances, setAttendances] = useState<AttendanceAny[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(date?: string) {
    setLoading(true);
    setError(null);
    try {
      const qs = date ? `?date=${encodeURIComponent(date)}` : "";
      const res = await fetch(`/api/attendance${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success)
        throw new Error(json.message || "Failed to load attendances");
      setAttendances(json.data || []);
    } catch (e: any) {
      setError(e?.message || "Error cargando asistencias");
    } finally {
      setLoading(false);
    }
  }

  async function loadActive() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/attendance?active=true`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success)
        throw new Error(json.message || "Failed to load active");
      setAttendances(json.data || []);
    } catch (e: any) {
      setError(e?.message || "Error cargando asistencias activas");
    } finally {
      setLoading(false);
    }
  }

  async function createAttendance(payload: Record<string, any>) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/attendance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to create");
      setAttendances((prev) => [...prev, json.data]);
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error creando asistencia");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function checkOut(id: string) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/attendance/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkout: true }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to checkout");
      setAttendances((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...json.data } : a))
      );
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error al registrar salida");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function removeAttendance(id: string) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to delete");
      setAttendances((prev) => prev.filter((a) => a.id !== id));
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error al eliminar asistencia");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    // load today's attendances by default
    const today = new Date().toISOString().split("T")[0];
    load(today);
  }, []);

  return {
    attendances,
    loading,
    submitting,
    error,
    load,
    loadActive,
    createAttendance,
    checkOut,
    removeAttendance,
  };
}
