"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell } from "lucide-react"

export default function MemberLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de login - cuando se agregue Supabase, aquí irá la autenticación real
    setTimeout(() => {
      // Mock: cualquier email/password funciona para demo
      if (email && password) {
        // Guardar sesión mock
        localStorage.setItem("member_session", JSON.stringify({ email, id: "1" }))
        router.push("/member/dashboard")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-10 w-10 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">FitList</h1>
          </div>
          <p className="text-muted-foreground">Portal del Socio</p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Accede a tu cuenta de socio</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <Link href="/member/forgot-password" className="text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <Link href="/admin" className="hover:text-foreground">
            ¿Eres administrador? Accede aquí
          </Link>
        </div>
      </div>
    </div>
  )
}
