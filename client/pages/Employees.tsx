import { useEffect, useState } from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AIAssistant from "@/components/AIAssistant";
import {
  Plus,
  Search,
  Users,
  Edit,
  Trash2,
  Filter,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Award,
  UserCheck,
  UserX,
  Eye,
  Star,
  TrendingUp,
  Target,
  ShoppingCart,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  ChevronDown,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';
import { string } from "zod";

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  role: 'admin' | 'manager' | 'worker' | 'intern';
  salary: number;
  commission: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  avatar?: string;
  manager?: string;
  skills: string[];
  notes: string;
  salesTarget?: number;
}

interface DailySale {
  id: string;
  employeeId: string;
  date: string;
  amount: number;
  quantity: number;
  clientName: string;
  productsSold: string[];
  commission: number;
  notes?: string;
}

interface TimeEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day';
  notes?: string;
}

interface AttendanceEntry {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  totalHours: number;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'on_break';
  breakStart?: string;
  breakEnd?: string;
  notes?: string;
}

const mockDailySales: DailySale[] = [
  {
    id: "1",
    employeeId: "EMP001",
    date: "2024-01-22",
    amount: 5500,
    quantity: 3,
    clientName: "Tech Solutions Ltd",
    productsSold: ["iPhone 15 Pro", "MacBook Air M3"],
    commission: 275,
    notes: "Large enterprise deal"
  },
  {
    id: "2",
    employeeId: "EMP002",
    date: "2024-01-22",
    amount: 2200,
    quantity: 2,
    clientName: "Startup Inc",
    productsSold: ["Samsung Galaxy S24"],
    commission: 66,
    notes: "First time customer"
  },
  {
    id: "3",
    employeeId: "EMP001",
    date: "2024-01-21",
    amount: 3800,
    quantity: 4,
    clientName: "Local Business",
    productsSold: ["Various Electronics"],
    commission: 190
  },
  {
    id: "4",
    employeeId: "EMP004",
    date: "2024-01-22",
    amount: 1500,
    quantity: 1,
    clientName: "Individual Customer",
    productsSold: ["iPad Pro"],
    commission: 52.5,
    notes: "Retail sale"
  },
  {
    id: "5",
    employeeId: "EMP002",
    date: "2024-01-21",
    amount: 1200,
    quantity: 1,
    clientName: "Small Business",
    productsSold: ["MacBook Air"],
    commission: 36
  }
];

const mockTimeEntries: TimeEntry[] = [
  {
    id: "1",
    employeeId: "EMP001",
    date: "2024-01-22",
    clockIn: "08:30",
    clockOut: "17:15",
    totalHours: 8.75,
    status: "present"
  },
  {
    id: "2",
    employeeId: "EMP002",
    date: "2024-01-22",
    clockIn: "09:15",
    clockOut: "18:00",
    totalHours: 8.75,
    status: "late",
    notes: "Traffic delay"
  },
  {
    id: "3",
    employeeId: "EMP003",
    date: "2024-01-22",
    clockIn: "08:00",
    clockOut: "16:30",
    totalHours: 8.5,
    status: "present"
  }
];

// Sample sales performance data
const salesPerformanceData = [
  { month: 'Jan', johnSales: 45000, sarahSales: 280, lisaSales: 200 },
  { month: 'Feb', johnSales: 5200, sarahSales: 320000, lisaSales: 250 },
  { month: 'Mar', johnSales: 48, sarahSales: 350, lisaSales: 28000 },
  { month: 'Apr', johnSales: 61000, sarahSales: 380, lisaSales: 300 },
  { month: 'May', johnSales: 550, sarahSales: 42000, lisaSales: 320 },
  { month: 'Jun', johnSales: 6000070, sarahSales: 450, lisaSales: 35000 },
  { month: 'Aug', johnSales: 67000, sarahSales: 450, lisaSales: 350 },
  { month: 'Sep', johnSales: 670, sarahSales: 4500000, lisaSales: 350 },
  { month: 'Okt', johnSales: 670, sarahSales: 4500000, lisaSales: 35000 },
  { month: 'Nov', johnSales: 67000, sarahSales: 450, lisaSales: 350 },

];

