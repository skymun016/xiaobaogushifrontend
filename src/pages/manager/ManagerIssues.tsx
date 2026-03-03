import { mockFulfillmentTasks, mockPurchaseOrders } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertTriangle, Send } from 'lucide-react';
import { FulfillmentStatus, PurchaseOrderStatus } from '@/types/enums';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ManagerIssues() {
  const [showReport, setShowReport] = useState(false);

  const abnormalTasks = mockFulfillmentTasks.filter(t => t.status === FulfillmentStatus.ABNORMAL);
  const abnormalPOs = mockPurchaseOrders.filter(po => po.status === PurchaseOrderStatus.ABNORMAL);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-lg font-bold">异常上报</h1>

      <Button className="w-full" onClick={() => setShowReport(true)}>
        <Send className="w-4 h-4 mr-2" />上报新异常
      </Button>

      {abnormalTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-2 text-status-error">履约异常 ({abnormalTasks.length})</h2>
          {abnormalTasks.map(t => (
            <Card key={t.id} className="mb-2">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{t.taskNo}</span>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-sm font-medium">{t.storeName} - {t.orderNo}</p>
                <p className="text-xs text-status-error mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />{t.abnormalReason}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {abnormalPOs.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-2 text-status-error">采购异常 ({abnormalPOs.length})</h2>
          {abnormalPOs.map(po => (
            <Card key={po.id} className="mb-2">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{po.poNo}</span>
                  <StatusBadge status={po.status} />
                </div>
                <p className="text-sm font-medium">{po.supplierName}</p>
                <p className="text-xs text-status-error mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />{po.abnormalReason}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {abnormalTasks.length === 0 && abnormalPOs.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>暂无异常</p>
        </div>
      )}

      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>上报异常</DialogTitle>
            <DialogDescription>描述异常情况</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium">关联单号</label><Input placeholder="订单号或采购单号" /></div>
            <div className="space-y-2"><label className="text-sm font-medium">异常描述</label><Textarea placeholder="请详细描述异常情况" rows={3} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReport(false)}>取消</Button>
            <Button onClick={() => { toast.success('异常已上报'); setShowReport(false); }}>提交</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
