import { useCartStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { isOrderTime } from '@/mock/data';
import { toast } from 'sonner';
import ProductImage from '@/components/ProductImage';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoreCart() {
  const { items, updateQty, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();
  const total = items.reduce((sum, i) => sum + i.product.salePrice * i.quantity, 0);
  const canOrder = isOrderTime();
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground px-6">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
          <ShoppingCart className="w-10 h-10 opacity-30" />
        </div>
        <p className="text-lg font-semibold text-foreground mb-1">购物车为空</p>
        <p className="text-sm mb-6">快去挑选需要的商品吧</p>
        <Button asChild className="rounded-xl px-8">
          <Link to="/store">去选购</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-24 bg-muted min-h-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-foreground">购物车</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{itemCount} 件商品</p>
          </div>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={clearCart}>
            <Trash2 className="w-4 h-4 mr-1" /> 清空
          </Button>
        </div>

        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {items.map(({ product, quantity }) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-3 flex items-center gap-3">
                    <ProductImage productId={product.id} className="w-16 h-16 shrink-0 rounded-xl overflow-hidden" iconSize="w-6 h-6" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.spec}</p>
                      <p className="text-sm font-bold text-primary mt-1">¥{product.salePrice.toFixed(1)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full border-border"
                        onClick={() => updateQty(product.id, quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-semibold w-7 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full border-border"
                        onClick={() => updateQty(product.id, quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-md border-t p-3 px-4 flex items-center gap-4 z-40">
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground">合计</p>
          <p className="text-xl font-bold text-primary">¥{total.toFixed(2)}</p>
        </div>
        {canOrder ? (
          <Button className="px-8 rounded-xl h-11 text-base font-semibold shadow-sm" onClick={() => {
            toast.success('模拟微信支付成功');
            clearCart();
            navigate('/store/orders');
          }}>
            去结算
          </Button>
        ) : (
          <Button className="px-8 rounded-xl h-11 text-base font-semibold" variant="secondary" onClick={() => {
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
