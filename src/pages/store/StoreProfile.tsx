import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, MapPin, Phone, ChevronRight, LogOut, ShoppingCart, Clock, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useNavigate } from 'react-router-dom';

export default function StoreProfile() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const menuItems = [
    { label: '门店资料', icon: MapPin, desc: '查看门店详细信息' },
    { label: '联系客服', icon: Phone, desc: '获取帮助与支持' },
  ];

  return (
    <div className="bg-muted min-h-full">
      {/* Header */}
      <div className="bg-background border-b border-border/50 px-5 pt-8 pb-5 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">宿迁总店</h2>
            <p className="text-sm text-muted-foreground mt-0.5">张三 · 13800138001</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4 pb-6">
        {/* Stats */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="grid grid-cols-3 divide-x divide-border/50">
              {[
                { value: '12', label: '总订单', icon: ShoppingCart, color: 'text-primary' },
                { value: '3', label: '处理中', icon: Clock, color: 'text-accent' },
                { value: '9', label: '已完成', icon: CheckCircle2, color: 'text-[hsl(var(--status-success))]' },
              ].map((stat) => (
                <div key={stat.label} className="py-5 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color} opacity-70`} />
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Menu */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            {menuItems.map((item, i) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 text-sm hover:bg-muted/50 transition-colors ${i > 0 ? 'border-t border-border/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            ))}
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/5 rounded-xl h-11"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogOut className="w-4 h-4 mr-2" /> 退出登录
        </Button>
      </div>
    </div>
  );
}
