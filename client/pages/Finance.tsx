import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIAssistant from "@/components/AIAssistant";
import {
  Plus,
  Search,
  DollarSign,
  Edit,
  Trash2,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calculator,
  PieChart,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Eye,
  Target,
  FileSpreadsheet,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'check';
  status: 'completed' | 'pending' | 'cancelled';
  reference?: string;
  tags: string[];
}

interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  status: 'on_track' | 'behind' | 'achieved';
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "Sales Revenue",
    description: "Invoice payment from Tech Solutions Ltd",
    amount: 14903.01,
    date: "2024-01-15",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "INV-2024-001",
    tags: ["wholesale", "recurring"]
  },
  {
    id: "2",
    type: "expense",
    category: "Office Supplies",
    description: "Computer equipment purchase",
    amount: 2500.00,
    date: "2024-01-14",
    paymentMethod: "card",
    status: "completed",
    reference: "PO-2024-001",
    tags: ["equipment", "office"]
  },
  {
    id: "3",
    type: "income",
    category: "Sales Revenue",
    description: "Retail sales - John Smith",
    amount: 975.42,
    date: "2024-01-20",
    paymentMethod: "card",
    status: "completed",
    reference: "INV-2024-002",
    tags: ["retail"]
  },
  {
    id: "4",
    type: "expense",
    category: "Marketing",
    description: "Social media advertising campaign",
    amount: 1200.00,
    date: "2024-01-18",
    paymentMethod: "card",
    status: "pending",
    tags: ["marketing", "advertising"]
  },
  {
    id: "5",
    type: "expense",
    category: "Utilities",
    description: "Monthly electricity bill",
    amount: 450.75,
    date: "2024-01-10",
    paymentMethod: "bank_transfer",
    status: "completed",
    reference: "UTIL-2024-001",
    tags: ["utilities", "recurring"]
  }
];

const mockGoals: FinancialGoal[] = [
  {
    id: "1",
    title: "Q1 Revenue Target",
    targetAmount: 150000,
    currentAmount: 87500,
    deadline: "2024-03-31",
    category: "Revenue",
    status: "on_track"
  },
  {
    id: "2",
    title: "Emergency Fund",
    targetAmount: 50000,
    currentAmount: 32000,
    deadline: "2024-06-30",
    category: "Savings",
    status: "behind"
  },
  {
    id: "3",
    title: "Equipment Upgrade Budget",
    targetAmount: 25000,
    currentAmount: 25000,
    deadline: "2024-02-15",
    category: "Capital",
    status: "achieved"
  }
];

const cashFlowData = [
  { month: 'Jan', income: 1, expenses: 2, profit: 3,},
  { month: 'Feb', income: 4, expenses: 5, profit: 6 },
  { month: 'Mar', income: 8, expenses: 8, profit: 90 },
  { month: 'Apr', income: 12, expenses: 11, profit: 12 },
  { month: 'May', income: 160, expenses: 14, profit: 15 },
  { month: 'Jun', income: 20, expenses: 17, profit: 18 },
  { month: 'Jul', income: 24, expenses: 200, profit: 21 },
  { month: 'Aug', income: 280, expenses: 23, profit: 24 },
  { month: 'Sep', income: 32, expenses: 26, profit: 27 },
  { month: 'Okt', income: 36, expenses: 290, profit: 30 },
  { month: 'Nov', income: 40, expenses: 32, profit: 33 },
  { month: 'Dec', income: 44, expenses: 35, profit: 360 },


];

const expenseCategories = [
  { name: 'Office Supplies', value: 15000, color: '#0088FE' },
  { name: 'Marketing', value: 8000, color: '#00C49F' },
  { name: 'Utilities', value: 5400, color: '#FFBB28' },
  { name: 'Equipment', value: 12000, color: '#FF8042' },
  { name: 'Travel', value: 3200, color: '#8884d8' },
];

