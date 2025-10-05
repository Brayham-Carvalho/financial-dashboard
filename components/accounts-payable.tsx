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
  ArrowDownRight,
  CalendarCheck,
  Check,
  Edit,
  MoreVertical,
  Percent,
  PiggyBank,
  ReceiptText,
  Recycle,
  Search,
  ShieldCheck,
  Trash2,
  TrendingDown,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { formatCurrency } from "@/lib/format"

type PayableStatus = "paid" | "pending" | "overdue"
type PayableCategory = "suppliers" | "services" | "rent" | "utilities" | "salaries" | "other"

interface Payable {
  id: string
  supplier: string
  amount: number
  issueDate: string
  dueDate: string
  category: PayableCategory
  status: PayableStatus
  hasDiscount?: boolean
}

type PayableSummaryCard = {
  title: string
  value: string
  description: string
  delta?: string
  deltaTone: "positive" | "negative" | "neutral"
  icon: LucideIcon
  accent: string
  valueClass: string
}

type PayableSummary = {
  summaryCards: readonly PayableSummaryCard[]
  paid: number
  pending: number
}

const mockPayables: Payable[] = [
  {
    id: "1",
    supplier: "Fornecedor Alpha",
    amount: 12000,
    issueDate: "2025-09-10",
    dueDate: "2025-10-10",
    category: "suppliers",
    status: "paid",
  },
  {
    id: "2",
    supplier: "Serviços de TI Beta",
    amount: 4500,
    issueDate: "2025-09-15",
    dueDate: "2025-10-15",
    category: "services",
    status: "pending",
    hasDiscount: true,
  },
  {
    id: "3",
    supplier: "Aluguel Escritório",
    amount: 8000,
    issueDate: "2025-08-01",
    dueDate: "2025-09-01",
    category: "rent",
    status: "overdue",
  },
  {
    id: "4",
    supplier: "Energia Elétrica",
    amount: 1200,
    issueDate: "2025-09-20",
    dueDate: "2025-10-20",
    category: "utilities",
    status: "pending",
  },
  {
    id: "5",
    supplier: "Folha de Pagamento",
    amount: 45000,
    issueDate: "2025-09-25",
    dueDate: "2025-10-05",
    category: "salaries",
    status: "pending",
  },
]

const categoryLabels: Record<PayableCategory, string> = {
  suppliers: "Fornecedores",
  services: "Serviços",
  rent: "Aluguel",
  utilities: "Utilidades",
  salaries: "Salários",
  other: "Outros",
}

export function getPayablesSummary(): PayableSummary {
  const totalPayable = mockPayables.reduce((sum, item) => sum + item.amount, 0)
  const paid = mockPayables.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0)
  const pending = mockPayables.filter((item) => item.status === "pending").reduce((sum, item) => sum + item.amount, 0)
  const overdue = mockPayables.filter((item) => item.status === "overdue").reduce((sum, item) => sum + item.amount, 0)
  const next30Days = mockPayables
    .filter((item) => {
      const dueDate = new Date(item.dueDate)
      const today = new Date()
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays <= 30 && diffDays >= 0 && item.status === "pending"
    })
    .reduce((sum, item) => sum + item.amount, 0)
  const future = mockPayables
    .filter((item) => {
      const dueDate = new Date(item.dueDate)
      const today = new Date()
      const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return diffDays > 30 && item.status === "pending"
    })
    .reduce((sum, item) => sum + item.amount, 0)
  const discountSavings = mockPayables
    .filter((item) => item.hasDiscount)
    .reduce((sum, item) => sum + item.amount * 0.05, 0)

  const summaryCards: PayableSummaryCard[] = [
    {
      title: "Total a pagar",
      value: formatCurrency(totalPayable),
      description: `${mockPayables.length} contas ativas`,
      delta: "+9% YoY",
      deltaTone: "neutral",
      icon: ArrowDownRight,
      accent: "bg-primary/10 text-primary",
      valueClass: "text-foreground",
    },
    {
      title: "Vencidos",
      value: formatCurrency(overdue),
      description: "Prioridade máxima",
      delta: "+R$ 6,2 mil",
      deltaTone: "negative",
      icon: AlertCircle,
      accent: "bg-rose-100 text-rose-600",
      valueClass: "text-rose-600",
    },
    {
      title: "Próx. 30 dias",
      value: formatCurrency(next30Days),
      description: "Planeje seus pagamentos",
      delta: "-12% vs. plano",
      deltaTone: "positive",
      icon: CalendarCheck,
      accent: "bg-blue-100 text-blue-600",
      valueClass: "text-foreground",
    },
    {
      title: "Futuros (+30d)",
      value: formatCurrency(future),
      description: "Compromissos agendados",
      delta: "+R$ 9 mil",
      deltaTone: "neutral",
      icon: TrendingDown,
      accent: "bg-indigo-100 text-indigo-600",
      valueClass: "text-foreground",
    },
    {
      title: "Economia c/ descontos",
      value: formatCurrency(discountSavings),
      description: "Antecipações vantajosas",
      delta: "+3 fornecedores",
      deltaTone: "positive",
      icon: PiggyBank,
      accent: "bg-emerald-100 text-emerald-600",
      valueClass: "text-emerald-600",
    },
  ]

  return { summaryCards, paid, pending }
}

