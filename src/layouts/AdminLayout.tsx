import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/store';
import {
  LayoutDashboard, Package, Warehouse, ShoppingCart, Truck, Users, FileText,
  DollarSign, Bell, Settings, ChevronLeft, ChevronRight, LogOut, Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const navItems = [
  { label: '工作台', icon: LayoutDashboard, path: '/admin' },
  { label: '商品中心', icon: Package, path: '/admin/products' },
  { label: '库存中心', icon: Warehouse, path: '/admin/inventory' },
  { label: '订单中心', icon: ShoppingCart, path: '/admin/orders' },
  { label: '供应商中心', icon: Users, path: '/admin/suppliers' },
  { label: '采购单中心', icon: FileText, path: '/admin/procurement' },
  { label: '履约配送', icon: Truck, path: '/admin/fulfillment' },
  { label: '财务中心', icon: DollarSign, path: '/admin/finance' },
  { label: '通知系统', icon: Bell, path: '/admin/notifications' },
  { label: '系统设置', icon: Settings, path: '/admin/settings' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { userName, logout } = useAuthStore();

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const sidebar = (
    <div className={cn(
      'flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-lg font-bold text-sidebar-primary-foreground tracking-tight">
            小堡故事订货管理系统
          </h1>
        )}
        {collapsed && <Package className="w-6 h-6 text-sidebar-primary mx-auto" />}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-md text-sm transition-colors',
              isActive(item.path)
                ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn('flex items-center', collapsed ? 'justify-center' : 'gap-3')}>
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-medium shrink-0">
            {userName?.[0] || 'A'}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName || '管理员'}</p>
              <p className="text-xs text-sidebar-foreground/60">管理后台</p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:text-sidebar-accent-foreground" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden lg:flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-foreground/60 hover:text-sidebar-foreground"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex h-full shrink-0">
        {sidebar}
      </aside>

      {/* Sidebar - Mobile */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {sidebar}
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b bg-card flex items-center px-4 gap-4 shrink-0">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <ThemeSwitcher />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
