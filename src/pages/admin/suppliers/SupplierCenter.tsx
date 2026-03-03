import { useState } from 'react';
import { formatDateWithDay } from '@/lib/utils';
import { mockSuppliers, mockProducts } from '@/mock/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Search, Plus, Users, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function SupplierCenter() {
  const [tab, setTab] = useState('list');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const filtered = mockSuppliers.filter(s =>
    !search || s.name.includes(search) || s.contactPerson.includes(search)
  );
  const detail = mockSuppliers.find(s => s.id === showDetail);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">供应商中心</h1>
        <p className="text-muted-foreground">管理供应商信息和商品绑定</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="list">供应商列表</TabsTrigger>
          <TabsTrigger value="binding">商品绑定</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="搜索供应商" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4 mr-1" />新增供应商</Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Users className="w-12 h-12 mb-4 opacity-30" />
                  <p>暂无供应商</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>供应商名称</TableHead>
                      <TableHead>联系人</TableHead>
                      <TableHead>电话</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>供应商品数</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(s => (
                      <TableRow key={s.id}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell>{s.contactPerson}</TableCell>
                        <TableCell className="text-muted-foreground">{s.phone}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{s.email}</TableCell>
                        <TableCell>{s.productCount}</TableCell>
                        <TableCell>
                          <Badge variant={s.status === 'active' ? 'default' : 'secondary'}>
                            {s.status === 'active' ? '合作中' : '已停用'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDetail(s.id)}><Eye className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm">编辑</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="binding" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>默认供应商</TableHead>
                    <TableHead>备用供应商</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProducts.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{p.skuCode}</TableCell>
                      <TableCell>{p.defaultSupplierName}</TableCell>
                      <TableCell className="text-muted-foreground">{p.backupSupplierName || '未设置'}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toast.success('已更新绑定')}>修改绑定</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增供应商</DialogTitle>
            <DialogDescription>填写供应商基本信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { label: '供应商名称', placeholder: '请输入名称' },
              { label: '联系人', placeholder: '请输入联系人' },
              { label: '联系电话', placeholder: '请输入电话' },
              { label: '邮箱', placeholder: '请输入邮箱' },
              { label: '地址', placeholder: '请输入地址' },
            ].map(f => (
              <div key={f.label} className="space-y-2">
                <label className="text-sm font-medium">{f.label}</label>
                <Input placeholder={f.placeholder} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>取消</Button>
            <Button onClick={() => { toast.success('供应商已添加'); setShowAdd(false); }}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>供应商详情</DialogTitle>
            <DialogDescription>{detail?.name}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-2">
              {[
                ['联系人', detail.contactPerson],
                ['电话', detail.phone],
                ['邮箱', detail.email],
                ['地址', detail.address],
                ['状态', detail.status === 'active' ? '合作中' : '已停用'],
                ['供应商品数', `${detail.productCount}`],
                ['创建时间', formatDateWithDay(detail.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm p-2 bg-muted rounded">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
