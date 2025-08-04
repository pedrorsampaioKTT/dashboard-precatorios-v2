"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin } from "lucide-react"
import type { Ente } from "@/lib/types"

interface BrazilMapProps {
  entes: Ente[]
  onSelectEnte: (ente: Ente) => void
}

export function BrazilMap({ entes, onSelectEnte }: BrazilMapProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const filteredEntes = entes.filter(
    (ente) =>
      ente.ente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ente.uf.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stateEntes = entes.filter((ente) => ente.esfera === "E")
  const municipalEntes = entes.filter((ente) => ente.esfera === "M")

  const getStateColor = (uf: string) => {
    const stateEnte = stateEntes.find((e) => e.uf === "BR" && e.ente.toLowerCase().includes(uf.toLowerCase()))
    if (!stateEnte) return "#e5e7eb"

    switch (stateEnte.notaGeralCAPAG2025) {
      case "A":
        return "#10b981"
      case "B":
        return "#3b82f6"
      case "C":
        return "#f59e0b"
      case "D":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const brazilStates = [
    { name: "Acre", uf: "AC", x: 15, y: 45 },
    { name: "Alagoas", uf: "AL", x: 75, y: 35 },
    { name: "Amapá", uf: "AP", x: 55, y: 15 },
    { name: "Amazonas", uf: "AM", x: 25, y: 25 },
    { name: "Bahia", uf: "BA", x: 65, y: 40 },
    { name: "Ceará", uf: "CE", x: 70, y: 25 },
    { name: "Distrito Federal", uf: "DF", x: 60, y: 50 },
    { name: "Espírito Santo", uf: "ES", x: 75, y: 60 },
    { name: "Goiás", uf: "GO", x: 55, y: 50 },
    { name: "Maranhão", uf: "MA", x: 60, y: 25 },
    { name: "Mato Grosso", uf: "MT", x: 45, y: 50 },
    { name: "Mato Grosso do Sul", uf: "MS", x: 45, y: 60 },
    { name: "Minas Gerais", uf: "MG", x: 65, y: 60 },
    { name: "Pará", uf: "PA", x: 45, y: 20 },
    { name: "Paraíba", uf: "PB", x: 75, y: 30 },
    { name: "Paraná", uf: "PR", x: 55, y: 70 },
    { name: "Pernambuco", uf: "PE", x: 70, y: 30 },
    { name: "Piauí", uf: "PI", x: 65, y: 30 },
    { name: "Rio de Janeiro", uf: "RJ", x: 70, y: 65 },
    { name: "Rio Grande do Norte", uf: "RN", x: 75, y: 25 },
    { name: "Rio Grande do Sul", uf: "RS", x: 50, y: 80 },
    { name: "Rondônia", uf: "RO", x: 30, y: 40 },
    { name: "Roraima", uf: "RR", x: 35, y: 10 },
    { name: "Santa Catarina", uf: "SC", x: 55, y: 75 },
    { name: "São Paulo", uf: "SP", x: 60, y: 65 },
    { name: "Sergipe", uf: "SE", x: 70, y: 35 },
    { name: "Tocantins", uf: "TO", x: 55, y: 35 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mapa do Brasil - Entes Devedores</h1>
          <p className="text-gray-600">Clique nos estados ou pesquise por municípios</p>
        </div>

        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar estado ou município..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa do Brasil */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa Interativo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 bg-blue-50 rounded-lg overflow-hidden">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Contorno do Brasil simplificado */}
                <path
                  d="M20,20 L80,15 L85,25 L80,35 L85,45 L80,55 L75,65 L70,75 L60,80 L50,85 L40,80 L30,75 L25,65 L20,55 L15,45 L20,35 L15,25 Z"
                  fill="#f0f9ff"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                />

                {/* Estados como círculos */}
                {brazilStates.map((state) => {
                  const stateEntes = entes.filter((e) => e.uf === state.uf)
                  const hasData = stateEntes.length > 0

                  return (
                    <g key={state.uf}>
                      <circle
                        cx={state.x}
                        cy={state.y}
                        r={hasData ? "3" : "1.5"}
                        fill={hasData ? getStateColor(state.uf) : "#d1d5db"}
                        stroke="#fff"
                        strokeWidth="0.5"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedState(selectedState === state.uf ? null : state.uf)}
                      />
                      <text
                        x={state.x}
                        y={state.y + 5}
                        textAnchor="middle"
                        fontSize="2"
                        fill="#374151"
                        className="pointer-events-none"
                      >
                        {state.uf}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Legenda */}
            <div className="mt-4 flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>CAPAG A</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>CAPAG B</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>CAPAG C</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>CAPAG D</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Entes */}
        <Card>
          <CardHeader>
            <CardTitle>{selectedState ? `Entes - ${selectedState}` : "Resultados da Busca"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(selectedState ? entes.filter((e) => e.uf === selectedState) : filteredEntes.slice(0, 20)).map(
                (ente) => (
                  <div
                    key={ente.codigoIBGE}
                    className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onSelectEnte(ente)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{ente.ente}</h4>
                        <p className="text-xs text-gray-600">
                          {ente.esfera === "M" ? "Municipal" : ente.esfera === "E" ? "Estadual" : "DF"} • {ente.uf}
                        </p>
                        <p className="text-xs text-gray-500">Pop: {ente.populacao.toLocaleString("pt-BR")}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          className={
                            ente.notaGeralCAPAG2025 === "A"
                              ? "bg-green-100 text-green-800"
                              : ente.notaGeralCAPAG2025 === "B"
                                ? "bg-blue-100 text-blue-800"
                                : ente.notaGeralCAPAG2025 === "C"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }
                        >
                          {ente.notaGeralCAPAG2025}
                        </Badge>
                        <Badge variant={ente.regime === "Ordinário" ? "default" : "secondary"} className="text-xs">
                          {ente.regime}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
