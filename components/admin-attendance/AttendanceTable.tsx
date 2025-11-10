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
import { Check, Trash2 } from "lucide-react";

type Props = {
  attendances: any[];
  loading?: boolean;
  submitting?: boolean;
  onCheckOut?: (id: string) => Promise<any>;
  onDelete?: (id: string) => Promise<any>;
};

export default function AttendanceTable({
  attendances,
  loading,
  submitting,
  onCheckOut,
  onDelete,
}: Props) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Socio</TableHead>
            <TableHead>Entrada</TableHead>
            <TableHead>Salida</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendances.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium">
                {a.member?.first_name || a.member_name}{" "}
                {a.member?.last_name || ""}
              </TableCell>
              <TableCell>
                {a.check_in_time
                  ? new Date(a.check_in_time).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                {a.check_out_time
                  ? new Date(a.check_out_time).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </TableCell>
              <TableCell>
                {a.check_in_time
                  ? a.check_out_time
                    ? (() => {
                        const d =
                          new Date(a.check_out_time).getTime() -
                          new Date(a.check_in_time).getTime();
                        const h = Math.floor(d / (1000 * 60 * 60));
                        const m = Math.floor(
                          (d % (1000 * 60 * 60)) / (1000 * 60)
                        );
                        return `${h}h ${m}m`;
                      })()
                    : "En curso"
                  : "-"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {!a.check_out_time && onCheckOut && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onCheckOut(a.id)}
                      disabled={submitting}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(a.id)}
                      disabled={submitting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {attendances.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No hay registros
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
