import { Link, Outlet, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ClipboardCheck, AlertTriangle, Truck, User } from 'lucide-react';

const tabs = [
  { label: '工作台', icon: LayoutDashboard, path: '/manager' },
  { label: '审核', icon: ClipboardCheck, path: '/manager/applications' },
  { label: '异常', icon: AlertTriangle, path: '/manager/issues' },
  { label: '配送', icon: Truck, path: '/manager/delivery' },
  { label: '我的', icon: User, path: '/manager/profile' },
];

export default function ManagerLayout() {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === '/manager') return location.pathname === '/manager';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen flex flex-col relative shadow-xl">
      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t flex z-50">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              'flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors',
              isActive(tab.path) ? 'text-primary font-medium' : 'text-muted-foreground'
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
