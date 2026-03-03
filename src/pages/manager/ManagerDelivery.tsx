import { mockFulfillmentTasks } from '@/mock/data';
import { formatDateWithDay } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, MapPin, CheckCircle } from 'lucide-react';
import { FulfillmentStatus } from '@/types/enums';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const statusOrder = [FulfillmentStatus.PICKING, FulfillmentStatus.SHIPPING, FulfillmentStatus.DELIVERING, FulfillmentStatus.RECEIVED];

export default function ManagerDelivery() {
  const activeTasks = mockFulfillmentTasks.filter(t => t.status !== FulfillmentStatus.NOT_TRANSFERRED);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">配送跟踪</h1>

      {activeTasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>暂无配送任务</p>
        </div>
      ) : (
        activeTasks.map(task => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{task.taskNo}</span>
                <StatusBadge status={task.status} />
              </div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{task.storeName}</span>
                <span className="text-xs text-muted-foreground">· {task.orderNo}</span>
              </div>

              {/* Progress steps */}
              <div className="flex items-center gap-1 mb-3">
                {['拣货', '发货', '配送', '签收'].map((step, i) => {
                  const currentIdx = statusOrder.indexOf(task.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} className="flex-1 flex flex-col items-center gap-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        done ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {done ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={`text-[10px] ${done ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{step}</span>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1 mb-3">
                {task.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span>{item.productName}</span>
                    <span className="text-muted-foreground">{item.quantity}{item.unit}</span>
                  </div>
                ))}
              </div>

              {task.status === FulfillmentStatus.DELIVERING && (
                <Button size="sm" className="w-full" onClick={() => toast.success('已确认签收')}>确认签收</Button>
              )}

              <div className="flex gap-2 text-xs text-muted-foreground mt-2">
                {task.pickedAt && <span>拣货: {formatDateWithDay(task.pickedAt)}</span>}
                {task.shippedAt && <span>· 发货: {formatDateWithDay(task.shippedAt)}</span>}
                {task.receivedAt && <span>· 签收: {formatDateWithDay(task.receivedAt)}</span>}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
