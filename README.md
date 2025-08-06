# Dashboard de Precatórios

Dashboard para análise de entes devedores e oportunidades de investimento em precatórios.

## 🚀 Como Funciona

Este dashboard possui um sistema híbrido de dados que permite:

1. **Dados Estáticos**: Carregamento automático dos dados da planilha Excel processada
2. **Dados Locais**: Upload de novas planilhas para análise personalizada
3. **Fallback**: Dados mock caso nenhuma fonte esteja disponível

## 📊 Atualização de Dados

### Para Atualizar os Dados Estáticos (Visíveis para Todos)

1. **Substitua a planilha**: Coloque sua nova planilha Excel na raiz do projeto com o nome `Base entes.xlsx`

2. **Processe os dados**: Execute o comando:
   ```bash
   npm run process-data
   ```

3. **Faça o deploy**: Os dados serão incluídos automaticamente no build:
   ```bash
   npm run build
   ```

### Para Análise Local (Apenas para Você)

1. **Acesse o dashboard** no navegador
2. **Clique em "Upload Base"** no cabeçalho
3. **Selecione sua planilha** Excel
4. **Os dados serão carregados** apenas no seu navegador

## 🔄 Gerenciamento de Dados

- **Dados Estáticos**: Sempre carregados primeiro, visíveis para todos
- **Dados Locais**: Sobrescrevem os dados estáticos apenas no seu navegador
- **Botão "Voltar aos Dados Originais"**: Remove dados locais e volta aos dados estáticos

## 📁 Estrutura de Arquivos

```
├── Base entes.xlsx          # Sua planilha de dados
├── public/
│   └── entes.json          # Dados processados (gerado automaticamente)
├── scripts/
│   └── processaExcel.ts    # Script de processamento
└── hooks/
    └── use-entes-data.ts   # Hook para gerenciar dados
```

## 🛠️ Comandos Disponíveis

- `npm run dev` - Desenvolvimento local
- `npm run build` - Build para produção (inclui processamento de dados)
- `npm run process-data` - Processa apenas a planilha
- `npm run start` - Inicia servidor de produção

## 📋 Formato da Planilha

A planilha deve seguir a estrutura:
- **Coluna A**: Nome do Ente
- **Coluna B**: Nome sem acento
- **Coluna C**: Esfera (M/E/D)
- **Coluna D**: UF
- **Coluna E**: Código IBGE
- **Coluna F**: População
- **Coluna G**: Regime
- **Colunas H-Z**: Dados financeiros e índices
- **Colunas AA-BN**: Históricos e informações adicionais

## 🌐 Deploy

O dashboard está configurado para deploy no Vercel. Os dados estáticos são incluídos automaticamente no build, garantindo que todos os usuários vejam os mesmos dados.

## 🔧 Personalização

- **Dados Mock**: Edite `lib/mock-data.ts` para dados de exemplo
- **Tipos**: Modifique `lib/types.ts` para alterar a estrutura de dados
- **Processamento**: Ajuste `scripts/processaExcel.ts` para mudanças na planilha 