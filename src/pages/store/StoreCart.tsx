import { useCartStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isOrderTime } from '@/mock/data';
import { toast } from 'sonner';

export default function StoreCart() {
  const { items, updateQty, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();
  const total = items.reduce((sum, i) => sum + i.product.salePrice * i.quantity, 0);
  const canOrder = isOrderTime();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <ShoppingCart className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">购物车为空</p>
        <p className="text-sm mb-4">去选购商品吧</p>
        <Button asChild><Link to="/store">去选购</Link></Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">购物车</h1>
          <Button variant="ghost" size="sm" className="text-destructive" onClick={clearCart}>
            <Trash2 className="w-4 h-4 mr-1" /> 清空
          </Button>
        </div>

        <div className="space-y-2">
          {items.map(({ product, quantity }) => (
            <Card key={product.id}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.spec}</p>
                  <p className="text-sm font-bold text-primary mt-1">¥{product.salePrice.toFixed(1)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(product.id, quantity - 1)}>
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-sm font-medium w-6 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(product.id, quantity + 1)}>
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-card border-t p-3 flex items-center gap-4">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">合计</p>
          <p className="text-lg font-bold text-primary">¥{total.toFixed(2)}</p>
        </div>
        {canOrder ? (
          <Button className="px-8" onClick={() => {
            toast.success('模拟微信支付成功');
            clearCart();
            navigate('/store/orders');
          }}>
            去结算
          </Button>
        ) : (
          <Button className="px-8" variant="secondary" onClick={() => {
            toast.success('申请订货已提交，等待审核');
            clearCart();
            navigate('/store/orders');
          }}>
            申请订货
          </Button>
        )}
      </div>
    </div>
  );
}
