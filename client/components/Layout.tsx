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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      {/* Enhanced Sidebar with Glassmorphism */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-r border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-500 ease-in-out shadow-business-xl",
          sidebarCollapsed ? "w-16" : "w-72",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Logo Section */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200/30 dark:border-gray-700/30 relative">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-xl flex items-center justify-center shadow-business-lg hover:shadow-business-xl transition-all duration-300 hover:scale-110 animate-glow">
                <Package className="h-6 w-6 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl" />
            </div>
            {!sidebarCollapsed && (
              <div className="transition-all duration-300 opacity-100">
                <h1 className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  BusinessPro
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Management Suite
                </p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -right-4 top-6 hidden lg:flex w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-business hover:shadow-business-md transition-all duration-300 hover:scale-110"
            >
              <Menu
                className={cn(
                  "h-4 w-4 transition-transform duration-300",
                  sidebarCollapsed && "rotate-180",
                )}
              />
            </Button>
          </div>

          {/* Enhanced Navigation */}
          <TooltipProvider>
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item, index) => {
                const isActive = location.pathname === item.href;
                const NavItem = (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "relative flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                      sidebarCollapsed ? "justify-center px-3" : "",
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary-light text-white shadow-business-lg hover:shadow-business-xl"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/50 hover:shadow-business",
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Background Effect */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-light/20 animate-pulse" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "relative z-10 p-1.5 rounded-lg transition-all duration-300",
                        isActive
                          ? "bg-white/20"
                          : "group-hover:bg-primary/10 group-hover:scale-110",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive
                            ? "text-white drop-shadow-sm"
                            : "text-gray-600 dark:text-gray-400 group-hover:text-primary",
                        )}
                      />
                    </div>

                    {/* Text */}
                    {!sidebarCollapsed && (
                      <span
                        className={cn(
                          "relative z-10 transition-all duration-300 font-semibold tracking-tight",
                          isActive && "text-white drop-shadow-sm",
                        )}
                      >
                        {item.name}
                      </span>
                    )}

                    {/* Active Indicator */}
                    {isActive && !sidebarCollapsed && (
                      <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </Link>
                );

                return sidebarCollapsed ? (
                  <Tooltip key={item.name} delayDuration={100}>
                    <TooltipTrigger asChild>{NavItem}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-0 shadow-business-lg"
                    >
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  NavItem
                );
              })}
            </nav>
          </TooltipProvider>

          {/* User section */}
          <div className="p-2 border-t">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full p-2 h-auto transition-all duration-200 hover:bg-muted",
                    sidebarCollapsed ? "justify-center" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center w-full",
                      sidebarCollapsed ? "justify-center" : "gap-3",
                    )}
                  >
                    <Avatar className="w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm font-medium">
                        {user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {!sidebarCollapsed && (
                      <>
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
                      </>
                    )}
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
          "transition-all duration-300",
          sidebarOpen ? (sidebarCollapsed ? "lg:ml-16" : "lg:ml-64") : "",
        )}
      >
        {/* Enhanced Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-business">
          <div className="flex items-center gap-6 px-6 py-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-2">
              {/* Enhanced Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-10 w-10 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 relative group"
                  >
                    <Globe className="h-4 w-4 transition-transform group-hover:rotate-12" />
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

              {/* Enhanced Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-10 w-10 rounded-xl relative overflow-hidden group hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
              >
                <div className="relative z-10">
                  {theme === "light" ? (
                    <Moon className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 group-hover:rotate-12" />
                  ) : (
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all duration-500 group-hover:rotate-180" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 dark:from-blue-400/10 dark:to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
              </Button>

              {/* Enhanced Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 rounded-xl relative group hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
              >
                <Bell className="h-4 w-4 group-hover:animate-pulse" />
                {/* Enhanced Notification Badge */}
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-pulse shadow-business">
                  3
                </span>
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
