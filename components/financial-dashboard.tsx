"use client"

import { useMemo, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AccountsReceivable, getReceivablesSummary } from "@/components/accounts-receivable"
import { AccountsPayable, getPayablesSummary } from "@/components/accounts-payable"
import { CashFlow, getCashFlowSummary } from "@/components/cash-flow"
import { Plus, Download, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TabKey = "receivable" | "payable" | "cashflow"

export function FinancialDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("receivable")

  const receivableSummary = useMemo(() => getReceivablesSummary(), [])
  const payableSummary = useMemo(() => getPayablesSummary(), [])
  const cashflowSummary = useMemo(() => getCashFlowSummary(), [])

  const tabMeta = {
    receivable: {
      badge: "Recebimentos",
      title: "Orquestre o ciclo de entrada com previsibilidade",
      description:
        "Analise performance por status, reduza inadimplência e mantenha o relacionamento saudável com clientes estratégicos.",
    },
    payable: {
      badge: "Despesas",
      title: "Controle compromissos com cadência previsível",
      description:
        "Centralize fornecedores, identifique oportunidades de desconto e mantenha o caixa protegido de surpresas.",
    },
    cashflow: {
      badge: "Fluxo de caixa",
      title: "Visualize entradas e saídas em um ritmo sustentável",
      description:
        "Compare períodos, ajuste projeções rapidamente e antecipe decisões de investimento com métricas confiáveis.",
    },
  } satisfies Record<TabKey, { badge: string; title: string; description: string }>

  const summaries = {
    receivable: {
      summaryCards: receivableSummary.summaryCards,
      deltaNote: "impacto direto no fluxo",
      variation: undefined,
    },
    payable: {
      summaryCards: payableSummary.summaryCards,
      deltaNote: "ajuste projetado",
      variation: undefined,
    },
    cashflow: {
      summaryCards: cashflowSummary.summaryCards,
      deltaNote: "ritmo projetado",
      variation: cashflowSummary.variation,
    },
  } satisfies Record<TabKey, { summaryCards: typeof receivableSummary.summaryCards; deltaNote: string; variation: number | undefined }>

  const activeSummary = summaries[activeTab]
  const activeMeta = tabMeta[activeTab]
  const summaryGridClass = activeTab === "cashflow" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-4" : "grid gap-4 md:grid-cols-2 xl:grid-cols-5"
  const summaryCardClass =
    activeTab === "receivable"
      ? "group border-white/60 bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/70 p-6 shadow-[0_36px_120px_-80px_rgba(16,27,55,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_40px_120px_-72px_rgba(16,27,55,0.58)] dark:border-white/10 dark:from-card/85 dark:via-card/80 dark:to-card/80"
      : "group border-white/60 bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/60 p-6 shadow-[0_36px_120px_-80px_rgba(16,27,55,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_40px_120px_-72px_rgba(16,27,55,0.58)] dark:border-white/10 dark:from-card/85 dark:via-card/80 dark:to-card/80"

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-16 pt-12 md:px-8 lg:px-0">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Visão central de liquidez</h1>
        <div className={summaryGridClass}>
          {activeSummary.summaryCards.map((card) => (
            <Card key={`${activeTab}-${card.title}`} className={summaryCardClass}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 px-0">
                <CardTitle className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
                  {card.title}
                </CardTitle>
                <div className={`flex size-9 items-center justify-center rounded-full ${card.accent}`}>
                  <card.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent className="px-0">
                <div className={`text-2xl font-semibold ${card.valueClass}`}>{card.value}</div>
                <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
                {activeTab === "cashflow" && card.title === "Saldo projetado" && typeof activeSummary.variation === "number" && (
                  <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    {activeSummary.variation > 0 ? "+" : ""}
                    {activeSummary.variation.toFixed(1)}% vs mês anterior
                  </p>
                )}
                {card.delta && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 font-semibold tracking-tight ${
                        card.deltaTone === "positive"
                          ? "bg-emerald-100 text-emerald-600"
                          : card.deltaTone === "negative"
                            ? "bg-rose-100 text-rose-600"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {card.delta}
                    </span>
                    {activeSummary.deltaNote}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="space-y-1.5">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground/70">{activeMeta.badge}</span>
          <h2 className="text-base font-semibold tracking-tight text-foreground/85">{activeMeta.title}</h2>
          <p className="max-w-3xl text-sm text-muted-foreground/85">{activeMeta.description}</p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabKey)} className="flex flex-col gap-6">
          <TabsList className="w-full max-w-2xl justify-start gap-2 border-white/50 bg-white/75 px-2 py-1.5 dark:border-white/10 dark:bg-card/70">
            <TabsTrigger value="receivable">Contas a Receber</TabsTrigger>
            <TabsTrigger value="payable">Contas a Pagar</TabsTrigger>
            <TabsTrigger value="cashflow">Fluxo de Caixa</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="lg" className="px-6 text-foreground">
              <Download className="h-5 w-5" />
              Exportar relatórios
            </Button>
            <Button size="lg" className="px-8">
              <Plus className="h-5 w-5" />
              Nova transação
            </Button>
          </div>

          <TabsContent value="receivable" className="space-y-6">
            <AccountsReceivable showSummary={false} showHeader={false} />
          </TabsContent>

          <TabsContent value="payable" className="space-y-6">
            <AccountsPayable showSummary={false} showHeader={false} />
          </TabsContent>

          <TabsContent value="cashflow" className="space-y-6">
            <CashFlow showSummary={false} showHeader={false} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
