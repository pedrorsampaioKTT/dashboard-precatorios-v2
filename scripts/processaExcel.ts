import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import type { Ente } from "../lib/types";

console.log("🎯 Iniciando processamento da planilha...");

// Caminho para a planilha Excel (usando caminho relativo)
const excelPath = path.resolve(__dirname, "../Base entes.xlsx");

// Verifica se o arquivo existe
if (!fs.existsSync(excelPath)) {
  console.error("❌ Arquivo Excel não encontrado no caminho:", excelPath);
  console.log("📁 Procurando por arquivos Excel na pasta raiz...");
  
  const files = fs.readdirSync(path.resolve(__dirname, ".."));
  const excelFiles = files.filter(file => file.endsWith('.xlsx') || file.endsWith('.xls'));
  
  if (excelFiles.length > 0) {
    console.log("📋 Arquivos Excel encontrados:", excelFiles);
    console.log("💡 Renomeie um dos arquivos para 'Base entes.xlsx' ou atualize o caminho no script");
  }
  process.exit(1);
}

// Lê a planilha
const workbook = XLSX.readFile(excelPath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Converter para JSON com cabeçalhos
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log("✅ Planilha lida com sucesso. Total de linhas:", jsonData.length);

// Função para processar os dados do Excel (mesma lógica do upload-modal)
const processExcelData = (rows: any[]): Ente[] => {
  console.log(`📊 Total de linhas no Excel: ${rows.length}`);

  // Filtrar linhas vazias primeiro
  const nonEmptyRows = rows.filter((row: any[]) => {
    return row && row.length > 0 && row[0] && String(row[0]).trim() !== ""
  });
  console.log(`📋 Linhas não vazias: ${nonEmptyRows.length}`);

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

          // Histórico financeiro (AB-AK)
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

          // Histórico expedições
          historicoExpedicoes: {
            "2019": Number(row[61]) || 0,
            "2020": Number(row[62]) || 0,
            "2021": Number(row[63]) || 0,
            "2022": Number(row[64]) || 0,
            "2023": Number(row[65]) || 0,
            "2024": Number(row[21]) || 0,
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

          // Status das Teses
          statusTeses: String(row[66] || "INDEFINIDO").trim(),
        } as Ente
    })
    .filter((ente): ente is Ente => ente !== null)

  console.log(`✅ Entes processados com sucesso: ${processedData.length}`);

  // Log dos primeiros 5 entes para debug
  console.log("🔍 Primeiros 5 entes:");
  processedData.slice(0, 5).forEach((ente, i) => {
    console.log(`${i + 1}. ${ente.ente} (${ente.uf})`);
  });

  return processedData
}

// Processar os dados (pular a primeira linha se for cabeçalho)
const processedData = processExcelData(jsonData.slice(1));

// Caminho para salvar o JSON
const outputPath = path.resolve(__dirname, "../public/entes.json");

// Cria a pasta public caso não exista
if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

// Salva o JSON
fs.writeFileSync(outputPath, JSON.stringify(processedData, null, 2), "utf-8");

console.log("✅ JSON salvo em:", outputPath);
console.log("📊 Total de entes processados:", processedData.length);