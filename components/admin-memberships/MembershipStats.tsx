"use client";

import React from "react";

export default function MembershipStats({
  memberships,
}: {
  memberships: any[];
}) {
  const active = memberships.filter((m) => m.status === "active").length;
  const expiring7 = memberships.filter((m) => {
    if (!m.end_date) return false;
    const end = new Date(m.end_date);
    const now = new Date();
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff <= 7 && m.status === "active";
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="">
        <div className="text-sm font-medium">Membresías Activas</div>
        <div className="text-2xl font-bold">{active}</div>
      </div>
      <div>
        <div className="text-sm font-medium">Por Vencer (7 días)</div>
        <div className="text-2xl font-bold">{expiring7}</div>
      </div>
      <div>
        <div className="text-sm font-medium">Ingresos del Mes</div>
        <div className="text-2xl font-bold">€0.00</div>
      </div>
      <div>
        <div className="text-sm font-medium">Renovaciones</div>
        <div className="text-2xl font-bold">0</div>
      </div>
    </div>
  );
}
