"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, ArrowDownRight, ArrowUpRight, Gauge, Search, TrendingUp, Wallet } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/format"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type TransactionType = "income" | "expense"

interface Transaction {
  id: string
  description: string
  amount: number
  date: string
  type: TransactionType
  category: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    description: "Recebimento - Empresa ABC",
    amount: 15000,
    date: "2025-10-01",
    type: "income",
    category: "Vendas",
  },
  {
    id: "2",
    description: "Pagamento - Fornecedor Alpha",
    amount: 12000,
    date: "2025-10-02",
    type: "expense",
    category: "Fornecedores",
  },
  {
    id: "3",
    description: "Recebimento - Tech Solutions",
    amount: 8500,
    date: "2025-10-03",
    type: "income",
    category: "Vendas",
  },
  {
    id: "4",
    description: "Pagamento - Aluguel",
    amount: 8000,
    date: "2025-10-04",
    type: "expense",
    category: "Aluguel",
  },
  {
    id: "5",
    description: "Pagamento - Serviços de TI",
    amount: 4500,
    date: "2025-10-05",
    type: "expense",
    category: "Serviços",
  },
]

const chartData = [
  { month: "Mai", entradas: 45000, saidas: 32000 },
  { month: "Jun", entradas: 52000, saidas: 38000 },
  { month: "Jul", entradas: 48000, saidas: 35000 },
  { month: "Ago", entradas: 61000, saidas: 42000 },
  { month: "Set", entradas: 55000, saidas: 39000 },
  { month: "Out", entradas: 58000, saidas: 41000 },
]

type CashFlowSummaryCard = {
  title: string
  value: string
  description: string
  delta?: string
  deltaTone: "positive" | "negative" | "neutral"
  icon: LucideIcon
  accent: string
  valueClass: string
}

type CashFlowSummary = {
  summaryCards: readonly CashFlowSummaryCard[]
  currentBalance: number
  monthIncome: number
  monthExpense: number
  projectedBalance: number
  variation: number
}

export function getCashFlowSummary(): CashFlowSummary {
  const currentBalance = 125000
  const monthIncome = mockTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const monthExpense = mockTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const projectedBalance = currentBalance + monthIncome - monthExpense
  const variation = monthExpense === 0 ? 0 : ((monthIncome - monthExpense) / monthExpense) * 100

  const summaryCards: CashFlowSummaryCard[] = [
    {
      title: "Saldo atual",
      value: formatCurrency(currentBalance),
      description: "Disponível agora",
      delta: "+R$ 18 mil",
      deltaTone: "positive",
      icon: Wallet,
      accent: "bg-primary/12 text-primary",
      valueClass: "text-primary",
    },
    {
      title: "Entradas do mês",
      value: formatCurrency(monthIncome),
      description: "Recebimentos consolidados",
      delta: "+8,1%",
      deltaTone: "positive",
      icon: ArrowUpRight,
      accent: "bg-emerald-100 text-emerald-600",
      valueClass: "text-emerald-600",
    },
    {
      title: "Saídas do mês",
      value: formatCurrency(monthExpense),
      description: "Pagamentos realizados",
      delta: "-4,3%",
      deltaTone: "positive",
      icon: ArrowDownRight,
      accent: "bg-rose-100 text-rose-600",
      valueClass: "text-rose-600",
    },
    {
      title: "Saldo projetado",
      value: formatCurrency(projectedBalance),
      description: "Após movimentações previstas",
      delta: "+5,4%",
      deltaTone: "positive",
      icon: Activity,
      accent: "bg-indigo-100 text-indigo-600",
      valueClass: "text-foreground",
    },
  ]

  return { summaryCards, currentBalance, monthIncome, monthExpense, projectedBalance, variation }
}

