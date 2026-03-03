import { useParams, Link } from 'react-router-dom';
import { formatDateWithDay } from '@/lib/utils';
import { mockOrders } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, FileText, Truck, Phone, User, CheckCircle } from 'lucide-react';
import { ShippingStatus } from '@/types/enums';
import { useState } from 'react';
import { toast } from 'sonner';
import { PhotoUpload } from '@/components/PhotoUpload';

export default function StoreOrderDetail() {
  const { id } = useParams();
  const order = mockOrders.find(o => o.id === id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [receivePhotos, setReceivePhotos] = useState<string[]>([]);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <FileText className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">订单不存在</p>
        <Button variant="link" asChild><Link to="/store/orders">返回订单列表</Link></Button>
      </div>
    );
  }

  const canConfirmReceive = order.shippingStatus === ShippingStatus.SHIPPED && !confirmed;

  const handleConfirmReceive = () => {
    if (receivePhotos.length === 0) {
      toast.error('请至少上传一张收货照片');
      return;
    }
    toast.success('已确认收货！');
    setConfirmed(true);
    setShowConfirm(false);
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="bg-background border-b border-border/50 p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-3">
          <Link to="/store/orders" className="text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="text-base font-bold text-foreground">订单详情</h1>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{order.orderNo}</p>
            <StatusBadge status={order.status} className="mt-1" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Confirm receive button */}
        {canConfirmReceive && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Truck className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">商品已发货，请确认收货</p>
                  <p className="text-xs text-muted-foreground">收到货物后，拍照上传确认收货</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => setShowConfirm(true)}>
                <Truck className="w-4 h-4 mr-1" /> 确认收货
              </Button>
            </CardContent>
          </Card>
        )}

        {confirmed && (
          <Card className="border-status-success/30 bg-status-success-bg">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-status-success" />
              <p className="text-sm font-medium text-status-success">已确认收货</p>
            </CardContent>
          </Card>
        )}

        {/* Shipping info */}
        {order.shippingInfo && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">物流信息</h3>
              </div>
              <div className="space-y-2">
                {order.shippingInfo.driverName && (
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>送货司机：{order.shippingInfo.driverName}</span>
                  </div>
                )}
                {order.shippingInfo.driverPhone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${order.shippingInfo.driverPhone}`} className="text-primary underline">{order.shippingInfo.driverPhone}</a>
                  </div>
                )}
                {order.shippingInfo.itemTrackings && order.shippingInfo.itemTrackings.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground font-medium">物流单号</p>
                    {order.shippingInfo.itemTrackings.map(t => {
                      const item = order.items.find(i => i.id === t.itemId);
                      return (
                        <div key={t.itemId} className="flex justify-between text-xs bg-muted rounded px-2 py-1.5">
                          <span>{item?.productName}</span>
                          <span className="font-mono text-primary">{t.trackingNo}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {order.shippingInfo.shippingPhotos && order.shippingInfo.shippingPhotos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground font-medium mb-1.5">发货照片</p>
                    <div className="flex gap-2 flex-wrap">
                      {order.shippingInfo.shippingPhotos.map((url, i) => (
                        <img key={i} src={url} alt={`发货照片${i + 1}`} className="w-16 h-16 rounded-lg object-cover border" />
                      ))}
                    </div>
                  </div>
                )}
                {order.shippingInfo.receivePhotos && order.shippingInfo.receivePhotos.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-muted-foreground font-medium mb-1.5">收货照片</p>
                    <div className="flex gap-2 flex-wrap">
                      {order.shippingInfo.receivePhotos.map((url, i) => (
                        <img key={i} src={url} alt={`收货照片${i + 1}`} className="w-16 h-16 rounded-lg object-cover border" />
                      ))}
                    </div>
                  </div>
                )}
                {order.shippingInfo.shippedAt && (
                  <p className="text-xs text-muted-foreground mt-1">发货时间：{formatDateWithDay(order.shippingInfo.shippedAt)}</p>
                )}
                {order.shippingInfo.receivedAt && (
                  <p className="text-xs text-muted-foreground">收货时间：{formatDateWithDay(order.shippingInfo.receivedAt)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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

        {/* Payment & shipping */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">支付状态</span>
              <StatusBadge status={order.paymentStatus} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">发货状态</span>
              <StatusBadge status={order.shippingStatus} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">下单时间</span>
              <span>{formatDateWithDay(order.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirm receive modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={() => setShowConfirm(false)}>
          <div className="w-full max-w-md bg-background rounded-t-2xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold">确认收货</h3>
            <p className="text-sm text-muted-foreground">请拍照上传收货凭证，确认商品已收到</p>
            
            <PhotoUpload
              folder={`receive/${order.id}`}
              photos={receivePhotos}
              onChange={setReceivePhotos}
              maxPhotos={5}
            />

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>取消</Button>
              <Button className="flex-1" onClick={handleConfirmReceive}>确认收货</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
