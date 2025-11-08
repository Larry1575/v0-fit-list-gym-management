"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, Users, TrendingUp, AlertCircle, Activity } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

const revenueData = [
  { month: "Ene", revenue: 12000, expenses: 5000, profit: 7000 },
  { month: "Feb", revenue: 15000, expenses: 5500, profit: 9500 },
  { month: "Mar", revenue: 18000, expenses: 6000, profit: 12000 },
  { month: "Abr", revenue: 16000, expenses: 5800, profit: 10200 },
  { month: "May", revenue: 22000, expenses: 6500, profit: 15500 },
  { month: "Jun", revenue: 25000, expenses: 7000, profit: 18000 },
]

const membershipDistribution = [
  { name: "Básico", value: 45, color: "#3b82f6" },
  { name: "Premium", value: 35, color: "#8b5cf6" },
  { name: "Elite", value: 20, color: "#06b6d4" },
]

const classPopularity = [
  { class: "Yoga", members: 45 },
  { class: "Pilates", members: 52 },
  { class: "CrossFit", members: 38 },
  { class: "Spinning", members: 61 },
  { class: "Zumba", members: 43 },
]

export default function OwnerDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard del Propietario</h1>
          <p className="text-muted-foreground">Resumen financiero y operativo del gimnasio</p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
              <DollarSign className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$25,000</div>
              <p className="text-xs text-muted-foreground">+12% vs mes anterior</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Socios Activos</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">+8 este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margen Operativo</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-muted-foreground">Saludable</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupación Promedio</CardTitle>
              <Activity className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">Capacidad</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="revenue">Ingresos</TabsTrigger>
            <TabsTrigger value="members">Membresías</TabsTrigger>
            <TabsTrigger value="classes">Clases</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Financiero</CardTitle>
                <CardDescription>Ingresos, gastos y ganancia últimos 6 meses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" name="Ingresos" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" name="Gastos" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" name="Ganancia" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Membresías</CardTitle>
                  <CardDescription>Proporciones por tipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={membershipDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {membershipDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ingresos por Tipo</CardTitle>
                  <CardDescription>Contribución de cada plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {membershipDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-sm font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm font-semibold">${item.value * 250}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle>Popularidad de Clases</CardTitle>
                <CardDescription>Participación por tipo de clase</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={classPopularity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="class" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="members" fill="#8b5cf6" name="Miembros" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Alerts */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <div>
              <CardTitle className="text-amber-900">Alertas Operativas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-amber-800">• 5 membresías vencen en los próximos 7 días</p>
            <p className="text-sm text-amber-800">• Utilización de clase baja: Yoga (45%) requiere promoción</p>
            <p className="text-sm text-amber-800">• Mantenimiento equipos: Se recomienda para próxima semana</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
