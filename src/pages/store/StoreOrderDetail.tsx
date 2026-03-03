import { useParams, Link } from 'react-router-dom';
import { formatDateWithDay } from '@/lib/utils';
import { mockOrders } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText } from 'lucide-react';

export default function StoreOrderDetail() {
  const { id } = useParams();
  const order = mockOrders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">订单不存在</p>
        <Button variant="link" asChild><Link to="/store/orders">返回订单列表</Link></Button>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center gap-3 mb-3">
          <Link to="/store/orders"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-base font-bold">订单详情</h1>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">{order.orderNo}</p>
            <StatusBadge status={order.status} className="mt-1 bg-primary-foreground/20 text-primary-foreground" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status steps */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold">订单进度</h3>
            </div>
            <div className="space-y-3 pl-2">
              {order.timeline.map((event, i) => (
                <div key={i} className="relative pl-5">
                  <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full ${
                    i === order.timeline.length - 1 ? 'bg-primary' : 'bg-border'
                  }`} />
                  {i < order.timeline.length - 1 && (
                    <div className="absolute left-[4px] top-4 bottom-0 w-px bg-border h-full" />
                  )}
                  <p className="text-sm font-medium">{event.title}</p>
                  {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                  <p className="text-xs text-muted-foreground">{formatDateWithDay(event.time)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Items - only sale price */}
        <Card>
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-3">商品明细</h3>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1.5 border-b last:border-0">
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.spec} × {item.quantity}{item.unit}</p>
                  </div>
                  <p className="font-medium shrink-0">¥{(item.salePrice * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-3 mt-2 border-t font-bold text-sm">
              <span>合计</span>
              <span className="text-primary">¥{order.totalSalePrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment & fulfillment */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">支付状态</span>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">配送状态</span>
              <StatusBadge status={order.fulfillmentStatus} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">下单时间</span>
              <span>{formatDateWithDay(order.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
