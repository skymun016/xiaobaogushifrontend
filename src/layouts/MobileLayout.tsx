import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Grid3X3, ShoppingCart, ClipboardList, User } from 'lucide-react';
import { useCartStore } from '@/lib/store';

const tabs = [
  { label: '首页', icon: Home, path: '/store' },
  { label: '分类', icon: Grid3X3, path: '/store/categories' },
  { label: '购物车', icon: ShoppingCart, path: '/store/cart' },
  { label: '订单', icon: ClipboardList, path: '/store/orders' },
  { label: '我的', icon: User, path: '/store/profile' },
];

export default function MobileLayout() {
  const location = useLocation();
  const cartCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const isActive = (path: string) => {
    if (path === '/store') return location.pathname === '/store';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen flex flex-col relative shadow-xl">
      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-[60px]">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-md border-t border-border/50 flex z-50 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              'flex-1 flex flex-col items-center py-2.5 gap-0.5 text-[11px] transition-all relative',
              isActive(tab.path)
                ? 'text-primary font-semibold'
                : 'text-muted-foreground'
            )}
          >
            <div className="relative">
              <tab.icon className={cn("w-5 h-5 transition-transform", isActive(tab.path) && "scale-110")} />
              {tab.label === '购物车' && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-3 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {cartCount > 99 ? '99' : cartCount}
                </span>
              )}
            </div>
            <span>{tab.label}</span>
            {isActive(tab.path) && (
              <div className="absolute -bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
