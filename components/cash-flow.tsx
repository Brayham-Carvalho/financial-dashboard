"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, ArrowDownRight, ArrowUpRight, Search, TrendingUp, Wallet } from "lucide-react"
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

export function CashFlow() {
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = mockTransactions.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const currentBalance = 125000
  const monthIncome = mockTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const monthExpense = mockTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const projectedBalance = currentBalance + monthIncome - monthExpense
  const variation = ((monthIncome - monthExpense) / monthExpense) * 100

  const summaryCards = [
    {
      title: "Saldo atual",
      value: formatCurrency(currentBalance),
      description: "Disponível agora",
      icon: Wallet,
      accent: "bg-blue-100/60 text-blue-600",
      valueClass: "text-blue-600",
    },
    {
      title: "Entradas do mês",
      value: formatCurrency(monthIncome),
      description: "Recebimentos consolidados",
      icon: ArrowUpRight,
      accent: "bg-emerald-100/60 text-emerald-600",
      valueClass: "text-emerald-600",
    },
    {
      title: "Saídas do mês",
      value: formatCurrency(monthExpense),
      description: "Pagamentos realizados",
      icon: ArrowDownRight,
      accent: "bg-red-100/65 text-red-600",
      valueClass: "text-red-600",
    },
    {
      title: "Saldo projetado",
      value: formatCurrency(projectedBalance),
      description: "Após movimentações previstas",
      icon: Activity,
      accent: "bg-purple-100/60 text-purple-600",
      valueClass: "text-foreground",
    },
  ] as const

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Fluxo de caixa</p>
        <h3 className="text-2xl font-semibold text-foreground">Acompanhe a respiração financeira do negócio com suavidade</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card
            key={card.title}
            className="border-white/70 bg-white/80 p-7 shadow-[0_32px_80px_-60px_rgba(31,27,26,0.45)] backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-[0_38px_90px_-58px_rgba(31,27,26,0.5)] dark:border-white/10 dark:bg-card/80"
          >
            <CardHeader className="flex flex-row items-start justify-between space-y-0 px-0">
              <CardTitle className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground/80">
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-white/70 bg-white/85 shadow-[0_38px_100px_-70px_rgba(31,27,26,0.52)] dark:border-white/10 dark:bg-card/85">
          <CardHeader className="px-0">
            <CardTitle className="text-lg font-semibold text-foreground">Fluxo de Caixa - Últimos 6 meses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
                <Area
                  type="monotone"
                  dataKey="entradas"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorEntradas)"
                  name="Entradas"
                />
                <Area
                  type="monotone"
                  dataKey="saidas"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorSaidas)"
                  name="Saídas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-white/70 bg-white/85 shadow-[0_38px_100px_-70px_rgba(31,27,26,0.52)] dark:border-white/10 dark:bg-card/85">
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
                <Bar dataKey="entradas" fill="#10b981" name="Entradas" radius={[8, 8, 0, 0]} />
                <Bar dataKey="saidas" fill="#ef4444" name="Saídas" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-white/60 bg-white/90 shadow-none transition-none hover:translate-y-0 hover:shadow-none dark:border-white/10 dark:bg-card/85">
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
                            isIncome ? "bg-emerald-100/70 text-emerald-600" : "bg-red-100/65 text-red-600"
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
    </div>
  )
}
