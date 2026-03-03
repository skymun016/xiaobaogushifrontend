import { useState } from 'react';
import { mockProducts, mockCategories } from '@/mock/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Upload, Download, Package, Edit, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductList() {
  const [tab, setTab] = useState('products');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showCatAdd, setShowCatAdd] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const filtered = mockProducts.filter(p => {
    if (catFilter !== 'all' && p.categoryId !== catFilter) return false;
    if (search && !p.name.includes(search) && !p.skuCode.includes(search)) return false;
    return true;
  });

  const detailProduct = mockProducts.find(p => p.id === showDetail);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">商品中心</h1>
          <p className="text-muted-foreground">管理商品信息、类目和SKU</p>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="products">商品列表</TabsTrigger>
          <TabsTrigger value="categories">类目管理</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="搜索商品名/SKU" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-56" />
              </div>
              <Select value={catFilter} onValueChange={setCatFilter}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类目</SelectItem>
                  {mockCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success('导入模板已下载')}><Upload className="w-4 h-4 mr-1" />导入</Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('导出成功')}><Download className="w-4 h-4 mr-1" />导出</Button>
              <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-1" />新增商品</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Package className="w-12 h-12 mb-4 opacity-30" />
                  <p className="text-lg font-medium">暂无商品</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>商品名称</TableHead>
                      <TableHead>SKU编码</TableHead>
                      <TableHead>类目</TableHead>
                      <TableHead>规格</TableHead>
                      <TableHead className="text-right">成本价</TableHead>
                      <TableHead className="text-right">售价</TableHead>
                      <TableHead className="text-right">库存</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>默认供应商</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">{p.skuCode}</TableCell>
                        <TableCell>{p.categoryName}</TableCell>
                        <TableCell>{p.spec}</TableCell>
                        <TableCell className="text-right text-muted-foreground">¥{p.costPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">¥{p.salePrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <span className={p.stock < 50 ? 'text-status-error font-medium' : ''}>{p.stock}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={p.isOnSale ? 'default' : 'secondary'}>
                            {p.isOnSale ? '上架' : '下架'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{p.defaultSupplierName}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDetail(p.id)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setShowAdd(true); }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">共 {filtered.length} 件商品</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>上一页</Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
              <Button variant="outline" size="sm" disabled>下一页</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">共 {mockCategories.length} 个类目</p>
            <Button size="sm" onClick={() => setShowCatAdd(true)}><Plus className="w-4 h-4 mr-1" />新增类目</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>类目名称</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>商品数量</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCategories.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell>{c.sort}</TableCell>
                      <TableCell>{c.productCount}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">编辑</Button>
                          <Button variant="ghost" size="sm" className="text-destructive" onClick={() => toast.success('已删除')}>删除</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Product Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>新增商品</DialogTitle>
            <DialogDescription>填写商品基本信息</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">商品名称 *</label>
              <Input placeholder="请输入商品名称" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">类目 *</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择类目" /></SelectTrigger>
                <SelectContent>
                  {mockCategories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">SKU编码 *</label>
              <Input placeholder="例: VEG-003" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">条码</label>
              <Input placeholder="商品条码" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">规格 *</label>
              <Input placeholder="例: 500g/袋" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">单位 *</label>
              <Input placeholder="例: 袋、盒、箱" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">成本价 *</label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">售价 *</label>
              <Input type="number" placeholder="0.00" />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-sm font-medium">默认供应商</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择供应商" /></SelectTrigger>
                <SelectContent>
                  {['绿源农业', '鲜果源', '鑫源肉业', '北方粮仓', '蒙源乳业', '海之鲜'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>取消</Button>
            <Button onClick={() => { toast.success('商品已保存'); setShowAdd(false); }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Add Dialog */}
      <Dialog open={showCatAdd} onOpenChange={setShowCatAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增类目</DialogTitle>
            <DialogDescription>请输入类目信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">类目名称</label>
              <Input placeholder="请输入类目名称" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">排序</label>
              <Input type="number" placeholder="数字越小越靠前" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCatAdd(false)}>取消</Button>
            <Button onClick={() => { toast.success('类目已添加'); setShowCatAdd(false); }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>商品详情</DialogTitle>
            <DialogDescription>{detailProduct?.name}</DialogDescription>
          </DialogHeader>
          {detailProduct && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['SKU编码', detailProduct.skuCode],
                  ['条码', detailProduct.barcode],
                  ['类目', detailProduct.categoryName],
                  ['规格', detailProduct.spec],
                  ['单位', detailProduct.unit],
                  ['成本价', `¥${detailProduct.costPrice.toFixed(2)}`],
                  ['售价', `¥${detailProduct.salePrice.toFixed(2)}`],
                  ['库存', `${detailProduct.stock}`],
                  ['状态', detailProduct.isOnSale ? '上架' : '下架'],
                  ['默认供应商', detailProduct.defaultSupplierName],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
