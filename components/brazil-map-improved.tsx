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
        {/* Mapa do Brasil Melhorado */}
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
                {/* Contorno do Brasil mais detalhado */}
                <path
                  d="M15,25 L20,15 L30,12 L40,10 L50,8 L60,10 L70,12 L80,15 L85,20 L88,25 L85,30 L82,35 L85,40 L82,45 L80,50 L78,55 L75,60 L70,65 L65,70 L60,75 L55,78 L50,80 L45,78 L40,75 L35,70 L30,65 L25,60 L22,55 L20,50 L18,45 L15,40 L12,35 L15,30 Z"
                  fill="#f0f9ff"
                  stroke="#0ea5e9"
                  strokeWidth="0.5"
                />

                {/* Região Norte */}
                <g>
                  <circle
                    cx="35"
                    cy="15"
                    r="2"
                    fill={getStateColor("RR")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("RR")}
                  />
                  <text x="35" y="20" textAnchor="middle" fontSize="1.5" fill="#374151">
                    RR
                  </text>

                  <circle
                    cx="45"
                    cy="20"
                    r="3"
                    fill={getStateColor("PA")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("PA")}
                  />
                  <text x="45" y="26" textAnchor="middle" fontSize="1.5" fill="#374151">
                    PA
                  </text>

                  <circle
                    cx="55"
                    cy="15"
                    r="2"
                    fill={getStateColor("AP")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("AP")}
                  />
                  <text x="55" y="20" textAnchor="middle" fontSize="1.5" fill="#374151">
                    AP
                  </text>

                  <circle
                    cx="25"
                    cy="25"
                    r="3"
                    fill={getStateColor("AM")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("AM")}
                  />
                  <text x="25" y="31" textAnchor="middle" fontSize="1.5" fill="#374151">
                    AM
                  </text>

                  <circle
                    cx="15"
                    cy="40"
                    r="2"
                    fill={getStateColor("AC")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("AC")}
                  />
                  <text x="15" y="45" textAnchor="middle" fontSize="1.5" fill="#374151">
                    AC
                  </text>

                  <circle
                    cx="30"
                    cy="40"
                    r="2"
                    fill={getStateColor("RO")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("RO")}
                  />
                  <text x="30" y="45" textAnchor="middle" fontSize="1.5" fill="#374151">
                    RO
                  </text>

                  <circle
                    cx="55"
                    cy="35"
                    r="2"
                    fill={getStateColor("TO")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("TO")}
                  />
                  <text x="55" y="40" textAnchor="middle" fontSize="1.5" fill="#374151">
                    TO
                  </text>
                </g>

                {/* Região Nordeste */}
                <g>
                  <circle
                    cx="60"
                    cy="25"
                    r="2"
                    fill={getStateColor("MA")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("MA")}
                  />
                  <text x="60" y="30" textAnchor="middle" fontSize="1.5" fill="#374151">
                    MA
                  </text>

                  <circle
                    cx="65"
                    cy="30"
                    r="2"
                    fill={getStateColor("PI")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("PI")}
                  />
                  <text x="65" y="35" textAnchor="middle" fontSize="1.5" fill="#374151">
                    PI
                  </text>

                  <circle
                    cx="70"
                    cy="25"
                    r="2"
                    fill={getStateColor("CE")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("CE")}
                  />
                  <text x="70" y="30" textAnchor="middle" fontSize="1.5" fill="#374151">
                    CE
                  </text>

                  <circle
                    cx="75"
                    cy="25"
                    r="2"
                    fill={getStateColor("RN")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("RN")}
                  />
                  <text x="75" y="30" textAnchor="middle" fontSize="1.5" fill="#374151">
                    RN
                  </text>

                  <circle
                    cx="75"
                    cy="30"
                    r="2"
                    fill={getStateColor("PB")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("PB")}
                  />
                  <text x="75" y="35" textAnchor="middle" fontSize="1.5" fill="#374151">
                    PB
                  </text>

                  <circle
                    cx="70"
                    cy="30"
                    r="2"
                    fill={getStateColor("PE")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("PE")}
                  />
                  <text x="70" y="35" textAnchor="middle" fontSize="1.5" fill="#374151">
                    PE
                  </text>

                  <circle
                    cx="75"
                    cy="35"
                    r="2"
                    fill={getStateColor("AL")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("AL")}
                  />
                  <text x="75" y="40" textAnchor="middle" fontSize="1.5" fill="#374151">
                    AL
                  </text>

                  <circle
                    cx="70"
                    cy="35"
                    r="2"
                    fill={getStateColor("SE")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("SE")}
                  />
                  <text x="70" y="40" textAnchor="middle" fontSize="1.5" fill="#374151">
                    SE
                  </text>

                  <circle
                    cx="65"
                    cy="40"
                    r="3"
                    fill={getStateColor("BA")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("BA")}
                  />
                  <text x="65" y="46" textAnchor="middle" fontSize="1.5" fill="#374151">
                    BA
                  </text>
                </g>

                {/* Região Centro-Oeste */}
                <g>
                  <circle
                    cx="45"
                    cy="50"
                    r="3"
                    fill={getStateColor("MT")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("MT")}
                  />
                  <text x="45" y="56" textAnchor="middle" fontSize="1.5" fill="#374151">
                    MT
                  </text>

                  <circle
                    cx="55"
                    cy="50"
                    r="2"
                    fill={getStateColor("GO")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("GO")}
                  />
                  <text x="55" y="55" textAnchor="middle" fontSize="1.5" fill="#374151">
                    GO
                  </text>

                  <circle
                    cx="60"
                    cy="50"
                    r="1.5"
                    fill={getStateColor("DF")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("DF")}
                  />
                  <text x="60" y="54" textAnchor="middle" fontSize="1.2" fill="#374151">
                    DF
                  </text>

                  <circle
                    cx="45"
                    cy="60"
                    r="2"
                    fill={getStateColor("MS")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("MS")}
                  />
                  <text x="45" y="65" textAnchor="middle" fontSize="1.5" fill="#374151">
                    MS
                  </text>
                </g>

                {/* Região Sudeste */}
                <g>
                  <circle
                    cx="65"
                    cy="60"
                    r="3"
                    fill={getStateColor("MG")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("MG")}
                  />
                  <text x="65" y="66" textAnchor="middle" fontSize="1.5" fill="#374151">
                    MG
                  </text>

                  <circle
                    cx="75"
                    cy="60"
                    r="2"
                    fill={getStateColor("ES")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("ES")}
                  />
                  <text x="75" y="65" textAnchor="middle" fontSize="1.5" fill="#374151">
                    ES
                  </text>

                  <circle
                    cx="70"
                    cy="65"
                    r="2"
                    fill={getStateColor("RJ")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("RJ")}
                  />
                  <text x="70" y="70" textAnchor="middle" fontSize="1.5" fill="#374151">
                    RJ
                  </text>

                  <circle
                    cx="60"
                    cy="65"
                    r="3"
                    fill={getStateColor("SP")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("SP")}
                  />
                  <text x="60" y="71" textAnchor="middle" fontSize="1.5" fill="#374151">
                    SP
                  </text>
                </g>

                {/* Região Sul */}
                <g>
                  <circle
                    cx="55"
                    cy="70"
                    r="2"
                    fill={getStateColor("PR")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("PR")}
                  />
                  <text x="55" y="75" textAnchor="middle" fontSize="1.5" fill="#374151">
                    PR
                  </text>

                  <circle
                    cx="55"
                    cy="75"
                    r="2"
                    fill={getStateColor("SC")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("SC")}
                  />
                  <text x="55" y="80" textAnchor="middle" fontSize="1.5" fill="#374151">
                    SC
                  </text>

                  <circle
                    cx="50"
                    cy="80"
                    r="2"
                    fill={getStateColor("RS")}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => setSelectedState("RS")}
                  />
                  <text x="50" y="85" textAnchor="middle" fontSize="1.5" fill="#374151">
                    RS
                  </text>
                </g>
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
