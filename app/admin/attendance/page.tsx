"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, UserCheck, Clock, TrendingUp, Calendar, QrCode } from "lucide-react"
import { mockMembers } from "@/lib/db-client"

export default function AttendancePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Mock attendance data
  const mockAttendance = [
    {
      id: "1",
      member: mockMembers[0],
      check_in_time: new Date().toISOString(),
      check_out_time: null,
    },
    {
      id: "2",
      member: mockMembers[1],
      check_in_time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      check_out_time: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ]

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (checkIn: string, checkOut: string | null) => {
    if (!checkOut) return "En curso"
    const duration = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const handleManualCheckIn = () => {
    // This would open a dialog to manually check in a member
    alert("Función de check-in manual - se implementará con el sistema de QR")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Control de Asistencia</h1>
            <p className="text-muted-foreground">Registra y monitorea la asistencia de los socios</p>
          </div>
          <Button className="gap-2" onClick={handleManualCheckIn}>
            <QrCode className="h-4 w-4" />
            Check-in Manual
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hoy</CardTitle>
              <UserCheck className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAttendance.length}</div>
              <p className="text-xs text-muted-foreground">Asistencias registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actualmente</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAttendance.filter((a) => !a.check_out_time).length}</div>
              <p className="text-xs text-muted-foreground">Socios en el gimnasio</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">Visitas totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio Diario</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Últimos 7 días</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Tabs */}
        <Tabs defaultValue="today" className="space-y-4">
          <TabsList>
            <TabsTrigger value="today">Hoy</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="active">Activos Ahora</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Asistencias de Hoy</CardTitle>
                <CardDescription>Registro de entradas y salidas del día</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nombre o número de socio..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Socio</TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Salida</TableHead>
                        <TableHead>Duración</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAttendance.map((attendance) => (
                        <TableRow key={attendance.id}>
                          <TableCell className="font-medium">
                            {attendance.member.first_name} {attendance.member.last_name}
                          </TableCell>
                          <TableCell>{attendance.member.member_number}</TableCell>
                          <TableCell>{formatTime(attendance.check_in_time)}</TableCell>
                          <TableCell>
                            {attendance.check_out_time ? formatTime(attendance.check_out_time) : "-"}
                          </TableCell>
                          <TableCell>
                            {calculateDuration(attendance.check_in_time, attendance.check_out_time)}
                          </TableCell>
                          <TableCell>
                            {attendance.check_out_time ? (
                              <Badge variant="secondary">Completado</Badge>
                            ) : (
                              <Badge variant="default">En gimnasio</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Asistencia</CardTitle>
                <CardDescription>Consulta el registro histórico de asistencias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Buscar..." className="pl-9" />
                  </div>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Socio</TableHead>
                        <TableHead>Entrada</TableHead>
                        <TableHead>Salida</TableHead>
                        <TableHead>Duración</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          Selecciona una fecha para ver el historial
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Socios Activos Ahora</CardTitle>
                <CardDescription>Personas actualmente en el gimnasio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAttendance
                    .filter((a) => !a.check_out_time)
                    .map((attendance) => (
                      <div key={attendance.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-medium">
                            {attendance.member.first_name} {attendance.member.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{attendance.member.member_number}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Entrada: {formatTime(attendance.check_in_time)}</p>
                          <p className="text-xs text-muted-foreground">
                            Hace {Math.floor((Date.now() - new Date(attendance.check_in_time).getTime()) / (1000 * 60))}{" "}
                            minutos
                          </p>
                        </div>
                      </div>
                    ))}
                  {mockAttendance.filter((a) => !a.check_out_time).length === 0 && (
                    <p className="text-center text-muted-foreground">No hay socios en el gimnasio actualmente</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
