"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountsReceivable } from "@/components/accounts-receivable"
import { AccountsPayable } from "@/components/accounts-payable"
import { CashFlow } from "@/components/cash-flow"
import { LineChart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState("receivable")

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 md:px-8 lg:px-0">
      <div className="flex flex-col gap-6">
        <Badge variant="outline" className="w-fit border-white/60 bg-white/70 text-xs uppercase tracking-[0.32em] text-muted-foreground">
          Painel financeiro
        </Badge>
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" className="px-8">
              <Plus className="h-5 w-5" />
              Nova transação
            </Button>
            <Button variant="outline" size="lg" className="px-8 text-foreground">
              <LineChart className="h-5 w-5" />
              Ver relatórios
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-8">
        <TabsList className="w-full max-w-xl justify-between">
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
