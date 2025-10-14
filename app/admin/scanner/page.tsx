"use client"

import type React from "react"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { QrCode, Search, CheckCircle2, XCircle, AlertCircle, Camera } from "lucide-react"
import { mockMembers } from "@/lib/db-client"

export default function ScannerPage() {
  const [scanResult, setScanResult] = useState<any>(null)
  const [manualInput, setManualInput] = useState("")
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = (memberNumber: string) => {
    // Buscar socio por número
    const member = mockMembers.find((m) => m.member_number === memberNumber)

    if (!member) {
      setScanResult({
        success: false,
        message: "Socio no encontrado",
        type: "error",
      })
      return
    }

    // Verificar estado del socio
    if (member.status !== "active") {
      setScanResult({
        success: false,
        message: "Membresía inactiva o suspendida",
        type: "warning",
        member,
      })
      return
    }

    // Check-in exitoso
    setScanResult({
      success: true,
      message: "Check-in registrado exitosamente",
      type: "success",
      member,
      timestamp: new Date().toLocaleTimeString("es-ES"),
    })

    // Limpiar después de 3 segundos
    setTimeout(() => {
      setScanResult(null)
      setManualInput("")
    }, 3000)
  }

  const handleManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      handleScan(manualInput.trim())
    }
  }

  const simulateQRScan = () => {
    setIsScanning(true)
    // Simular escaneo de QR
    setTimeout(() => {
      handleScan("M001")
      setIsScanning(false)
    }, 1500)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Escáner de Asistencia</h1>
          <p className="text-muted-foreground">Registra la entrada de socios mediante QR o número de socio</p>
        </div>

        {/* Scanner Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle>Control de Acceso</CardTitle>
              <CardDescription>Escanea el código QR o ingresa el número de socio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Scanner Simulation */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
                  {isScanning ? (
                    <div className="text-center">
                      <Camera className="mx-auto h-12 w-12 animate-pulse text-primary" />
                      <p className="mt-2 text-sm text-muted-foreground">Escaneando...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Área de escaneo</p>
                    </div>
                  )}
                </div>
                <Button className="w-full gap-2" onClick={simulateQRScan} disabled={isScanning}>
                  <Camera className="h-4 w-4" />
                  {isScanning ? "Escaneando..." : "Simular Escaneo QR"}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">O ingresa manualmente</span>
                </div>
              </div>

              {/* Manual Input */}
              <form onSubmit={handleManualCheckIn} className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Número de socio (ej: M001)"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button type="submit">Check-in</Button>
                </div>
              </form>

              {/* Scan Result */}
              {scanResult && (
                <Alert
                  variant={scanResult.type === "error" ? "destructive" : "default"}
                  className={
                    scanResult.type === "success"
                      ? "border-accent bg-accent/10"
                      : scanResult.type === "warning"
                        ? "border-yellow-500 bg-yellow-500/10"
                        : ""
                  }
                >
                  <div className="flex items-start gap-3">
                    {scanResult.type === "success" && <CheckCircle2 className="h-5 w-5 text-accent" />}
                    {scanResult.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                    {scanResult.type === "error" && <XCircle className="h-5 w-5" />}
                    <div className="flex-1">
                      <AlertDescription className="font-semibold">{scanResult.message}</AlertDescription>
                      {scanResult.member && (
                        <div className="mt-2 space-y-1 text-sm">
                          <p>
                            Socio: {scanResult.member.first_name} {scanResult.member.last_name}
                          </p>
                          <p>Número: {scanResult.member.member_number}</p>
                          {scanResult.timestamp && <p>Hora: {scanResult.timestamp}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Check-ins */}
        <Card>
          <CardHeader>
            <CardTitle>Últimos Check-ins</CardTitle>
            <CardDescription>Registros recientes de entrada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { member: mockMembers[0], time: "Hace 2 minutos", status: "active" },
                { member: mockMembers[1], time: "Hace 15 minutos", status: "active" },
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-accent/10 p-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {record.member.first_name} {record.member.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">{record.member.member_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default">Activo</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">{record.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Solicita al socio que muestre su código QR desde la app o su teléfono</p>
            <p>• Escanea el código QR con la cámara del dispositivo</p>
            <p>• Si el código no funciona, ingresa manualmente el número de socio</p>
            <p>• Verifica que el estado de la membresía sea "Activo" antes de permitir el acceso</p>
            <p>• En caso de problemas, contacta al administrador del sistema</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
