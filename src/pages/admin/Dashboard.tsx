import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDashboardStats, mockRevenueData, mockOrders } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { ShoppingCart, AlertTriangle, Clock, Package, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';

const stats = mockDashboardStats;

const statCards = [
  { label: '今日订单', value: stats.todayOrders, icon: ShoppingCart, color: 'text-primary' },
  { label: '今日营收', value: `¥${stats.todayRevenue.toFixed(0)}`, icon: DollarSign, color: 'text-status-success' },
  { label: '待处理订单', value: stats.pendingOrders, icon: Clock, color: 'text-status-pending' },
  { label: '待审核申请', value: stats.pendingApplications, icon: Package, color: 'text-status-processing' },
  { label: '采购异常', value: stats.procurementAbnormal, icon: AlertTriangle, color: 'text-status-error' },
  { label: '库存预警', value: stats.lowStockItems, icon: TrendingUp, color: 'text-status-pending' },
];

export default function Dashboard() {
  const recentOrders = mockOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">工作台</h1>
        <p className="text-muted-foreground">欢迎回来，查看今日经营概览</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">营收与利润趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" name="营收" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} />
                  <Area type="monotone" dataKey="profit" name="利润" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">最近订单</CardTitle>
            <Link to="/admin/orders" className="text-xs text-primary hover:underline">查看全部</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <Link key={order.id} to={`/admin/orders/${order.id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{order.storeName}</p>
                  <p className="text-xs text-muted-foreground">{order.orderNo}</p>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-sm font-medium">¥{order.totalSalePrice.toFixed(0)}</p>
                  <StatusBadge status={order.status} />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* To-do list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">待办事项</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link to="/admin/orders?tab=applications" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-status-pending-bg flex items-center justify-center">
                <Clock className="w-5 h-5 text-status-pending" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.pendingApplications} 条申请待审核</p>
                <p className="text-xs text-muted-foreground">需要尽快处理</p>
              </div>
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-status-processing-bg flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-status-processing" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.pendingOrders} 个订单待处理</p>
                <p className="text-xs text-muted-foreground">录入物流成本</p>
              </div>
            </Link>
            <Link to="/admin/procurement" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-status-error-bg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-status-error" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.procurementAbnormal} 条采购异常</p>
                <p className="text-xs text-muted-foreground">需要切换供应商</p>
              </div>
            </Link>
            <Link to="/admin/inventory" className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-status-pending-bg flex items-center justify-center">
                <Package className="w-5 h-5 text-status-pending" />
              </div>
              <div>
                <p className="text-sm font-medium">{stats.lowStockItems} 个商品库存预警</p>
                <p className="text-xs text-muted-foreground">低于安全库存</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
