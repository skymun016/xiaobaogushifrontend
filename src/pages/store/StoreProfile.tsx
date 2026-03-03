import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MapPin, Phone, ChevronRight, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

export default function StoreProfile() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { label: '门店资料', icon: MapPin },
    { label: '联系客服', icon: Phone },
  ];

  return (
    <div>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold">朝阳门店</h2>
            <p className="text-sm opacity-70">张三 · 13800138001</p>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-3 space-y-4">
        {/* Stats */}
        <Card>
          <CardContent className="p-4 grid grid-cols-3 text-center">
            <div>
              <p className="text-xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">总订单</p>
            </div>
            <div>
              <p className="text-xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">处理中</p>
            </div>
            <div>
              <p className="text-xl font-bold">9</p>
              <p className="text-xs text-muted-foreground">已完成</p>
            </div>
          </CardContent>
        </Card>

        {/* Menu */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, i) => (
              <button key={item.label} className={`w-full flex items-center justify-between p-4 text-sm ${i > 0 ? 'border-t' : ''}`}>
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full text-destructive" onClick={() => {
          logout();
          navigate('/');
        }}>
          <LogOut className="w-4 h-4 mr-2" /> 退出登录
        </Button>
      </div>
    </div>
  );
}
