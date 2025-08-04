"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import type { Ente } from "@/lib/types"

interface FilterSidebarProps {
  entes: Ente[]
  onFilter: (filtered: Ente[]) => void
}

export function FilterSidebar({ entes, onFilter }: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    esferas: [] as string[],
    regimes: [] as string[],
    capagNotas: [] as string[],
    fazAcordo: null as boolean | null,
    populacaoMin: 0,
    populacaoMax: 50000000, // Valor maior
    estoqueRCLMax: 10, // Valor maior
    statusTeses: [] as string[],
  })

  useEffect(() => {
    console.log("🔍 FILTROS APLICADOS:", filters)
    console.log("📊 ENTES ORIGINAIS:", entes.length)

    let filtered = entes

    // Log inicial
    console.log("🚀 Iniciando filtragem com", filtered.length, "entes")

    if (filters.esferas.length > 0) {
      const antes = filtered.length
      filtered = filtered.filter((e) => filters.esferas.includes(e.esfera))
      console.log(`🏛️ Filtro esfera: ${antes} → ${filtered.length}`)
    }

    if (filters.regimes.length > 0) {
      const antes = filtered.length
      filtered = filtered.filter((e) => filters.regimes.includes(e.regime))
      console.log(`⚖️ Filtro regime: ${antes} → ${filtered.length}`)
    }

    if (filters.capagNotas.length > 0) {
      const antes = filtered.length
      filtered = filtered.filter((e) => filters.capagNotas.includes(e.notaGeralCAPAG2025))
      console.log(`📈 Filtro CAPAG: ${antes} → ${filtered.length}`)
    }

    if (filters.fazAcordo !== null) {
      const antes = filtered.length
      filtered = filtered.filter((e) => e.fazAcordo === filters.fazAcordo)
      console.log(`🤝 Filtro acordo: ${antes} → ${filtered.length}`)
    }

    if (filters.statusTeses && filters.statusTeses.length > 0) {
      const antes = filtered.length
      filtered = filtered.filter((e) => filters.statusTeses.includes(e.statusTeses || "INDEFINIDO"))
      console.log(`📋 Filtro status teses: ${antes} → ${filtered.length}`)
    }

    const antes1 = filtered.length
    filtered = filtered.filter((e) => e.populacao >= filters.populacaoMin && e.populacao <= filters.populacaoMax)
    console.log(`👥 Filtro população: ${antes1} → ${filtered.length}`)

    const antes2 = filtered.length
    filtered = filtered.filter((e) => e.estoquePrecRCL <= filters.estoqueRCLMax)
    console.log(`💰 Filtro estoque RCL: ${antes2} → ${filtered.length}`)

    console.log("✅ RESULTADO FINAL:", filtered.length, "entes")

    onFilter(filtered)
  }, [filters, entes, onFilter])

  const clearFilters = () => {
    console.log("🧹 Limpando todos os filtros")
    setFilters({
      esferas: [],
      regimes: [],
      capagNotas: [],
      fazAcordo: null,
      populacaoMin: 0,
      populacaoMax: 50000000, // Aumentar o máximo
      estoqueRCLMax: 10, // Aumentar o máximo
      statusTeses: [],
    })
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Filtros</h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4" />
          Limpar
        </Button>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Esfera</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["M", "E", "D"].map((esfera) => (
              <div key={esfera} className="flex items-center space-x-2">
                <Checkbox
                  id={`esfera-${esfera}`}
                  checked={filters.esferas.includes(esfera)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({
                        ...prev,
                        esferas: [...prev.esferas, esfera],
                      }))
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        esferas: prev.esferas.filter((e) => e !== esfera),
                      }))
                    }
                  }}
                />
                <Label htmlFor={`esfera-${esfera}`} className="text-sm">
                  {esfera === "M" ? "Municipal" : esfera === "E" ? "Estadual" : "Distrito Federal"}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Regime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Ordinário", "Especial"].map((regime) => (
              <div key={regime} className="flex items-center space-x-2">
                <Checkbox
                  id={`regime-${regime}`}
                  checked={filters.regimes.includes(regime)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({
                        ...prev,
                        regimes: [...prev.regimes, regime],
                      }))
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        regimes: prev.regimes.filter((r) => r !== regime),
                      }))
                    }
                  }}
                />
                <Label htmlFor={`regime-${regime}`} className="text-sm">
                  {regime}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Nota CAPAG</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["A", "B", "C", "D"].map((nota) => (
              <div key={nota} className="flex items-center space-x-2">
                <Checkbox
                  id={`capag-${nota}`}
                  checked={filters.capagNotas.includes(nota)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({
                        ...prev,
                        capagNotas: [...prev.capagNotas, nota],
                      }))
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        capagNotas: prev.capagNotas.filter((n) => n !== nota),
                      }))
                    }
                  }}
                />
                <Label htmlFor={`capag-${nota}`} className="text-sm">
                  Nota {nota}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Faz Acordo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acordo-sim"
                checked={filters.fazAcordo === true}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    fazAcordo: checked ? true : null,
                  }))
                }}
              />
              <Label htmlFor="acordo-sim" className="text-sm">
                Sim
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="acordo-nao"
                checked={filters.fazAcordo === false}
                onCheckedChange={(checked) => {
                  setFilters((prev) => ({
                    ...prev,
                    fazAcordo: checked ? false : null,
                  }))
                }}
              />
              <Label htmlFor="acordo-nao" className="text-sm">
                Não
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Status das Teses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["APROVADA", "REPROVADA", "REVISÃO", "INDEFINIDO"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.statusTeses?.includes(status)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFilters((prev) => ({
                        ...prev,
                        statusTeses: [...(prev.statusTeses || []), status],
                      }))
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        statusTeses: (prev.statusTeses || []).filter((s) => s !== status),
                      }))
                    }
                  }}
                />
                <Label htmlFor={`status-${status}`} className="text-sm">
                  {status === "INDEFINIDO" ? "Caso a Caso" : status}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Estoque Prec./RCL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label className="text-xs text-gray-600">Máximo: {(filters.estoqueRCLMax * 100).toFixed(0)}%</Label>
              <Slider
                value={[filters.estoqueRCLMax]}
                onValueChange={([value]) => setFilters((prev) => ({ ...prev, estoqueRCLMax: value }))}
                max={2}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
