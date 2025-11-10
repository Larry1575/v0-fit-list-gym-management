"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Class } from "@/lib/types";

export default function ClassForm({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting,
}: {
  onSubmit: (data: Omit<Class, "id" | "created_at">) => Promise<void> | void;
  onCancel?: () => void;
  initialData?: Partial<Class>;
  isSubmitting?: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructor: "",
    day_of_week: 1,
    start_time: "",
    end_time: "",
    max_capacity: 20,
    is_active: true,
  });

  useEffect(() => {
    if (initialData) setFormData((s) => ({ ...s, ...initialData }));
  }, [initialData]);

  const DAYS_OF_WEEK = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData as Omit<Class, "id" | "created_at">);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Nueva Clase</DialogTitle>
        <DialogDescription>
          Crea una nueva clase en el horario
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Clase *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Yoga Matutino"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Descripción de la clase"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) =>
              setFormData({ ...formData, instructor: e.target.value })
            }
            placeholder="Nombre del instructor"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="day_of_week">Día de la Semana *</Label>
            <Select
              value={String(formData.day_of_week)}
              onValueChange={(value) =>
                setFormData({ ...formData, day_of_week: Number(value) })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_capacity">Capacidad Máxima *</Label>
            <Input
              id="max_capacity"
              type="number"
              required
              min="1"
              value={formData.max_capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  max_capacity: Number(e.target.value),
                })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_time">Hora de Inicio *</Label>
            <Input
              id="start_time"
              type="time"
              required
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_time">Hora de Fin *</Label>
            <Input
              id="end_time"
              type="time"
              required
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : "Crear Clase"}
        </Button>
      </DialogFooter>
    </form>
  );
}
