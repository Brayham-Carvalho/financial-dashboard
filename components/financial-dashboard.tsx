"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountsReceivable } from "@/components/accounts-receivable"
import { AccountsPayable } from "@/components/accounts-payable"
import { CashFlow } from "@/components/cash-flow"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("receivable")

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Controle Financeiro</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas contas a receber, pagar e fluxo de caixa</p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="receivable">Contas a Receber</TabsTrigger>
          <TabsTrigger value="payable">Contas a Pagar</TabsTrigger>
          <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
        </TabsList>

        <TabsContent value="receivable" className="space-y-6">
          <AccountsReceivable />
        </TabsContent>

        <TabsContent value="payable" className="space-y-6">
          <AccountsPayable />
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-6">
          <CashFlow />
        </TabsContent>
      </Tabs>
    </div>
  )
}
