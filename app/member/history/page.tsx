"use client"

import { MemberLayout } from "@/components/member-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MemberHistoryPage() {
  // Mock data
  const attendanceHistory = [
    { date: "2024-01-15", check_in: "18:30", check_out: "20:15", duration: "1h 45m" },
    { date: "2024-01-14", check_in: "07:00", check_out: "08:30", duration: "1h 30m" },
    { date: "2024-01-13", check_in: "19:00", check_out: "21:00", duration: "2h 00m" },
    { date: "2024-01-12", check_in: "18:00", check_out: "19:45", duration: "1h 45m" },
  ]

  const paymentHistory = [
    { date: "2024-01-01", concept: "Membresía Premium - Mensual", amount: 49.99, method: "Tarjeta" },
    { date: "2023-12-01", concept: "Membresía Premium - Mensual", amount: 49.99, method: "Tarjeta" },
    { date: "2023-11-01", concept: "Membresía Premium - Mensual", amount: 49.99, method: "Efectivo" },
  ]

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Historial</h1>
          <p className="text-muted-foreground">Consulta tu actividad y pagos</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Asistencias</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Asistencias</CardTitle>
                <CardDescription>Registro de tus visitas al gimnasio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Salida</TableHead>
                        <TableHead>Duración</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceHistory.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{record.date}</TableCell>
                          <TableCell>{record.check_in}</TableCell>
                          <TableCell>{record.check_out}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{record.duration}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Pagos</CardTitle>
                <CardDescription>Registro de tus transacciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Concepto</TableHead>
                        <TableHead>Método</TableHead>
                        <TableHead className="text-right">Monto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{payment.date}</TableCell>
                          <TableCell>{payment.concept}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{payment.method}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold">€{payment.amount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MemberLayout>
  )
}
