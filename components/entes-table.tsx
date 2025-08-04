"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, TrendingUp, TrendingDown, Minus } from "lucide-react"
import type { Ente } from "@/lib/types"

interface EntesTableProps {
  entes: Ente[]
  onSelectEnte: (ente: Ente) => void
}

export function EntesTable({ entes, onSelectEnte }: EntesTableProps) {
  const [sortField, setSortField] = useState<keyof Ente>("ente")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getScoreColor = (nota: string) => {
    switch (nota) {
      case "A":
        return "bg-green-100 text-green-800"
      case "B":
        return "bg-blue-100 text-blue-800"
      case "C":
        return "bg-yellow-100 text-yellow-800"
      case "D":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOpportunityIndicator = (ente: Ente) => {
    if (ente.notaGeralCAPAG2025 === "A" && ente.estoquePrecRCL < 0.3) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (ente.notaGeralCAPAG2025 === "D" || ente.estoquePrecRCL > 1) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Entes Devedores</h2>
        <p className="text-sm text-gray-600">{entes.length} entes encontrados</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ente</TableHead>
            <TableHead>Esfera/UF</TableHead>
            <TableHead>Regime</TableHead>
            <TableHead>CAPAG</TableHead>
            <TableHead>Estoque/RCL</TableHead>
            <TableHead>Estoque/DC</TableHead>
            <TableHead>Ticket Médio</TableHead>
            <TableHead>Acordo</TableHead>
            <TableHead>Status Teses</TableHead>
            <TableHead>Oportunidade</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entes.map((ente) => (
            <TableRow key={ente.codigoIBGE} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold">{ente.ente}</div>
                  <div className="text-xs text-gray-500">Pop: {ente.populacao.toLocaleString("pt-BR")}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {ente.esfera}/{ente.uf}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={ente.regime === "Ordinário" ? "default" : "secondary"}>{ente.regime}</Badge>
              </TableCell>
              <TableCell>
                <Badge className={getScoreColor(ente.notaGeralCAPAG2025)}>{ente.notaGeralCAPAG2025}</Badge>
              </TableCell>
              <TableCell>
                <span className={ente.estoquePrecRCL > 0.5 ? "text-red-600 font-semibold" : "text-green-600"}>
                  {formatPercentage(ente.estoquePrecRCL)}
                </span>
              </TableCell>
              <TableCell>
                <span className={ente.estoquePrecDC > 0.3 ? "text-red-600 font-semibold" : "text-green-600"}>
                  {formatPercentage(ente.estoquePrecDC)}
                </span>
              </TableCell>
              <TableCell>{formatCurrency(ente.ticketMedioEstimado)}</TableCell>
              <TableCell>
                {ente.fazAcordo ? (
                  <Badge className="bg-purple-100 text-purple-800">Sim</Badge>
                ) : (
                  <Badge variant="outline">Não</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    ente.statusTeses === "APROVADA"
                      ? "bg-green-100 text-green-800"
                      : ente.statusTeses === "REPROVADA"
                        ? "bg-red-100 text-red-800"
                        : ente.statusTeses === "REVISÃO"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }
                  variant="outline"
                >
                  {ente.statusTeses === "INDEFINIDO" ? "Caso a Caso" : ente.statusTeses}
                </Badge>
              </TableCell>
              <TableCell>{getOpportunityIndicator(ente)}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onSelectEnte(ente)} className="gap-1">
                  <Eye className="h-4 w-4" />
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
