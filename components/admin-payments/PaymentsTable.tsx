"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "@/lib/types";

export default function PaymentsTable({
  payments,
  onDelete,
}: {
  payments: Payment[];
  onDelete?: (id: string) => void;
}) {
  const getPaymentMethodBadge = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      other: "Otro",
    };
    return <Badge variant="secondary">{labels[method] || method}</Badge>;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Recibo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Socio</TableHead>
            <TableHead>Concepto</TableHead>
            <TableHead>Método</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No se encontraron pagos
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-mono text-sm">
                  {payment.receipt_number}
                </TableCell>
                <TableCell>{payment.payment_date}</TableCell>
                <TableCell>
                  {payment.member ? (
                    <>
                      {payment.member.first_name} {payment.member.last_name}
                      <div className="text-xs text-muted-foreground">
                        {payment.member.member_number}
                      </div>
                    </>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  {payment.concept}
                  {(payment as any).membership ? (
                    <div className="text-xs text-muted-foreground">
                      Membresía:{" "}
                      {(payment as any).membership?.membership_type?.name ??
                        (payment as any).membership?.membership_type_id}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>
                  {getPaymentMethodBadge(payment.payment_method)}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  €{payment.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(payment.id)}
                    >
                      Eliminar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
