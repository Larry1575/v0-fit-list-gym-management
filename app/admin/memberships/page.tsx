"use client";

import { useState } from "react";
import { useEffect } from "react";
import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { mockMembershipTypes } from "@/lib/db-client";
import type { Member } from "@/lib/types";
import useMemberships from "@/components/admin-memberships/useMemberships";
import MembershipStats from "@/components/admin-memberships/MembershipStats";
import MembershipsTable from "@/components/admin-memberships/MembershipsTable";
import NewMembershipForm from "@/components/admin-memberships/NewMembershipForm";

export default function MembershipsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const {
    memberships,
    members,
    loading,
    submitting,
    error,
    createMembership,
    updateMembership,
    deleteMembership,
    renewMembership,
  } = useMemberships();
  // data & actions come from useMemberships

  // using external NewMembershipForm component

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil(
      (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  };

  const getStatusBadge = (status: string, daysRemaining: number) => {
    if (status === "expired") {
      return <Badge variant="destructive">Vencida</Badge>;
    }
    if (daysRemaining <= 7) {
      return <Badge variant="destructive">Por vencer</Badge>;
    }
    if (daysRemaining <= 15) {
      return <Badge className="bg-yellow-500">Próxima a vencer</Badge>;
    }
    return <Badge variant="default">Activa</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Membresías
            </h1>
            <p className="text-muted-foreground">
              Gestiona las membresías activas y renovaciones
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Membresía
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Activar Membresía</DialogTitle>
                <DialogDescription>
                  Asigna una membresía a un socio
                </DialogDescription>
              </DialogHeader>
              <NewMembershipForm
                members={members}
                types={mockMembershipTypes}
                onCancel={() => setIsAddDialogOpen(false)}
                onCreate={async (payload) => {
                  try {
                    const created = await createMembership(payload);
                    // optional: create an associated payment for the membership activation
                    try {
                      const type = mockMembershipTypes.find(
                        (t) => t.id === payload.membership_type_id
                      );
                      const amount = type?.price ?? 0;
                      await fetch("/api/payments", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          member_id: payload.member_id,
                          membership_id: created.id,
                          amount,
                          payment_method: "card",
                          payment_date: payload.start_date,
                          concept: `Pago activación ${type?.name ?? ""}`,
                        }),
                      });
                    } catch (err) {
                      // don't block membership creation if payment fails
                      console.error(
                        "Failed to create payment for membership",
                        err
                      );
                    }
                    setIsAddDialogOpen(false);
                  } catch (e) {
                    // error state handled in hook
                  }
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <MembershipStats memberships={memberships} />

        {/* NewMembershipForm component */}

        {/* Memberships Table */}
        <Card>
          <CardHeader>
            <CardTitle>Membresías Activas</CardTitle>
            <CardDescription>
              Lista de todas las membresías vigentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MembershipsTable
              memberships={memberships}
              members={members}
              types={mockMembershipTypes}
              loading={loading}
              submitting={submitting}
              onRenew={renewMembership}
              onDelete={deleteMembership}
            />
          </CardContent>
        </Card>

        {/* Membership Types */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Membresía</CardTitle>
            <CardDescription>
              Planes disponibles para los socios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {mockMembershipTypes.map((type) => (
                <Card key={type.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold">€{type.price}</div>
                      <div className="text-sm text-muted-foreground">
                        {type.duration_days} días
                      </div>
                      <div className="text-sm">
                        Clases:{" "}
                        {type.class_limit
                          ? `${type.class_limit}/mes`
                          : "Ilimitadas"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
