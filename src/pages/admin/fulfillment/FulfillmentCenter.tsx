import { useState } from 'react';
import { formatDateWithDay } from '@/lib/utils';
import { mockFulfillmentTasks } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Truck, Package, CheckCircle, AlertTriangle, ClipboardCheck } from 'lucide-react';
import { FulfillmentStatus } from '@/types/enums';
import { toast } from 'sonner';

export default function FulfillmentCenter() {
  const [tab, setTab] = useState('all');
  const [showPick, setShowPick] = useState<string | null>(null);
  const pickTask = mockFulfillmentTasks.find(t => t.id === showPick);

  const filtered = mockFulfillmentTasks.filter(t => {
    if (tab === 'picking') return t.status === FulfillmentStatus.PICKING;
    if (tab === 'shipping') return t.status === FulfillmentStatus.SHIPPING;
    if (tab === 'received') return t.status === FulfillmentStatus.RECEIVED;
    if (tab === 'abnormal') return t.status === FulfillmentStatus.ABNORMAL;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">履约配送</h1>
        <p className="text-muted-foreground">出库任务、拣货发货、签收管理</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><ClipboardCheck className="w-8 h-8 text-status-pending" /><div><p className="text-2xl font-bold">{mockFulfillmentTasks.filter(t => t.status === FulfillmentStatus.PICKING).length}</p><p className="text-xs text-muted-foreground">待拣货</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Truck className="w-8 h-8 text-status-processing" /><div><p className="text-2xl font-bold">{mockFulfillmentTasks.filter(t => t.status === FulfillmentStatus.SHIPPING || t.status === FulfillmentStatus.DELIVERING).length}</p><p className="text-xs text-muted-foreground">配送中</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><CheckCircle className="w-8 h-8 text-status-success" /><div><p className="text-2xl font-bold">{mockFulfillmentTasks.filter(t => t.status === FulfillmentStatus.RECEIVED).length}</p><p className="text-xs text-muted-foreground">已签收</p></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-status-error" /><div><p className="text-2xl font-bold">{mockFulfillmentTasks.filter(t => t.status === FulfillmentStatus.ABNORMAL).length}</p><p className="text-xs text-muted-foreground">履约异常</p></div></div></CardContent></Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">全部 ({mockFulfillmentTasks.length})</TabsTrigger>
          <TabsTrigger value="picking">待拣货</TabsTrigger>
          <TabsTrigger value="shipping">待发货</TabsTrigger>
          <TabsTrigger value="received">已签收</TabsTrigger>
          <TabsTrigger value="abnormal">异常</TabsTrigger>
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {filtered.length === 0 ? (
            <Card><CardContent className="py-16 text-center text-muted-foreground"><Package className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>暂无任务</p></CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>任务编号</TableHead>
                      <TableHead>关联订单</TableHead>
                      <TableHead>门店</TableHead>
                      <TableHead>商品数</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作人</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-xs font-medium">{t.taskNo}</TableCell>
                        <TableCell className="text-primary text-sm">{t.orderNo}</TableCell>
                        <TableCell>{t.storeName}</TableCell>
                        <TableCell>{t.items.length}</TableCell>
                        <TableCell><StatusBadge status={t.status} /></TableCell>
                        <TableCell>{t.operator || '-'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{formatDateWithDay(t.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {t.status === FulfillmentStatus.PICKING && (
                              <Button size="sm" onClick={() => setShowPick(t.id)}>拣货</Button>
                            )}
                            {t.status === FulfillmentStatus.SHIPPING && (
                              <Button size="sm" onClick={() => toast.success('已确认发货')}>发货</Button>
                            )}
                            {t.status === FulfillmentStatus.DELIVERING && (
                              <Button size="sm" onClick={() => toast.success('已确认签收')}>签收</Button>
                            )}
                            {t.status === FulfillmentStatus.ABNORMAL && (
                              <Button size="sm" variant="outline" className="text-status-error" onClick={() => toast.success('异常已上报')}>处理异常</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Pick Dialog */}
      <Dialog open={!!showPick} onOpenChange={() => setShowPick(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>拣货确认</DialogTitle>
            <DialogDescription>任务 {pickTask?.taskNo} - {pickTask?.storeName}</DialogDescription>
          </DialogHeader>
          {pickTask && (
            <div className="space-y-3">
              {pickTask.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg border">
                  <Checkbox defaultChecked={item.picked} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity}{item.unit}</p>
                  </div>
                  <Badge variant={item.picked ? 'default' : 'secondary'}>{item.picked ? '已拣' : '待拣'}</Badge>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPick(null)}>取消</Button>
            <Button onClick={() => { toast.success('拣货完成，已转待发货'); setShowPick(null); }}>确认完成拣货</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
