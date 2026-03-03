import { mockOrders } from '@/mock/data';
import { formatDateWithDay } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ClipboardList, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { OrderStatus } from '@/types/enums';

export default function StoreOrders() {
  const [tab, setTab] = useState('all');

  const storeOrders = mockOrders.filter(o => o.storeId === 's1');
  const filtered = storeOrders.filter(o => {
    if (tab === 'pending') return o.status === OrderStatus.PENDING;
    if (tab === 'processing') return o.status === OrderStatus.PROCESSING;
    if (tab === 'completed') return o.status === OrderStatus.COMPLETED;
    return true;
  });

  return (
    <div className="bg-muted min-h-full">
      <div className="bg-background border-b border-border/50 px-4 pt-4 pb-3 sticky top-0 z-20">
        <h1 className="text-lg font-bold text-foreground">我的订单</h1>
      </div>
      <div className="p-4">

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full bg-card rounded-xl p-1 h-auto">
            <TabsTrigger value="all" className="flex-1 rounded-lg text-xs py-2 data-[state=active]:shadow-sm">全部</TabsTrigger>
            <TabsTrigger value="pending" className="flex-1 rounded-lg text-xs py-2 data-[state=active]:shadow-sm">待处理</TabsTrigger>
            <TabsTrigger value="processing" className="flex-1 rounded-lg text-xs py-2 data-[state=active]:shadow-sm">处理中</TabsTrigger>
            <TabsTrigger value="completed" className="flex-1 rounded-lg text-xs py-2 data-[state=active]:shadow-sm">已完成</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-4">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8 opacity-30" />
                </div>
                <p className="font-medium text-foreground">暂无订单</p>
                <p className="text-sm mt-1">您的订单记录将在这里显示</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(order => (
                  <Link key={order.id} to={`/store/orders/${order.id}`}>
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow mb-3">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2.5">
                          <span className="text-xs text-muted-foreground font-mono">{order.orderNo}</span>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="space-y-1.5">
                          {order.items.slice(0, 2).map(item => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="truncate text-foreground">{item.productName} × {item.quantity}</span>
                              <span className="shrink-0 ml-2 text-muted-foreground">¥{(item.salePrice * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-xs text-muted-foreground">等 {order.items.length} 件商品</p>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50">
                          <span className="text-xs text-muted-foreground">{formatDateWithDay(order.createdAt)}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-foreground">¥{order.totalSalePrice.toFixed(2)}</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
