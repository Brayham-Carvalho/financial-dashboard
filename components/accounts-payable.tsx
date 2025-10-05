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
  ArrowDownRight,
  AlertCircle,
  Clock,
  TrendingDown,
  Percent,
  MoreVertical,
  Check,
  Calendar,
  Edit,
  Trash2,
  Search,
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
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20">
            Pago
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20">Pendente</Badge>
        )
      case "overdue":
        return <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20">Vencido</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPayable)}</div>
            <p className="text-xs text-muted-foreground mt-1">{mockPayables.length} contas</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md border-red-200 dark:border-red-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(overdue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Pagar urgente</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos 30 Dias</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(next30Days)}</div>
            <p className="text-xs text-muted-foreground mt-1">A pagar em breve</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Futuros (30+ dias)</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(future)}</div>
            <p className="text-xs text-muted-foreground mt-1">Pagamentos futuros</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md border-emerald-200 dark:border-emerald-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia c/ Descontos</CardTitle>
            <Percent className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(discountSavings)}</div>
            <p className="text-xs text-muted-foreground mt-1">Antecipações</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Contas a Pagar</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fornecedor..."
                  className="pl-8 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
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
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="overdue">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden lg:table-cell">Data de Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma conta encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayables.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {item.supplier}
                          {item.hasDiscount && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900"
                            >
                              -5%
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(item.amount)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {new Date(item.issueDate).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(item.dueDate).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">{categoryLabels[item.category]}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
                              <Calendar className="h-4 w-4" />
                              Agendar pagamento
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
