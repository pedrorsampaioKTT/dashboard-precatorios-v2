export interface Ente {
  // Dados básicos (A-G)
  ente: string
  enteSemAcento: string
  esfera: "M" | "E" | "D"
  uf: string
  codigoIBGE: string
  populacao: number
  regime: "Ordinário" | "Especial"

  // Dados financeiros 2024 (H-I)
  receitaCorrenteLiquida2024: number
  dividaConsolidada2024: number

  // Índices CAPAG (J-P)
  indice1Endividamento: number
  indice1Nota: string
  indice2PoupancaCorrente: number
  indice2Nota: string
  indice3Liquidez: number
  indice3Nota: string
  notaGeralCAPAG2025: string

  // Precatórios (Q-AA)
  dividaPrecatoriosSICONFI2024: number
  estoquePrecRCL: number
  estoquePrecDC: number
  dividaPrecatoriosSICONFI2025: number
  dividaMapaAnual2024: number
  montanteExpedido2025: number
  reguaParcelamento2025: number
  qtdProcessosPendentes: number
  atualizacao: string
  fazAcordo: boolean
  ticketMedioEstimado: number

  // Histórico financeiro (AB-AK)
  historicoRCL: Record<string, number>
  historicoDC: Record<string, number>

  // Histórico pagamentos (AL-AQ)
  historicoPagamentos: Record<string, number>

  // Adicionar após historicoPagamentos:
  historicoExpedicoes: Record<string, number>

  // Limites parcelamento (AR-AV)
  limitesParcelamento: Record<string, number>

  // Dívidas por ano (AW-BB)
  dividasMapaAnual: Record<string, number>

  // Editais (BC-BI)
  ultimoEdital: string
  linkEdital: string
  desagio: string
  criterio: string
  dataInicio: string
  dataFechamento: string
  valorDestinado: number

  statusTeses: string // BO - Status das Teses
}
