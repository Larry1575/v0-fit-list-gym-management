"use client";

import { useEffect, useState } from "react";
import type { Member } from "@/lib/types";

type Membership = any;

export function useMemberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [mRes, membersRes] = await Promise.all([
          fetch("/api/memberships", { cache: "no-store" }),
          fetch("/api/members", { cache: "no-store" }),
        ]);
        if (!mRes.ok) throw new Error(`Memberships HTTP ${mRes.status}`);
        if (!membersRes.ok)
          throw new Error(`Members HTTP ${membersRes.status}`);
        const mJson = await mRes.json();
        const membersJson = await membersRes.json();
        if (!mJson.success)
          throw new Error(mJson.message || "Failed to load memberships");
        if (!membersJson.success)
          throw new Error(membersJson.message || "Failed to load members");
        if (mounted) {
          setMemberships(mJson.data || []);
          setMembers(membersJson.data || []);
        }
      } catch (e: any) {
        if (mounted) setError(e?.message || "Error cargando datos");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function createMembership(payload: Record<string, any>) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to create");
      setMemberships((prev) => [json.data, ...prev]);
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error creando membresía");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function updateMembership(id: string, data: Record<string, any>) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/memberships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to update");
      setMemberships((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...json.data } : m))
      );
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error al actualizar");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteMembership(id: string) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/memberships/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to delete");
      setMemberships((prev) => prev.filter((m) => m.id !== id));
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error al eliminar");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function renewMembership(id: string, extraDays: number) {
    setSubmitting(true);
    setError(null);
    try {
      const current = memberships.find((m) => m.id === id);
      const currentEnd = current?.end_date
        ? new Date(current.end_date)
        : new Date();
      const newEnd = new Date(
        currentEnd.getTime() + extraDays * 24 * 60 * 60 * 1000
      );
      const res = await fetch(`/api/memberships/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          end_date: newEnd.toISOString().split("T")[0],
          status: "active",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || "Failed to renew");
      setMemberships((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...json.data } : m))
      );
      return json.data;
    } catch (e: any) {
      setError(e?.message || "Error al renovar");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    memberships,
    members,
    loading,
    submitting,
    error,
    createMembership,
    updateMembership,
    deleteMembership,
    renewMembership,
  };
}

export default useMemberships;
