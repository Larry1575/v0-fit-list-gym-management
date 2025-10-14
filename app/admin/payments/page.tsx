"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, DollarSign, TrendingUp, CreditCard, Receipt } from "lucide-react"
import { mockMembers } from "@/lib/db-client"
import type { Payment, PaymentFormData } from "@/lib/types"

export default function PaymentsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [methodFilter, setMethodFilter] = useState<string>("all")

  // Mock payments data
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "1",
      member_id: "1",
      amount: 49.99,
      payment_method: "card",
      payment_date: new Date().toISOString().split("T")[0],
      concept: "Membresía Premium - Mensual",
      receipt_number: "REC-001",
      created_at: new Date().toISOString(),
      member: mockMembers[0],
    },
    {
      id: "2",
      member_id: "2",
      amount: 29.99,
      payment_method: "cash",
      payment_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      concept: "Membresía Básica - Mensual",
      receipt_number: "REC-002",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      member: mockMembers[1],
    },
  ])

  const handleAddPayment = (data: PaymentFormData) => {
    const member = mockMembers.find((m) => m.id === data.member_id)
    const newPayment: Payment = {
      id: String(payments.length + 1),
      ...data,
      receipt_number: `REC-${String(payments.length + 1).padStart(3, "0")}`,
      created_at: new Date().toISOString(),
      member,
    }
    setPayments([newPayment, ...payments])
    setIsAddDialogOpen(false)
  }

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.member?.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.member?.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.receipt_number?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesMethod = methodFilter === "all" || payment.payment_method === methodFilter

    return matchesSearch && matchesMethod
  })

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
  const thisMonthRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.payment_date)
      const now = new Date()
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + p.amount, 0)

  const getPaymentMethodBadge = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Efectivo",
      card: "Tarjeta",
      transfer: "Transferencia",
      other: "Otro",
    }
    return <Badge variant="secondary">{labels[method] || method}</Badge>
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Pagos</h1>
            <p className="text-muted-foreground">Gestiona los pagos y transacciones del gimnasio</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Registrar Pago
              </Button>
            </DialogTrigger>
            <DialogContent>
              <PaymentForm onSubmit={handleAddPayment} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{thisMonthRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Pagos recibidos este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Histórico</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Todos los pagos registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Hoy</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {payments.filter((p) => p.payment_date === new Date().toISOString().split("T")[0]).length}
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
                €{payments.length > 0 ? (totalRevenue / payments.length).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">Por transacción</p>
            </CardContent>
          </Card>
        </div>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historial de Pagos</CardTitle>
            <CardDescription>Registro completo de todas las transacciones</CardDescription>
          </CardHeader>
          <CardContent>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No se encontraron pagos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono text-sm">{payment.receipt_number}</TableCell>
                        <TableCell>{payment.payment_date}</TableCell>
                        <TableCell>
                          {payment.member ? (
                            <>
                              {payment.member.first_name} {payment.member.last_name}
                              <div className="text-xs text-muted-foreground">{payment.member.member_number}</div>
                            </>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{payment.concept}</TableCell>
                        <TableCell>{getPaymentMethodBadge(payment.payment_method)}</TableCell>
                        <TableCell className="text-right font-semibold">€{payment.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

function PaymentForm({ onSubmit }: { onSubmit: (data: PaymentFormData) => void }) {
  const [formData, setFormData] = useState<PaymentFormData>({
    member_id: "",
    amount: 0,
    payment_method: "cash",
    payment_date: new Date().toISOString().split("T")[0],
    concept: "",
    notes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Registrar Pago</DialogTitle>
        <DialogDescription>Registra un nuevo pago en el sistema</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="member_id">Socio *</Label>
          <Select value={formData.member_id} onValueChange={(value) => setFormData({ ...formData, member_id: value })}>
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto (€) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_date">Fecha *</Label>
            <Input
              id="payment_date"
              type="date"
              required
              value={formData.payment_date}
              onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment_method">Método de Pago *</Label>
          <Select
            value={formData.payment_method}
            onValueChange={(value: any) => setFormData({ ...formData, payment_method: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Efectivo</SelectItem>
              <SelectItem value="card">Tarjeta</SelectItem>
              <SelectItem value="transfer">Transferencia</SelectItem>
              <SelectItem value="other">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="concept">Concepto *</Label>
          <Input
            id="concept"
            required
            value={formData.concept}
            onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
            placeholder="Ej: Membresía Premium - Mensual"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notes">Notas</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notas adicionales (opcional)"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Registrar Pago</Button>
      </DialogFooter>
    </form>
  )
}
