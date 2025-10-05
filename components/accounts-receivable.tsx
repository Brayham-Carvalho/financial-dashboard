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
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
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
          <Badge className="border-transparent bg-emerald-100/60 text-emerald-600">
            Recebido
          </Badge>
        )
      case "pending":
        return (
          <Badge className="border-transparent bg-amber-100/60 text-amber-600">A vencer</Badge>
        )
      case "overdue":
        return <Badge className="border-transparent bg-red-100/65 text-red-600">Vencido</Badge>
    }
  }

  const summaryCards = [
    {
      title: "Total a receber",
      value: formatCurrency(totalReceivable),
      description: `${mockReceivables.length} faturas ativas`,
      icon: ArrowUpRight,
      accent: "bg-primary/15 text-primary",
      valueClass: "text-foreground",
    },
    {
      title: "Vencidos",
      value: formatCurrency(overdue),
      description: "Requer atenção imediata",
      icon: AlertCircle,
      accent: "bg-red-100/65 text-red-600",
      valueClass: "text-red-600",
    },
    {
      title: "Próx. 30 dias",
      value: formatCurrency(next30Days),
      description: "A vencer em breve",
      icon: CalendarClock,
      accent: "bg-amber-100/60 text-amber-600",
      valueClass: "text-foreground",
    },
    {
      title: "Futuros (+30d)",
      value: formatCurrency(future),
      description: "Recebimentos planejados",
      icon: TrendingUp,
      accent: "bg-blue-100/60 text-blue-600",
      valueClass: "text-foreground",
    },
    {
      title: "Taxa inadimplência",
      value: `${defaultRate}%`,
      description: "Meta confortável: até 5%",
      icon: Sparkles,
      accent: "bg-purple-100/60 text-purple-600",
      valueClass: "text-foreground",
    },
  ] as const

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted-foreground">Recebimentos</p>
        <h3 className="text-2xl font-semibold text-foreground">Visualize o pipeline das suas entradas com serenidade</h3>
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
    </div>
  )
}