export function AccountsPayable({ showSummary = true, showHeader = true }: { showSummary?: boolean; showHeader?: boolean }) {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPayables = mockPayables.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesSearch = item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const { summaryCards, paid, pending } = getPayablesSummary()

  const getStatusBadge = (status: PayableStatus) => {
    switch (status) {
      case "paid":
        return <Badge className="border-transparent bg-emerald-100 text-emerald-600">Pago</Badge>
      case "pending":
        return <Badge className="border-transparent bg-amber-100 text-amber-600">Pendente</Badge>
      case "overdue":
        return <Badge className="border-transparent bg-rose-100 text-rose-600">Vencido</Badge>
    }
  }

  return (
    <div className="space-y-8">
      {showHeader && (
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit border-transparent bg-secondary/60 px-4 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-secondary-foreground/80">
            Despesas
          </Badge>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">Controle compromissos com cadência previsível</h3>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Centralize fornecedores, identifique oportunidades de desconto e mantenha o caixa protegido de surpresas.
          </p>
        </div>
      )}

      {showSummary && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
                    ajuste projetado
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
              <CardTitle className="text-xl font-semibold text-foreground">Contas a Pagar</CardTitle>
              <p className="text-sm text-muted-foreground">Acione filtros rápidos e acompanhe cada compromisso financeiro.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fornecedor..."
                  className="pl-10 sm:w-[220px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas categorias</SelectItem>
                  <SelectItem value="suppliers">Fornecedores</SelectItem>
                  <SelectItem value="services">Serviços</SelectItem>
                  <SelectItem value="rent">Aluguel</SelectItem>
                  <SelectItem value="utilities">Utilidades</SelectItem>
                  <SelectItem value="salaries">Salários</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
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
                <TableHead>Fornecedor</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead className="hidden lg:table-cell">Emissão</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead className="hidden md:table-cell">Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayables.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Nenhuma conta encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredPayables.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold text-foreground">
                      <div className="flex items-center gap-2">
                        {item.supplier}
                        {item.hasDiscount && (
                          <Badge className="border-transparent bg-emerald-100 text-emerald-600">-5%</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-foreground/90">{formatCurrency(item.amount)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {new Date(item.issueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(item.dueDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="border-white/60 bg-white/60 text-foreground/80">
                        {categoryLabels[item.category]}
                      </Badge>
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
                            Marcar como pago
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Percent className="h-4 w-4" />
                            Negociar condição
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
            <CardTitle className="text-base font-semibold text-primary">Status de execução</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 px-0 text-sm text-primary/80">
            <p>
              <ShieldCheck className="mr-2 inline h-4 w-4" /> {formatCurrency(paid)} já liquidados no período, mantendo SLA médio de 2,1 dias.
            </p>
            <p>
              <ReceiptText className="mr-2 inline h-4 w-4" /> {formatCurrency(pending)} aguardando aprovação de diretoria financeira.
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-dashed border-amber-300/60 bg-amber-50/70 p-6 shadow-none">
          <CardHeader className="px-0">
            <CardTitle className="text-base font-semibold text-amber-700">Recomendações</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 px-0 text-sm text-amber-700">
            <div className="flex items-start gap-2">
              <Recycle className="mt-0.5 h-4 w-4" />
              <span>Renegocie contratos de serviços com reajuste anual acima de 12%.</span>
            </div>
            <div className="flex items-start gap-2">
              <Percent className="mt-0.5 h-4 w-4" />
              <span>Ative descontos automáticos para fornecedores com adiantamento positivo.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