export function CashFlow({ showSummary = true, showHeader = true }: { showSummary?: boolean; showHeader?: boolean }) {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = mockTransactions.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const { summaryCards, currentBalance, monthIncome, monthExpense, variation } = getCashFlowSummary()

  return (
    <div className="space-y-8">
      {showHeader && (
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit border-transparent bg-secondary/60 px-4 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-secondary-foreground/80">
            Fluxo de caixa
          </Badge>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">Visualize entradas e saídas em um ritmo sustentável</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Compare períodos, ajuste projeções rapidamente e antecipe decisões de investimento com métricas confiáveis.
          </p>
        </div>
      )}

      {showSummary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <Card
              key={card.title}
              className="group border-white/60 bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/60 p-6 shadow-[0_36px_120px_-80px_rgba(16,27,55,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_40px_120px_-72px_rgba(16,27,55,0.58)] dark:border-white/10 dark:from-card/85 dark:via-card/80 dark:to-card/80"
            >
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
                {card.title === "Saldo projetado" && (
                  <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <TrendingUp className="h-3 w-3" />
                    {variation > 0 ? "+" : ""}
                    {variation.toFixed(1)}% vs mês anterior
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
                    ritmo projetado
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl border-white/60 bg-white/85 shadow-[0_48px_140px_-90px_rgba(16,27,55,0.55)] dark:border-white/10 dark:bg-card/85">
          <CardHeader className="px-0">
            <CardTitle className="text-lg font-semibold text-foreground">Fluxo de Caixa - Últimos 6 meses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Area type="monotone" dataKey="entradas" stroke="var(--chart-2)" fillOpacity={1} fill="url(#colorEntradas)" name="Entradas" />
                <Area type="monotone" dataKey="saidas" stroke="var(--chart-3)" fillOpacity={1} fill="url(#colorSaidas)" name="Saídas" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/60 bg-white/85 shadow-[0_48px_140px_-90px_rgba(16,27,55,0.55)] dark:border-white/10 dark:bg-card/85">
          <CardHeader className="px-0">
            <CardTitle className="text-lg font-semibold text-foreground">Comparativo mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Bar dataKey="entradas" fill="var(--chart-2)" name="Entradas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saidas" fill="var(--chart-3)" name="Saídas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-3xl border-white/60 bg-white/90 shadow-none transition-none hover:translate-y-0 hover:shadow-none dark:border-white/10 dark:bg-card/85">
        <CardHeader className="px-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold text-foreground">Movimentações recentes</CardTitle>
              <p className="text-sm text-muted-foreground">Use filtros leves para localizar entradas e saídas específicas.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar transação..."
                  className="pl-10 sm:w-[220px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="income">Entradas</SelectItem>
                  <SelectItem value="expense">Saídas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead className="hidden md:table-cell">Categoria</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((item) => {
                  const isIncome = item.type === "income"

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-semibold text-foreground">{item.description}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="border-white/60 bg-white/60 text-foreground/80">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(item.date).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`border-transparent px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase ${
                            isIncome ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isIncome ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {isIncome ? "Entrada" : "Saída"}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-right font-semibold ${isIncome ? "text-emerald-600" : "text-red-600"}`}>
                        {isIncome ? "+" : "-"}
                        {formatCurrency(item.amount)}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl border-dashed border-primary/30 bg-primary/5 p-6 shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-base font-semibold text-primary">Indicadores operacionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 text-sm text-primary/80">
            <p>
              <Gauge className="mr-2 inline h-4 w-4" /> Índice de cobertura em {((monthIncome - monthExpense + currentBalance) / monthExpense).toFixed(1)}× para os próximos 60 dias.
            </p>
            <p>
              <Activity className="mr-2 inline h-4 w-4" /> Burn rate ajustado em {formatCurrency(monthExpense - monthIncome)} considerando metas do trimestre.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-dashed border-emerald-300/60 bg-emerald-50/70 p-6 shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-base font-semibold text-emerald-700">Ações recomendadas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-0 text-sm text-emerald-700">
            <div className="flex items-start gap-2">
              <ArrowUpRight className="mt-0.5 h-4 w-4" />
              <span>Reinvestir excedente de caixa em aplicações de curto prazo com liquidez diária.</span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowDownRight className="mt-0.5 h-4 w-4 text-rose-600" />
              <span>Antecipar pagamentos com desconto para fornecedores estratégicos e otimizar margem.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