export default function Finance() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [goals, setGoals] = useState(mockGoals);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [isViewTransactionOpen, setIsViewTransactionOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    type: "income",
    category: "",
    description: "",
    amount: 0,
    paymentMethod: "cash",
    tags: [],
  });
  const [newGoal, setNewGoal] = useState<Partial<FinancialGoal>>({
    title: "",
    targetAmount: 0,
    currentAmount: 0,
    category: "",
    deadline: "",
  });
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getGoalStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <Badge variant="default" className="bg-green-100 text-green-800">On Track</Badge>;
      case 'behind':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Behind</Badge>;
      case 'achieved':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Achieved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const clearNewTransaction = () => {
    setNewTransaction({
      type: "income",
      category: "",
      description: "",
      amount: 0,
      paymentMethod: "cash",
      reference: "",
      tags: [],
    });
  };

  const clearNewGoal = () => {
    setNewGoal({
      title: "",
      targetAmount: 0,
      currentAmount: 0,
      category: "",
      deadline: "",
    });
  };

  const addTransaction = () => {
    if (!newTransaction.category || !newTransaction.description || !newTransaction.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      type: newTransaction.type as 'income' | 'expense',
      category: newTransaction.category!,
      description: newTransaction.description!,
      amount: newTransaction.amount!,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: newTransaction.paymentMethod as any,
      status: 'completed',
      reference: newTransaction.reference,
      tags: newTransaction.tags || [],
    };

    setTransactions([transaction, ...transactions]);
    clearNewTransaction();
    setIsAddTransactionOpen(false);

    toast({
      title: "Transaction added",
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} of $${transaction.amount} has been recorded.`,
    });
  };

  const updateTransaction = () => {
    if (!selectedTransaction || !newTransaction.category || !newTransaction.description || !newTransaction.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedTransaction: Transaction = {
      ...selectedTransaction,
      type: newTransaction.type as 'income' | 'expense',
      category: newTransaction.category!,
      description: newTransaction.description!,
      amount: newTransaction.amount!,
      paymentMethod: newTransaction.paymentMethod as any,
      reference: newTransaction.reference,
      tags: newTransaction.tags || [],
    };

    setTransactions(transactions.map(t => t.id === selectedTransaction.id ? updatedTransaction : t));
    clearNewTransaction();
    setIsEditTransactionOpen(false);
    setSelectedTransaction(null);

    toast({
      title: "Transaction updated",
      description: "Transaction has been updated successfully.",
    });
  };

  const deleteTransaction = (transactionId: string) => {
    const transaction = transactions.find(t => t.id === transactionId);
    setTransactions(transactions.filter(t => t.id !== transactionId));
    
    toast({
      title: "Transaction deleted",
      description: `Transaction "${transaction?.description}" has been removed.`,
    });
  };

  const openEditTransactionDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setNewTransaction({
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      reference: transaction.reference,
      tags: transaction.tags,
    });
    setIsEditTransactionOpen(true);
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const goal: FinancialGoal = {
      id: Date.now().toString(),
      title: newGoal.title!,
      targetAmount: newGoal.targetAmount!,
      currentAmount: newGoal.currentAmount || 0,
      deadline: newGoal.deadline!,
      category: newGoal.category || 'General',
      status: 'on_track',
    };

    setGoals([...goals, goal]);
    clearNewGoal();
    setIsAddGoalOpen(false);

    toast({
      title: "Goal created",
      description: `Financial goal "${goal.title}" has been created.`,
    });
  };

  const updateGoal = () => {
    if (!selectedGoal || !newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedGoal: FinancialGoal = {
      ...selectedGoal,
      title: newGoal.title!,
      targetAmount: newGoal.targetAmount!,
      currentAmount: newGoal.currentAmount || selectedGoal.currentAmount,
      deadline: newGoal.deadline!,
      category: newGoal.category || 'General',
    };

    setGoals(goals.map(g => g.id === selectedGoal.id ? updatedGoal : g));
    clearNewGoal();
    setIsEditGoalOpen(false);
    setSelectedGoal(null);

    toast({
      title: "Goal updated",
      description: `Goal "${updatedGoal.title}" has been updated.`,
    });
  };

  const deleteGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    setGoals(goals.filter(g => g.id !== goalId));
    
    toast({
      title: "Goal deleted",
      description: `Goal "${goal?.title}" has been removed.`,
    });
  };

  const openEditGoalDialog = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setNewGoal({
      title: goal.title,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      category: goal.category,
      deadline: goal.deadline,
    });
    setIsEditGoalOpen(true);
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportFinanceReport = (format: 'pdf' | 'excel' | 'csv') => {
    const reportData = {
      reportType: 'Financial Report',
      generatedAt: new Date().toISOString(),
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin,
        pendingTransactions: transactions.filter(t => t.status === 'pending').length
      },
      transactions: filteredTransactions,
      goals,
      cashFlowData,
      expenseCategories
    };

    switch (format) {
      case 'pdf':
        downloadFile(generateFinancePDFContent(reportData), 'financial-report.pdf', 'application/pdf');
        break;
      case 'excel':
        downloadFile(generateFinanceExcelContent(reportData), 'financial-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        break;
      case 'csv':
        downloadFile(generateFinanceCSVContent(reportData), 'financial-report.csv', 'text/csv');
        break;
    }

    toast({
      title: "Financial Report Exported",
      description: `Financial report has been exported as ${format.toUpperCase()} and downloaded.`,
    });
  };

  const exportTransactions = () => {
    let csv = 'Date,Type,Category,Description,Amount,Payment Method,Status,Reference,Tags\n';
    filteredTransactions.forEach(transaction => {
      csv += `${transaction.date},${transaction.type},${transaction.category},"${transaction.description}",${transaction.amount},${transaction.paymentMethod.replace('_', ' ')},${transaction.status},${transaction.reference || ''},"${transaction.tags.join(', ')}"\n`;
    });

    downloadFile(csv, 'transactions.csv', 'text/csv');
    toast({
      title: "Transactions Exported",
      description: "Transaction data has been exported as CSV.",
    });
  };

  const exportGoals = () => {
    let csv = 'Title,Target Amount,Current Amount,Progress %,Deadline,Category,Status\n';
    goals.forEach(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      csv += `"${goal.title}",${goal.targetAmount},${goal.currentAmount},${progress.toFixed(1)},${goal.deadline},${goal.category},${goal.status}\n`;
    });

    downloadFile(csv, 'financial-goals.csv', 'text/csv');
    toast({
      title: "Goals Exported",
      description: "Financial goals data has been exported as CSV.",
    });
  };

  const generateFinancePDFContent = (data: any) => {
    return `
FINANCIAL REPORT
================
Generated: ${new Date(data.generatedAt).toLocaleString()}

EXECUTIVE SUMMARY
=================
Total Income: $${data.summary.totalIncome.toLocaleString()}
Total Expenses: $${data.summary.totalExpenses.toLocaleString()}
Net Profit: $${data.summary.netProfit.toLocaleString()}
Profit Margin: ${data.summary.profitMargin.toFixed(1)}%
Pending Transactions: ${data.summary.pendingTransactions}

CASH FLOW ANALYSIS
==================
${data.cashFlowData.map((item: any) => `${item.month}: Income $${item.income.toLocaleString()}, Expenses $${item.expenses.toLocaleString()}, Profit $${item.profit.toLocaleString()}`).join('\n')}

EXPENSE BREAKDOWN
=================
${data.expenseCategories.map((cat: any) => `${cat.name}: $${cat.value.toLocaleString()}`).join('\n')}

FINANCIAL GOALS
===============
${data.goals.map((goal: any) => `${goal.title}: $${goal.currentAmount.toLocaleString()}/$${goal.targetAmount.toLocaleString()} (${((goal.currentAmount/goal.targetAmount)*100).toFixed(1)}%) - ${goal.status}`).join('\n')}

RECENT TRANSACTIONS
===================
${data.transactions.slice(0, 20).map((t: any) => `${t.date} - ${t.type.toUpperCase()}: ${t.description} - $${t.amount.toLocaleString()}`).join('\n')}
    `;
  };

  const generateFinanceExcelContent = (data: any) => {
    return generateFinanceCSVContent(data);
  };

  const generateFinanceCSVContent = (data: any) => {
    let csv = '';

    // Summary
    csv += 'Financial Summary\n';
    csv += `Generated,${new Date(data.generatedAt).toLocaleString()}\n`;
    csv += '\n';
    csv += 'Metric,Amount\n';
    csv += `Total Income,$${data.summary.totalIncome.toLocaleString()}\n`;
    csv += `Total Expenses,$${data.summary.totalExpenses.toLocaleString()}\n`;
    csv += `Net Profit,$${data.summary.netProfit.toLocaleString()}\n`;
    csv += `Profit Margin,${data.summary.profitMargin.toFixed(1)}%\n`;
    csv += `Pending Transactions,${data.summary.pendingTransactions}\n`;
    csv += '\n';

    // Cash Flow
    csv += 'Monthly Cash Flow\n';
    csv += 'Month,Income,Expenses,Profit\n';
    data.cashFlowData.forEach((item: any) => {
      csv += `${item.month},$${item.income.toLocaleString()},$${item.expenses.toLocaleString()},$${item.profit.toLocaleString()}\n`;
    });
    csv += '\n';

    // Expense Categories
    csv += 'Expense Categories\n';
    csv += 'Category,Amount\n';
    data.expenseCategories.forEach((cat: any) => {
      csv += `${cat.name},$${cat.value.toLocaleString()}\n`;
    });
    csv += '\n';

    // Financial Goals
    csv += 'Financial Goals\n';
    csv += 'Title,Target Amount,Current Amount,Progress %,Deadline,Category,Status\n';
    data.goals.forEach((goal: any) => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      csv += `"${goal.title}",$${goal.targetAmount.toLocaleString()},$${goal.currentAmount.toLocaleString()},${progress.toFixed(1)}%,${goal.deadline},${goal.category},${goal.status}\n`;
    });
    csv += '\n';

    // Transactions
    csv += 'Transactions\n';
    csv += 'Date,Type,Category,Description,Amount,Payment Method,Status,Reference,Tags\n';
    data.transactions.forEach((transaction: any) => {
      csv += `${transaction.date},${transaction.type},${transaction.category},"${transaction.description}",$${transaction.amount.toLocaleString()},${transaction.paymentMethod.replace('_', ' ')},${transaction.status},${transaction.reference || ''},"${transaction.tags.join(', ')}"\n`;
    });

    return csv;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Management</h1>
          <p className="text-muted-foreground">Track income, expenses, and financial goals</p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Export Financial Report</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 space-y-1">
                <div className="text-xs text-muted-foreground mb-2">
                  Comprehensive financial report including transactions, cash flow analysis, expense breakdown, and goal tracking.
                </div>
                <DropdownMenuItem onClick={() => exportFinanceReport('pdf')} className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">PDF Financial Report</div>
                    <div className="text-xs text-muted-foreground">Executive financial summary with charts</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportFinanceReport('excel')} className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Excel Workbook</div>
                    <div className="text-xs text-muted-foreground">Detailed transactions and analytics</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportFinanceReport('csv')} className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">CSV Transaction Data</div>
                    <div className="text-xs text-muted-foreground">Raw transaction data for analysis</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => exportTransactions()} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Transactions Only</div>
                    <div className="text-xs text-muted-foreground">Export filtered transaction list</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportGoals()} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Financial Goals</div>
                    <div className="text-xs text-muted-foreground">Export goals and progress data</div>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Transaction</DialogTitle>
                <DialogDescription>
                  Record a new income or expense transaction.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Transaction Type</Label>
                  <Select 
                    value={newTransaction.type} 
                    onValueChange={(value) => setNewTransaction({...newTransaction, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Sales Revenue, Office Supplies"
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Transaction description"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select 
                      value={newTransaction.paymentMethod} 
                      onValueChange={(value) => setNewTransaction({...newTransaction, paymentMethod: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference">Reference (Optional)</Label>
                  <Input
                    id="reference"
                    placeholder="e.g., INV-2024-001"
                    value={newTransaction.reference || ""}
                    onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={addTransaction}>
                    Add Transaction
                  </Button>
                  <Button variant="outline" onClick={() => {
                    clearNewTransaction();
                    setIsAddTransactionOpen(false);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${netProfit.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {profitMargin.toFixed(1)}% profit margin
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          <TabsTrigger value="goals">Financial Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Sales Revenue">Sales Revenue</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'} 
                               className={transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.description}</div>
                          {transaction.reference && (
                            <div className="text-sm text-muted-foreground">Ref: {transaction.reference}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setIsViewTransactionOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditTransactionDialog(transaction)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteTransaction(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {/* Reports & Analytics */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Trend</CardTitle>
                <CardDescription>Monthly income vs expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={2} />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={expenseCategories}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
              <CardDescription>Income, expenses, and profit comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#22c55e" />
                  <Bar dataKey="expenses" fill="#ef4444" />
                  <Bar dataKey="profit" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          {/* Financial Goals */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Financial Goals</h3>
              <p className="text-sm text-muted-foreground">Track your financial objectives and progress</p>
            </div>
            <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Financial Goal</DialogTitle>
                  <DialogDescription>
                    Set a new financial target to track your progress.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goalTitle">Goal Title</Label>
                    <Input
                      id="goalTitle"
                      placeholder="e.g., Q2 Revenue Target"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="targetAmount">Target Amount ($)</Label>
                      <Input
                        id="targetAmount"
                        type="number"
                        placeholder="0.00"
                        value={newGoal.targetAmount}
                        onChange={(e) => setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentAmount">Current Amount ($)</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        placeholder="0.00"
                        value={newGoal.currentAmount}
                        onChange={(e) => setNewGoal({...newGoal, currentAmount: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goalCategory">Category</Label>
                      <Input
                        id="goalCategory"
                        placeholder="e.g., Revenue, Savings, Capital"
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="flex-1" onClick={addGoal}>
                      Create Goal
                    </Button>
                    <Button variant="outline" onClick={() => {
                      clearNewGoal();
                      setIsAddGoalOpen(false);
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <Card key={goal.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{goal.title}</span>
                    {getGoalStatusBadge(goal.status)}
                  </CardTitle>
                  <CardDescription>{goal.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="font-semibold">${goal.currentAmount.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Target</p>
                        <p className="font-semibold">${goal.targetAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Deadline: {goal.deadline}
                    </div>
                    <div className="flex gap-1 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => openEditGoalDialog(goal)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Transaction Dialog */}
      <Dialog open={isEditTransactionOpen} onOpenChange={setIsEditTransactionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Update the transaction information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-type">Transaction Type</Label>
              <Select 
                value={newTransaction.type} 
                onValueChange={(value) => setNewTransaction({...newTransaction, type: value as any})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Amount ($)</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({...newTransaction, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paymentMethod">Payment Method</Label>
                <Select 
                  value={newTransaction.paymentMethod} 
                  onValueChange={(value) => setNewTransaction({...newTransaction, paymentMethod: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reference">Reference</Label>
              <Input
                id="edit-reference"
                value={newTransaction.reference || ""}
                onChange={(e) => setNewTransaction({...newTransaction, reference: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={updateTransaction}>
                Update Transaction
              </Button>
              <Button variant="outline" onClick={() => {
                clearNewTransaction();
                setIsEditTransactionOpen(false);
                setSelectedTransaction(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Transaction Dialog */}
      <Dialog open={isViewTransactionOpen} onOpenChange={setIsViewTransactionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <Badge variant={selectedTransaction.type === 'income' ? 'default' : 'secondary'} 
                         className={selectedTransaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedTransaction.type === 'income' ? 'Income' : 'Expense'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className={`text-lg font-bold ${selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toLocaleString()}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="font-medium">{selectedTransaction.description}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div>{selectedTransaction.category}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div>{selectedTransaction.date}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Payment Method</div>
                  <div className="capitalize">{selectedTransaction.paymentMethod.replace('_', ' ')}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div>{getStatusBadge(selectedTransaction.status)}</div>
                </div>
              </div>
              {selectedTransaction.reference && (
                <div>
                  <div className="text-sm text-muted-foreground">Reference</div>
                  <div className="font-mono text-sm">{selectedTransaction.reference}</div>
                </div>
              )}
              {selectedTransaction.tags.length > 0 && (
                <div>
                  <div className="text-sm text-muted-foreground">Tags</div>
                  <div className="flex gap-1 flex-wrap">
                    {selectedTransaction.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditGoalOpen} onOpenChange={setIsEditGoalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Financial Goal</DialogTitle>
            <DialogDescription>
              Update the goal information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-goalTitle">Goal Title</Label>
              <Input
                id="edit-goalTitle"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-targetAmount">Target Amount ($)</Label>
                <Input
                  id="edit-targetAmount"
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-currentAmount">Current Amount ($)</Label>
                <Input
                  id="edit-currentAmount"
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({...newGoal, currentAmount: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-deadline">Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-goalCategory">Category</Label>
                <Input
                  id="edit-goalCategory"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={updateGoal}>
                Update Goal
              </Button>
              <Button variant="outline" onClick={() => {
                clearNewGoal();
                setIsEditGoalOpen(false);
                setSelectedGoal(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Assistant */}
      <AIAssistant context="finance" />
    </div>
  );
}
