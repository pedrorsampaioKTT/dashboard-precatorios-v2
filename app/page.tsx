"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { EntesTable } from "@/components/entes-table"
import { UploadModal } from "@/components/upload-modal"
import { EnteProfile } from "@/components/ente-profile"
import { DashboardStats } from "@/components/dashboard-stats"
import { FilterSidebar } from "@/components/filter-sidebar"
import { BrazilMapRealistic } from "@/components/brazil-map-realistic"
import { mockEntes } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Ente } from "@/lib/types"

export default function Dashboard() {
  const [selectedEnte, setSelectedEnte] = useState<Ente | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [entes, setEntes] = useState(mockEntes)
  const [filteredEntes, setFilteredEntes] = useState(mockEntes)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Carregar dados salvos no localStorage ao inicializar
    const savedData = localStorage.getItem("entesData")
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setEntes(parsedData)
        setFilteredEntes(parsedData)
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error)
      }
    }

    // Escutar eventos de atualização de dados
    const handleDataUpdate = (event: CustomEvent) => {
      setEntes(event.detail)
      setFilteredEntes(event.detail)
    }

    window.addEventListener("dataUpdated", handleDataUpdate as EventListener)

    return () => {
      window.removeEventListener("dataUpdated", handleDataUpdate as EventListener)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader onUpload={() => setShowUpload(true)} />

      {selectedEnte ? (
        <div className="p-6">
          <EnteProfile ente={selectedEnte} onBack={() => setSelectedEnte(null)} />
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="mapa">Mapa do Brasil</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-0">
            <div className="flex">
              <FilterSidebar entes={entes} onFilter={setFilteredEntes} />
              <main className="flex-1 p-6">
                <DashboardStats entes={filteredEntes} />
                <EntesTable entes={filteredEntes} onSelectEnte={setSelectedEnte} />
              </main>
            </div>
          </TabsContent>

          <TabsContent value="mapa" className="mt-0">
            <BrazilMapRealistic entes={entes} onSelectEnte={setSelectedEnte} />
          </TabsContent>
        </Tabs>
      )}

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  )
}
