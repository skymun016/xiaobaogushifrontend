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
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t flex z-50">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors relative',
              isActive(tab.path)
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            )}
          >
            <div className="relative">
              <tab.icon className="w-5 h-5" />
              {tab.label === '购物车' && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 99 ? '99' : cartCount}
                </span>
              )}
            </div>
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
