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

export function BrazilMapRealistic({ entes, onSelectEnte }: BrazilMapProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const filteredEntes = entes.filter(
    (ente) =>
      ente.ente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ente.uf.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStateColor = (uf: string) => {
    const stateEntes = entes.filter((e) => e.uf === uf)
    if (stateEntes.length === 0) return "#e5e7eb"

    // Pegar a melhor nota CAPAG do estado
    const melhorNota = stateEntes.reduce((melhor, atual) => {
      const notas = { A: 4, B: 3, C: 2, D: 1 }
      return (notas[atual.notaGeralCAPAG2025] || 0) > (notas[melhor] || 0) ? atual.notaGeralCAPAG2025 : melhor
    }, "D")

    switch (melhorNota) {
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
        {/* Mapa Realista do Brasil */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapa do Brasil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-96 bg-blue-50 rounded-lg overflow-hidden">
              <svg viewBox="0 0 1000 800" className="w-full h-full">
                {/* Mapa do Brasil com coordenadas mais realistas */}

                {/* Roraima */}
                <path
                  d="M300,50 L380,45 L420,80 L400,120 L350,110 L320,90 Z"
                  fill={getStateColor("RR")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("RR")}
                />
                <text x="360" y="85" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  RR
                </text>

                {/* Amapá */}
                <path
                  d="M500,60 L580,55 L600,90 L580,130 L540,125 L520,100 Z"
                  fill={getStateColor("AP")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("AP")}
                />
                <text x="550" y="95" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  AP
                </text>

                {/* Amazonas */}
                <path
                  d="M80,120 L300,110 L350,180 L320,250 L280,280 L200,270 L150,240 L100,200 Z"
                  fill={getStateColor("AM")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("AM")}
                />
                <text x="215" y="195" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
                  AM
                </text>

                {/* Pará */}
                <path
                  d="M350,120 L500,110 L580,140 L600,200 L580,260 L520,280 L450,270 L380,250 L350,200 Z"
                  fill={getStateColor("PA")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("PA")}
                />
                <text x="475" y="195" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
                  PA
                </text>

                {/* Acre */}
                <path
                  d="M80,280 L150,275 L180,320 L160,360 L120,355 L100,330 Z"
                  fill={getStateColor("AC")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("AC")}
                />
                <text x="130" y="320" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  AC
                </text>

                {/* Rondônia */}
                <path
                  d="M150,280 L250,275 L280,320 L260,360 L200,355 L180,330 Z"
                  fill={getStateColor("RO")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("RO")}
                />
                <text x="215" y="320" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  RO
                </text>

                {/* Mato Grosso */}
                <path
                  d="M280,320 L380,315 L420,380 L400,450 L350,460 L300,440 L260,400 Z"
                  fill={getStateColor("MT")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("MT")}
                />
                <text x="340" y="390" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
                  MT
                </text>

                {/* Tocantins */}
                <path
                  d="M520,285 L580,280 L600,340 L580,400 L540,405 L500,380 L480,340 Z"
                  fill={getStateColor("TO")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("TO")}
                />
                <text x="540" y="345" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  TO
                </text>

                {/* Maranhão */}
                <path
                  d="M580,200 L680,195 L720,240 L700,300 L660,305 L620,280 L600,240 Z"
                  fill={getStateColor("MA")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("MA")}
                />
                <text x="650" y="250" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  MA
                </text>

                {/* Piauí */}
                <path
                  d="M600,345 L680,340 L720,380 L700,440 L660,445 L620,420 Z"
                  fill={getStateColor("PI")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("PI")}
                />
                <text x="660" y="395" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  PI
                </text>

                {/* Ceará */}
                <path
                  d="M720,200 L820,195 L860,240 L840,280 L800,285 L760,260 L740,220 Z"
                  fill={getStateColor("CE")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("CE")}
                />
                <text x="790" y="240" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  CE
                </text>

                {/* Rio Grande do Norte */}
                <path
                  d="M820,200 L900,195 L920,220 L900,250 L860,255 L840,230 Z"
                  fill={getStateColor("RN")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("RN")}
                />
                <text x="880" y="225" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">
                  RN
                </text>

                {/* Paraíba */}
                <path
                  d="M860,260 L920,255 L940,285 L920,315 L880,320 L860,295 Z"
                  fill={getStateColor("PB")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("PB")}
                />
                <text x="900" y="285" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">
                  PB
                </text>

                {/* Pernambuco */}
                <path
                  d="M720,285 L860,280 L880,340 L860,380 L800,385 L760,360 L740,320 Z"
                  fill={getStateColor("PE")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("PE")}
                />
                <text x="800" y="335" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  PE
                </text>

                {/* Alagoas */}
                <path
                  d="M860,385 L920,380 L940,410 L920,440 L880,445 L860,420 Z"
                  fill={getStateColor("AL")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("AL")}
                />
                <text x="900" y="415" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">
                  AL
                </text>

                {/* Sergipe */}
                <path
                  d="M860,450 L920,445 L940,475 L920,505 L880,510 L860,485 Z"
                  fill={getStateColor("SE")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("SE")}
                />
                <text x="900" y="475" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">
                  SE
                </text>

                {/* Bahia */}
                <path
                  d="M620,450 L860,445 L880,540 L840,600 L780,605 L720,580 L660,555 L620,520 Z"
                  fill={getStateColor("BA")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("BA")}
                />
                <text x="750" y="520" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
                  BA
                </text>

                {/* Goiás */}
                <path
                  d="M420,410 L580,405 L620,480 L600,540 L560,545 L520,520 L480,485 L440,450 Z"
                  fill={getStateColor("GO")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("GO")}
                />
                <text x="520" y="475" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
                  GO
                </text>

                {/* Distrito Federal */}
                <circle
                  cx="540"
                  cy="460"
                  r="12"
                  fill={getStateColor("DF")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("DF")}
                />
                <text x="560" y="465" textAnchor="middle" fontSize="10" fill="#374151" fontWeight="bold">
                  DF
                </text>

                {/* Mato Grosso do Sul */}
                <path
                  d="M350,465 L440,460 L480,520 L460,580 L420,585 L380,560 L340,525 Z"
                  fill={getStateColor("MS")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("MS")}
                />
                <text x="410" y="525" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  MS
                </text>

                {/* Minas Gerais */}
                <path
                  d="M480,525 L720,520 L780,580 L760,640 L720,645 L680,620 L640,595 L600,570 L560,545 Z"
                  fill={getStateColor("MG")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("MG")}
                />
                <text x="620" y="585" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
                  MG
                </text>

                {/* Espírito Santo */}
                <path
                  d="M780,585 L840,580 L860,620 L840,660 L800,665 L780,645 Z"
                  fill={getStateColor("ES")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("ES")}
                />
                <text x="820" y="625" textAnchor="middle" fontSize="12" fill="#374151" fontWeight="bold">
                  ES
                </text>

                {/* Rio de Janeiro */}
                <path
                  d="M720,650 L800,645 L820,685 L800,725 L760,730 L720,705 Z"
                  fill={getStateColor("RJ")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("RJ")}
                />
                <text x="760" y="690" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  RJ
                </text>

                {/* São Paulo */}
                <path
                  d="M560,550 L720,545 L760,605 L740,665 L700,670 L660,645 L620,620 L580,595 Z"
                  fill={getStateColor("SP")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("SP")}
                />
                <text x="640" y="605" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
                  SP
                </text>

                {/* Paraná */}
                <path
                  d="M460,585 L620,580 L660,640 L640,680 L600,685 L560,660 L520,635 L480,610 Z"
                  fill={getStateColor("PR")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("PR")}
                />
                <text x="540" y="635" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  PR
                </text>

                {/* Santa Catarina */}
                <path
                  d="M480,615 L640,610 L680,650 L660,690 L620,695 L580,670 L540,645 Z"
                  fill={getStateColor("SC")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("SC")}
                />
                <text x="560" y="655" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="bold">
                  SC
                </text>

                {/* Rio Grande do Sul */}
                <path
                  d="M340,590 L540,585 L580,645 L560,705 L520,730 L480,725 L440,700 L400,675 L360,650 Z"
                  fill={getStateColor("RS")}
                  stroke="#fff"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedState("RS")}
                />
                <text x="450" y="660" textAnchor="middle" fontSize="16" fill="#374151" fontWeight="bold">
                  RS
                </text>
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
