"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  ArrowUpRight,
  CalendarClock,
  Check,
  Edit,
  Mail,
  MoreVertical,
  Radar,
  Search,
  Signal,
  Sparkles,
  Trash2,
  TrendingUp,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/format"

type ReceivableStatus = "paid" | "pending" | "overdue"

interface Receivable {
  id: string
  client: string
  amount: number
  issueDate: string
  dueDate: string
  status: ReceivableStatus
}

type ReceivableSummaryCard = {
  title: string
  value: string
  description: string
  delta?: string
  deltaTone: "positive" | "negative" | "neutral"
  icon: LucideIcon
  accent: string
  valueClass: string
}

type ReceivableSummary = {
  summaryCards: readonly ReceivableSummaryCard[]
  paid: number
  pending: number
}

const mockReceivables: Receivable[] = [
  {
    id: "1",
    client: "Empresa ABC Ltda",
    amount: 15000,
    issueDate: "2025-09-15",
    dueDate: "2025-10-15",
    status: "paid",
  },
  {
    id: "2",
    client: "Tech Solutions Inc",
    amount: 8500,
    issueDate: "2025-09-20",
    dueDate: "2025-10-20",
    status: "pending",
  },
  {
    id: "3",
    client: "Comércio XYZ",
    amount: 3200,
    issueDate: "2025-08-10",
    dueDate: "2025-09-10",
    status: "overdue",
  },
  {
    id: "4",
    client: "Indústria Beta",
    amount: 22000,
    issueDate: "2025-09-25",
    dueDate: "2025-11-25",
    status: "pending",
  },
  {
    id: "5",
    client: "Serviços Gamma",
    amount: 5800,
    issueDate: "2025-08-05",
    dueDate: "2025-09-05",
    status: "overdue",
  },
]

export function getReceivablesSummary(): ReceivableSummary {
  const totalReceivable = mockReceivables.reduce((sum, item) => sum + item.amount, 0)
  const paid = mockReceivables.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0)
  const pending = mockReceivables.filter((item) => item.status === "pending").reduce((sum, item) => sum + item.amount, 0)
  const overdue = mockReceivables
    .filter((item) => item.status === "overdue")
    .reduce((sum, item) => sum + item.amount, 0)
  const next30Days = mockReceivables
    .filter((item) => {
      const dueDate = new Date(item.dueDate)
      const today = new Date()
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays >= 0 && item.status === "pending"
    })
    .reduce((sum, item) => sum + item.amount, 0)
  const future = mockReceivables
    .filter((item) => {
      const dueDate = new Date(item.dueDate)
      const today = new Date()
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays > 30 && item.status === "pending"
    })
    .reduce((sum, item) => sum + item.amount, 0)
  const defaultRate = totalReceivable > 0 ? ((overdue / totalReceivable) * 100).toFixed(1) : "0.0"

  const summaryCards: ReceivableSummaryCard[] = [
    {
      title: "Total a receber",
      value: formatCurrency(totalReceivable),
      description: `${mockReceivables.length} faturas ativas`,
      delta: "+14% YoY",
      deltaTone: "positive",
      icon: ArrowUpRight,
      accent: "bg-primary/10 text-primary",
      valueClass: "text-foreground",
    },
    {
      title: "Vencidos",
      value: formatCurrency(overdue),
      description: "Exige contato rápido",
      delta: "+R$ 8,4 mil",
      deltaTone: "negative",
      icon: AlertCircle,
      accent: "bg-rose-100 text-rose-600",
      valueClass: "text-rose-600",
    },
    {
      title: "Próx. 30 dias",
      value: formatCurrency(next30Days),
      description: "Programadas para o mês",
      delta: "+2 novos clientes",
      deltaTone: "positive",
      icon: CalendarClock,
      accent: "bg-blue-100 text-blue-600",
      valueClass: "text-foreground",
    },
    {
      title: "Futuros (+30d)",
      value: formatCurrency(future),
      description: "Recebimentos planejados",
      delta: "+R$ 22 mil",
      deltaTone: "neutral",
      icon: TrendingUp,
      accent: "bg-indigo-100 text-indigo-600",
      valueClass: "text-foreground",
    },
    {
      title: "Taxa inadimplência",
      value: `${defaultRate}%`,
      description: "Meta confortável: até 5%",
      delta: "-1,2 p.p.",
      deltaTone: "positive",
      icon: Sparkles,
      accent: "bg-emerald-100 text-emerald-600",
      valueClass: "text-foreground",
    },
  ]

  return { summaryCards, paid, pending }
}

