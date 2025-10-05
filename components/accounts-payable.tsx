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
  Search,
  Trash2,
  TrendingDown,
} from "lucide-react"
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

export function AccountsPayable() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPayables = mockPayables.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesSearch = item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesCategory && matchesSearch
  })

  const totalPayable = mockPayables.reduce((sum, item) => sum + item.amount, 0)
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

  const getStatusBadge = (status: PayableStatus) => {
    switch (status) {
      case "paid":
        return <Badge className="border-transparent bg-emerald-100/60 text-emerald-600">Pago</Badge>
      case "pending":
        return <Badge className="border-transparent bg-amber-100/60 text-amber-600">Pendente</Badge>
      case "overdue":
        return <Badge className="border-transparent bg-red-100/65 text-red-600">Vencido</Badge>
    }
  }

  const summaryCards = [
    {
      title: "Total a pagar",
      value: formatCurrency(totalPayable),
      description: `${mockPayables.length} contas ativas`,
      icon: ArrowDownRight,
      accent: "bg-primary/18 text-primary",
      valueClass: "text-foreground",
    },
    {
      title: "Vencidos",
      value: formatCurrency(overdue),
      description: "Prioridade máxima",
      icon: AlertCircle,
      accent: "bg-red-100/65 text-red-600",
      valueClass: "text-red-600",
    },
    {
      title: "Próx. 30 dias",
      value: formatCurrency(next30Days),
      description: "Planeje seus pagamentos",
      icon: CalendarCheck,
      accent: "bg-amber-100/60 text-amber-600",
      valueClass: "text-foreground",
    },
    {
      title: "Futuros (+30d)",
      value: formatCurrency(future),
      description: "Compromissos agendados",
      icon: TrendingDown,
      accent: "bg-blue-100/60 text-blue-600",
      valueClass: "text-foreground",
    },
    {
      title: "Economia c/ descontos",
      value: formatCurrency(discountSavings),
      description: "Antecipações vantajosas",
      icon: PiggyBank,
      accent: "bg-emerald-100/65 text-emerald-600",
      valueClass: "text-emerald-600",
    },
  ] as const

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Despesas</p>
        <h3 className="text-2xl font-semibold text-foreground">Oriente seus pagamentos com clareza e leveza visual</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl border-white/60 bg-white/90 shadow-none transition-none hover:translate-y-0 hover:shadow-none dark:border-white/10 dark:bg-card/85">
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
                          <Badge className="border-transparent bg-emerald-100/70 text-emerald-600">-5%</Badge>
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
    </div>
  )
}
