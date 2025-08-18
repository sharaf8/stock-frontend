import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AIAssistant from "@/components/AIAssistant";
import RBACDemo from "@/components/RBACDemo";
import UserCredentials from "@/components/UserCredentials";
import { useAuthStore } from "@/stores/authStore";

const salesData = [
  { name: "Jan", sales: 4000, profit: 2400 },
  { name: "Feb", sales: 3000, profit: 1398 },
  { name: "Mar", sales: 2000, profit: 9800 },
  { name: "Apr", sales: 2780, profit: 3908 },
  { name: "May", sales: 1890, profit: 4800 },
  { name: "Jun", sales: 2390, profit: 3800 },
];

const productCategories = [
  { name: "Electronics", value: 400, color: "#0088FE" },
  { name: "Clothing", value: 300, color: "#00C49F" },
  { name: "Food", value: 300, color: "#FFBB28" },
  { name: "Books", value: 200, color: "#FF8042" },
];

const lowStockItems = [
  { name: "iPhone 15 Pro", stock: 5, minRequired: 20 },
  { name: "Samsung Galaxy S24", stock: 3, minRequired: 15 },
  { name: "MacBook Air M3", stock: 2, minRequired: 10 },
];

interface RecentActivity {
  id: string;
  type: "sale" | "client" | "product" | "payment";
  description: string;
  amount?: number;
  time: string;
  status: "success" | "pending" | "failed";
}

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "sale",
    description: "New invoice created for Tech Solutions Ltd",
    amount: 14903.01,
    time: "2 hours ago",
    status: "success",
  },
  {
    id: "2",
    type: "payment",
    description: "Payment received from John Smith",
    amount: 975.42,
    time: "4 hours ago",
    status: "success",
  },
  {
    id: "3",
    type: "client",
    description: "New client registered: ABC Corp",
    time: "6 hours ago",
    status: "success",
  },
  {
    id: "4",
    type: "product",
    description: "Low stock alert: iPhone 15 Pro (5 remaining)",
    time: "8 hours ago",
    status: "pending",
  },
  {
    id: "5",
    type: "payment",
    description: "Payment overdue from Global Distributors Inc",
    amount: 11583.75,
    time: "1 day ago",
    status: "failed",
  },
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("7");
  const [activityFilter, setActivityFilter] = useState("all");
  const { toast } = useToast();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const filteredActivities = recentActivities.filter((activity) => {
    const matchesSearch = activity.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesActivity =
      activityFilter === "all" || activity.type === activityFilter;
    return matchesSearch && matchesActivity;
  });

  const exportReport = (format: "pdf" | "excel" | "csv") => {
    // Generate comprehensive report data
    const reportData = {
      reportType: "Dashboard Overview",
      generatedAt: new Date().toISOString(),
      dateRange: `Last ${dateFilter} days`,
      summary: {
        totalRevenue: 45231.89,
        totalProducts: 2350,
        activeClients: 573,
        salesToday: 127,
        growthMetrics: {
          revenueGrowth: 20.1,
          productGrowth: 180,
          clientGrowth: 25,
          salesGrowth: 12,
        },
      },
      salesData: salesData,
      productCategories: productCategories,
      recentActivities: filteredActivities,
      lowStockItems: lowStockItems,
      quickStats: [
        {
          metric: "Total Sales",
          thisMonth: 45231,
          lastMonth: 38942,
          change: 16.1,
        },
        { metric: "New Clients", thisMonth: 25, lastMonth: 18, change: 38.9 },
        {
          metric: "Products Sold",
          thisMonth: 1247,
          lastMonth: 1156,
          change: 7.9,
        },
        {
          metric: "Average Order",
          thisMonth: 186.42,
          lastMonth: 172.33,
          change: 8.2,
        },
      ],
    };

    // Simulate different export formats
    switch (format) {
      case "pdf":
        // In a real app, this would generate a PDF using libraries like jsPDF or PDFKit
        downloadFile(
          generatePDFContent(reportData),
          "dashboard-report.pdf",
          "application/pdf",
        );
        break;
      case "excel":
        // In a real app, this would use libraries like XLSX or ExcelJS
        downloadFile(
          generateExcelContent(reportData),
          "dashboard-report.xlsx",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        );
        break;
      case "csv":
        downloadFile(
          generateCSVContent(reportData),
          "dashboard-report.csv",
          "text/csv",
        );
        break;
    }

    toast({
      title: "Report Exported",
      description: `Dashboard report has been exported as ${format.toUpperCase()} and downloaded.`,
    });
  };

  const downloadFile = (
    content: string,
    filename: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const generatePDFContent = (data: any) => {
    // Simplified PDF content (in real app, use proper PDF generation)
    return `
DASHBOARD REPORT
Generated: ${new Date(data.generatedAt).toLocaleString()}
Period: ${data.dateRange}

EXECUTIVE SUMMARY
===============
Total Revenue: $${data.summary.totalRevenue.toLocaleString()}
Total Products: ${data.summary.totalProducts.toLocaleString()}
Active Clients: ${data.summary.activeClients.toLocaleString()}
Sales Today: ${data.summary.salesToday}

GROWTH METRICS
==============
Revenue Growth: +${data.summary.growthMetrics.revenueGrowth}%
Product Growth: +${data.summary.growthMetrics.productGrowth} new items
Client Growth: +${data.summary.growthMetrics.clientGrowth} new clients
Sales Growth: +${data.summary.growthMetrics.salesGrowth}%

MONTHLY SALES DATA
==================
${data.salesData.map((item: any) => `${item.name}: $${item.sales.toLocaleString()} sales, $${item.profit.toLocaleString()} profit`).join("\n")}

PRODUCT CATEGORIES
==================
${data.productCategories.map((cat: any) => `${cat.name}: ${cat.value} products`).join("\n")}

LOW STOCK ALERTS
================
${data.lowStockItems.map((item: any) => `${item.name}: ${item.stock} units (Min: ${item.minRequired})`).join("\n")}

RECENT ACTIVITIES
=================
${data.recentActivities.map((activity: any) => `${activity.time} - ${activity.description}${activity.amount ? ` ($${activity.amount.toLocaleString()})` : ""}`).join("\n")}
    `;
  };

  const generateExcelContent = (data: any) => {
    // Simplified Excel content (in real app, use proper Excel generation)
    const csvContent = generateCSVContent(data);
    return csvContent; // For demo, return CSV format
  };

  const generateCSVContent = (data: any) => {
    let csv = "";

    // Summary section
    csv += "Dashboard Report Summary\n";
    csv += `Generated,${new Date(data.generatedAt).toLocaleString()}\n`;
    csv += `Period,${data.dateRange}\n`;
    csv += "\n";

    csv += "Metric,Value,Growth\n";
    csv += `Total Revenue,$${data.summary.totalRevenue.toLocaleString()},+${data.summary.growthMetrics.revenueGrowth}%\n`;
    csv += `Total Products,${data.summary.totalProducts.toLocaleString()},+${data.summary.growthMetrics.productGrowth}\n`;
    csv += `Active Clients,${data.summary.activeClients.toLocaleString()},+${data.summary.growthMetrics.clientGrowth}\n`;
    csv += `Sales Today,${data.summary.salesToday},+${data.summary.growthMetrics.salesGrowth}%\n`;
    csv += "\n";

    // Sales data
    csv += "Monthly Sales Data\n";
    csv += "Month,Sales,Profit\n";
    data.salesData.forEach((item: any) => {
      csv += `${item.name},$${item.sales.toLocaleString()},$${item.profit.toLocaleString()}\n`;
    });
    csv += "\n";

    // Product categories
    csv += "Product Categories\n";
    csv += "Category,Count\n";
    data.productCategories.forEach((cat: any) => {
      csv += `${cat.name},${cat.value}\n`;
    });
    csv += "\n";

    // Low stock items
    csv += "Low Stock Alerts\n";
    csv += "Product,Current Stock,Minimum Required\n";
    data.lowStockItems.forEach((item: any) => {
      csv += `${item.name},${item.stock},${item.minRequired}\n`;
    });
    csv += "\n";

    // Quick stats
    csv += "Monthly Comparison\n";
    csv += "Metric,This Month,Last Month,Change %\n";
    data.quickStats.forEach((stat: any) => {
      csv += `${stat.metric},${stat.thisMonth},${stat.lastMonth},+${stat.change}%\n`;
    });

    return csv;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "sale":
        return <ShoppingCart className="h-4 w-4" />;
      case "client":
        return <Users className="h-4 w-4" />;
      case "product":
        return <Package className="h-4 w-4" />;
      case "payment":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-10 border-gray-200 hover:border-gray-300 transition-colors">
              <Calendar className="mr-2 h-4 w-4 text-gray-500" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">{t("dashboard.today")}</SelectItem>
              <SelectItem value="7">7 {t("dashboard.days")}</SelectItem>
              <SelectItem value="30">30 {t("dashboard.days")}</SelectItem>
              <SelectItem value="90">90 {t("dashboard.days")}</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Export Dashboard Report</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 space-y-1">
                <div className="text-xs text-muted-foreground mb-2">
                  Comprehensive report including sales data, analytics, alerts,
                  and performance metrics for the last {dateFilter} days.
                </div>
                <DropdownMenuItem
                  onClick={() => exportReport("pdf")}
                  className="cursor-pointer"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">PDF Report</div>
                    <div className="text-xs text-muted-foreground">
                      Executive summary with charts and insights
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportReport("excel")}
                  className="cursor-pointer"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Excel Workbook</div>
                    <div className="text-xs text-muted-foreground">
                      Detailed data with multiple sheets
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => exportReport("csv")}
                  className="cursor-pointer"
                >
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">CSV Data</div>
                    <div className="text-xs text-muted-foreground">
                      Raw data for external analysis
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Enhanced KPI Cards with Glassmorphism */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden group border-0 bg-gradient-to-br from-white via-white to-green-50/30 backdrop-blur-xl shadow-business-lg hover:shadow-business-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 tracking-tight">
              {t("dashboard.total_revenue")}
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300 group-hover:scale-110 shadow-sm">
              <DollarSign className="h-5 w-5 text-green-600 group-hover:text-green-700 transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              $45,231.89
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm font-semibold text-green-600">
                  +20.1%
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {t("dashboard.from_last_month")}
              </span>
            </div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-4/5 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-0 bg-gradient-to-br from-white via-white to-blue-50/30 backdrop-blur-xl shadow-business-lg hover:shadow-business-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 tracking-tight">
              {t("dashboard.products")}
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl group-hover:from-blue-200 group-hover:to-cyan-200 transition-all duration-300 group-hover:scale-110 shadow-sm">
              <Package className="h-5 w-5 text-blue-600 group-hover:text-blue-700 transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              2,350
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Package className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">
                  +180
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {t("dashboard.new_this_month")}
              </span>
            </div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full w-3/5 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-0 bg-gradient-to-br from-white via-white to-purple-50/30 backdrop-blur-xl shadow-business-lg hover:shadow-business-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 tracking-tight">
              {t("dashboard.active_clients")}
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl group-hover:from-purple-200 group-hover:to-pink-200 transition-all duration-300 group-hover:scale-110 shadow-sm">
              <Users className="h-5 w-5 text-purple-600 group-hover:text-purple-700 transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              573
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-600">
                  +25
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {t("dashboard.new_this_week")}
              </span>
            </div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-4/6 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-0 bg-gradient-to-br from-white via-white to-orange-50/30 backdrop-blur-xl shadow-business-lg hover:shadow-business-xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 relative z-10">
            <CardTitle className="text-sm font-semibold text-gray-700 tracking-tight">
              {t("dashboard.sales_today")}
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl group-hover:from-orange-200 group-hover:to-red-200 transition-all duration-300 group-hover:scale-110 shadow-sm">
              <ShoppingCart className="h-5 w-5 text-orange-600 group-hover:text-orange-700 transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="pt-0 relative z-10">
            <div className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
              127
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-semibold text-orange-600">
                  +12%
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {t("dashboard.from_yesterday")}
              </span>
            </div>
            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full w-2/3 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        {/* Enhanced Sales Chart */}
        <Card className="col-span-4 relative overflow-hidden group border-0 bg-gradient-to-br from-white via-white to-blue-50/20 backdrop-blur-xl shadow-business-lg hover:shadow-business-xl transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                  {t("dashboard.sales_overview")}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {t("dashboard.monthly_sales_profit")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
                <Bar dataKey="profit" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Enhanced Product Categories */}
        <Card className="col-span-3 relative overflow-hidden group border-0 bg-gradient-to-br from-white via-white to-green-50/20 backdrop-blur-xl shadow-business-lg hover:shadow-business-xl transition-all duration-500 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/3 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="pb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 tracking-tight">
                  {t("dashboard.product_categories")}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {t("dashboard.distribution_by_category")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {t("dashboard.recent_activity")}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("dashboard.search_activities")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-8 w-48"
                  />
                </div>
                <Select
                  value={activityFilter}
                  onValueChange={setActivityFilter}
                >
                  <SelectTrigger className="w-[100px] h-8">
                    <Filter className="mr-2 h-3 w-3" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("dashboard.all")}</SelectItem>
                    <SelectItem value="sale">
                      {t("navigation.sales")}
                    </SelectItem>
                    <SelectItem value="payment">
                      {t("dashboard.payments")}
                    </SelectItem>
                    <SelectItem value="client">
                      {t("navigation.clients")}
                    </SelectItem>
                    <SelectItem value="product">
                      {t("dashboard.products")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardTitle>
            <CardDescription>
              {t("dashboard.latest_activities")}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto">
            <div className="space-y-3">
              {filteredActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {activity.time}
                      </span>
                      {activity.amount && (
                        <span className="text-xs font-medium">
                          ${activity.amount.toLocaleString()}
                        </span>
                      )}
                      {getStatusBadge(activity.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              {t("dashboard.inventory_alerts")}
            </CardTitle>
            <CardDescription>
              {t("dashboard.products_requiring_attention")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("dashboard.current")}: {item.stock} |{" "}
                      {t("dashboard.required")}: {item.minRequired}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            item.stock / item.minRequired < 0.3
                              ? "bg-red-500"
                              : item.stock / item.minRequired < 0.6
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{
                            width: `${Math.min((item.stock / item.minRequired) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round((item.stock / item.minRequired) * 100)}%
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {t("dashboard.reorder")}
                  </Button>
                </div>
              ))}
              <Button variant="ghost" className="w-full" size="sm">
                {t("dashboard.view_all_inventory")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.quick_statistics")}</CardTitle>
          <CardDescription>{t("dashboard.kpi_at_glance")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("dashboard.metric")}</TableHead>
                <TableHead>{t("dashboard.this_month")}</TableHead>
                <TableHead>{t("dashboard.last_month")}</TableHead>
                <TableHead>{t("dashboard.change")}</TableHead>
                <TableHead>{t("dashboard.trend")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  {t("dashboard.total_sales")}
                </TableCell>
                <TableCell>$45,231</TableCell>
                <TableCell>$38,942</TableCell>
                <TableCell className="text-green-600">+16.1%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm">
                      {t("dashboard.up")}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  {t("dashboard.new_clients")}
                </TableCell>
                <TableCell>25</TableCell>
                <TableCell>18</TableCell>
                <TableCell className="text-green-600">+38.9%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm">
                      {t("dashboard.up")}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  {t("dashboard.products_sold")}
                </TableCell>
                <TableCell>1,247</TableCell>
                <TableCell>1,156</TableCell>
                <TableCell className="text-green-600">+7.9%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm">
                      {t("dashboard.up")}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  {t("dashboard.average_order")}
                </TableCell>
                <TableCell>$186.42</TableCell>
                <TableCell>$172.33</TableCell>
                <TableCell className="text-green-600">+8.2%</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 text-sm">
                      {t("dashboard.up")}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Accounts Section - Only show for demo purposes */}
      {user?.email?.includes("example.com") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              👥 Available User Accounts
            </CardTitle>
            <CardDescription>
              Try different user accounts to see how permissions and interface
              change based on roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserCredentials />
          </CardContent>
        </Card>
      )}

      {/* AI Assistant */}
      <AIAssistant context="dashboard" />
    </div>
  );
}
