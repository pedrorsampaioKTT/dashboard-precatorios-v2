import { useState, useEffect } from "react"
import type { Ente } from "@/lib/types"

export function useEntesData() {
  const [entes, setEntes] = useState<Ente[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Primeiro, tentar carregar dados do localStorage (dados atualizados pelo usuário)
        if (typeof window !== 'undefined') {
          const savedData = localStorage.getItem("entesData")
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData)
              setEntes(parsedData)
              setLoading(false)
              return
            } catch (error) {
              console.warn("Erro ao carregar dados do localStorage:", error)
              // Se falhar, continuar para carregar dados estáticos
            }
          }
        }

        // Se não há dados no localStorage, carregar dados estáticos
        try {
          const response = await fetch("/entes.json")
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const staticData = await response.json()
          setEntes(staticData)
        } catch (fetchError) {
          console.warn("Erro ao carregar dados estáticos:", fetchError)
          
          // Se não conseguir carregar dados estáticos, usar dados mock como fallback
          try {
            const { mockEntes } = await import("@/lib/mock-data")
            setEntes(mockEntes)
          } catch (mockError) {
            console.error("Erro ao carregar dados mock:", mockError)
            setError("Não foi possível carregar os dados dos entes")
          }
        }
      } catch (error) {
        console.error("Erro geral ao carregar dados:", error)
        setError("Erro ao carregar dados dos entes")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Função para atualizar dados (usada pelo upload)
  const updateData = (newData: Ente[]) => {
    setEntes(newData)
    if (typeof window !== 'undefined') {
      localStorage.setItem("entesData", JSON.stringify(newData))
    }
  }

  // Função para limpar dados locais e voltar aos dados estáticos
  const resetToStaticData = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem("entesData")
      }
      const response = await fetch("/entes.json")
      if (response.ok) {
        const staticData = await response.json()
        setEntes(staticData)
      }
    } catch (error) {
      console.error("Erro ao resetar dados:", error)
    }
  }

  return {
    entes,
    loading,
    error,
    updateData,
    resetToStaticData,
    hasLocalData: typeof window !== 'undefined' ? !!localStorage.getItem("entesData") : false
  }
} 