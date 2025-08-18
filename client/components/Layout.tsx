import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeStore } from "@/stores/themeStore";
import { useAuthStore } from "@/stores/authStore";
import { useRBACStore } from "@/stores/rbacStore";
import { useLanguageStore } from "@/stores/languageStore";
import RoleBadge from "@/components/ui/role-badge";
import PermissionGate, { AdminOnly } from "@/components/PermissionGate";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  UserPlus,
  Settings,
  Shield,
  UserCheck,
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  Globe,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AvatarUpload from "@/components/AvatarUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const { currentUser, canAccessRoute } = useRBACStore();
  const { language, setLanguage } = useLanguageStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const allNavigation = [
    {
      name: t("navigation.dashboard"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    { name: t("navigation.warehouse"), href: "/warehouse", icon: Package },
    { name: t("navigation.clients"), href: "/clients", icon: Users },
    { name: t("navigation.sales"), href: "/sales", icon: ShoppingCart },
    { name: t("navigation.finance"), href: "/finance", icon: DollarSign },
    { name: t("navigation.employees"), href: "/employees", icon: UserPlus },
    { name: "User Management", href: "/admin/users", icon: Shield },
    { name: t("navigation.settings"), href: "/settings", icon: Settings },
  ];

  // Filter navigation based on user permissions
  const navigation = allNavigation.filter((item) => canAccessRoute(item.href));

  const handleLogout = () => {
    logout();
    toast({
      title: t("auth.logout"),
      description: "You have been successfully logged out.",
    });
    navigate("/auth/login");
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    toast({
      title: "Language changed",
      description: `Language switched to ${newLanguage === "en" ? "English" : newLanguage === "tg" ? "Тоҷикӣ" : "Русский"}`,
    });
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    // For now, just show success message - would update auth store in real app
    toast({
      title: "Avatar updated",
      description: "Your profile picture has been updated",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 ease-in-out shadow-lg",
          sidebarCollapsed ? "w-16" : "w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-4 py-4 border-b relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all group">
              <Package className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            {!sidebarCollapsed && (
              <div className="transition-opacity duration-200">
                <h1 className="font-bold text-lg">BusinessPro</h1>
                <p className="text-xs text-muted-foreground">Management Suite</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-3 top-4 hidden lg:flex w-6 h-6 rounded-full bg-background border shadow-md hover:shadow-lg transition-all"
            >
              <Menu className="h-3 w-3" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full p-2 h-auto justify-start"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm">
                        {user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                      {currentUser && (
                        <div className="mt-1">
                          <RoleBadge role={currentUser.role} size="sm" />
                        </div>
                      )}
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  {t("navigation.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("auth.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-200",
          sidebarOpen ? "lg:ml-64" : "",
        )}
      >
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center gap-4 px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </Button>

            {/* Search - hidden on small screens */}
            <div className="relative flex-1 max-w-sm hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("common.search") + "..."}
                className="pl-8"
              />
            </div>

            <div className="flex items-center gap-1 md:gap-2">
              {/* Language switcher - smaller on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9"
                  >
                    <Globe className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Language</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("en")}
                    className={language === "en" ? "bg-accent" : ""}
                  >
                    🇺🇸 English
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("tg")}
                    className={language === "tg" ? "bg-accent" : ""}
                  >
                    🇹🇯 Тоҷикӣ
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleLanguageChange("ru")}
                    className={language === "ru" ? "bg-accent" : ""}
                  >
                    🇷🇺 Русский
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme toggle - smaller on mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-8 w-8 md:h-9 md:w-9"
              >
                {theme === "light" ? (
                  <Moon className="h-3 w-3 md:h-4 md:w-4" />
                ) : (
                  <Sun className="h-3 w-3 md:h-4 md:w-4" />
                )}
              </Button>

              {/* Notifications - smaller on mobile */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 md:h-9 md:w-9"
              >
                <Bell className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page content - mobile-optimized padding */}
        <main className="p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
