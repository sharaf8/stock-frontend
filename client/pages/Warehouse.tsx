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
  Package, 
  AlertTriangle, 
  Edit, 
  Trash2, 
  Filter, 
  Eye, 
  Barcode, 
  TrendingUp, 
  TrendingDown,
  ArrowUp,
  ArrowDown,
  History,
  Calendar,
  User,
  Package2
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  description: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  location: string;
  expiryDate?: string;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: 'stock_in' | 'stock_out' | 'adjustment';
  quantity: number;
  reason: string;
  notes?: string;
  performedBy: string;
  date: string;
  time: string;
  previousQuantity: number;
  newQuantity: number;
}

interface WarehouseHistory {
  id: string;
  action: 'create' | 'edit' | 'delete' | 'stock_in' | 'stock_out' | 'adjustment';
  entityType: 'product' | 'stock';
  entityId: string;
  entityName: string;
  description: string;
  performedBy: string;
  date: string;
  time: string;
  details?: any;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    category: "Smartphones",
    brand: "Apple",
    sku: "APL-IP15P-128",
    description: "Latest iPhone model with advanced features",
    quantity: 5,
    minStock: 10,
    maxStock: 50,
    costPrice: 799,
    sellingPrice: 999,
    supplier: "Apple Inc.",
    location: "A1-B2",
    expiryDate: "",
    status: "low-stock",
    tags: ["premium", "flagship"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-20"
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    category: "Smartphones", 
    brand: "Samsung",
    sku: "SAM-GS24-256",
    description: "High-end Android smartphone",
    quantity: 15,
    minStock: 10,
    maxStock: 40,
    costPrice: 699,
    sellingPrice: 899,
    supplier: "Samsung Electronics",
    location: "A1-B3",
    status: "in-stock",
    tags: ["android", "flagship"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-18"
  },
  {
    id: "3",
    name: "Nike Air Max",
    category: "Footwear",
    brand: "Nike",
    sku: "NIK-AM90-42",
    description: "Comfortable running shoes",
    quantity: 0,
    minStock: 15,
    maxStock: 60,
    costPrice: 80,
    sellingPrice: 120,
    supplier: "Nike Distribution",
    location: "B2-C1",
    status: "out-of-stock",
    tags: ["sport", "casual"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-15"
  },
  {
    id: "4",
    name: "MacBook Air M3",
    category: "Laptops",
    brand: "Apple",
    sku: "APL-MBA-M3-13",
    description: "Lightweight laptop with M3 chip",
    quantity: 8,
    minStock: 5,
    maxStock: 25,
    costPrice: 1099,
    sellingPrice: 1299,
    supplier: "Apple Inc.",
    location: "C1-D2",
    status: "in-stock",
    tags: ["laptop", "premium"],
    createdAt: "2024-01-01",
    updatedAt: "2024-01-19"
  }
];

const mockStockMovements: StockMovement[] = [
  {
    id: "1",
    productId: "1",
    productName: "iPhone 15 Pro",
    type: "stock_in",
    quantity: 20,
    reason: "New shipment received",
    notes: "Supplier delivery batch #123",
    performedBy: "John Smith",
    date: "2024-01-20",
    time: "14:30",
    previousQuantity: 5,
    newQuantity: 25
  },
  {
    id: "2",
    productId: "2",
    productName: "Samsung Galaxy S24",
    type: "stock_out",
    quantity: 5,
    reason: "Sale to customer",
    notes: "Invoice #INV-2024-002",
    performedBy: "Sarah Johnson",
    date: "2024-01-19",
    time: "11:15",
    previousQuantity: 20,
    newQuantity: 15
  },
  {
    id: "3",
    productId: "3",
    productName: "Nike Air Max",
    type: "adjustment",
    quantity: -2,
    reason: "Damaged items",
    notes: "Found 2 damaged pairs during inspection",
    performedBy: "Mike Chen",
    date: "2024-01-18",
    time: "16:45",
    previousQuantity: 2,
    newQuantity: 0
  }
];

const mockWarehouseHistory: WarehouseHistory[] = [
  {
    id: "1",
    action: "stock_in",
    entityType: "stock",
    entityId: "1",
    entityName: "iPhone 15 Pro",
    description: "Added 20 units - New shipment received",
    performedBy: "John Smith",
    date: "2024-01-20",
    time: "14:30",
    details: { quantity: 20, reason: "New shipment received" }
  },
  {
    id: "2",
    action: "edit",
    entityType: "product",
    entityId: "2",
    entityName: "Samsung Galaxy S24",
    description: "Updated product information",
    performedBy: "Admin",
    date: "2024-01-19",
    time: "15:20",
    details: { field: "price", oldValue: 849, newValue: 899 }
  },
  {
    id: "3",
    action: "stock_out",
    entityType: "stock",
    entityId: "2",
    entityName: "Samsung Galaxy S24",
    description: "Removed 5 units - Sale to customer",
    performedBy: "Sarah Johnson",
    date: "2024-01-19",
    time: "11:15",
    details: { quantity: 5, reason: "Sale to customer" }
  },
  {
    id: "4",
    action: "create",
    entityType: "product",
    entityId: "4",
    entityName: "MacBook Air M3",
    description: "Created new product",
    performedBy: "Admin",
    date: "2024-01-18",
    time: "10:30",
    details: { category: "Laptops", brand: "Apple" }
  },
  {
    id: "5",
    action: "adjustment",
    entityType: "stock",
    entityId: "3",
    entityName: "Nike Air Max",
    description: "Adjusted -2 units - Damaged items",
    performedBy: "Mike Chen",
    date: "2024-01-18",
    time: "16:45",
    details: { quantity: -2, reason: "Damaged items" }
  }
];

export default function Warehouse() {
  const [products, setProducts] = useState(mockProducts);
  const [stockMovements, setStockMovements] = useState(mockStockMovements);
  const [warehouseHistory, setWarehouseHistory] = useState(mockWarehouseHistory);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [historyFilter, setHistoryFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isStockInDialogOpen, setIsStockInDialogOpen] = useState(false);
  const [isStockOutDialogOpen, setIsStockOutDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [stockReason, setStockReason] = useState("");
  const [stockNotes, setStockNotes] = useState("");
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    category: "",
    brand: "",
    sku: "",
    description: "",
    quantity: 0,
    minStock: 0,
    maxStock: 0,
    costPrice: 0,
    sellingPrice: 0,
    supplier: "",
    location: "",
    tags: [],
    status: "in-stock"
  });
  const { toast } = useToast();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredHistory = warehouseHistory.filter(history => {
    const matchesFilter = historyFilter === "all" || history.action === historyFilter;
    return matchesFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'low-stock':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      case 'discontinued':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Discontinued</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getMovementTypeBadge = (type: string) => {
    switch (type) {
      case 'stock_in':
        return <Badge variant="default" className="bg-green-100 text-green-800">Stock In</Badge>;
      case 'stock_out':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Stock Out</Badge>;
      case 'adjustment':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Adjustment</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge variant="default" className="bg-green-100 text-green-800">Created</Badge>;
      case 'edit':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Edited</Badge>;
      case 'delete':
        return <Badge variant="destructive">Deleted</Badge>;
      case 'stock_in':
        return <Badge variant="default" className="bg-green-100 text-green-800">Stock In</Badge>;
      case 'stock_out':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Stock Out</Badge>;
      case 'adjustment':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">Adjustment</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const calculateStatus = (quantity: number, minStock: number): Product['status'] => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity <= minStock) return 'low-stock';
    return 'in-stock';
  };

  const addStockMovement = (productId: string, type: 'stock_in' | 'stock_out' | 'adjustment', quantity: number, reason: string, notes?: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const movement: StockMovement = {
      id: Date.now().toString(),
      productId,
      productName: product.name,
      type,
      quantity,
      reason,
      notes,
      performedBy: "Current User", // In real app, get from auth context
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      previousQuantity: product.quantity,
      newQuantity: type === 'stock_out' ? product.quantity - quantity : product.quantity + quantity
    };

    setStockMovements([movement, ...stockMovements]);

    // Add to warehouse history
    const historyEntry: WarehouseHistory = {
      id: Date.now().toString() + "_history",
      action: type,
      entityType: "stock",
      entityId: productId,
      entityName: product.name,
      description: `${type === 'stock_in' ? 'Added' : type === 'stock_out' ? 'Removed' : 'Adjusted'} ${quantity} units - ${reason}`,
      performedBy: "Current User",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: { quantity, reason, notes }
    };

    setWarehouseHistory([historyEntry, ...warehouseHistory]);
  };

  const handleStockIn = () => {
    if (!selectedProduct || stockQuantity <= 0 || !stockReason.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        const newQuantity = product.quantity + stockQuantity;
        return {
          ...product,
          quantity: newQuantity,
          status: calculateStatus(newQuantity, product.minStock),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    addStockMovement(selectedProduct.id, 'stock_in', stockQuantity, stockReason, stockNotes);

    toast({
      title: "Stock Added",
      description: `Added ${stockQuantity} units to ${selectedProduct.name}`,
    });

    // Reset form
    setStockQuantity(0);
    setStockReason("");
    setStockNotes("");
    setIsStockInDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleStockOut = () => {
    if (!selectedProduct || stockQuantity <= 0 || !stockReason.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (stockQuantity > selectedProduct.quantity) {
      toast({
        title: "Error",
        description: "Cannot remove more stock than available",
        variant: "destructive",
      });
      return;
    }

    const updatedProducts = products.map(product => {
      if (product.id === selectedProduct.id) {
        const newQuantity = product.quantity - stockQuantity;
        return {
          ...product,
          quantity: newQuantity,
          status: calculateStatus(newQuantity, product.minStock),
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return product;
    });

    setProducts(updatedProducts);
    addStockMovement(selectedProduct.id, 'stock_out', stockQuantity, stockReason, stockNotes);

    toast({
      title: "Stock Removed",
      description: `Removed ${stockQuantity} units from ${selectedProduct.name}`,
    });

    // Reset form
    setStockQuantity(0);
    setStockReason("");
    setStockNotes("");
    setIsStockOutDialogOpen(false);
    setSelectedProduct(null);
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.category || !newProduct.sku) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Category, SKU)",
        variant: "destructive",
      });
      return;
    }

    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      category: newProduct.category!,
      brand: newProduct.brand || "",
      sku: newProduct.sku!,
      description: newProduct.description || "",
      quantity: newProduct.quantity || 0,
      minStock: newProduct.minStock || 0,
      maxStock: newProduct.maxStock || 0,
      costPrice: newProduct.costPrice || 0,
      sellingPrice: newProduct.sellingPrice || 0,
      supplier: newProduct.supplier || "",
      location: newProduct.location || "",
      tags: newProduct.tags || [],
      status: calculateStatus(newProduct.quantity || 0, newProduct.minStock || 0),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setProducts([...products, product]);

    // Add to warehouse history
    const historyEntry: WarehouseHistory = {
      id: Date.now().toString() + "_history",
      action: "create",
      entityType: "product",
      entityId: product.id,
      entityName: product.name,
      description: `Created new product: ${product.name}`,
      performedBy: "Current User",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: { category: product.category, brand: product.brand, sku: product.sku }
    };

    setWarehouseHistory([historyEntry, ...warehouseHistory]);

    setNewProduct({
      name: "",
      category: "",
      brand: "",
      sku: "",
      description: "",
      quantity: 0,
      minStock: 0,
      maxStock: 0,
      costPrice: 0,
      sellingPrice: 0,
      supplier: "",
      location: "",
      tags: [],
      status: "in-stock"
    });
    setIsAddDialogOpen(false);

    toast({
      title: "Product added",
      description: `${product.name} has been added to inventory.`,
    });
  };

  const deleteProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setProducts(products.filter(p => p.id !== productId));

    // Add to warehouse history
    const historyEntry: WarehouseHistory = {
      id: Date.now().toString() + "_history",
      action: "delete",
      entityType: "product",
      entityId: productId,
      entityName: product.name,
      description: `Deleted product: ${product.name}`,
      performedBy: "Current User",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      details: { deletedProduct: product }
    };

    setWarehouseHistory([historyEntry, ...warehouseHistory]);

    toast({
      title: "Product deleted",
      description: `${product.name} has been removed from inventory.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Warehouse Management</h1>
          <p className="text-muted-foreground">Manage inventory, stock movements, and track warehouse activities</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product in your inventory system.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="iPhone 15 Pro"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    placeholder="APL-IP15P-128"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={newProduct.category} 
                    onValueChange={(value) => setNewProduct({...newProduct, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Smartphones">Smartphones</SelectItem>
                      <SelectItem value="Laptops">Laptops</SelectItem>
                      <SelectItem value="Tablets">Tablets</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                      <SelectItem value="Footwear">Footwear</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="Apple"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Product description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Initial Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({...newProduct, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="0"
                    value={newProduct.minStock}
                    onChange={(e) => setNewProduct({...newProduct, minStock: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxStock">Max Stock</Label>
                  <Input
                    id="maxStock"
                    type="number"
                    min="0"
                    value={newProduct.maxStock}
                    onChange={(e) => setNewProduct({...newProduct, maxStock: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price ($)</Label>
                  <Input
                    id="costPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.costPrice}
                    onChange={(e) => setNewProduct({...newProduct, costPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price ($)</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({...newProduct, sellingPrice: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input
                    id="supplier"
                    placeholder="Apple Inc."
                    value={newProduct.supplier}
                    onChange={(e) => setNewProduct({...newProduct, supplier: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="A1-B2"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={addProduct}>
                  Add Product
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
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter(p => p.status === 'in-stock').length} in stock
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {products.filter(p => p.status === 'low-stock').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need immediate attention
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {products.filter(p => p.status === 'out-of-stock').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require restocking
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${products.reduce((sum, p) => sum + (p.quantity * p.costPrice), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="history">Warehouse History</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Product List */}
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Smartphones">Smartphones</SelectItem>
                    <SelectItem value="Laptops">Laptops</SelectItem>
                    <SelectItem value="Tablets">Tablets</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Footwear">Footwear</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">{product.brand}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono text-sm">{product.sku}</div>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        <div className="font-medium">{product.quantity}</div>
                        <div className="text-xs text-muted-foreground">
                          Min: {product.minStock} | Max: {product.maxStock}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                      <TableCell>
                        <div className="font-medium">${(product.quantity * product.costPrice).toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">
                          @${product.costPrice}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsStockInDialogOpen(true);
                            }}
                          >
                            <ArrowUp className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsStockOutDialogOpen(true);
                            }}
                          >
                            <ArrowDown className="h-4 w-4 text-red-600" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteProduct(product.id)}
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

        <TabsContent value="movements" className="space-y-4">
          {/* Stock Movements */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>Track all stock in, stock out, and adjustment activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Stock Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{movement.date}</div>
                          <div className="text-sm text-muted-foreground">{movement.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{movement.productName}</div>
                      </TableCell>
                      <TableCell>{getMovementTypeBadge(movement.type)}</TableCell>
                      <TableCell>
                        <div className={`font-medium ${movement.type === 'stock_in' ? 'text-green-600' : movement.type === 'stock_out' ? 'text-red-600' : 'text-orange-600'}`}>
                          {movement.type === 'stock_in' ? '+' : movement.type === 'stock_out' ? '-' : ''}
                          {movement.quantity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{movement.reason}</div>
                        {movement.notes && (
                          <div className="text-xs text-muted-foreground">{movement.notes}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{movement.performedBy}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {movement.previousQuantity} → {movement.newQuantity}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {/* Warehouse History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Warehouse History
              </CardTitle>
              <div className="flex gap-4">
                <Select value={historyFilter} onValueChange={setHistoryFilter}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Created</SelectItem>
                    <SelectItem value="edit">Edited</SelectItem>
                    <SelectItem value="delete">Deleted</SelectItem>
                    <SelectItem value="stock_in">Stock In</SelectItem>
                    <SelectItem value="stock_out">Stock Out</SelectItem>
                    <SelectItem value="adjustment">Adjustments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Performed By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHistory.map((history) => (
                    <TableRow key={history.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{history.date}</div>
                            <div className="text-sm text-muted-foreground">{history.time}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(history.action)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {history.entityType === 'product' ? <Package2 className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                          <div>
                            <div className="font-medium">{history.entityName}</div>
                            <div className="text-sm text-muted-foreground capitalize">{history.entityType}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{history.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{history.performedBy}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock In Dialog */}
      <Dialog open={isStockInDialogOpen} onOpenChange={setIsStockInDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowUp className="h-5 w-5 text-green-600" />
              Stock In
            </DialogTitle>
            <DialogDescription>
              Add stock for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stockInQuantity">Quantity to Add *</Label>
              <Input
                id="stockInQuantity"
                type="number"
                min="1"
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockInReason">Reason *</Label>
              <Select value={stockReason} onValueChange={setStockReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New shipment received">New shipment received</SelectItem>
                  <SelectItem value="Supplier delivery">Supplier delivery</SelectItem>
                  <SelectItem value="Return from customer">Return from customer</SelectItem>
                  <SelectItem value="Transfer from another location">Transfer from another location</SelectItem>
                  <SelectItem value="Production completed">Production completed</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockInNotes">Notes (Optional)</Label>
              <Textarea
                id="stockInNotes"
                value={stockNotes}
                onChange={(e) => setStockNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            {selectedProduct && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Current Stock: <span className="font-medium">{selectedProduct.quantity}</span></div>
                <div className="text-sm text-muted-foreground">New Stock: <span className="font-medium">{selectedProduct.quantity + stockQuantity}</span></div>
              </div>
            )}
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleStockIn}>
                <ArrowUp className="mr-2 h-4 w-4" />
                Add Stock
              </Button>
              <Button variant="outline" onClick={() => {
                setIsStockInDialogOpen(false);
                setStockQuantity(0);
                setStockReason("");
                setStockNotes("");
                setSelectedProduct(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Out Dialog */}
      <Dialog open={isStockOutDialogOpen} onOpenChange={setIsStockOutDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDown className="h-5 w-5 text-red-600" />
              Stock Out
            </DialogTitle>
            <DialogDescription>
              Remove stock for {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stockOutQuantity">Quantity to Remove *</Label>
              <Input
                id="stockOutQuantity"
                type="number"
                min="1"
                max={selectedProduct?.quantity || 0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockOutReason">Reason *</Label>
              <Select value={stockReason} onValueChange={setStockReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sale to customer">Sale to customer</SelectItem>
                  <SelectItem value="Damaged items">Damaged items</SelectItem>
                  <SelectItem value="Lost items">Lost items</SelectItem>
                  <SelectItem value="Transfer to another location">Transfer to another location</SelectItem>
                  <SelectItem value="Return to supplier">Return to supplier</SelectItem>
                  <SelectItem value="Expired items">Expired items</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockOutNotes">Notes (Optional)</Label>
              <Textarea
                id="stockOutNotes"
                value={stockNotes}
                onChange={(e) => setStockNotes(e.target.value)}
                placeholder="Additional notes..."
                rows={3}
              />
            </div>
            {selectedProduct && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Current Stock: <span className="font-medium">{selectedProduct.quantity}</span></div>
                <div className="text-sm text-muted-foreground">Remaining Stock: <span className="font-medium">{Math.max(0, selectedProduct.quantity - stockQuantity)}</span></div>
                {stockQuantity > selectedProduct.quantity && (
                  <div className="text-sm text-red-600 mt-1">⚠️ Cannot remove more than available stock</div>
                )}
              </div>
            )}
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleStockOut}>
                <ArrowDown className="mr-2 h-4 w-4" />
                Remove Stock
              </Button>
              <Button variant="outline" onClick={() => {
                setIsStockOutDialogOpen(false);
                setStockQuantity(0);
                setStockReason("");
                setStockNotes("");
                setSelectedProduct(null);
              }}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Details: {selectedProduct?.name}
            </DialogTitle>
            <DialogDescription>
              Complete product information and inventory status
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-muted-foreground">SKU</div>
                  <div className="font-mono">{selectedProduct.sku}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div>{selectedProduct.category}</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div>{selectedProduct.description || "No description available"}</div>
              </div>

              <div className="grid grid-cols-3 gap-4 border rounded-lg p-4">
                <div>
                  <div className="text-sm text-muted-foreground">Current Stock</div>
                  <div className="text-2xl font-bold">{selectedProduct.quantity}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Min Stock</div>
                  <div className="text-lg">{selectedProduct.minStock}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Max Stock</div>
                  <div className="text-lg">{selectedProduct.maxStock}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
                <div>
                  <div className="text-sm text-muted-foreground">Cost Price</div>
                  <div className="text-lg font-semibold">${selectedProduct.costPrice}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Selling Price</div>
                  <div className="text-lg font-semibold text-green-600">${selectedProduct.sellingPrice}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <div>Location: {selectedProduct.location || "N/A"}</div>
                  <div>Created: {selectedProduct.createdAt}</div>
                </div>
                <div>
                  <div>Updated: {selectedProduct.updatedAt}</div>
                  <div>Profit Margin: {selectedProduct.sellingPrice > 0 ? (((selectedProduct.sellingPrice - selectedProduct.costPrice) / selectedProduct.sellingPrice) * 100).toFixed(1) : 0}%</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* AI Assistant */}
      <AIAssistant context="warehouse" />
    </div>
  );
}
