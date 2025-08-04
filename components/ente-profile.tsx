"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, TrendingUp, Calendar, Calculator } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts"
import type { Ente } from "@/lib/types"

interface EnteProfileProps {
  ente: Ente
  onBack: () => void
}

export function EnteProfile({ ente, onBack }: EnteProfileProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`
  }

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "") return ""

    // Se for um número (formato Excel), converter para data
    if (!isNaN(Number(dateString))) {
      const excelDate = Number(dateString)
      // Excel conta dias desde 1900-01-01, mas tem um bug de ano bissexto
      const date = new Date((excelDate - 25569) * 86400 * 1000)
      const month = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")
      const year = date.getFullYear().toString().slice(-2)
      return `${month}/${year}`
    }

    // Se já estiver em formato de data, tentar converter
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        const month = date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")
        const year = date.getFullYear().toString().slice(-2)
        return `${month}/${year}`
      }
    } catch (error) {
      // Se não conseguir converter, retornar como está
      return dateString
    }

    return dateString
  }

  // NOVA FUNCIONALIDADE: Análise Preditiva
  const calcularAnalisePredicativa = () => {
    // 1. Calcular crescimento médio da RCL (2019-2024)
    const rclValues = [
      ente.historicoRCL["2019"],
      ente.historicoRCL["2020"],
      ente.historicoRCL["2021"],
      ente.historicoRCL["2022"],
      ente.historicoRCL["2023"],
      ente.receitaCorrenteLiquida2024,
    ].filter((val) => val > 0)

    let crescimentoMedioRCL = 0
    if (rclValues.length >= 2) {
      const crescimentos = []
      for (let i = 1; i < rclValues.length; i++) {
        const crescimento = (rclValues[i] - rclValues[i - 1]) / rclValues[i - 1]
        crescimentos.push(crescimento)
      }
      crescimentoMedioRCL = crescimentos.reduce((acc, val) => acc + val, 0) / crescimentos.length
    }

    crescimentoMedioRCL = crescimentoMedioRCL * 0.75 // Aplicar premissa de 75%

    // 2. Calcular percentual médio de RCL destinado a precatórios
    const percentuaisRCL = [
      ente.historicoRCL["2019"] > 0 ? (ente.historicoPagamentos["2020"] || 0) / ente.historicoRCL["2019"] : 0,
      ente.historicoRCL["2020"] > 0 ? (ente.historicoPagamentos["2021"] || 0) / ente.historicoRCL["2020"] : 0,
      ente.historicoRCL["2021"] > 0 ? (ente.historicoPagamentos["2022"] || 0) / ente.historicoRCL["2021"] : 0,
      ente.historicoRCL["2022"] > 0 ? (ente.historicoPagamentos["2023"] || 0) / ente.historicoRCL["2022"] : 0,
      ente.historicoRCL["2023"] > 0 ? (ente.historicoPagamentos["2024"] || 0) / ente.historicoRCL["2023"] : 0,
    ].filter((val) => val > 0)

    const percentualMedioRCL =
      percentuaisRCL.length > 0
        ? (percentuaisRCL.reduce((acc, val) => acc + val, 0) / percentuaisRCL.length) * 0.9 // Aplicar premissa de 90%
        : 0

    // 3. Projetar RCL para os próximos anos
    const projecaoRCL = []
    let rclAtual = ente.receitaCorrenteLiquida2024

    for (let ano = 2025; ano <= 2029; ano++) {
      rclAtual = rclAtual * (1 + crescimentoMedioRCL)
      let pagamentoPrevisto = rclAtual * percentualMedioRCL

      // Se o ente faz acordo, reduzir pagamento em 50%
      if (ente.fazAcordo) {
        pagamentoPrevisto = pagamentoPrevisto * 0.5
      }

      projecaoRCL.push({
        ano,
        rcl: rclAtual,
        pagamentoPrevisto,
      })
    }

    // 4. Calcular tempo para quitação
    const dividaAtual = ente.dividaPrecatoriosSICONFI2024
    const pagamentoAnualMedio =
      projecaoRCL.length > 0 ? projecaoRCL.reduce((acc, val) => acc + val.pagamentoPrevisto, 0) / projecaoRCL.length : 0

    const tempoQuitacaoAnos = dividaAtual > 0 ? pagamentoAnualMedio / dividaAtual : 0
    const tempoQuitacaoMeses = tempoQuitacaoAnos * 12

    // 5. Estimar processos pagos por ano
    const processosAnuais = ente.ticketMedioEstimado > 0 ? pagamentoAnualMedio / ente.ticketMedioEstimado : 0

    return {
      crescimentoMedioRCL,
      percentualMedioRCL,
      projecaoRCL,
      tempoQuitacaoAnos,
      tempoQuitacaoMeses,
      pagamentoAnualMedio,
      processosAnuais,
      percentuaisRCL,
    }
  }

  const analisePredicativa = calcularAnalisePredicativa()

  // Adicionar função para determinar status das teses após a função formatDate:

  const getStatusTeses = () => {
    const status = ente.statusTeses || "INDEFINIDO"

    // Se for INDEFINIDO, verificar parâmetros para aprovação automática
    if (status === "INDEFINIDO") {
      const temNotaBoaCapag = ente.notaGeralCAPAG2025 === "A" || ente.notaGeralCAPAG2025 === "B"
      const temRegimeOrdinario = ente.regime === "Ordinário"
      const temEstoqueRCLBaixo = ente.estoquePrecRCL < 0.01 // menor que 1%
      const temEstoqueDCBaixo = ente.estoquePrecDC < 0.01 // menor que 1%
      const temTicketBaixo = ente.ticketMedioEstimado < 500000
      const temMediaBoa = analisePredicativa.mediaRazao > 100

      if (
        temNotaBoaCapag &&
        temRegimeOrdinario &&
        temEstoqueRCLBaixo &&
        temEstoqueDCBaixo &&
        temTicketBaixo &&
        temMediaBoa
      ) {
        return "APROVADO POR PARÂMETROS"
      }
    }

    return status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APROVADA":
      case "APROVADO POR PARÂMETROS":
        return "bg-green-100 text-green-800 border-green-200"
      case "REPROVADA":
        return "bg-red-100 text-red-800 border-red-200"
      case "REVISÃO":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "INDEFINIDO":
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    if (status === "INDEFINIDO") return "Caso a Caso"
    return status
  }

  // Dados para gráficos
  const historicoData = [
    {
      ano: "2019",
      rcl: ente.historicoRCL["2019"] || 0,
      divida: ente.dividasMapaAnual["2019"] || 0,
      dc: ente.historicoDC["2019"] || 0,
    },
    {
      ano: "2020",
      rcl: ente.historicoRCL["2020"] || 0,
      divida: ente.dividasMapaAnual["2020"] || 0,
      dc: ente.historicoDC["2020"] || 0,
    },
    {
      ano: "2021",
      rcl: ente.historicoRCL["2021"] || 0,
      divida: ente.dividasMapaAnual["2021"] || 0,
      dc: ente.historicoDC["2021"] || 0,
    },
    {
      ano: "2022",
      rcl: ente.historicoRCL["2022"] || 0,
      divida: ente.dividasMapaAnual["2022"] || 0,
      dc: ente.historicoDC["2022"] || 0,
    },
    {
      ano: "2023",
      rcl: ente.historicoRCL["2023"] || 0,
      divida: ente.dividasMapaAnual["2023"] || 0,
      dc: ente.historicoDC["2023"] || 0,
    },
    {
      ano: "2024",
      rcl: ente.receitaCorrenteLiquida2024,
      divida: ente.dividaMapaAnual2024,
      dc: ente.dividaConsolidada2024,
    },
  ]

  // Dados para gráfico de pagamentos, expedições e percentual - MAPEAMENTO CORRIGIDO
  const pagamentosData = [
    {
      ano: "2019",
      pago: ente.historicoPagamentos["2019"] || 0,
      expedido: ente.historicoExpedicoes?.["2019"] || 0, // BJ
      percentual: ente.historicoExpedicoes?.["2019"]
        ? ((ente.historicoPagamentos["2019"] || 0) / ente.historicoExpedicoes["2019"]) * 100
        : 0,
    },
    {
      ano: "2020",
      pago: ente.historicoPagamentos["2020"] || 0,
      expedido: ente.historicoExpedicoes?.["2020"] || 0, // BK
      percentual: ente.historicoExpedicoes?.["2020"]
        ? ((ente.historicoPagamentos["2020"] || 0) / ente.historicoExpedicoes["2020"]) * 100
        : 0,
    },
    {
      ano: "2021",
      pago: ente.historicoPagamentos["2021"] || 0,
      expedido: ente.historicoExpedicoes?.["2021"] || 0, // BL
      percentual: ente.historicoExpedicoes?.["2021"]
        ? ((ente.historicoPagamentos["2021"] || 0) / ente.historicoExpedicoes["2021"]) * 100
        : 0,
    },
    {
      ano: "2022",
      pago: ente.historicoPagamentos["2022"] || 0,
      expedido: ente.historicoExpedicoes?.["2022"] || 0, // BM
      percentual: ente.historicoExpedicoes?.["2022"]
        ? ((ente.historicoPagamentos["2022"] || 0) / ente.historicoExpedicoes["2022"]) * 100
        : 0,
    },
    {
      ano: "2023",
      pago: ente.historicoPagamentos["2023"] || 0,
      expedido: ente.historicoExpedicoes?.["2023"] || 0, // BN
      percentual: ente.historicoExpedicoes?.["2023"]
        ? ((ente.historicoPagamentos["2023"] || 0) / ente.historicoExpedicoes["2023"]) * 100
        : 0,
    },
    {
      ano: "2024",
      pago: ente.historicoPagamentos["2024"] || 0,
      expedido: ente.historicoExpedicoes?.["2024"] || 0, // V (coluna V)
      percentual: ente.historicoExpedicoes?.["2024"]
        ? ((ente.historicoPagamentos["2024"] || 0) / ente.historicoExpedicoes["2024"]) * 100
        : 0,
    },
  ]

  // Cálculos das métricas de pagamentos
  const pagamentosComDados = pagamentosData.filter((item) => item.pago > 0 || item.expedido > 0)
  const mediaMontantePago =
    pagamentosComDados.length > 0
      ? pagamentosComDados.reduce((acc, item) => acc + item.pago, 0) / pagamentosComDados.length
      : 0
  const mediaMontanteExpedido =
    pagamentosComDados.length > 0
      ? pagamentosComDados.reduce((acc, item) => acc + item.expedido, 0) / pagamentosComDados.length
      : 0
  const mediaRazao =
    pagamentosComDados.length > 0
      ? pagamentosComDados.reduce((acc, item) => acc + item.percentual, 0) / pagamentosComDados.length
      : 0

  // Dados para Montante Pago/RCL do ano anterior
  const pagoRCLData = [
    {
      ano: "2020",
      montantePago: ente.historicoPagamentos["2020"] || 0,
      rclAnterior: ente.historicoRCL["2019"] || 0,
      razaoRCL:
        (ente.historicoRCL["2019"] || 0) > 0
          ? ((ente.historicoPagamentos["2020"] || 0) / ente.historicoRCL["2019"]) * 100
          : 0,
    },
    {
      ano: "2021",
      montantePago: ente.historicoPagamentos["2021"] || 0,
      rclAnterior: ente.historicoRCL["2020"] || 0,
      razaoRCL:
        (ente.historicoRCL["2020"] || 0) > 0
          ? ((ente.historicoPagamentos["2021"] || 0) / ente.historicoRCL["2020"]) * 100
          : 0,
    },
    {
      ano: "2022",
      montantePago: ente.historicoPagamentos["2022"] || 0,
      rclAnterior: ente.historicoRCL["2021"] || 0,
      razaoRCL:
        (ente.historicoRCL["2021"] || 0) > 0
          ? ((ente.historicoPagamentos["2022"] || 0) / ente.historicoRCL["2021"]) * 100
          : 0,
    },
    {
      ano: "2023",
      montantePago: ente.historicoPagamentos["2023"] || 0,
      rclAnterior: ente.historicoRCL["2022"] || 0,
      razaoRCL:
        (ente.historicoRCL["2022"] || 0) > 0
          ? ((ente.historicoPagamentos["2023"] || 0) / ente.historicoRCL["2022"]) * 100
          : 0,
    },
    {
      ano: "2024",
      montantePago: ente.historicoPagamentos["2024"] || 0,
      rclAnterior: ente.historicoRCL["2023"] || 0,
      razaoRCL:
        (ente.historicoRCL["2023"] || 0) > 0
          ? ((ente.historicoPagamentos["2024"] || 0) / ente.historicoRCL["2023"]) * 100
          : 0,
    },
  ]

  const getNotaColor = (nota: string) => {
    switch (nota) {
      case "A":
        return "bg-green-100 text-green-800 border-green-200"
      case "B":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "C":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "D":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{ente.ente}</h1>
          <p className="text-gray-600">
            {ente.esfera === "M" ? "Municipal" : ente.esfera === "E" ? "Estadual" : "Distrito Federal"} • {ente.uf}
          </p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Regime</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={ente.regime === "Ordinário" ? "default" : "secondary"}>{ente.regime}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CAPAG 2025</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ente.notaGeralCAPAG2025}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estoque/RCL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${ente.estoquePrecRCL > 0.5 ? "text-red-600" : "text-green-600"}`}>
              {formatPercentage(ente.estoquePrecRCL)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(ente.ticketMedioEstimado)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status das Teses</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(getStatusTeses())} variant="outline">
              {getStatusText(getStatusTeses())}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* NOVA SEÇÃO: Análise Preditiva para "Caso a Caso" */}
      {getStatusTeses() === "INDEFINIDO" && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Calculator className="h-5 w-5" />
              Análise Preditiva - Capacidade de Pagamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-xs text-gray-600 font-medium">Crescimento Médio RCL</div>
                <div className="text-lg font-bold text-blue-700">
                  {(analisePredicativa.crescimentoMedioRCL * 100).toFixed(2)}% a.a.
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-xs text-gray-600 font-medium">% RCL para Precatórios</div>
                <div className="text-lg font-bold text-green-700">
                  {(analisePredicativa.percentualMedioRCL * 100).toFixed(2)}%
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-xs text-gray-600 font-medium">Tempo Estimado</div>
                <div className="text-lg font-bold text-orange-700">
                  {analisePredicativa.tempoQuitacaoAnos.toFixed(1)} anos
                </div>
                <div className="text-xs text-gray-500">({Math.round(analisePredicativa.tempoQuitacaoMeses)} meses)</div>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-xs text-gray-600 font-medium">Processos/Ano</div>
                <div className="text-lg font-bold text-purple-700">
                  {Math.round(analisePredicativa.processosAnuais)}
                </div>
              </div>
            </div>

            {/* Projeção de Pagamentos */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Projeção de Pagamentos (2025-2029)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {analisePredicativa.projecaoRCL.map((proj) => (
                  <div key={proj.ano} className="text-center p-3 bg-gray-50 rounded">
                    <div className="text-sm font-medium text-gray-700">{proj.ano}</div>
                    <div className="text-xs text-gray-600">RCL Projetada</div>
                    <div className="text-sm font-bold">{formatCurrency(proj.rcl)}</div>
                    <div className="text-xs text-gray-600 mt-1">Pagamento Previsto</div>
                    <div className="text-sm font-bold text-green-600">{formatCurrency(proj.pagamentoPrevisto)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico de Percentuais RCL */}
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3">Histórico: % RCL Anterior Destinado a Precatórios</h4>
              <div className="grid grid-cols-5 gap-2 text-xs">
                <div className="text-center p-2 bg-gray-100 rounded">
                  <div className="font-medium">2020</div>
                  <div>{(analisePredicativa.percentuaisRCL[0] * 100).toFixed(2)}%</div>
                </div>
                <div className="text-center p-2 bg-gray-100 rounded">
                  <div className="font-medium">2021</div>
                  <div>{(analisePredicativa.percentuaisRCL[1] * 100).toFixed(2)}%</div>
                </div>
                <div className="text-center p-2 bg-gray-100 rounded">
                  <div className="font-medium">2022</div>
                  <div>{(analisePredicativa.percentuaisRCL[2] * 100).toFixed(2)}%</div>
                </div>
                <div className="text-center p-2 bg-gray-100 rounded">
                  <div className="font-medium">2023</div>
                  <div>{(analisePredicativa.percentuaisRCL[3] * 100).toFixed(2)}%</div>
                </div>
                <div className="text-center p-2 bg-gray-100 rounded">
                  <div className="font-medium">2024</div>
                  <div>{(analisePredicativa.percentuaisRCL[4] * 100).toFixed(2)}%</div>
                </div>
              </div>
            </div>

            {/* Premissas Aplicadas */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-800">Premissas Aplicadas</h4>
              <div className="text-xs space-y-1 text-yellow-700">
                <p>• Crescimento RCL ajustado para 75% (conservadorismo)</p>
                <p>• Montante para precatórios ajustado para 90% (10% para prioridades)</p>
                {ente.fazAcordo && <p>• Pagamento reduzido em 50% (destinação para acordos)</p>}
              </div>
            </div>

            {/* Resumo da Análise */}
            <div className="bg-gradient-to-r from-blue-100 to-green-100 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Resumo da Análise
              </h4>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Dívida Atual:</strong> {formatCurrency(ente.dividaPrecatoriosSICONFI2024)}
                </p>
                <p>
                  <strong>Pagamento Anual Médio Projetado:</strong>{" "}
                  {formatCurrency(analisePredicativa.pagamentoAnualMedio)}
                </p>
                <p>
                  <strong>Processos Pendentes:</strong> {ente.qtdProcessosPendentes.toLocaleString("pt-BR")}
                </p>
                <p>
                  <strong>Estimativa de Quitação:</strong> {analisePredicativa.tempoQuitacaoAnos.toFixed(1)} anos (
                  {Math.round(analisePredicativa.tempoQuitacaoMeses)} meses)
                </p>
                <p>
                  <strong>Processos Pagos por Ano:</strong> ~{Math.round(analisePredicativa.processosAnuais)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CAPAG Detalhado */}
        <Card>
          <CardHeader>
            <CardTitle>CAPAG 2025</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* RCL e DC */}
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="text-xs text-gray-600 font-medium">RCL - 2024:</div>
                <div className="text-sm font-bold">{formatCurrency(ente.receitaCorrenteLiquida2024)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-600 font-medium">DC - 2024:</div>
                <div className="text-sm font-bold">{formatCurrency(ente.dividaConsolidada2024)}</div>
              </div>
            </div>

            {/* Tabela de Índices */}
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-100 text-xs font-medium">
                <div className="p-2 border-r">Índice</div>
                <div className="p-2 border-r text-center">Valor</div>
                <div className="p-2 text-center">Nota</div>
              </div>

              <div className="grid grid-cols-3 border-b text-sm">
                <div className="p-2 border-r">Endividamento</div>
                <div className="p-2 border-r text-center">{formatPercentage(ente.indice1Endividamento)}</div>
                <div className="p-2 text-center">
                  <Badge className={getNotaColor(ente.indice1Nota)} variant="outline">
                    {ente.indice1Nota}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 border-b text-sm">
                <div className="p-2 border-r">Poupança Corrente</div>
                <div className="p-2 border-r text-center">{formatPercentage(ente.indice2PoupancaCorrente)}</div>
                <div className="p-2 text-center">
                  <Badge className={getNotaColor(ente.indice2Nota)} variant="outline">
                    {ente.indice2Nota}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 text-sm">
                <div className="p-2 border-r">Liquidez</div>
                <div className="p-2 border-r text-center">{formatPercentage(ente.indice3Liquidez)}</div>
                <div className="p-2 text-center">
                  <Badge className={getNotaColor(ente.indice3Nota)} variant="outline">
                    {ente.indice3Nota}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Nota Geral - Destaque */}
            <div className="bg-gray-200 rounded-lg p-4 text-center">
              <div className="text-sm font-medium text-gray-700 mb-1">NOTA GERAL</div>
              <div className="text-3xl font-bold">{ente.notaGeralCAPAG2025}</div>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de evolução */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução RCL vs Dívida Precatórios vs Dívida Consolidada</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicoData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ano" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line type="monotone" dataKey="rcl" stroke="#2563eb" name="RCL" />
                <Line type="monotone" dataKey="divida" stroke="#dc2626" name="Dívida Precatórios" />
                <Line type="monotone" dataKey="dc" stroke="#059669" name="Dívida Consolidada" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico combinado: pagamentos, expedições e percentual */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gráfico combinado: pagamentos, expedições e percentual */}
          <Card>
            <CardHeader>
              <CardTitle>Pagamentos vs Expedições + % Pago/Expedido</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={pagamentosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(0)}%`} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "percentual") {
                        return [`${value.toFixed(1)}%`, "% Pago/Expedido"]
                      }
                      return [formatCurrency(value), name === "pago" ? "Pago" : "Expedido"]
                    }}
                  />
                  <Bar yAxisId="left" dataKey="pago" fill="#059669" name="pago" />
                  <Bar yAxisId="left" dataKey="expedido" fill="#dc2626" name="expedido" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="percentual"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="percentual"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              {/* Métricas de Resumo */}
              <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium">Média Montante Pago</div>
                  <div className="text-sm font-bold text-green-700">{formatCurrency(mediaMontantePago)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium">Média Montante Expedido</div>
                  <div className="text-sm font-bold text-red-700">{formatCurrency(mediaMontanteExpedido)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 font-medium">Média da Razão</div>
                  <div className={`text-sm font-bold ${mediaRazao >= 100 ? "text-green-700" : "text-orange-700"}`}>
                    {mediaRazao.toFixed(1)}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Novo gráfico: Montante Pago/RCL do ano anterior */}
          <Card>
            <CardHeader>
              <CardTitle>Montante Pago / RCL do Ano Anterior</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={pagoRCLData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ano" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value.toFixed(1)}%`} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === "razaoRCL") {
                        return [`${value.toFixed(2)}%`, "% Pago/RCL Anterior"]
                      }
                      return [formatCurrency(value), name === "montantePago" ? "Montante Pago" : "RCL Anterior"]
                    }}
                  />
                  <Bar yAxisId="left" dataKey="montantePago" fill="#3b82f6" name="montantePago" />
                  <Bar yAxisId="left" dataKey="rclAnterior" fill="#6b7280" name="rclAnterior" opacity={0.6} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="razaoRCL"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    name="razaoRCL"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Régua de Parcelamento por Ano */}
        <Card>
          <CardHeader>
            <CardTitle>Régua de Parcelamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(ente.limitesParcelamento).map(([ano, valor]) => (
                <div key={ano} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 font-medium">{ano}</div>
                  <div className="text-sm font-bold">{formatCurrency(valor)}</div>
                </div>
              ))}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 font-medium">2025</div>
                <div className="text-sm font-bold text-blue-800">{formatCurrency(ente.reguaParcelamento2025)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Financeiros 2024</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">RCL:</span>
              <span className="font-medium">{formatCurrency(ente.receitaCorrenteLiquida2024)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Dívida Consolidada:</span>
              <span className="font-medium">{formatCurrency(ente.dividaConsolidada2024)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Dívida Precatórios:</span>
              <span className="font-medium">{formatCurrency(ente.dividaPrecatoriosSICONFI2024)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">População:</span>
              <span className="font-medium">{ente.populacao.toLocaleString("pt-BR")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Operacionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Processos Pendentes:</span>
              <span className="font-medium">{ente.qtdProcessosPendentes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Atualização Processos:</span>
              <span className="font-medium text-xs">{formatDate(ente.atualizacao)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Ticket Médio:</span>
              <span className="font-medium">{formatCurrency(ente.ticketMedioEstimado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Faz Acordo:</span>
              <Badge
                variant={ente.fazAcordo ? "default" : "outline"}
                className={ente.fazAcordo ? "bg-black text-white" : ""}
              >
                {ente.fazAcordo ? "Sim" : "Não"}
              </Badge>
            </div>
            {ente.fazAcordo && ente.linkEdital && (
              <div className="pt-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                  <a href={ente.linkEdital} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Ver Último Edital
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Métricas de Análise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estoque/RCL:</span>
              <span className={`font-medium ${ente.estoquePrecRCL > 0.5 ? "text-red-600" : "text-green-600"}`}>
                {formatPercentage(ente.estoquePrecRCL)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Estoque/DC:</span>
              <span className={`font-medium ${ente.estoquePrecDC > 0.3 ? "text-red-600" : "text-green-600"}`}>
                {formatPercentage(ente.estoquePrecDC)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Última Atualização:</span>
              <span className="font-medium text-xs">{formatDate(ente.atualizacao)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status Teses:</span>
              <Badge className={getStatusColor(getStatusTeses())} variant="outline">
                {getStatusText(getStatusTeses())}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
