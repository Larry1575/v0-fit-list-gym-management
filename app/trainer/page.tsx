"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Calendar, Award, MessageSquare, CheckCircle } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

const trainerClasses = [
  { id: 1, name: "Yoga Mañana", time: "07:00", capacity: "30/30", level: "Beginner", attendees: 30 },
  { id: 2, name: "Yoga Tarde", time: "18:30", capacity: "28/30", level: "Intermediate", attendees: 28 },
  { id: 3, name: "Pilates", time: "19:30", capacity: "20/20", level: "Advanced", attendees: 20 },
]

const studentsList = [
  { id: 1, name: "Carlos López", classes: 12, level: "Intermediate", joined: "Hace 3 meses" },
  { id: 2, name: "María García", classes: 18, level: "Advanced", joined: "Hace 6 meses" },
  { id: 3, name: "Juan Martínez", classes: 5, level: "Beginner", joined: "Hace 2 semanas" },
  { id: 4, name: "Ana Rodríguez", classes: 14, level: "Intermediate", joined: "Hace 4 meses" },
]

const progressData = [
  { student: "Carlos López", month: "Oct", attendance: 4, progress: 85 },
  { student: "María García", month: "Oct", attendance: 5, progress: 92 },
  { student: "Juan Martínez", month: "Oct", attendance: 2, progress: 65 },
]

export default function TrainerDashboard() {
  const [selectedClass, setSelectedClass] = useState(trainerClasses[0])

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard del Entrenador</h1>
          <p className="text-muted-foreground">Gestiona tus clases y seguimiento de estudiantes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentsList.length}</div>
              <p className="text-xs text-muted-foreground">Bajo tu supervisión</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clases Esta Semana</CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">+2 cambios de horario</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">93%</div>
              <p className="text-xs text-muted-foreground">Estudiantes activos</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calificación</CardTitle>
              <Award className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">De 5.0 estrellas</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="classes">Mis Clases</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="progress">Progreso</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Clases Programadas</CardTitle>
                  <CardDescription>Lista de tus clases esta semana</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trainerClasses.map((cls) => (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedClass(cls)}
                      className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                        selectedClass.id === cls.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{cls.name}</p>
                          <p className="text-sm text-muted-foreground">{cls.time}</p>
                        </div>
                        <Badge variant="secondary">{cls.attendees} asistentes</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{selectedClass.name}</CardTitle>
                  <CardDescription>Detalles de la clase seleccionada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Horario</p>
                    <p className="font-semibold">{selectedClass.time}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Nivel</p>
                    <Badge>{selectedClass.level}</Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Capacidad</p>
                    <p className="font-semibold">{selectedClass.capacity}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Asistentes</p>
                    <p className="font-semibold">{selectedClass.attendees} personas</p>
                  </div>
                  <Button className="w-full">Editar Clase</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Mis Estudiantes</CardTitle>
                <CardDescription>Gestiona y sigue el progreso de tus estudiantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Clases Asistidas</TableHead>
                        <TableHead>Nivel</TableHead>
                        <TableHead>Miembro Desde</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {studentsList.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.classes}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{student.level}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{student.joined}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="gap-1">
                              <MessageSquare className="h-4 w-4" />
                              Feedback
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Seguimiento de Progreso</CardTitle>
                <CardDescription>Progreso de tus estudiantes este mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.map((student) => (
                    <div key={`${student.student}-${student.month}`} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{student.student}</p>
                        <span className="text-sm text-muted-foreground">{student.progress}% progreso</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${student.progress}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground">{student.attendance} clases este mes</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
