"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import * as XLSX from "xlsx"
import type { Ente } from "@/lib/types"

interface UploadModalProps {
  onClose: () => void
  onDataUpdate?: (data: Ente[]) => void
}



export function UploadModal({ onClose, onDataUpdate }: UploadModalProps) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState("")
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setUploadStatus("uploading")
    setDebugInfo([])

    try {
      // Ler o arquivo Excel
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      setUploadStatus("processing")

      // Converter para JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

      // Processar os dados (pular a primeira linha se for cabeçalho)
      const processedData = processExcelData(jsonData.slice(1))

      // Salvar no localStorage para persistir os dados
      localStorage.setItem("entesData", JSON.stringify(processedData))

      // Atualizar dados via callback se fornecido
      if (onDataUpdate) {
        onDataUpdate(processedData)
      }

      setUploadStatus("success")
    } catch (error) {
      console.error("Erro ao processar arquivo:", error)
      setUploadStatus("error")
    }
  }

  // Função para processar os dados do Excel - DEBUG MELHORADO
  const processExcelData = (rows: any[]): Ente[] => {
    const debug: string[] = []
    debug.push(`📊 Total de linhas no Excel: ${rows.length}`)

    // Filtrar linhas vazias primeiro
    const nonEmptyRows = rows.filter((row: any[]) => {
      return row && row.length > 0 && row[0] && String(row[0]).trim() !== ""
    })
    debug.push(`📋 Linhas não vazias: ${nonEmptyRows.length}`)

    // Processar cada linha
    const processedData = nonEmptyRows
      .map((row: any[], index: number) => {
        const enteName = String(row[0] || "").trim()

        // Filtros mais específicos
        if (!enteName) return null
        if (enteName.toLowerCase() === "ente") return null // Cabeçalho
        if (enteName.toLowerCase().includes("total")) return null // Linhas de total
        if (enteName.toLowerCase().includes("soma")) return null // Linhas de soma

        const esfera = String(row[2] || "M").trim() as "M" | "E" | "D"
        const regime = String(row[6] || "Ordinário").trim() as "Ordinário" | "Especial"
        
        return {
          // Colunas A-G: Dados básicos
          ente: enteName,
          enteSemAcento: String(row[1] || "").trim(),
          esfera,
          uf: String(row[3] || "").trim(),
          codigoIBGE: String(row[4] || "").trim(),
          populacao: Number(row[5]) || 0,
          regime,

          // Colunas H-I: Dados financeiros 2024
          receitaCorrenteLiquida2024: Number(row[7]) || 0,
          dividaConsolidada2024: Number(row[8]) || 0,

          // Colunas J-P: Índices CAPAG
          indice1Endividamento: Number(row[9]) || 0,
          indice1Nota: String(row[10] || "").trim(),
          indice2PoupancaCorrente: Number(row[11]) || 0,
          indice2Nota: String(row[12] || "").trim(),
          indice3Liquidez: Number(row[13]) || 0,
          indice3Nota: String(row[14] || "").trim(),
          notaGeralCAPAG2025: String(row[15] || "").trim(),

          // Colunas Q-AA: Precatórios
          dividaPrecatoriosSICONFI2024: Number(row[16]) || 0,
          estoquePrecRCL: Number(row[17]) || 0,
          estoquePrecDC: Number(row[18]) || 0,
          dividaPrecatoriosSICONFI2025: Number(row[19]) || 0,
          dividaMapaAnual2024: Number(row[20]) || 0,
          montanteExpedido2025: Number(row[21]) || 0,
          reguaParcelamento2025: Number(row[22]) || 0,
          qtdProcessosPendentes: Number(row[23]) || 0,
          atualizacao: String(row[24] || "").trim(),
          fazAcordo: row[25] === "Sim" || row[25] === true,
          ticketMedioEstimado: Number(row[26]) || 0,

          // Histórico RCL (colunas AB-AJ)
          historicoRCL: {
            "2023": Number(row[27]) || 0,
            "2022": Number(row[29]) || 0,
            "2021": Number(row[31]) || 0,
            "2020": Number(row[33]) || 0,
            "2019": Number(row[35]) || 0,
          },

          // Histórico DC (colunas AC-AK)
          historicoDC: {
            "2023": Number(row[28]) || 0,
            "2022": Number(row[30]) || 0,
            "2021": Number(row[32]) || 0,
            "2020": Number(row[34]) || 0,
            "2019": Number(row[36]) || 0,
          },

          // Histórico pagamentos (colunas AL-AQ)
          historicoPagamentos: {
            "2024": Number(row[37]) || 0,
            "2023": Number(row[38]) || 0,
            "2022": Number(row[39]) || 0,
            "2021": Number(row[40]) || 0,
            "2020": Number(row[41]) || 0,
            "2019": Number(row[42]) || 0,
          },

          // Limites parcelamento (colunas AR-AV)
          limitesParcelamento: {
            "2024": Number(row[43]) || 0,
            "2023": Number(row[44]) || 0,
            "2022": Number(row[45]) || 0,
            "2021": Number(row[46]) || 0,
            "2020": Number(row[47]) || 0,
          },

          // Dívidas mapa anual (colunas AW-BB)
          dividasMapaAnual: {
            "2024": Number(row[48]) || 0,
            "2023": Number(row[49]) || 0,
            "2022": Number(row[50]) || 0,
            "2021": Number(row[51]) || 0,
            "2020": Number(row[52]) || 0,
            "2019": Number(row[53]) || 0,
          },

          // Editais (colunas BC-BI)
          ultimoEdital: String(row[54] || "").trim(),
          linkEdital: String(row[55] || "").trim(),
          desagio: String(row[56] || "").trim(),
          criterio: String(row[57] || "").trim(),
          dataInicio: String(row[58] || "").trim(),
          dataFechamento: String(row[59] || "").trim(),
          valorDestinado: Number(row[60]) || 0,

          // Histórico expedições
          historicoExpedicoes: {
            "2019": Number(row[61]) || 0,
            "2020": Number(row[62]) || 0,
            "2021": Number(row[63]) || 0,
            "2022": Number(row[64]) || 0,
            "2023": Number(row[65]) || 0,
            "2024": Number(row[21]) || 0,
          },
          // Status das Teses
          statusTeses: String(row[66] || "INDEFINIDO").trim(),
        } as Ente
      })
      .filter((ente): ente is Ente => ente !== null)

    debug.push(`✅ Entes processados com sucesso: ${processedData.length}`)

    // Log dos primeiros 5 entes para debug
    debug.push("🔍 Primeiros 5 entes:")
    processedData.slice(0, 5).forEach((ente, i) => {
      debug.push(`${i + 1}. ${ente.ente} (${ente.uf})`)
    })

    setDebugInfo(debug)
    console.log("DEBUG INFO:", debug)

    return processedData
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload da Base de Dados</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {uploadStatus === "idle" && (
            <>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">Selecione sua planilha Excel com os dados dos entes</p>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button className="gap-2" asChild>
                    <span>
                      <Upload className="h-4 w-4" />
                      Selecionar Arquivo
                    </span>
                  </Button>
                </label>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  <strong>Formato esperado:</strong> Excel (.xlsx ou .xls)
                </p>
                <p>
                  <strong>Estrutura:</strong> Colunas A (Ente) até BN (Expedições)
                </p>
                <p>
                  <strong>Debug:</strong> Verifique o console para informações detalhadas
                </p>
              </div>
            </>
          )}

          {uploadStatus === "uploading" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">{fileName}</p>
                  <p className="text-sm text-gray-600">Fazendo upload...</p>
                </div>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-center text-gray-600">{progress}%</p>
            </div>
          )}

          {uploadStatus === "processing" && (
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <div>
                <p className="font-medium">Processando dados...</p>
                <p className="text-sm text-gray-600">Validando estrutura e importando entes</p>
              </div>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <div>
                <p className="font-medium text-green-800">Upload concluído!</p>
                {debugInfo.length > 0 && (
                  <div className="text-xs text-left bg-gray-100 p-2 rounded mt-2 max-h-32 overflow-y-auto">
                    {debugInfo.map((info, i) => (
                      <div key={i}>{info}</div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={onClose} className="w-full">
                Continuar
              </Button>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
              <div>
                <p className="font-medium text-red-800">Erro no upload</p>
                <p className="text-sm text-gray-600">Verifique o formato do arquivo e tente novamente</p>
              </div>
              <Button variant="outline" onClick={() => setUploadStatus("idle")} className="w-full">
                Tentar Novamente
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
