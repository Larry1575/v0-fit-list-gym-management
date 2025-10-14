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
import { Plus, Calendar, Users, Clock, Edit, Trash2 } from "lucide-react"
import { mockClasses } from "@/lib/db-client"
import type { Class } from "@/lib/types"

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(mockClasses)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleAddClass = (newClass: Omit<Class, "id" | "created_at">) => {
    const classToAdd: Class = {
      ...newClass,
      id: String(classes.length + 1),
      created_at: new Date().toISOString(),
    }
    setClasses([...classes, classToAdd])
    setIsAddDialogOpen(false)
  }

  const handleDeleteClass = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta clase?")) {
      setClasses(classes.filter((c) => c.id !== id))
    }
  }

  const toggleClassStatus = (id: string) => {
    setClasses(classes.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c)))
  }

  // Group classes by day
  const classesByDay = classes.reduce(
    (acc, cls) => {
      if (!acc[cls.day_of_week]) {
        acc[cls.day_of_week] = []
      }
      acc[cls.day_of_week].push(cls)
      return acc
    },
    {} as Record<number, Class[]>,
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Clases</h1>
            <p className="text-muted-foreground">Gestiona el horario de clases del gimnasio</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Clase
              </Button>
            </DialogTrigger>
            <DialogContent>
              <ClassForm onSubmit={handleAddClass} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clases</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.length}</div>
              <p className="text-xs text-muted-foreground">Clases programadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clases Activas</CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.filter((c) => c.is_active).length}</div>
              <p className="text-xs text-muted-foreground">Disponibles para reserva</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Capacidad Total</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classes.reduce((sum, c) => sum + c.max_capacity, 0)}</div>
              <p className="text-xs text-muted-foreground">Plazas disponibles</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Horario Semanal</CardTitle>
            <CardDescription>Vista del calendario de clases por día</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6, 0].map((day) => (
                <div key={day}>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{DAYS_OF_WEEK[day]}</h3>
                  {classesByDay[day] && classesByDay[day].length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {classesByDay[day]
                        .sort((a, b) => a.start_time.localeCompare(b.start_time))
                        .map((cls) => (
                          <Card key={cls.id} className={!cls.is_active ? "opacity-50" : ""}>
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-base">{cls.name}</CardTitle>
                                  <CardDescription className="text-sm">{cls.instructor}</CardDescription>
                                </div>
                                <Badge variant={cls.is_active ? "default" : "secondary"}>
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
                                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                                  <Edit className="mr-1 h-3 w-3" />
                                  Editar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => toggleClassStatus(cls.id)}
                                  className="flex-1"
                                >
                                  {cls.is_active ? "Desactivar" : "Activar"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay clases programadas</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* All Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Todas las Clases</CardTitle>
            <CardDescription>Lista completa de clases disponibles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Instructor</TableHead>
                    <TableHead>Día</TableHead>
                    <TableHead>Horario</TableHead>
                    <TableHead>Capacidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes.map((cls) => (
                    <TableRow key={cls.id}>
                      <TableCell className="font-medium">{cls.name}</TableCell>
                      <TableCell>{cls.instructor}</TableCell>
                      <TableCell>{DAYS_OF_WEEK[cls.day_of_week]}</TableCell>
                      <TableCell>
                        {cls.start_time} - {cls.end_time}
                      </TableCell>
                      <TableCell>{cls.max_capacity}</TableCell>
                      <TableCell>
                        <Badge variant={cls.is_active ? "default" : "secondary"}>
                          {cls.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClass(cls.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

function ClassForm({ onSubmit }: { onSubmit: (data: Omit<Class, "id" | "created_at">) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructor: "",
    day_of_week: 1,
    start_time: "",
    end_time: "",
    max_capacity: 20,
    is_active: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Nueva Clase</DialogTitle>
        <DialogDescription>Crea una nueva clase en el horario</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre de la Clase *</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Yoga Matutino"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción de la clase"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="instructor">Instructor</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="Nombre del instructor"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="day_of_week">Día de la Semana *</Label>
            <Select
              value={String(formData.day_of_week)}
              onValueChange={(value) => setFormData({ ...formData, day_of_week: Number(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_capacity">Capacidad Máxima *</Label>
            <Input
              id="max_capacity"
              type="number"
              required
              min="1"
              value={formData.max_capacity}
              onChange={(e) => setFormData({ ...formData, max_capacity: Number(e.target.value) })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_time">Hora de Inicio *</Label>
            <Input
              id="start_time"
              type="time"
              required
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_time">Hora de Fin *</Label>
            <Input
              id="end_time"
              type="time"
              required
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Crear Clase</Button>
      </DialogFooter>
    </form>
  )
}
