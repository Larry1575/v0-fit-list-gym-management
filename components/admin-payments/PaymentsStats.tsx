"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Receipt, CreditCard } from "lucide-react";
import type { Payment } from "@/lib/types";

export default function PaymentsStats({ payments }: { payments: Payment[] }) {
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const thisMonthRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date);
      const now = new Date();
      return (
        paymentDate.getMonth() === now.getMonth() &&
        paymentDate.getFullYear() === now.getFullYear()
      );
    })
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Ingresos del Mes
          </CardTitle>
          <DollarSign className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            €{thisMonthRevenue.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            Pagos recibidos este mes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Histórico</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Todos los pagos registrados
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pagos Hoy</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {
              payments.filter(
                (p) => p.payment_date === new Date().toISOString().split("T")[0]
              ).length
            }
          </div>
          <p className="text-xs text-muted-foreground">Transacciones de hoy</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            €
            {payments.length > 0
              ? (totalRevenue / payments.length).toFixed(2)
              : "0.00"}
          </div>
          <p className="text-xs text-muted-foreground">Por transacción</p>
        </CardContent>
      </Card>
    </div>
  );
}
