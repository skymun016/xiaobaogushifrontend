import { useState } from 'react';
import { mockPurchaseOrders, mockOrders } from '@/mock/data';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Printer, Download, Send, AlertTriangle, Clock, ArrowRightLeft } from 'lucide-react';
import { toast } from 'sonner';
import { PurchaseOrderStatus, ProcurementAggStatus } from '@/types/enums';

export default function ProcurementCenter() {
  const [tab, setTab] = useState('pool');
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState<string | null>(null);
  const [showSwitch, setShowSwitch] = useState(false);
  const [receiptNo, setReceiptNo] = useState('');

  const toSplitOrders = mockOrders.filter(o => o.procurementStatus === ProcurementAggStatus.TO_SPLIT);
  const abnormalPOs = mockPurchaseOrders.filter(po => po.status === PurchaseOrderStatus.ABNORMAL);
  const detail = mockPurchaseOrders.find(po => po.id === showDetail);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">采购单中心</h1>
        <p className="text-muted-foreground">采购拆分、下单、回执、异常处理</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="pool">
            待拆分池
            {toSplitOrders.length > 0 && <span className="ml-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">{toSplitOrders.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="list">采购单列表</TabsTrigger>
          <TabsTrigger value="abnormal">
            异常处理
            {abnormalPOs.length > 0 && <span className="ml-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center">{abnormalPOs.length}</span>}
          </TabsTrigger>
        </TabsList>

        {/* Split Pool */}
        <TabsContent value="pool" className="mt-4 space-y-4">
          {toSplitOrders.length === 0 ? (
            <Card><CardContent className="py-16 text-center text-muted-foreground"><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>暂无待拆分订单</p></CardContent></Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>订单号</TableHead>
                      <TableHead>门店</TableHead>
                      <TableHead>商品数</TableHead>
                      <TableHead>总成本</TableHead>
                      <TableHead>下单时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {toSplitOrders.map(o => (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium">{o.orderNo}</TableCell>
                        <TableCell>{o.storeName}</TableCell>
                        <TableCell>{o.items.length}</TableCell>
                        <TableCell>¥{o.totalCostPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{o.createdAt}</TableCell>
                        <TableCell>
                          <Button size="sm" onClick={() => toast.success(`已为 ${o.orderNo} 生成采购单`)}>生成采购单</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* PO List */}
        <TabsContent value="list" className="mt-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="搜索采购单号" className="pl-9 w-56" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.success('已导出采购单')}><Download className="w-4 h-4 mr-1" />导出</Button>
              <Button variant="outline" size="sm" onClick={() => toast.success('打印预览已打开')}><Printer className="w-4 h-4 mr-1" />打印</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>采购单号</TableHead>
                    <TableHead>供应商</TableHead>
                    <TableHead>来源订单</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>ETA</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>回执号</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPurchaseOrders.map(po => (
                    <TableRow key={po.id}>
                      <TableCell className="font-medium font-mono text-xs">{po.poNo}</TableCell>
                      <TableCell>{po.supplierName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{po.sourceOrderNos.join(', ')}</TableCell>
                      <TableCell className="text-right font-medium">¥{po.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{po.eta}</TableCell>
                      <TableCell><StatusBadge status={po.status} /></TableCell>
                      <TableCell className="text-sm">{po.receiptNo || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setShowDetail(po.id)}>详情</Button>
                          {po.status === PurchaseOrderStatus.SENT && (
                            <Button size="sm" variant="outline" onClick={() => setShowReceipt(po.id)}>录入回执</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Abnormal */}
        <TabsContent value="abnormal" className="mt-4 space-y-4">
          {abnormalPOs.length === 0 ? (
            <Card><CardContent className="py-16 text-center text-muted-foreground"><AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>暂无采购异常</p></CardContent></Card>
          ) : (
            abnormalPOs.map(po => (
              <Card key={po.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{po.poNo}</p>
                      <p className="text-sm text-muted-foreground">{po.supplierName}</p>
                    </div>
                    <StatusBadge status={po.status} />
                  </div>
                  <div className="p-3 bg-status-error-bg rounded-lg mb-3">
                    <div className="flex items-center gap-2 text-status-error text-sm font-medium mb-1">
                      <AlertTriangle className="w-4 h-4" />异常原因
                    </div>
                    <p className="text-sm">{po.abnormalReason}</p>
                  </div>
                  <div className="space-y-1 mb-3">
                    {po.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{item.productName} × {item.quantity}{item.unit}</span>
                        <span>¥{(item.costPrice * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowSwitch(true)}>
                      <ArrowRightLeft className="w-4 h-4 mr-1" />切换供应商
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success('已重新拆分')}>重新拆分</Button>
                    <Button size="sm" variant="destructive" onClick={() => toast.success('采购单已取消')}>取消采购</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={!!showDetail} onOpenChange={() => setShowDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>采购单详情</DialogTitle>
            <DialogDescription>{detail?.poNo}</DialogDescription>
          </DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  ['供应商', detail.supplierName],
                  ['状态', ''],
                  ['来源订单', detail.sourceOrderNos.join(', ')],
                  ['ETA', detail.eta],
                  ['总金额', `¥${detail.totalAmount.toFixed(2)}`],
                  ['回执号', detail.receiptNo || '无'],
                ].map(([k, v], i) => (
                  <div key={k} className="p-2 bg-muted rounded flex justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    {i === 1 ? <StatusBadge status={detail.status} /> : <span className="font-medium">{v}</span>}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">商品明细</p>
                {detail.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b last:border-0">
                    <span>{item.productName} ({item.skuCode})</span>
                    <span>{item.quantity}{item.unit} · ¥{(item.costPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">操作记录</p>
                <div className="space-y-2 pl-3 border-l-2 border-border">
                  {detail.timeline.map((t, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium">{t.title}</p>
                      {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                      <p className="text-xs text-muted-foreground">{t.time}</p>
                    </div>
                  ))}
                </div>
              </div>
              {detail.abnormalReason && (
                <div className="p-3 bg-status-error-bg rounded-lg text-sm">
                  <span className="text-status-error font-medium">异常：</span>{detail.abnormalReason}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={!!showReceipt} onOpenChange={() => setShowReceipt(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>录入回执</DialogTitle>
            <DialogDescription>请输入供应商回执信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">回执编号</label>
              <Input value={receiptNo} onChange={e => setReceiptNo(e.target.value)} placeholder="请输入回执编号" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceipt(null)}>取消</Button>
            <Button onClick={() => { toast.success('回执已录入'); setShowReceipt(null); setReceiptNo(''); }}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch Supplier Dialog */}
      <Dialog open={showSwitch} onOpenChange={setShowSwitch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>切换供应商</DialogTitle>
            <DialogDescription>选择替代供应商并重新生成采购单</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">替代供应商</label>
              <Select>
                <SelectTrigger><SelectValue placeholder="选择供应商" /></SelectTrigger>
                <SelectContent>
                  {['鲜果源', '北方粮仓', '蒙源乳业'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">切换原因</label>
              <Input placeholder="请说明切换原因" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSwitch(false)}>取消</Button>
            <Button onClick={() => { toast.success('供应商切换申请已提交，等待审批'); setShowSwitch(false); }}>提交申请</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
