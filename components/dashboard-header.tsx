"use client"

import { Button } from "@/components/ui/button"
import { Upload, Download, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
  onUpload: () => void
  hasLocalData?: boolean
  onResetData?: () => void
}

export function DashboardHeader({ onUpload, hasLocalData, onResetData }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Precatórios</h1>
          <p className="text-gray-600">Análise de entes devedores e oportunidades de investimento</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Buscar ente..." className="pl-10 w-64" />
          </div>

          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Exportar
          </Button>

          {hasLocalData && onResetData && (
            <Button variant="outline" onClick={onResetData} className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50">
              <Download className="h-4 w-4" />
              Voltar aos Dados Originais
            </Button>
          )}

          <Button onClick={onUpload} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Base
          </Button>
        </div>
      </div>
    </header>
  )
}
