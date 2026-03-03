import { mockProducts } from '@/mock/data';
import { useCartStore } from '@/lib/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const categories = ['全部', ...new Set(mockProducts.map(p => p.categoryName))];

export default function StoreCategories() {
  const [selectedCat, setSelectedCat] = useState('全部');
  const [search, setSearch] = useState('');
  const { addItem } = useCartStore();

  const filtered = mockProducts.filter(p => {
    if (selectedCat !== '全部' && p.categoryName !== selectedCat) return false;
    if (search && !p.name.includes(search)) return false;
    return p.isOnSale;
  });

  return (
    <div className="flex h-full">
      {/* Category sidebar */}
      <div className="w-20 bg-muted border-r shrink-0 overflow-y-auto">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`w-full py-3 text-xs text-center border-b transition-colors ${
              selectedCat === cat 
                ? 'bg-card text-primary font-semibold border-l-2 border-l-primary'
                : 'text-muted-foreground hover:bg-card/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sticky top-0 bg-background z-10">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="搜索商品" value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-8 text-sm" />
          </div>
        </div>

        <div className="p-3 pt-0 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">暂无商品</p>
            </div>
          ) : (
            filtered.map(product => (
              <Card key={product.id}>
                <CardContent className="p-2.5 flex gap-2.5">
                  <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-muted-foreground/40" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.spec}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm font-bold text-primary">¥{product.salePrice.toFixed(1)}</span>
                      <Button size="sm" className="h-6 w-6 p-0 rounded-full" onClick={() => {
                        addItem(product);
                        toast.success(`已添加 ${product.name}`);
                      }}>
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
