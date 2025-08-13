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
import AIAssistant from "@/components/AIAssistant";
import { 
  Plus, 
  Search, 
  Users, 
  Edit, 
  Trash2, 
  Filter, 
  Phone, 
  Mail,
  MapPin,
  CreditCard,
  AlertTriangle,
  Eye,
  Send
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type: 'retail' | 'wholesale' | 'distributor';
  creditLimit: number;
  currentDebt: number;
  status: 'active' | 'inactive' | 'overdue';
  totalPurchases: number;
  lastPurchase: string;
  notes: string;
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "Tech Solutions Ltd",
    email: "contact@techsolutions.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Ave, Tech City, TC 12345",
    type: "wholesale",
    creditLimit: 10000,
    currentDebt: 2500,
    status: "active",
    totalPurchases: 45000,
    lastPurchase: "2024-01-15",
    notes: "Regular wholesale customer with excellent payment history"
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 987-6543",
    address: "456 Retail St, Shopping Town, ST 67890",
    type: "retail",
    creditLimit: 1000,
    currentDebt: 0,
    status: "active",
    totalPurchases: 3200,
    lastPurchase: "2024-01-20",
    notes: "Frequent retail customer"
  },
  {
    id: "3",
    name: "Global Distributors Inc",
    email: "orders@globaldist.com",
    phone: "+1 (555) 456-7890",
    address: "789 Distribution Blvd, Warehouse City, WC 11111",
    type: "distributor",
    creditLimit: 50000,
    currentDebt: 15000,
    status: "overdue",
    totalPurchases: 150000,
    lastPurchase: "2023-12-30",
    notes: "Large distributor - payment currently overdue"
  },
];

export default function Clients() {
  const [clients, setClients] = useState(mockClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState<Partial<Client>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    type: "retail",
    creditLimit: 1000,
    notes: "",
  });
  const { toast } = useToast();

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesType = typeFilter === "all" || client.type === typeFilter;
    const matchesStatus = statusFilter === "all" || client.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'retail':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Retail</Badge>;
      case 'wholesale':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Wholesale</Badge>;
      case 'distributor':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Distributor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email || !newClient.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const client: Client = {
      id: Date.now().toString(),
      name: newClient.name!,
      email: newClient.email!,
      phone: newClient.phone!,
      address: newClient.address || "",
      type: newClient.type as 'retail' | 'wholesale' | 'distributor' || 'retail',
      creditLimit: newClient.creditLimit || 1000,
      currentDebt: 0,
      status: 'active',
      totalPurchases: 0,
      lastPurchase: "",
      notes: newClient.notes || "",
    };

    setClients([...clients, client]);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      address: "",
      type: "retail",
      creditLimit: 1000,
      notes: "",
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Client added",
      description: `${client.name} has been added successfully.`,
    });
  };

  const handleEditClient = () => {
    if (!selectedClient) return;

    setClients(clients.map(c => 
      c.id === selectedClient.id ? selectedClient : c
    ));
    setIsEditDialogOpen(false);
    setSelectedClient(null);
    
    toast({
      title: "Client updated",
      description: "Client information has been updated successfully.",
    });
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(clients.filter(c => c.id !== clientId));
    toast({
      title: "Client deleted",
      description: "Client has been removed from the system.",
    });
  };

  const sendReminder = (client: Client) => {
    toast({
      title: "Reminder sent",
      description: `Payment reminder sent to ${client.name} via email and SMS.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
          <p className="text-muted-foreground">Manage customer relationships and accounts</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client profile with contact and business information.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name / Company Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter client name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="client@email.com"
                  value={newClient.email}
                  onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+1 (555) 123-4567"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({...newClient, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Full address"
                  value={newClient.address}
                  onChange={(e) => setNewClient({...newClient, address: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Client Type</Label>
                  <Select 
                    value={newClient.type} 
                    onValueChange={(value) => setNewClient({...newClient, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit ($)</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    placeholder="1000"
                    value={newClient.creditLimit}
                    onChange={(e) => setNewClient({...newClient, creditLimit: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes about the client"
                  value={newClient.notes}
                  onChange={(e) => setNewClient({...newClient, notes: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleAddClient}>
                  Add Client
                </Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clients.length}</div>
            <p className="text-xs text-muted-foreground">
              {clients.filter(c => c.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${clients.reduce((sum, c) => sum + c.currentDebt, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all clients
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clients.filter(c => c.status === 'overdue').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Clients need follow-up
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${clients.reduce((sum, c) => sum + c.totalPurchases, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Debt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Total: ${client.totalPurchases.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(client.type)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        ${client.currentDebt.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Limit: ${client.creditLimit.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedClient(client);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {client.status === 'overdue' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendReminder(client)}
                          className="text-orange-600"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteClient(client.id)}
                        className="text-red-600"
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

      {/* View Client Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedClient?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{selectedClient.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm">{getTypeBadge(selectedClient.type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{selectedClient.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Phone</Label>
                  <p className="text-sm">{selectedClient.phone}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm">{selectedClient.address}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Credit Limit</Label>
                  <p className="text-sm">${selectedClient.creditLimit.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Current Debt</Label>
                  <p className="text-sm">${selectedClient.currentDebt.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Purchases</Label>
                  <p className="text-sm">${selectedClient.totalPurchases.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Purchase</Label>
                  <p className="text-sm">{selectedClient.lastPurchase || 'Never'}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm">{selectedClient.notes || 'No notes'}</p>
                </div>
              </div>
              <Button onClick={() => setIsViewDialogOpen(false)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>
              Update client information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="editName">Name / Company</Label>
                <Input
                  id="editName"
                  value={selectedClient.name}
                  onChange={(e) => setSelectedClient({...selectedClient, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone</Label>
                <Input
                  id="editPhone"
                  value={selectedClient.phone}
                  onChange={(e) => setSelectedClient({...selectedClient, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="editType">Type</Label>
                  <Select
                    value={selectedClient.type}
                    onValueChange={(value) => setSelectedClient({...selectedClient, type: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                      <SelectItem value="distributor">Distributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select
                    value={selectedClient.status}
                    onValueChange={(value) => setSelectedClient({...selectedClient, status: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="editCreditLimit">Credit Limit</Label>
                  <Input
                    id="editCreditLimit"
                    type="number"
                    value={selectedClient.creditLimit}
                    onChange={(e) => setSelectedClient({...selectedClient, creditLimit: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDebt">Current Debt</Label>
                  <Input
                    id="editDebt"
                    type="number"
                    value={selectedClient.currentDebt}
                    onChange={(e) => setSelectedClient({...selectedClient, currentDebt: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editNotes">Notes</Label>
                <Textarea
                  id="editNotes"
                  value={selectedClient.notes}
                  onChange={(e) => setSelectedClient({...selectedClient, notes: e.target.value})}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleEditClient}>
                  Update Client
                </Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Assistant */}
      <AIAssistant context="clients" />
    </div>
  );
}
