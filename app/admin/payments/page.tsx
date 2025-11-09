"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import PaymentsTable from "@/components/admin-payments/PaymentsTable";
import PaymentsStats from "@/components/admin-payments/PaymentsStats";
import PaymentFormDialog from "@/components/admin-payments/PaymentFormDialog";
import { usePayments } from "@/components/admin-payments/usePayments";

export default function PaymentsPage() {
  const { payments, load, createPayment, deletePayment, loading } =
    usePayments();
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");

  useEffect(() => {
    load();
  }, [load]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.member?.first_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        payment.member?.last_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        payment.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.receipt_number
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesMethod =
        methodFilter === "all" || payment.payment_method === methodFilter;
      return matchesSearch && matchesMethod;
    });
  }, [payments, searchQuery, methodFilter]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Pagos
            </h1>
            <p className="text-muted-foreground">
              Gestiona los pagos y transacciones del gimnasio
            </p>
          </div>
          <PaymentFormDialog onCreate={createPayment} />
        </div>

        <PaymentsStats payments={payments} />

        <div>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por socio, concepto o recibo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Método de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="card">Tarjeta</SelectItem>
                <SelectItem value="transfer">Transferencia</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <PaymentsTable
            payments={filteredPayments}
            onDelete={(id) => deletePayment(id)}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
