import { mockProducts, getOrderTimeHint, isOrderTime } from '@/mock/data';
import { useCartStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProductImage from '@/components/ProductImage';

export default function StoreHome() {
  const { addItem } = useCartStore();

  return (
    <div className="bg-muted min-h-full">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold">宿迁总店</h1>
            <p className="text-primary-foreground/70 text-xs">欢迎使用小堡故事订货管理系统</p>
          </div>
          <Link to="/store/cart" className="relative">
            <ShoppingCart className="w-6 h-6" />
          </Link>
        </div>

        {/* Time hint */}
        <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg p-2.5 text-xs">
          <Clock className="w-4 h-4 shrink-0" />
          <span>{getOrderTimeHint()}</span>
        </div>
      </div>

      {/* All products */}
      <div className="px-4 pb-4 -mt-3">
        <h2 className="text-sm font-semibold mb-3">全部商品</h2>
        <div className="space-y-2">
          {mockProducts.filter(p => p.isOnSale).map(product => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-3 flex gap-3">
                <ProductImage productId={product.id} className="w-16 h-16 shrink-0" iconSize="w-8 h-8" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.spec}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-sm font-bold text-primary">¥{product.salePrice.toFixed(1)}<span className="text-xs font-normal text-muted-foreground">/{product.unit}</span></span>
                    <Button size="sm" className="h-7 w-7 p-0 rounded-full" onClick={() => {
                      addItem(product);
                      toast.success(`已添加 ${product.name}`);
                    }}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
