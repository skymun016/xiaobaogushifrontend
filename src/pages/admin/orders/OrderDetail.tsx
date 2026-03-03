import { useParams, Link } from 'react-router-dom';
import { formatDateWithDay } from '@/lib/utils';
import { mockOrders } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, FileText, DollarSign, Truck, Phone, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { OrderStatus, PaymentStatus, ShippingStatus } from '@/types/enums';

export default function OrderDetail() {
  const { id } = useParams();
  const order = mockOrders.find(o => o.id === id);
  const [showLogistics, setShowLogistics] = useState(false);
  const [logisticsCost, setLogisticsCost] = useState('');
  const [showShipping, setShowShipping] = useState(false);

  // Shipping form state
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [itemTrackings, setItemTrackings] = useState<Record<string, string>>({});

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">订单不存在</p>
        <Button variant="link" asChild className="mt-2"><Link to="/admin/orders">返回订单列表</Link></Button>
      </div>
    );
  }

  const handleShippingSubmit = () => {
    const trackings = Object.entries(itemTrackings).filter(([, v]) => v.trim());
    if (!driverName.trim() && trackings.length === 0) {
      toast.error('请至少填写司机信息或物流单号');
      return;
    }
    toast.success('发货信息已保存');
    setShowShipping(false);
    setDriverName('');
    setDriverPhone('');
    setItemTrackings({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/admin/orders"><ArrowLeft className="w-5 h-5" /></Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{order.orderNo}</h1>
            <StatusBadge status={order.status} />
            {order.isApplication && (
              <span className="text-xs bg-status-pending-bg text-status-pending px-2 py-0.5 rounded-full font-medium">申请订货</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{order.storeName} · {formatDateWithDay(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          {order.status === OrderStatus.PENDING && order.paymentStatus === PaymentStatus.PAID && (
            <Button onClick={() => setShowLogistics(true)}>录入物流成本</Button>
          )}
          {order.paymentStatus === PaymentStatus.PAID && order.shippingStatus === ShippingStatus.NOT_SHIPPED && (
            <Button onClick={() => setShowShipping(true)}>
              <Truck className="w-4 h-4 mr-1" />录入发货信息
            </Button>
          )}
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">支付状态</p>
            <StatusBadge status={order.paymentStatus} />
          </CardContent>
        </Card>
        {order.auditStatus && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">审核状态</p>
              <StatusBadge status={order.auditStatus} />
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">发货状态</p>
            <StatusBadge status={order.shippingStatus} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">采购状态</p>
            <StatusBadge status={order.procurementStatus} />
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">商品明细</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>商品</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>规格</TableHead>
                  <TableHead className="text-right">成本价</TableHead>
                  <TableHead className="text-right">售价</TableHead>
                  <TableHead className="text-right">数量</TableHead>
                  <TableHead className="text-right">小计</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{item.skuCode}</TableCell>
                    <TableCell>{item.spec}</TableCell>
                    <TableCell className="text-right text-muted-foreground">¥{item.costPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">¥{item.salePrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.quantity}{item.unit}</TableCell>
                    <TableCell className="text-right font-medium">¥{(item.salePrice * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-6">
          {/* Financial */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> 利润信息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">售价合计</span>
                <span className="font-medium">¥{order.totalSalePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">成本合计</span>
                <span>¥{order.totalCostPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">预估物流</span>
                <span>¥{order.estimatedLogisticsCost.toFixed(2)}</span>
              </div>
              {order.actualLogisticsCost !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">实际物流</span>
                  <span>¥{order.actualLogisticsCost.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-sm font-medium">
                <span>预估毛利</span>
                <span className="text-status-success">¥{order.estimatedProfit.toFixed(2)}</span>
              </div>
              {order.settlementProfit !== undefined && (
                <div className="flex justify-between text-sm font-medium">
                  <span>结算毛利</span>
                  <span className="text-status-success">¥{order.settlementProfit.toFixed(2)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shipping Info */}
          {order.shippingInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Truck className="w-4 h-4" /> 发货信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.shippingInfo.driverName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>司机：{order.shippingInfo.driverName}</span>
                  </div>
                )}
                {order.shippingInfo.driverPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>电话：{order.shippingInfo.driverPhone}</span>
                  </div>
                )}
                {order.shippingInfo.itemTrackings && order.shippingInfo.itemTrackings.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground font-medium">物流单号</p>
                    {order.shippingInfo.itemTrackings.map(t => {
                      const item = order.items.find(i => i.id === t.itemId);
                      return (
                        <div key={t.itemId} className="flex justify-between text-xs bg-muted rounded px-2 py-1.5">
                          <span>{item?.productName || t.itemId}</span>
                          <span className="font-mono text-primary">{t.trackingNo}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {order.shippingInfo.shippingPhotos && order.shippingInfo.shippingPhotos.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1.5">发货照片</p>
                    <div className="flex gap-2 flex-wrap">
                      {order.shippingInfo.shippingPhotos.map((url, i) => (
                        <img key={i} src={url} alt={`发货照片${i + 1}`} className="w-20 h-20 rounded-lg object-cover border" />
                      ))}
                    </div>
                  </div>
                )}
                {order.shippingInfo.receivePhotos && order.shippingInfo.receivePhotos.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground font-medium mb-1.5">收货照片</p>
                    <div className="flex gap-2 flex-wrap">
                      {order.shippingInfo.receivePhotos.map((url, i) => (
                        <img key={i} src={url} alt={`收货照片${i + 1}`} className="w-20 h-20 rounded-lg object-cover border" />
                      ))}
                    </div>
                  </div>
                )}
                {order.shippingInfo.shippedAt && (
                  <p className="text-xs text-muted-foreground">发货时间：{formatDateWithDay(order.shippingInfo.shippedAt)}</p>
                )}
                {order.shippingInfo.receivedAt && (
                  <p className="text-xs text-muted-foreground">收货时间：{formatDateWithDay(order.shippingInfo.receivedAt)}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4" /> 操作记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-4 space-y-4">
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
                {order.timeline.map((event, i) => (
                  <div key={i} className="relative">
                    <div className={`absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2 ${
                      i === order.timeline.length - 1 ? 'bg-primary border-primary' : 'bg-card border-border'
                    }`} />
                    <div className="ml-2">
                      <p className="text-sm font-medium">{event.title}</p>
                      {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatDateWithDay(event.time)} {event.operator && `· ${event.operator}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logistics cost dialog */}
      <Dialog open={showLogistics} onOpenChange={setShowLogistics}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>录入预估物流成本</DialogTitle>
            <DialogDescription>请输入该订单的预估物流费用</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">预估物流成本（元）</label>
            <Input type="number" value={logisticsCost} onChange={e => setLogisticsCost(e.target.value)} placeholder="请输入金额" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogistics(false)}>取消</Button>
            <Button onClick={() => {
              toast.success(`已录入预估物流成本 ¥${logisticsCost}`);
              setShowLogistics(false);
              setLogisticsCost('');
            }}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Shipping info dialog */}
      <Dialog open={showShipping} onOpenChange={setShowShipping}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>录入发货信息</DialogTitle>
            <DialogDescription>填写送货司机信息和/或按商品填写物流单号</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Driver info */}
            <div className="space-y-3 p-3 rounded-lg border">
              <p className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4" /> 司机信息</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">司机姓名</label>
                  <Input value={driverName} onChange={e => setDriverName(e.target.value)} placeholder="请输入" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">联系电话</label>
                  <Input value={driverPhone} onChange={e => setDriverPhone(e.target.value)} placeholder="请输入" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">发货备注/照片说明</label>
                <Textarea placeholder="可在此描述发货情况，实际照片上传待后续接入存储服务" className="mt-1" rows={2} />
              </div>
            </div>

            {/* Per-item tracking */}
            <div className="space-y-3 p-3 rounded-lg border">
              <p className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4" /> 商品物流单号</p>
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity}{item.unit}</p>
                  </div>
                  <Input
                    className="w-48"
                    placeholder="物流单号"
                    value={itemTrackings[item.id] || ''}
                    onChange={e => setItemTrackings(prev => ({ ...prev, [item.id]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShipping(false)}>取消</Button>
            <Button onClick={handleShippingSubmit}>确认发货</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
