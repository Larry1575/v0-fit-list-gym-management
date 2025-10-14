"use client"

import { useState } from "react"
import { MemberLayout } from "@/components/member-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Users, CheckCircle2 } from "lucide-react"
import { mockClasses } from "@/lib/db-client"

const DAYS_OF_WEEK = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export default function MemberClassesPage() {
  const [bookedClasses, setBookedClasses] = useState<string[]>(["1"])

  const handleBookClass = (classId: string) => {
    if (bookedClasses.includes(classId)) {
      setBookedClasses(bookedClasses.filter((id) => id !== classId))
    } else {
      setBookedClasses([...bookedClasses, classId])
    }
  }

  const isBooked = (classId: string) => bookedClasses.includes(classId)

  return (
    <MemberLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Clases</h1>
          <p className="text-muted-foreground">Reserva tu lugar en las clases disponibles</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="booked">Mis Reservas</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const dayClasses = mockClasses.filter((c) => c.day_of_week === day && c.is_active)
              if (dayClasses.length === 0) return null

              return (
                <div key={day}>
                  <h3 className="mb-3 text-lg font-semibold text-foreground">{DAYS_OF_WEEK[day]}</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {dayClasses
                      .sort((a, b) => a.start_time.localeCompare(b.start_time))
                      .map((cls) => (
                        <Card key={cls.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">{cls.name}</CardTitle>
                                <CardDescription>{cls.instructor}</CardDescription>
                              </div>
                              {isBooked(cls.id) && <Badge variant="default">Reservada</Badge>}
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {cls.start_time} - {cls.end_time}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              {Math.floor(Math.random() * cls.max_capacity)} / {cls.max_capacity} plazas
                            </div>
                            <Button
                              className="w-full"
                              variant={isBooked(cls.id) ? "outline" : "default"}
                              onClick={() => handleBookClass(cls.id)}
                            >
                              {isBooked(cls.id) ? "Cancelar Reserva" : "Reservar"}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )
            })}
          </TabsContent>

          <TabsContent value="booked" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Reservas</CardTitle>
                <CardDescription>Clases que has reservado</CardDescription>
              </CardHeader>
              <CardContent>
                {bookedClasses.length === 0 ? (
                  <p className="text-center text-muted-foreground">No tienes reservas activas</p>
                ) : (
                  <div className="space-y-4">
                    {mockClasses
                      .filter((c) => bookedClasses.includes(c.id))
                      .map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-primary/10 p-3">
                              <CheckCircle2 className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">{cls.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {DAYS_OF_WEEK[cls.day_of_week]} - {cls.start_time}
                              </p>
                              <p className="text-sm text-muted-foreground">{cls.instructor}</p>
                            </div>
                          </div>
                          <Button variant="outline" onClick={() => handleBookClass(cls.id)}>
                            Cancelar
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MemberLayout>
  )
}
