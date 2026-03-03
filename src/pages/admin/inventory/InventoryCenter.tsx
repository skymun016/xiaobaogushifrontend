import { useState } from 'react';
import { formatDateWithDay } from '@/lib/utils';
import { mockProducts, mockInventoryRecords } from '@/mock/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Package, AlertTriangle, ArrowDownToLine, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const lowStockProducts = mockProducts.filter(p => p.stock < 80);

export default function InventoryCenter() {
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [showAdjust, setShowAdjust] = useState(false);

  const inRecords = mockInventoryRecords.filter(r => r.type === 'in');
  const outRecords = mockInventoryRecords.filter(r => r.type === 'out');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">库存中心</h1>
        <p className="text-muted-foreground">库存总览、出入库管理、盘点调整</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">库存总览</TabsTrigger>
          <TabsTrigger value="in">入库记录</TabsTrigger>
          <TabsTrigger value="out">出库记录</TabsTrigger>
          <TabsTrigger value="warning">
            库存预警
            {lowStockProducts.length > 0 && (
              <span className="ml-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">
                {lowStockProducts.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="adjust">盘点调整</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><Package className="w-8 h-8 text-primary" /><div><p className="text-2xl font-bold">{mockProducts.length}</p><p className="text-xs text-muted-foreground">商品种类</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><BarChart3 className="w-8 h-8 text-status-success" /><div><p className="text-2xl font-bold">{mockProducts.reduce((s, p) => s + p.stock, 0)}</p><p className="text-xs text-muted-foreground">总库存量</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><ArrowDownToLine className="w-8 h-8 text-status-processing" /><div><p className="text-2xl font-bold">{inRecords.length}</p><p className="text-xs text-muted-foreground">近期入库</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><AlertTriangle className="w-8 h-8 text-status-error" /><div><p className="text-2xl font-bold">{lowStockProducts.length}</p><p className="text-xs text-muted-foreground">库存预警</p></div></div></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">库存台账</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="搜索商品" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-48" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品名称</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>类目</TableHead>
                    <TableHead className="text-right">当前库存</TableHead>
                    <TableHead>单位</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts.filter(p => !search || p.name.includes(search) || p.skuCode.includes(search)).map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{p.skuCode}</TableCell>
                      <TableCell>{p.categoryName}</TableCell>
                      <TableCell className="text-right font-medium">{p.stock}</TableCell>
                      <TableCell>{p.unit}</TableCell>
                      <TableCell>
                        {p.stock === 0 ? <Badge variant="destructive">缺货</Badge> :
                         p.stock < 50 ? <Badge className="bg-status-error text-destructive-foreground">低库存</Badge> :
                         p.stock < 80 ? <Badge className="bg-status-pending text-accent-foreground">预警</Badge> :
                         <Badge variant="secondary">正常</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* In records */}
        <TabsContent value="in" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>入库单号</TableHead>
                    <TableHead>商品</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead>操作人</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>备注</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inRecords.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium font-mono text-xs">{r.docNo}</TableCell>
                      <TableCell>{r.productName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{r.skuCode}</TableCell>
                      <TableCell className="text-right text-status-success font-medium">+{r.quantity}{r.unit}</TableCell>
                      <TableCell>{r.operator}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDateWithDay(r.createdAt)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{r.remark}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Out records */}
        <TabsContent value="out" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>出库单号</TableHead>
                    <TableHead>商品</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">数量</TableHead>
                    <TableHead>关联订单</TableHead>
                    <TableHead>操作人</TableHead>
                    <TableHead>时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outRecords.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium font-mono text-xs">{r.docNo}</TableCell>
                      <TableCell>{r.productName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{r.skuCode}</TableCell>
                      <TableCell className="text-right text-status-error font-medium">-{r.quantity}{r.unit}</TableCell>
                      <TableCell className="text-primary text-sm">{r.relatedOrderNo}</TableCell>
                      <TableCell>{r.operator}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDateWithDay(r.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Warning */}
        <TabsContent value="warning" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">当前库存</TableHead>
                    <TableHead className="text-right">安全库存</TableHead>
                    <TableHead>供应商</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lowStockProducts.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{p.skuCode}</TableCell>
                      <TableCell className="text-right text-status-error font-bold">{p.stock}</TableCell>
                      <TableCell className="text-right text-muted-foreground">80</TableCell>
                      <TableCell>{p.defaultSupplierName}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => toast.success('已生成补货采购单')}>生成采购单</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Adjust */}
        <TabsContent value="adjust" className="mt-4 space-y-4">
          <div className="flex justify-between">
            <p className="text-sm text-muted-foreground">通过盘点调整库存数量</p>
            <Button size="sm" onClick={() => setShowAdjust(true)}>新增盘点</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>盘点单号</TableHead>
                    <TableHead>盘点时间</TableHead>
                    <TableHead>操作人</TableHead>
                    <TableHead>调整商品数</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-mono text-xs">PD20260301001</TableCell>
                    <TableCell>2026-03-01 09:00:00</TableCell>
                    <TableCell>仓库李</TableCell>
                    <TableCell>3</TableCell>
                    <TableCell><Badge variant="secondary">已完成</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adjust Dialog */}
      <Dialog open={showAdjust} onOpenChange={setShowAdjust}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增盘点调整</DialogTitle>
            <DialogDescription>选择商品并调整库存数量</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">商品</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择商品" /></SelectTrigger>
                <SelectContent>
                  {mockProducts.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (当前:{p.stock})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">实际库存</label>
              <Input type="number" placeholder="盘点后的实际数量" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">调整原因</label>
              <Input placeholder="请输入调整原因" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjust(false)}>取消</Button>
            <Button onClick={() => { toast.success('盘点调整已保存'); setShowAdjust(false); }}>确认调整</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
