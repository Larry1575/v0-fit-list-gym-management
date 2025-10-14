"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Download, TrendingUp, Users, DollarSign, Calendar } from "lucide-react"

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState("month")

  // Mock data for charts
  const revenueData = [
    { name: "Ene", revenue: 2400 },
    { name: "Feb", revenue: 1398 },
    { name: "Mar", revenue: 3800 },
    { name: "Abr", revenue: 3908 },
    { name: "May", revenue: 4800 },
    { name: "Jun", revenue: 3800 },
  ]

  const attendanceData = [
    { name: "Lun", visits: 45 },
    { name: "Mar", visits: 52 },
    { name: "Mié", visits: 48 },
    { name: "Jue", visits: 61 },
    { name: "Vie", visits: 55 },
    { name: "Sáb", visits: 38 },
    { name: "Dom", visits: 28 },
  ]

  const membershipData = [
    { name: "Básica", count: 45, percentage: 45 },
    { name: "Premium", count: 35, percentage: 35 },
    { name: "Estudiante", count: 15, percentage: 15 },
    { name: "Anual", count: 5, percentage: 5 },
  ]

  const handleExport = (type: string) => {
    alert(`Exportando reporte: ${type}`)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Reportes</h1>
            <p className="text-muted-foreground">Análisis y estadísticas del gimnasio</p>
          </div>
          <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mes</SelectItem>
                <SelectItem value="quarter">Este Trimestre</SelectItem>
                <SelectItem value="year">Este Año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={() => handleExport("general")}>
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€4,800</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">+12%</span> vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nuevos Socios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-accent">+8%</span> vs mes anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">Visitas diarias</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Retención</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
              <p className="text-xs text-muted-foreground">Renovaciones exitosas</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Ingresos</TabsTrigger>
            <TabsTrigger value="attendance">Asistencia</TabsTrigger>
            <TabsTrigger value="memberships">Membresías</TabsTrigger>
            <TabsTrigger value="classes">Clases</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos Mensuales</CardTitle>
                <CardDescription>Evolución de los ingresos en los últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Desglose por Método de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tarjeta</span>
                      <span className="font-semibold">€2,880 (60%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Efectivo</span>
                      <span className="font-semibold">€1,440 (30%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Transferencia</span>
                      <span className="font-semibold">€480 (10%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Conceptos de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Membresía Premium</span>
                      <span className="font-semibold">€1,749</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Membresía Básica</span>
                      <span className="font-semibold">€1,349</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Membresía Estudiante</span>
                      <span className="font-semibold">€374</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asistencia Semanal</CardTitle>
                <CardDescription>Número de visitas por día de la semana</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Horarios Pico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">18:00 - 20:00</span>
                      <span className="font-semibold">35% de visitas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">07:00 - 09:00</span>
                      <span className="font-semibold">28% de visitas</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">12:00 - 14:00</span>
                      <span className="font-semibold">22% de visitas</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas de Permanencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tiempo Promedio</span>
                      <span className="font-semibold">1h 45m</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Visitas Semanales</span>
                      <span className="font-semibold">3.2 por socio</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tasa de Asistencia</span>
                      <span className="font-semibold">78%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="memberships" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Membresías</CardTitle>
                <CardDescription>Tipos de membresías activas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {membershipData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.count} socios ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary transition-all" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Renovaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Este Mes</span>
                      <span className="font-semibold">23 renovaciones</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Próximas (7 días)</span>
                      <span className="font-semibold text-destructive">8 pendientes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tasa de Éxito</span>
                      <span className="font-semibold">94%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Valor Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Por Socio/Mes</span>
                      <span className="font-semibold">€38.50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lifetime Value</span>
                      <span className="font-semibold">€462</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Duración Media</span>
                      <span className="font-semibold">12 meses</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clases Más Populares</CardTitle>
                <CardDescription>Ranking por número de reservas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Spinning", bookings: 156, capacity: 85 },
                    { name: "CrossFit", bookings: 142, capacity: 78 },
                    { name: "Yoga Matutino", bookings: 128, capacity: 72 },
                    { name: "Zumba", bookings: 118, capacity: 68 },
                    { name: "Pilates", bookings: 95, capacity: 65 },
                  ].map((cls) => (
                    <div key={cls.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{cls.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {cls.bookings} reservas ({cls.capacity}% ocupación)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-accent transition-all" style={{ width: `${cls.capacity}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tasa de Asistencia a Clases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reservas Confirmadas</span>
                      <span className="font-semibold">639</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Asistencias Reales</span>
                      <span className="font-semibold">567 (89%)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cancelaciones</span>
                      <span className="font-semibold">72 (11%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Instructores Destacados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Ana López</span>
                      <span className="font-semibold">4.9 ⭐</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Carlos Ruiz</span>
                      <span className="font-semibold">4.8 ⭐</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">María González</span>
                      <span className="font-semibold">4.7 ⭐</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
