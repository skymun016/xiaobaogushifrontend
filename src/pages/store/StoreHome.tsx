import { mockProducts, getOrderTimeHint, isOrderTime } from '@/mock/data';
import { useCartStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Clock, Plus, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ProductImage from '@/components/ProductImage';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StoreHome() {
  const { addItem } = useCartStore();
  const [search, setSearch] = useState('');
  const cartCount = useCartStore(s => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const products = mockProducts.filter(p => {
    if (!p.isOnSale) return false;
    if (search && !p.name.includes(search) && !p.categoryName.includes(search)) return false;
    return true;
  });

  return (
    <div className="bg-muted min-h-full">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight">宿迁总店</h1>
            <p className="text-primary-foreground/60 text-xs mt-0.5">欢迎使用小堡故事订货系统</p>
          </div>
          <Link to="/store/cart" className="relative p-2 -mr-2 rounded-full hover:bg-primary-foreground/10 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Time hint */}
        <div className="flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-xl p-3 text-xs">
          <div className="w-7 h-7 rounded-full bg-primary-foreground/15 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span className="leading-relaxed">{getOrderTimeHint()}</span>
        </div>
      </div>

      {/* Search bar - overlapping header */}
      <div className="px-4 -mt-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索商品名称..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl bg-card shadow-sm border-0 text-sm"
          />
        </div>
      </div>

      {/* Products list */}
      <div className="px-4 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">全部商品</h2>
          <span className="text-xs text-muted-foreground">{products.length} 件</span>
        </div>
        <div className="space-y-2.5">
          <AnimatePresence mode="popLayout">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
              >
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-3 flex gap-3">
                    <ProductImage
                      productId={product.id}
                      className="w-[72px] h-[72px] shrink-0 rounded-xl overflow-hidden"
                      iconSize="w-8 h-8"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <p className="text-sm font-semibold truncate text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{product.spec}</p>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <span className="text-base font-bold text-primary">¥{product.salePrice.toFixed(1)}</span>
                          <span className="text-[11px] text-muted-foreground ml-0.5">/{product.unit}</span>
                        </div>
                        <Button
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full shadow-sm"
                          onClick={() => {
                            addItem(product);
                            toast.success(`已添加 ${product.name}`);
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {products.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">未找到相关商品</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