const departmentData = [
  { department: 'Sales', employees: 8, productivity: 92, avgSales: 35000 },
  { department: 'Marketing', employees: 5, productivity: 88, avgSales: 0 },
  { department: 'IT', employees: 12, productivity: 95, avgSales: 0 },
  { department: 'Finance', employees: 4, productivity: 89, avgSales: 0 },
  { department: 'HR', employees: 3, productivity: 87, avgSales: 0 },
];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [dailySales, setDailySales] = useState(mockDailySales);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [attendanceEntries, setAttendanceEntries] = useState<AttendanceEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Dialog states
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [isEditEmployeeOpen, setIsEditEmployeeOpen] = useState(false);
  const [isViewEmployeeOpen, setIsViewEmployeeOpen] = useState(false);
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isViewSalesOpen, setIsViewSalesOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);

  // Selected items
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeSales, setSelectedEmployeeSales] = useState<Employee | null>(null);

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    department: "",
    position: "",
    role: "worker",
    salary: 0,
    commission: 0,
    skills: [],
    notes: "",
    salesTarget: 0
  });

  const [newAttendance, setNewAttendance] = useState<Partial<AttendanceEntry>>({
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    clockIn: "",
    clockOut: "",
    status: "present",
    notes: ""
  });

  const [newSale, setNewSale] = useState<Partial<DailySale>>({
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    quantity: 0,
    clientName: "",
    productsSold: [],
    notes: ""
  });

  // Skills management
  const [currentSkill, setCurrentSkill] = useState("");

  const { toast } = useToast();

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:5002/api/workers");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
        }

        const data = await res.json();

        if (data.ok) {
          const employeesWithHireDate = data.result.map((emp: any) => ({
            ...emp,
            hireDate: emp.createdAt,
          }));
          setEmployees(employeesWithHireDate);
        } else {
          let message = "Unknown backend error";
          if (data.message) message = data.message;
          else if (data.error) message = data.error;
          throw new Error(message);
        }
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // --- Fetch Attendance for Selected Date ---
  const fetchAttendanceForDate = async (date: string) => {
    try {
      const res = await fetch(`http://localhost:5002/api/workers-attendance/${date}?date=${date}`);
      const data = await res.json();
      if (data.ok) {
        setAttendanceEntries(data.result);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch attendance",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Network error or server not reachable",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAttendanceForDate(selectedDate);
  }, [selectedDate]);

  const getSalesEmployees = () => employees.filter(emp => emp.department === "Sales" && emp.status === "active");

  const getDailySalesForEmployee = (employeeId: string, date: string) => {
    return dailySales.filter(sale => sale.employeeId === employeeId && sale.date === date);
  };

  const getTotalSalesForEmployee = (employeeId: string, date: string) => {
    return getDailySalesForEmployee(employeeId, date).reduce((sum, sale) => sum + sale.amount, 0);
  };

  const getTotalCommissionForEmployee = (employeeId: string, date: string) => {
    return getDailySalesForEmployee(employeeId, date).reduce((sum, sale) => sum + sale.commission, 0);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'terminated':
        return <Badge variant="destructive">Terminated</Badge>;
      case 'on_leave':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Admin</Badge>;
      case 'manager':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Manager</Badge>;
      case 'worker':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Employee</Badge>;
      case 'intern':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Intern</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const generateEmployeeId = () => {
    const count = employees.length + 1;
    return `EMP${count.toString().padStart(3, '0')}`;
  };

  const clearNewEmployee = () => {
    setNewEmployee({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      department: "",
      position: "",
      role: "worker",
      salary: 0,
      commission: 0,
      skills: [],
      notes: "",
      salesTarget: 0
    });
    setCurrentSkill("");
  };

  const clearNewSale = () => {
    setNewSale({
      employeeId: "",
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      quantity: 0,
      clientName: "",
      productsSold: [],
      notes: ""
    });
  };

  const clearNewAttendance = () => {
    setNewAttendance({
      employeeId: "",
      date: new Date().toISOString().split('T')[0],
      clockIn: "",
      clockOut: "",
      status: "present",
      notes: ""
    });
  };

  const addAttendanceEntry = async () => {
    if (!newAttendance.employeeId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const attendancePayload = {
      clockIn: newAttendance.clockIn,
      clockOut: newAttendance.clockOut,
      status: newAttendance.status || 'present',
      note: newAttendance.notes || "",
    };

    try {
      const response = await fetch(`http://localhost:5002/api/workers-attendance/${newAttendance.employeeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendancePayload),
      });

      const data = await response.json();

      if (data.ok) {
        setAttendanceEntries([...attendanceEntries, data.result]);
        clearNewAttendance();
        setIsAttendanceOpen(false);

        const employee = employees.find(emp => emp.id === newAttendance.employeeId);
        toast({
          title: "Attendance recorded",
          description: `Attendance recorded for ${employee?.firstName} ${employee?.lastName}.`,
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to record attendance",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error or server not reachable",
        variant: "destructive",
      });
    }
  };


  const getAttendanceForEmployee = (employeeId: string, date: string) => {
    return attendanceEntries.filter(entry => entry.employeeId === employeeId && entry.date === date);
  };

  const getTodaysAttendance = () => {
    const today = selectedDate;
    return employees.map(employee => {
      const attendance = getAttendanceForEmployee(employee.id, today)[0];
      return {
        employee,
        attendance
      };
    });
  };

  const addSkill = () => {
    if (currentSkill.trim() && !newEmployee.skills?.includes(currentSkill.trim())) {
      setNewEmployee({
        ...newEmployee,
        skills: [...(newEmployee.skills || []), currentSkill.trim()]
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setNewEmployee({
      ...newEmployee,
      skills: newEmployee.skills?.filter(skill => skill !== skillToRemove) || []
    });
  };

  const addEmployee = async () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      employeeId: generateEmployeeId(),
      firstName: newEmployee.firstName!,
      lastName: newEmployee.lastName!,
      email: newEmployee.email!,
      phone: newEmployee.phone || "",
      address: newEmployee.address || "",
      department: newEmployee.department!,
      position: newEmployee.position || "",
      role: newEmployee.role || 'worker',
      salary: newEmployee.salary || 0,
      commission: newEmployee.commission || 0,
      status: 'active',
      skills: newEmployee.skills || [],
      notes: newEmployee.notes || "",
      salesTarget: newEmployee.salesTarget || 0
    };

    try {
      const res = await fetch("http://localhost:5002/api/workers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.ok) {
        const employeeFromServer: Employee = {
          ...data.result,
          hireDate: data.result.createdAt,
        };

        setEmployees([...employees, employeeFromServer]);
        clearNewEmployee();
        setIsAddEmployeeOpen(false);

        toast({
          title: "Employee added",
          description: `${employeeFromServer.firstName} ${employeeFromServer.lastName} has been added to the team.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add employee on server",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error or server not reachable",
        variant: "destructive",
      });
    }
  };


  const updateEmployee = async () => {
    if (!selectedEmployee || !newEmployee.firstName || !newEmployee.lastName || !newEmployee.department) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedEmployeeData = {
      firstName: newEmployee.firstName!,
      lastName: newEmployee.lastName!,
      phone: newEmployee.phone || "",
      address: newEmployee.address || "",
      department: newEmployee.department!,
      position: newEmployee.position || "",
      role: newEmployee.role || 'worker',
      salary: newEmployee.salary || 0,
      commission: newEmployee.commission || 0,
      status: selectedEmployee.status || 'active',
      manager: newEmployee.manager || selectedEmployee.manager || null,
      skills: newEmployee.skills || [],
      notes: newEmployee.notes || "",
      salesTarget: newEmployee.salesTarget || 0
    };

    try {
      const res = await fetch(`http://localhost:5002/api/workers/${selectedEmployee.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEmployeeData),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        const updatedEmployee: Employee = {
          ...selectedEmployee,
          ...updatedEmployeeData,
          hireDate: selectedEmployee.hireDate,
        };

        setEmployees(employees.map(emp => emp.id === selectedEmployee.id ? updatedEmployee : emp));
        clearNewEmployee();
        setIsEditEmployeeOpen(false);
        setSelectedEmployee(null);

        toast({
          title: "Employee updated",
          description: `${updatedEmployee.firstName} ${updatedEmployee.lastName} has been updated.`,
        });
      } else {
        const message = data.message || "Failed to update employee";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Network error",
        variant: "destructive",
      });
    }
  };


  const deleteEmployee = async (employeeId: string) => {
    const employee = employees.find(emp => emp.id === employeeId);
    if (!employee) {
      toast({
        title: "Error",
        description: "Employee not found",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch(`http://localhost:5002/api/workers/${employeeId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setEmployees(employees.filter(emp => emp.id !== employeeId));
        toast({
          title: "Employee removed",
          description: `${employee.firstName} ${employee.lastName} has been removed from the team.`,
        });
      } else {
        const message = data.message || "Failed to delete employee";
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Network error",
        variant: "destructive",
      });
    }
  };


  const openEditEmployeeDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      address: employee.address,
      department: employee.department,
      position: employee.position,
      role: employee.role,
      salary: employee.salary,
      commission: employee.commission,
      skills: employee.skills,
      notes: employee.notes,
      salesTarget: employee.salesTarget
    });
    setCurrentSkill("");
    setIsEditEmployeeOpen(true);
  };

  const addDailySale = () => {
    if (!newSale.employeeId || !newSale.amount || !newSale.clientName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const employee = employees.find(emp => emp.id === newSale.employeeId);
    const commission = (newSale.amount! * (employee?.commission || 0)) / 100;

    const sale: DailySale = {
      id: Date.now().toString(),
      employeeId: newSale.employeeId!,
      date: newSale.date!,
      amount: newSale.amount!,
      quantity: newSale.quantity || 1,
      clientName: newSale.clientName!,
      productsSold: newSale.productsSold || [],
      commission: commission,
      notes: newSale.notes || ""
    };

    setDailySales([...dailySales, sale]);
    clearNewSale();
    setIsAddSaleOpen(false);

    toast({
      title: "Sale recorded",
      description: `Sale of $${sale.amount} recorded for ${employee?.firstName} ${employee?.lastName}.`,
    });
  };

  const updateEmployeeStatus = (employeeId: string, newStatus: string) => {
    setEmployees(employees.map(emp =>
      emp.id === employeeId ? { ...emp, status: newStatus as any } : emp
    ));

    toast({
      title: "Status updated",
      description: `Employee status changed to ${newStatus}.`,
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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

  const exportEmployeeReport = (format: 'pdf' | 'excel' | 'csv') => {
    const todaysSales = dailySales.filter(s => s.date === selectedDate).reduce((sum, s) => sum + s.amount, 0);
    const todaysCommissions = dailySales.filter(s => s.date === selectedDate).reduce((sum, s) => sum + s.commission, 0);
    const avgSalary = Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length);

    const reportData = {
      reportType: 'Employee Report',
      generatedAt: new Date().toISOString(),
      summary: {
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.status === 'active').length,
        salesTeam: getSalesEmployees().length,
        todaysSales,
        todaysCommissions,
        avgSalary
      },
      employees: filteredEmployees,
      dailySales,
      timeEntries,
      salesPerformanceData,
      departmentData
    };

    switch (format) {
      case 'pdf':
        downloadFile(generateEmployeePDFContent(reportData), 'employee-report.pdf', 'application/pdf');
        break;
      case 'excel':
        downloadFile(generateEmployeeExcelContent(reportData), 'employee-report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        break;
      case 'csv':
        downloadFile(generateEmployeeCSVContent(reportData), 'employee-report.csv', 'text/csv');
        break;
    }

    toast({
      title: "Employee Report Exported",
      description: `Employee report has been exported as ${format.toUpperCase()} and downloaded.`,
    });
  };

  const exportEmployeeDirectory = () => {
    let csv = 'Employee ID,First Name,Last Name,Email,Phone,Department,Position,Role,Status,Hire Date,Salary,Commission %,Sales Target\n';
    filteredEmployees.forEach(employee => {
      csv += `${employee.employeeId},"${employee.firstName}","${employee.lastName}",${employee.email},${employee.phone},${employee.department},${employee.position},${employee.role},${employee.status},${employee.hireDate},${employee.salary},${employee.commission},${employee.salesTarget || ''}\n`;
    });

    downloadFile(csv, 'employee-directory.csv', 'text/csv');
    toast({
      title: "Directory Exported",
      description: "Employee directory has been exported as CSV.",
    });
  };

  const exportSalesPerformance = () => {
    let csv = 'Employee ID,Name,Date,Sales Amount,Commission,Client,Products,Notes\n';
    dailySales.forEach(sale => {
      const employee = employees.find(e => e.id === sale.employeeId);
      if (employee) {
        csv += `${employee.employeeId},"${employee.firstName} ${employee.lastName}",${sale.date},${sale.amount},${sale.commission},"${sale.clientName}","${sale.productsSold.join(', ')}","${sale.notes || ''}"\n`;
      }
    });

    downloadFile(csv, 'sales-performance.csv', 'text/csv');
    toast({
      title: "Sales Performance Exported",
      description: "Sales performance data has been exported as CSV.",
    });
  };

  const exportAttendance = () => {
    let csv = 'Employee ID,Name,Date,Clock In,Clock Out,Total Hours,Status,Notes\n';
    timeEntries.forEach(entry => {
      const employee = employees.find(e => e.employeeId === entry.employeeId);
      if (employee) {
        csv += `${employee.employeeId},"${employee.firstName} ${employee.lastName}",${entry.date},${entry.clockIn},${entry.clockOut || ''},${entry.totalHours},${entry.status},"${entry.notes || ''}"\n`;
      }
    });

    downloadFile(csv, 'attendance-data.csv', 'text/csv');
    toast({
      title: "Attendance Exported",
      description: "Attendance data has been exported as CSV.",
    });
  };

  const generateEmployeePDFContent = (data: any) => {
    return `
EMPLOYEE REPORT
===============
Generated: ${new Date(data.generatedAt).toLocaleString()}

EXECUTIVE SUMMARY
=================
Total Employees: ${data.summary.totalEmployees}
Active Employees: ${data.summary.activeEmployees}
Sales Team: ${data.summary.salesTeam}
Today's Sales: $${data.summary.todaysSales.toLocaleString()}
Today's Commissions: $${data.summary.todaysCommissions.toFixed(2)}
Average Salary: $${data.summary.avgSalary.toLocaleString()}

EMPLOYEE DIRECTORY
==================
${data.employees.map((emp: any) => `${emp.employeeId} - ${emp.firstName} ${emp.lastName} | ${emp.department} - ${emp.position} | ${emp.status.toUpperCase()}`).join('\n')}

DEPARTMENT BREAKDOWN
====================
${data.departmentData.map((dept: any) => `${dept.department}: ${dept.employees} employees (${dept.productivity}% productivity)`).join('\n')}

SALES PERFORMANCE
=================
${data.dailySales.map((sale: any) => {
  const employee = data.employees.find((e: any) => e.id === sale.employeeId);
  return `${sale.date} - ${employee?.firstName} ${employee?.lastName}: $${sale.amount.toLocaleString()} (Commission: $${sale.commission.toFixed(2)})`;
}).join('\n')}

ATTENDANCE SUMMARY
==================
${data.timeEntries.map((entry: any) => {
  const employee = data.employees.find((e: any) => e.employeeId === entry.employeeId);
  return `${entry.date} - ${employee?.firstName} ${employee?.lastName}: ${entry.totalHours}h (${entry.status})`;
}).join('\n')}
    `;
  };

  const generateEmployeeExcelContent = (data: any) => {
    return generateEmployeeCSVContent(data);
  };

  const generateEmployeeCSVContent = (data: any) => {
    let csv = '';

    // Summary
    csv += 'Employee Summary\n';
    csv += `Generated,${new Date(data.generatedAt).toLocaleString()}\n`;
    csv += '\n';
    csv += 'Metric,Value\n';
    csv += `Total Employees,${data.summary.totalEmployees}\n`;
    csv += `Active Employees,${data.summary.activeEmployees}\n`;
    csv += `Sales Team,${data.summary.salesTeam}\n`;
    csv += `Today's Sales,$${data.summary.todaysSales.toLocaleString()}\n`;
    csv += `Today's Commissions,$${data.summary.todaysCommissions.toFixed(2)}\n`;
    csv += `Average Salary,$${data.summary.avgSalary.toLocaleString()}\n`;
    csv += '\n';

    // Department Data
    csv += 'Department Statistics\n';
    csv += 'Department,Employees,Productivity %,Avg Sales\n';
    data.departmentData.forEach((dept: any) => {
      csv += `${dept.department},${dept.employees},${dept.productivity},${dept.avgSales}\n`;
    });
    csv += '\n';

    // Employee Directory
    csv += 'Employee Directory\n';
    csv += 'Employee ID,First Name,Last Name,Email,Phone,Department,Position,Role,Status,Hire Date,Salary,Commission %,Sales Target\n';
    data.employees.forEach((employee: any) => {
      csv += `${employee.employeeId},"${employee.firstName}","${employee.lastName}",${employee.email},${employee.phone},${employee.department},${employee.position},${employee.role},${employee.status},${employee.hireDate},${employee.salary},${employee.commission},${employee.salesTarget || ''}\n`;
    });
    csv += '\n';

    // Sales Performance
    csv += 'Sales Performance\n';
    csv += 'Employee ID,Name,Date,Sales Amount,Commission,Client,Products,Notes\n';
    data.dailySales.forEach((sale: any) => {
      const employee = data.employees.find((e: any) => e.id === sale.employeeId);
      if (employee) {
        csv += `${employee.employeeId},"${employee.firstName} ${employee.lastName}",${sale.date},${sale.amount},${sale.commission},"${sale.clientName}","${sale.productsSold.join(', ')}","${sale.notes || ''}"\n`;
      }
    });
    csv += '\n';

    // Attendance Data
    csv += 'Attendance Data\n';
    csv += 'Employee ID,Name,Date,Clock In,Clock Out,Total Hours,Status,Notes\n';
    data.timeEntries.forEach((entry: any) => {
      const employee = data.employees.find((e: any) => e.employeeId === entry.employeeId);
      if (employee) {
        csv += `${employee.employeeId},"${employee.firstName} ${employee.lastName}",${entry.date},${entry.clockIn},${entry.clockOut || ''},${entry.totalHours},${entry.status},"${entry.notes || ''}"\n`;
      }
    });

    return csv;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">Manage staff, roles, performance, and sales tracking</p>
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
              <DropdownMenuLabel>Export Employee Report</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-2 space-y-1">
                <div className="text-xs text-muted-foreground mb-2">
                  Comprehensive employee report including directory, sales performance, attendance, and analytics.
                </div>
                <DropdownMenuItem onClick={() => exportEmployeeReport('pdf')} className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">PDF Employee Report</div>
                    <div className="text-xs text-muted-foreground">Complete HR report with analytics</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportEmployeeReport('excel')} className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Excel Workbook</div>
                    <div className="text-xs text-muted-foreground">Detailed employee data and sales</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportEmployeeReport('csv')} className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">CSV Employee Data</div>
                    <div className="text-xs text-muted-foreground">Raw employee data for analysis</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => exportEmployeeDirectory()} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Employee Directory</div>
                    <div className="text-xs text-muted-foreground">Contact information and roles</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportSalesPerformance()} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Sales Performance</div>
                    <div className="text-xs text-muted-foreground">Sales data and commissions</div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportAttendance()} className="cursor-pointer">
                  <Download className="mr-2 h-4 w-4" />
                  <div className="flex-1">
                    <div className="font-medium">Attendance Data</div>
                    <div className="text-xs text-muted-foreground">Time tracking and presence</div>
                  </div>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Dialog open={isAttendanceOpen} onOpenChange={setIsAttendanceOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Mark Employee Attendance</DialogTitle>
                <DialogDescription>
                  Record attendance for an employee.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="attendanceEmployee">Employee *</Label>
                  <Select
                    value={newAttendance.employeeId}
                    onValueChange={(value) => setNewAttendance({...newAttendance, employeeId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.filter(emp => emp.status === 'active').map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName} - {employee.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="attendanceDate">Date</Label>
                    <Input
                      id="attendanceDate"
                      type="date"
                      value={newAttendance.date}
                      onChange={(e) => setNewAttendance({...newAttendance, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendanceStatus">Status</Label>
                    <Select
                      value={newAttendance.status}
                      onValueChange={(value) => setNewAttendance({...newAttendance, status: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="present">Present</SelectItem>
                        <SelectItem value="absent">Absent</SelectItem>
                        <SelectItem value="late">Late</SelectItem>
                        <SelectItem value="half_day">Half Day</SelectItem>
                        <SelectItem value="on_break">On Break</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clockIn">Clock In</Label>
                    <Input
                      id="clockIn"
                      type="time"
                      value={newAttendance.clockIn}
                      onChange={(e) => setNewAttendance({...newAttendance, clockIn: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clockOut">Clock Out</Label>
                    <Input
                      id="clockOut"
                      type="time"
                      value={newAttendance.clockOut}
                      onChange={(e) => setNewAttendance({...newAttendance, clockOut: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attendanceNotes">Notes</Label>
                  <Textarea
                    id="attendanceNotes"
                    placeholder="Additional notes"
                    value={newAttendance.notes}
                    onChange={(e) => setNewAttendance({...newAttendance, notes: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={addAttendanceEntry}>
                    Mark Attendance
                  </Button>
                  <Button variant="outline" onClick={() => {
                    clearNewAttendance();
                    setIsAttendanceOpen(false);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Record Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Record Daily Sale</DialogTitle>
                <DialogDescription>
                  Record a sale for an employee.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="saleEmployee">Employee *</Label>
                  <Select
                    value={newSale.employeeId}
                    onValueChange={(value) => setNewSale({...newSale, employeeId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSalesEmployees().map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.firstName} {employee.lastName} - {employee.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saleDate">Date</Label>
                    <Input
                      id="saleDate"
                      type="date"
                      value={newSale.date}
                      onChange={(e) => setNewSale({...newSale, date: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleAmount">Amount ($) *</Label>
                    <Input
                      id="saleAmount"
                      type="number"
                      placeholder="0.00"
                      value={newSale.amount}
                      onChange={(e) => setNewSale({...newSale, amount: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="saleQuantity">Quantity</Label>
                    <Input
                      id="saleQuantity"
                      type="number"
                      placeholder="1"
                      value={newSale.quantity}
                      onChange={(e) => setNewSale({...newSale, quantity: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name *</Label>
                    <Input
                      id="clientName"
                      placeholder="Client name"
                      value={newSale.clientName}
                      onChange={(e) => setNewSale({...newSale, clientName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleNotes">Notes</Label>
                  <Textarea
                    id="saleNotes"
                    placeholder="Additional sale details"
                    value={newSale.notes}
                    onChange={(e) => setNewSale({...newSale, notes: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={addDailySale}>
                    Record Sale
                  </Button>
                  <Button variant="outline" onClick={() => {
                    clearNewSale();
                    setIsAddSaleOpen(false);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Create a new employee profile with personal and job information.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={newEmployee.firstName}
                      onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      value={newEmployee.lastName}
                      onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.smith@businesspro.com"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={newEmployee.phone}
                      onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="123 Main St, City, State 12345"
                    value={newEmployee.address}
                    onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={newEmployee.department}
                      onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      placeholder="Sales Manager"
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={newEmployee.role}
                      onValueChange={(value) => setNewEmployee({...newEmployee, role: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salary">Annual Salary ($)</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="75000"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({...newEmployee, salary: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {/* Sales-specific fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="commission">Commission (%)</Label>
                    <Input
                      id="commission"
                      type="number"
                      placeholder="5"
                      value={newEmployee.commission}
                      onChange={(e) => setNewEmployee({...newEmployee, commission: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salesTarget">Monthly Sales Target ($)</Label>
                    <Input
                      id="salesTarget"
                      type="number"
                      placeholder="50000"
                      value={newEmployee.salesTarget}
                      onChange={(e) => setNewEmployee({...newEmployee, salesTarget: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                {/* Skills section */}
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {newEmployee.skills && newEmployee.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {newEmployee.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-2"
                            onClick={() => removeSkill(skill)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes about the employee"
                    value={newEmployee.notes}
                    onChange={(e) => setNewEmployee({...newEmployee, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={addEmployee}>
                    Add Employee
                  </Button>
                  <Button variant="outline" onClick={() => {
                    clearNewEmployee();
                    setIsAddEmployeeOpen(false);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* HR Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">
              {employees.filter(e => e.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Team</CardTitle>
            <Target className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getSalesEmployees().length}</div>
            <p className="text-xs text-muted-foreground">
              Active sales staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dailySales.filter(s => s.date === selectedDate).reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {dailySales.filter(s => s.date === selectedDate).length} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dailySales.filter(s => s.date === selectedDate).reduce((sum, s) => sum + s.commission, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Today's earned commissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Per year across all roles
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="directory">Employee Directory</TabsTrigger>
          <TabsTrigger value="sales">Daily Sales</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-4">
          {/* Employee Directory */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={employee.avatar} />
                            <AvatarFallback>
                              {getInitials(employee.firstName, employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {employee.employeeId}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {employee.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.department}</div>
                          <div className="text-sm text-muted-foreground">{employee.position}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(employee.role)}</TableCell>
                      <TableCell className="font-medium">
                        <div>${employee.salary.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          {employee.commission}% commission
                        </div>
                        {employee.salesTarget && (
                          <div className="text-xs text-muted-foreground">
                            Target: ${employee.salesTarget.toLocaleString()}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsViewEmployeeOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditEmployeeDialog(employee)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteEmployee(employee.id)}
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

        <TabsContent value="sales" className="space-y-4">
          {/* Daily Sales Tracking */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Employee Sales Performance</h3>
              <p className="text-sm text-muted-foreground">Track daily sales and commissions by employee</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="salesDate">Date:</Label>
                <Input
                  id="salesDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </div>

          {/* Sales Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            {getSalesEmployees().map((employee) => {
              const dailySalesAmount = getTotalSalesForEmployee(employee.id, selectedDate);
              const dailyCommission = getTotalCommissionForEmployee(employee.id, selectedDate);
              const salesCount = getDailySalesForEmployee(employee.id, selectedDate).length;
              const targetProgress = employee.salesTarget ? (dailySalesAmount / employee.salesTarget) * 100 : 0;

              return (
                <Card key={employee.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(employee.firstName, employee.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-sm">{employee.firstName} {employee.lastName}</CardTitle>
                          <CardDescription className="text-xs">{employee.position}</CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedEmployeeSales(employee);
                          setIsViewSalesOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Sales</div>
                        <div className="font-semibold text-green-600">${dailySalesAmount.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Commission</div>
                        <div className="font-semibold text-blue-600">${dailyCommission.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="text-muted-foreground">Transactions: {salesCount}</div>
                    </div>
                    {employee.salesTarget && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Monthly Progress</span>
                          <span>{targetProgress.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${Math.min(targetProgress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Target: ${employee.salesTarget.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Performance Trend</CardTitle>
              <CardDescription>Monthly sales by employee</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="johnSales" stroke="#22c55e" strokeWidth={2} name="John Smith" />
                  <Line type="monotone" dataKey="sarahSales" stroke="#3b82f6" strokeWidth={2} name="Sarah Johnson" />
                  <Line type="monotone" dataKey="lisaSales" stroke="#f59e0b" strokeWidth={2} name="Lisa Rodriguez" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          {/* Attendance Tracking */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Employee Attendance</h3>
              <p className="text-sm text-muted-foreground">Track employee time and attendance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="attendanceDate">Date:</Label>
                <Input
                  id="attendanceDate"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-auto"
                />
              </div>
            </div>
          </div>

          {/* Attendance Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Present Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {getTodaysAttendance().filter(({attendance}) => attendance?.status === 'present').length}
                </div>
                <p className="text-xs text-muted-foreground">Employees present</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Late Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {getTodaysAttendance().filter(({attendance}) => attendance?.status === 'late').length}
                </div>
                <p className="text-xs text-muted-foreground">Late employees</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Absent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {getTodaysAttendance().filter(({attendance}) => attendance?.status === 'absent' || !attendance).length}
                </div>
                <p className="text-xs text-muted-foreground">Not present</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getTodaysAttendance().reduce((sum, {attendance}) => sum + (attendance?.totalHours || 0), 0).toFixed(1)}h
                </div>
                <p className="text-xs text-muted-foreground">Hours worked</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance - {selectedDate}</CardTitle>
              <CardDescription>Employee clock-in and clock-out records</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTodaysAttendance().map(({employee, attendance}) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {getInitials(employee.firstName, employee.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {employee.employeeId} - {employee.department}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {attendance?.clockIn ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-green-500" />
                            {attendance.clockIn}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {attendance?.clockOut ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-red-500" />
                            {attendance.clockOut}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">--</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {attendance?.totalHours ? `${attendance.totalHours.toFixed(1)}h` : '--'}
                      </TableCell>
                      <TableCell>
                        {attendance?.status === 'present' && <Badge variant="default" className="bg-green-100 text-green-800">Present</Badge>}
                        {attendance?.status === 'absent' && <Badge variant="destructive">Absent</Badge>}
                        {attendance?.status === 'late' && <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Late</Badge>}
                        {attendance?.status === 'half_day' && <Badge variant="outline" className="bg-blue-50 text-blue-700">Half Day</Badge>}
                        {attendance?.status === 'on_break' && <Badge variant="outline" className="bg-orange-50 text-orange-700">On Break</Badge>}
                        {!attendance && <Badge variant="secondary" className="bg-gray-100 text-gray-800">Not Marked</Badge>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {attendance?.notes || '--'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewAttendance({
                              ...newAttendance,
                              employeeId: employee.id,
                              date: selectedDate
                            });
                            setIsAttendanceOpen(true);
                          }}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* HR Analytics */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Department Overview</CardTitle>
                <CardDescription>Employee count and productivity by department</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="employees" fill="#8884d8" name="Employees" />
                    <Bar dataKey="productivity" fill="#82ca9d" name="Productivity %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales vs Other Departments</CardTitle>
                <CardDescription>Employee distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="employees"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Department Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Department Statistics</CardTitle>
              <CardDescription>Detailed breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Avg Salary</TableHead>
                    <TableHead>Productivity</TableHead>
                    <TableHead>Sales Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departmentData.map((dept) => {
                    const deptEmployees = employees.filter(e => e.department === dept.department);
                    const avgSalary = deptEmployees.reduce((sum, e) => sum + e.salary, 0) / deptEmployees.length;

                    return (
                      <TableRow key={dept.department}>
                        <TableCell className="font-medium">{dept.department}</TableCell>
                        <TableCell>{dept.employees}</TableCell>
                        <TableCell>${Math.round(avgSalary).toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 bg-green-500 rounded-full transition-all"
                                style={{ width: `${dept.productivity}%` }}
                              />
                            </div>
                            <span className="text-sm">{dept.productivity}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {dept.department === "Sales" ? (
                            <div className="text-green-600 font-medium">
                              ${dept.avgSales.toLocaleString()}/month
                            </div>
                          ) : (
                            <span className="text-muted-foreground">N/A</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Employee Dialog */}
      <Dialog open={isViewEmployeeOpen} onOpenChange={setIsViewEmployeeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              Complete profile for {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Employee Header */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedEmployee.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                  </h3>
                  <p className="text-muted-foreground">{selectedEmployee.position}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(selectedEmployee.role)}
                    {getStatusBadge(selectedEmployee.status)}
                  </div>
                </div>
              </div>

              {/* Employee Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Employee ID</Label>
                    <p className="text-sm">{selectedEmployee.employeeId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Department</Label>
                    <p className="text-sm">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Hire Date</Label>
                    <p className="text-sm">{selectedEmployee.hireDate}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">{selectedEmployee.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Salary</Label>
                    <p className="text-sm">${selectedEmployee.salary.toLocaleString()}</p>
                  </div>
                  {selectedEmployee.commission > 0 && (
                    <div>
                      <Label className="text-sm font-medium">Commission</Label>
                      <p className="text-sm">{selectedEmployee.commission}%</p>
                    </div>
                  )}
                  {selectedEmployee.salesTarget && (
                    <div>
                      <Label className="text-sm font-medium">Monthly Sales Target</Label>
                      <p className="text-sm">${selectedEmployee.salesTarget.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div>
                <Label className="text-sm font-medium">Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedEmployee.skills.map((skill, index) => (
                    <Badge key={index} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedEmployee.notes || 'No notes available'}
                </p>
              </div>

              <Button onClick={() => setIsViewEmployeeOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditEmployeeOpen} onOpenChange={setIsEditEmployeeOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>
              Update employee information and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name *</Label>
                <Input
                  id="edit-firstName"
                  value={newEmployee.firstName}
                  onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name *</Label>
                <Input
                  id="edit-lastName"
                  value={newEmployee.lastName}
                  onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={newEmployee.role}
                  onValueChange={(value) => setNewEmployee({...newEmployee, role: value as any})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Worker</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-salary">Annual Salary ($)</Label>
                <Input
                  id="edit-salary"
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({...newEmployee, salary: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-commission">Commission (%)</Label>
                <Input
                  id="edit-commission"
                  type="number"
                  value={newEmployee.commission}
                  onChange={(e) => setNewEmployee({...newEmployee, commission: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-salesTarget">Monthly Sales Target ($)</Label>
              <Input
                id="edit-salesTarget"
                type="number"
                value={newEmployee.salesTarget}
                onChange={(e) => setNewEmployee({...newEmployee, salesTarget: parseInt(e.target.value) || 0})}
              />
            </div>

            {/* Skills section for edit */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill"
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button type="button" onClick={addSkill} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {newEmployee.skills && newEmployee.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {newEmployee.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-2"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={newEmployee.notes}
                onChange={(e) => setNewEmployee({...newEmployee, notes: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={updateEmployee}>
                Update Employee
              </Button>
              <Button variant="outline" onClick={() => {
                clearNewEmployee();
                setIsEditEmployeeOpen(false);
                setSelectedEmployee(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Employee Sales Dialog */}
      <Dialog open={isViewSalesOpen} onOpenChange={setIsViewSalesOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Sales Details</DialogTitle>
            <DialogDescription>
              Sales history for {selectedEmployeeSales?.firstName} {selectedEmployeeSales?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedEmployeeSales && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Today's Sales</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${getTotalSalesForEmployee(selectedEmployeeSales.id, selectedDate).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Commission Earned</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${getTotalCommissionForEmployee(selectedEmployeeSales.id, selectedDate).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Transactions</div>
                    <div className="text-2xl font-bold">
                      {getDailySalesForEmployee(selectedEmployeeSales.id, selectedDate).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailySales
                    .filter(sale => sale.employeeId === selectedEmployeeSales.id)
                    .map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell className="font-medium">{sale.clientName}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        ${sale.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium text-blue-600">
                        ${sale.commission.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {sale.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Assistant */}
      <AIAssistant context="employees" />
    </div>
  );
}
