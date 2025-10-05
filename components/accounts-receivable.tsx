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
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  TrendingUp,
  MoreVertical,
  Check,
  Edit,
  Trash2,
  Mail,
  Search,
} from "lucide-react"
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

export function AccountsReceivable() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredReceivables = mockReceivables.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesSearch = item.client.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const totalReceivable = mockReceivables.reduce((sum, item) => sum + item.amount, 0)
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

  const getStatusBadge = (status: ReceivableStatus) => {
    switch (status) {
      case "paid":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20">
            Recebido
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20">A Vencer</Badge>
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
            <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalReceivable)}</div>
            <p className="text-xs text-muted-foreground mt-1">{mockReceivables.length} faturas</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md border-red-200 dark:border-red-900/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(overdue)}</div>
            <p className="text-xs text-muted-foreground mt-1">Requer atenção</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximos 30 Dias</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(next30Days)}</div>
            <p className="text-xs text-muted-foreground mt-1">A vencer em breve</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Futuros (30+ dias)</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(future)}</div>
            <p className="text-xs text-muted-foreground mt-1">Recebimentos futuros</p>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Inadimplência</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaultRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Do total a receber</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Faturas a Receber</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar cliente..."
                  className="pl-8 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="paid">Recebido</SelectItem>
                  <SelectItem value="pending">A Vencer</SelectItem>
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
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="hidden md:table-cell">Data de Emissão</TableHead>
                  <TableHead>Vencimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceivables.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhuma fatura encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceivables.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{item.client}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(item.amount)}</TableCell>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8">
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
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
