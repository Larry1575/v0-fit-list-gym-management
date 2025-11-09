"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Edit } from "lucide-react";
import type { Class } from "@/lib/types";

const DAYS_OF_WEEK = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export default function WeeklySchedule({
  classesByDay,
  toggleActive,
  submitting,
}: {
  classesByDay: Record<number, Class[]>;
  toggleActive: (id: string) => Promise<void>;
  submitting: boolean;
}) {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4, 5, 6, 0].map((day) => (
        <div key={day}>
          <h3 className="mb-3 text-lg font-semibold text-foreground">
            {DAYS_OF_WEEK[day]}
          </h3>
          {classesByDay[day] && classesByDay[day].length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {classesByDay[day]
                .sort((a, b) => a.start_time.localeCompare(b.start_time))
                .map((cls) => (
                  <Card
                    key={cls.id}
                    className={!cls.is_active ? "opacity-50" : ""}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">
                            {cls.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {cls.instructor}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={cls.is_active ? "default" : "secondary"}
                        >
                          {cls.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {cls.start_time} - {cls.end_time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        Capacidad: {cls.max_capacity} personas
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                        >
                          <Edit className="mr-1 h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(cls.id)}
                          className="flex-1"
                          disabled={submitting}
                        >
                          {cls.is_active ? "Desactivar" : "Activar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No hay clases programadas
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
