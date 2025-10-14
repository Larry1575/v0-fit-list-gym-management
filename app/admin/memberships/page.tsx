"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, CreditCard, AlertTriangle, CheckCircle2, Calendar } from "lucide-react"
import { mockMembers, mockMembershipTypes } from "@/lib/db-client"

export default function MembershipsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Mock memberships data
  const mockMemberships = [
    {
      id: "1",
      member: mockMembers[0],
      membership_type: mockMembershipTypes[1],
      start_date: new Date().toISOString().split("T")[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active" as const,
    },
    {
      id: "2",
      member: mockMembers[1],
      membership_type: mockMembershipTypes[0],
      start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "active" as const,
    },
  ]

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getStatusBadge = (status: string, daysRemaining: number) => {
    if (status === "expired") {
      return <Badge variant="destructive">Vencida</Badge>
    }
    if (daysRemaining <= 7) {
      return <Badge variant="destructive">Por vencer</Badge>
    }
    if (daysRemaining <= 15) {
      return <Badge className="bg-yellow-500">Próxima a vencer</Badge>
    }
    return <Badge variant="default">Activa</Badge>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Membresías</h1>
            <p className="text-muted-foreground">Gestiona las membresías activas y renovaciones</p>
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
                <DialogDescription>Asigna una membresía a un socio</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Socio</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un socio" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.first_name} {member.last_name} ({member.member_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Membresía</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembershipTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} - €{type.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsAddDialogOpen(false)}>Activar Membresía</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Membresías Activas</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockMemberships.filter((m) => m.status === "active").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Por Vencer (7 días)</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockMemberships.filter((m) => getDaysRemaining(m.end_date) <= 7 && m.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€159.96</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Renovaciones</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Memberships Table */}
        <Card>
          <CardHeader>
            <CardTitle>Membresías Activas</CardTitle>
            <CardDescription>Lista de todas las membresías vigentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Socio</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Inicio</TableHead>
                    <TableHead>Vencimiento</TableHead>
                    <TableHead>Días Restantes</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMemberships.map((membership) => {
                    const daysRemaining = getDaysRemaining(membership.end_date)
                    return (
                      <TableRow key={membership.id}>
                        <TableCell className="font-medium">
                          {membership.member.first_name} {membership.member.last_name}
                          <div className="text-xs text-muted-foreground">{membership.member.member_number}</div>
                        </TableCell>
                        <TableCell>{membership.membership_type.name}</TableCell>
                        <TableCell>{membership.start_date}</TableCell>
                        <TableCell>{membership.end_date}</TableCell>
                        <TableCell>
                          <span className={daysRemaining <= 7 ? "text-destructive font-medium" : ""}>
                            {daysRemaining} días
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(membership.status, daysRemaining)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Renovar
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Membership Types */}
        <Card>
          <CardHeader>
            <CardTitle>Tipos de Membresía</CardTitle>
            <CardDescription>Planes disponibles para los socios</CardDescription>
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
                      <div className="text-sm text-muted-foreground">{type.duration_days} días</div>
                      <div className="text-sm">
                        Clases: {type.class_limit ? `${type.class_limit}/mes` : "Ilimitadas"}
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
  )
}
