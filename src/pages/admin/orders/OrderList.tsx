import { useState } from 'react';
import { formatDateWithDay } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { mockOrders } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter } from 'lucide-react';
import { OrderStatus, AuditStatus } from '@/types/enums';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

export default function OrderList() {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [reviewOrder, setReviewOrder] = useState<string | null>(null);

  const filtered = mockOrders.filter(o => {
    if (tab === 'applications') return o.isApplication;
    if (tab === 'pending') return o.status === OrderStatus.PENDING && !o.isApplication;
    if (tab === 'processing') return o.status === OrderStatus.PROCESSING;
    if (tab === 'completed') return o.status === OrderStatus.COMPLETED;
    if (tab === 'cancelled') return o.status === OrderStatus.CANCELLED;
    return true;
  }).filter(o =>
    !search || o.orderNo.includes(search) || o.storeName.includes(search)
  );

  const pendingApps = mockOrders.filter(o => o.isApplication && o.auditStatus === AuditStatus.PENDING);
  const orderToReview = mockOrders.find(o => o.id === reviewOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">订单中心</h1>
          <p className="text-muted-foreground">管理所有用户订单和申请订货</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">全部 ({mockOrders.length})</TabsTrigger>
            <TabsTrigger value="pending">待处理</TabsTrigger>
            <TabsTrigger value="processing">处理中</TabsTrigger>
            <TabsTrigger value="completed">已完成</TabsTrigger>
            <TabsTrigger value="applications">
              申请订货
              {pendingApps.length > 0 && (
                <span className="ml-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">
                  {pendingApps.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="搜索订单号/门店" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-60" />
            </div>
            <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
          </div>
        </div>

        <TabsContent value={tab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Search className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-medium">暂无订单</p>
                  <p className="text-sm">没有找到符合条件的订单</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单号</TableHead>
                      <TableHead>门店</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>订单状态</TableHead>
                      <TableHead>支付状态</TableHead>
                      <TableHead>履约状态</TableHead>
                      {tab === 'applications' && <TableHead>审核状态</TableHead>}
                      <TableHead>下单时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          <Link to={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                            {order.orderNo}
                          </Link>
                          {order.isApplication && (
                            <span className="ml-1.5 text-[10px] bg-status-pending-bg text-status-pending px-1.5 py-0.5 rounded-full">申请</span>
                          )}
                        </TableCell>
                        <TableCell>{order.storeName}</TableCell>
                        <TableCell>¥{order.totalSalePrice.toFixed(2)}</TableCell>
                        <TableCell><StatusBadge status={order.status} /></TableCell>
                        <TableCell><StatusBadge status={order.paymentStatus} /></TableCell>
                        <TableCell><StatusBadge status={order.fulfillmentStatus} /></TableCell>
                        {tab === 'applications' && (
                          <TableCell>
                            {order.auditStatus && <StatusBadge status={order.auditStatus} />}
                          </TableCell>
                        )}
                        <TableCell className="text-muted-foreground text-sm">{formatDateWithDay(order.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" asChild>
                              <Link to={`/admin/orders/${order.id}`}>详情</Link>
                            </Button>
                            {order.isApplication && order.auditStatus === AuditStatus.PENDING && (
                              <Button size="sm" onClick={() => setReviewOrder(order.id)}>审核</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">共 {filtered.length} 条记录</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>上一页</Button>
                <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                <Button variant="outline" size="sm" disabled>下一页</Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review dialog */}
      <Dialog open={!!reviewOrder} onOpenChange={() => setReviewOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>审核申请订货</DialogTitle>
            <DialogDescription>
              订单 {orderToReview?.orderNo} - {orderToReview?.storeName}
            </DialogDescription>
          </DialogHeader>
          {orderToReview && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted">
                <p className="text-sm font-medium mb-2">商品明细</p>
                {orderToReview.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm py-1">
                    <span>{item.productName} × {item.quantity}{item.unit}</span>
                    <span>¥{(item.salePrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t mt-2 pt-2 flex justify-between font-medium text-sm">
                  <span>合计</span>
                  <span>¥{orderToReview.totalSalePrice.toFixed(2)}</span>
                </div>
              </div>
              {orderToReview.remark && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm font-medium">备注</p>
                  <p className="text-sm text-muted-foreground">{orderToReview.remark}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              toast.error('已驳回申请');
              setReviewOrder(null);
            }}>驳回</Button>
            <Button onClick={() => {
              toast.success('审核通过，已转为正式订单');
              setReviewOrder(null);
            }}>通过</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
