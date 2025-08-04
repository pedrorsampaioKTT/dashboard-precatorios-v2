import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react"
import type { Ente } from "@/lib/types"

interface DashboardStatsProps {
  entes: Ente[]
}

export function DashboardStats({ entes }: DashboardStatsProps) {
  const totalEntes = entes.length
  const entesOrdinarios = entes.filter((e) => e.regime === "Ordinário").length
  const entesEspeciais = entes.filter((e) => e.regime === "Especial").length
  const entesComAcordo = entes.filter((e) => e.fazAcordo).length

  const oportunidadesQuentes = entes.filter((e) => e.notaGeralCAPAG2025 === "A" && e.estoquePrecRCL < 0.5).length

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Entes</CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEntes}</div>
          <p className="text-xs text-muted-foreground">Base completa</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Regime Ordinário</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{entesOrdinarios}</div>
          <p className="text-xs text-muted-foreground">{((entesOrdinarios / totalEntes) * 100).toFixed(1)}% do total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Regime Especial</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{entesEspeciais}</div>
          <p className="text-xs text-muted-foreground">{((entesEspeciais / totalEntes) * 100).toFixed(1)}% do total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fazem Acordo</CardTitle>
          <TrendingDown className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{entesComAcordo}</div>
          <p className="text-xs text-muted-foreground">Oportunidades de deságio</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Oportunidades</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{oportunidadesQuentes}</div>
          <p className="text-xs text-muted-foreground">CAPAG A + Baixo estoque</p>
        </CardContent>
      </Card>
    </div>
  )
}
