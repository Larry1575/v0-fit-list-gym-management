"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { LayoutDashboard, UserCheck, Dumbbell, LogIn } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Bienvenido a FitList</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Sistema completo de gestión para gimnasios. Selecciona tu rol para acceder al dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          <Link href="/owner">
            <Card className="cursor-pointer hover:border-primary transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Propietario</CardTitle>
                    <CardDescription>Gestión financiera y operativa</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/admin">
            <Card className="cursor-pointer hover:border-primary transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-accent" />
                  <div>
                    <CardTitle>Administrador</CardTitle>
                    <CardDescription>Gestión completa del gimnasio</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/trainer">
            <Card className="cursor-pointer hover:border-primary transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle>Entrenador</CardTitle>
                    <CardDescription>Gestión de clases y estudiantes</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/member/login">
            <Card className="cursor-pointer hover:border-primary transition-colors h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <LogIn className="h-6 w-6 text-accent" />
                  <div>
                    <CardTitle>Portal del Socio</CardTitle>
                    <CardDescription>Acceso a tu perfil y membresía</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
