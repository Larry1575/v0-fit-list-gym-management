"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import useClasses from "@/components/admin-classes/useClasses";
import ClassForm from "@/components/admin-classes/ClassForm";
import ClassStats from "@/components/admin-classes/ClassStats";
import WeeklySchedule from "@/components/admin-classes/WeeklySchedule";
import ClassesTable from "@/components/admin-classes/ClassesTable";
import type { Class } from "@/lib/types";

export default function ClassesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const {
    classes,
    loading,
    submitting,
    error,
    createClass,
    deleteClass,
    toggleActive,
  } = useClasses();

  const handleAdd = async (payload: Omit<Class, "id" | "created_at">) => {
    try {
      await createClass({ ...payload, created_at: new Date().toISOString() });
      setIsAddDialogOpen(false);
    } catch (e) {
      // error shown by hook
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Confirmar eliminación de la clase?")) return;
    try {
      await deleteClass(id);
    } catch (e) {
      // handled in hook
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleActive(id);
    } catch (e) {
      // handled in hook
    }
  };

  const classesByDay = classes.reduce(
    (acc: Record<number, Class[]>, cls: any) => {
      if (!acc[cls.day_of_week]) acc[cls.day_of_week] = [];
      acc[cls.day_of_week].push(cls);
      return acc;
    },
    {}
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Clases
            </h1>
            <p className="text-muted-foreground">
              Gestiona el horario de clases del gimnasio
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Nueva Clase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ClassForm
                onSubmit={handleAdd}
                onCancel={() => setIsAddDialogOpen(false)}
                isSubmitting={submitting}
              />
            </DialogContent>
          </Dialog>
        </div>

        <ClassStats classes={classes} />

        <div>
          <WeeklySchedule
            classesByDay={classesByDay}
            toggleActive={handleToggle}
            submitting={submitting}
          />
        </div>

        <div>
          <ClassesTable
            classes={classes}
            loading={loading}
            submitting={submitting}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
