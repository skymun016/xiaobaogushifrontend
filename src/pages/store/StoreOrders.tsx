import { mockOrders } from '@/mock/data';
import { formatDateWithDay } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { OrderStatus } from '@/types/enums';

export default function StoreOrders() {
  const [tab, setTab] = useState('all');

  // Only show orders for "our" store
  const storeOrders = mockOrders.filter(o => o.storeId === 's1');
  const filtered = storeOrders.filter(o => {
    if (tab === 'pending') return o.status === OrderStatus.PENDING;
    if (tab === 'processing') return o.status === OrderStatus.PROCESSING;
    if (tab === 'completed') return o.status === OrderStatus.COMPLETED;
    return true;
  });

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">我的订单</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">全部</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">待处理</TabsTrigger>
          <TabsTrigger value="processing" className="flex-1">处理中</TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">已完成</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <ClipboardList className="w-12 h-12 mb-3 opacity-30" />
              <p>暂无订单</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(order => (
                <Link key={order.id} to={`/store/orders/${order.id}`}>
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{order.orderNo}</span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="space-y-1">
                        {order.items.slice(0, 2).map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="truncate">{item.productName} × {item.quantity}</span>
                            <span className="shrink-0 ml-2">¥{(item.salePrice * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p className="text-xs text-muted-foreground">等 {order.items.length} 件商品</p>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t">
                        <span className="text-xs text-muted-foreground">{formatDateWithDay(order.createdAt)}</span>
                        <span className="text-sm font-bold">合计 ¥{order.totalSalePrice.toFixed(2)}</span>
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
  );
}
