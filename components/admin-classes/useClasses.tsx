"use client";

import { useEffect, useState } from "react";
import type { Class } from "@/lib/types";

type ClassAny = any;

export default function useClasses() {
  const [classes, setClasses] = useState<ClassAny[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/classes", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success)
          throw new Error(json.message || "Failed to load classes");
        if (mounted) setClasses(json.data || []);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Error cargando clases");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function createClass(payload: Record<string, any>) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success)
        throw new Error(json.message || "Failed to create class");
      setClasses((prev) => [...prev, json.data]);
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error creando clase");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function updateClass(id: string, data: Record<string, any>) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/classes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to update");
      setClasses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...json.data } : c))
      );
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error al actualizar clase");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteClass(id: string) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to delete");
      setClasses((prev) => prev.filter((c) => c.id !== id));
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error al eliminar clase");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleActive(id: string) {
    const existing = classes.find((c) => c.id === id);
    if (!existing) throw new Error("Clase no encontrada");
    return updateClass(id, { is_active: !existing.is_active });
  }

  return {
    classes,
    loading,
    submitting,
    error,
    createClass,
    updateClass,
    deleteClass,
    toggleActive,
  };
}
