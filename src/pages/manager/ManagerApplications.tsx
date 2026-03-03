import { mockOrders } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AuditStatus } from '@/types/enums';
import { ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ManagerApplications() {
  const applications = mockOrders.filter(o => o.isApplication);

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">申请订货审核</h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ClipboardCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>暂无申请</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(order => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{order.orderNo}</span>
                  {order.auditStatus && <StatusBadge status={order.auditStatus} />}
                </div>
                <p className="text-sm font-medium">{order.storeName}</p>
                <div className="mt-2 space-y-1">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-xs text-muted-foreground">
                      <span>{item.productName} × {item.quantity}</span>
                      <span>¥{(item.salePrice * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t">
                  <span className="text-sm font-bold">¥{order.totalSalePrice.toFixed(2)}</span>
                  {order.auditStatus === AuditStatus.PENDING && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => toast.error('已驳回')}>驳回</Button>
                      <Button size="sm" onClick={() => toast.success('已通过')}>通过</Button>
                    </div>
                  )}
                </div>
                {order.remark && (
                  <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">备注：{order.remark}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