export function AccountsReceivable({ showSummary = true, showHeader = true }: { showSummary?: boolean; showHeader?: boolean }) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReceivables = mockReceivables.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesSearch = item.client.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const { summaryCards, paid, pending } = getReceivablesSummary()

  const getStatusBadge = (status: ReceivableStatus) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="border-transparent bg-emerald-100 text-emerald-600">
            Recebido
          </Badge>
        )
      case "pending":
        return (
          <Badge className="border-transparent bg-amber-100 text-amber-600">A vencer</Badge>
        )
      case "overdue":
        return <Badge className="border-transparent bg-rose-100 text-rose-600">Vencido</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {showHeader && (
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit border-transparent bg-secondary/60 px-4 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-secondary-foreground/80">
            Recebimentos
          </Badge>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">Orquestre o ciclo de entrada com previsibilidade</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Analise performance por status, reduza inadimplência e mantenha o relacionamento saudável com clientes estratégicos.
          </p>
        </div>
      )}

      {showSummary && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {summaryCards.map((card) => (
            <Card
              key={card.title}
              className="group border-white/60 bg-gradient-to-br from-white/95 via-white/90 to-indigo-50/70 p-6 shadow-[0_36px_120px_-80px_rgba(16,27,55,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_40px_120px_-72px_rgba(16,27,55,0.58)] dark:border-white/10 dark:from-card/85 dark:via-card/80 dark:to-card/80"
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
                    impacto direto no fluxo
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="rounded-3xl border-white/60 bg-white/90 shadow-none transition-none hover:translate-y-0 hover:shadow-none dark:border-white/10 dark:bg-card/85">
        <CardHeader className="px-0">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold text-foreground">Faturas a Receber</CardTitle>
              <p className="text-sm text-muted-foreground">Filtre, organize e acompanhe cada cobrança com clareza.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  className="pl-10 sm:w-[220px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="paid">Recebido</SelectItem>
                  <SelectItem value="pending">A vencer</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="hidden md:table-cell">Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceivables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    Nenhuma fatura encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredReceivables.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-foreground">{item.client}</TableCell>
                    <TableCell className="font-semibold text-foreground/90">{formatCurrency(item.amount)}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {new Date(item.issueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.dueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-full bg-primary/5 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Check className="h-4 w-4" />
                            Marcar como recebido
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Mail className="h-4 w-4" />
                            Enviar lembrete
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Edit className="h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="rounded-3xl border-dashed border-primary/30 bg-primary/5 p-6 shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-base font-semibold text-primary">Mix de receitas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 text-sm text-primary/80">
            <p>
              <span className="font-semibold text-primary">{formatCurrency(paid)}</span> já confirmados este mês, com foco em contratos enterprise.
            </p>
            <p>
              <Signal className="mr-2 inline h-4 w-4" /> {formatCurrency(pending)} aguardando aprovação financeira.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-dashed border-emerald-300/60 bg-emerald-50/60 p-6 shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-base font-semibold text-emerald-700">Ações sugeridas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-0 text-sm text-emerald-700">
            <div className="flex items-start gap-2">
              <Radar className="mt-0.5 h-4 w-4" />
              <span>Envie lembretes automáticos para clientes com vencimento nos próximos 5 dias.</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4" />
              <span>Negocie antecipação de recebíveis com instituições parceiras para manter o ciclo abaixo de 30 dias.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
