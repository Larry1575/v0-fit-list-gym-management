"use client";

import React from "react";

export default function ClassStats({ classes }: { classes: any[] }) {
  const total = classes.length;
  const active = classes.filter((c) => c.is_active).length;
  const capacity = classes.reduce((sum, c) => sum + (c.max_capacity || 0), 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="">
        <div className="text-sm font-medium">Total Clases</div>
        <div className="text-2xl font-bold">{total}</div>
        <p className="text-xs text-muted-foreground">Clases programadas</p>
      </div>
      <div>
        <div className="text-sm font-medium">Clases Activas</div>
        <div className="text-2xl font-bold">{active}</div>
        <p className="text-xs text-muted-foreground">
          Disponibles para reserva
        </p>
      </div>
      <div>
        <div className="text-sm font-medium">Capacidad Total</div>
        <div className="text-2xl font-bold">{capacity}</div>
        <p className="text-xs text-muted-foreground">Plazas disponibles</p>
      </div>
    </div>
  );
}
