import { mockProducts, getOrderTimeHint, isOrderTime } from '@/mock/data';
import { useCartStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock, Plus, Package, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const categories = [...new Set(mockProducts.map(p => p.categoryName))];

export default function StoreHome() {
  const { addItem } = useCartStore();

  return (
    <div className="bg-muted min-h-full">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 pb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-lg font-bold">朝阳门店</h1>
            <p className="text-primary-foreground/70 text-xs">欢迎使用门店订货系统</p>
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

      {/* Categories */}
      <div className="p-4 -mt-3">
        <div className="bg-card rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">商品分类</h2>
            <Link to="/store/categories" className="text-xs text-primary flex items-center">
              全部 <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {categories.slice(0, 8).map(cat => (
              <Link key={cat} to="/store/categories" className="flex flex-col items-center gap-1">
                <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                  <Package className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs">{cat}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Hot products */}
      <div className="px-4 pb-4">
        <h2 className="text-sm font-semibold mb-3">热门商品</h2>
        <div className="space-y-2">
          {mockProducts.slice(0, 6).map(product => (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-3 flex gap-3">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Package className="w-8 h-8 text-muted-foreground/40" />
                </div>
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
