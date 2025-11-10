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
import { Edit, Trash2 } from "lucide-react";
import type { Class } from "@/lib/types";

export default function ClassesTable({
  classes,
  loading,
  submitting,
  onEdit,
  onDelete,
}: {
  classes: any[];
  loading: boolean;
  submitting: boolean;
  onEdit?: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  const DAYS_OF_WEEK = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead>Día</TableHead>
            <TableHead>Horario</TableHead>
            <TableHead>Capacidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                Cargando...
              </TableCell>
            </TableRow>
          ) : classes.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No hay clases
              </TableCell>
            </TableRow>
          ) : (
            classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell className="font-medium">{cls.name}</TableCell>
                <TableCell>{cls.instructor}</TableCell>
                <TableCell>{DAYS_OF_WEEK[cls.day_of_week]}</TableCell>
                <TableCell>
                  {cls.start_time} - {cls.end_time}
                </TableCell>
                <TableCell>{cls.max_capacity}</TableCell>
                <TableCell>
                  <Badge variant={cls.is_active ? "default" : "secondary"}>
                    {cls.is_active ? "Activa" : "Inactiva"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit?.(cls.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(cls.id)}
                      disabled={submitting}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
