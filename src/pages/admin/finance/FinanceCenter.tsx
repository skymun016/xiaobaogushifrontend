import { useState } from 'react';
import { mockPaymentRecords, mockRefunds, mockRevenueData, mockProfitByProduct, mockProfitByStore } from '@/mock/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, CreditCard, RotateCcw, BarChart3 } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const totalRevenue = mockPaymentRecords.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);
const totalRefund = mockRefunds.reduce((s, r) => s + r.amount, 0);

export default function FinanceCenter() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">财务中心</h1>
        <p className="text-muted-foreground">收款对账、利润报表、退款管理</p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">财务概览</TabsTrigger>
          <TabsTrigger value="payments">收款记录</TabsTrigger>
          <TabsTrigger value="refunds">退款管理</TabsTrigger>
          <TabsTrigger value="profit-product">商品毛利</TabsTrigger>
          <TabsTrigger value="profit-store">门店毛利</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-4 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><DollarSign className="w-8 h-8 text-status-success" /><div><p className="text-2xl font-bold">¥{totalRevenue.toFixed(0)}</p><p className="text-xs text-muted-foreground">总收款</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><RotateCcw className="w-8 h-8 text-status-error" /><div><p className="text-2xl font-bold">¥{totalRefund.toFixed(0)}</p><p className="text-xs text-muted-foreground">退款金额</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><TrendingUp className="w-8 h-8 text-primary" /><div><p className="text-2xl font-bold">¥{(totalRevenue - totalRefund).toFixed(0)}</p><p className="text-xs text-muted-foreground">净收入</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><CreditCard className="w-8 h-8 text-status-processing" /><div><p className="text-2xl font-bold">{mockPaymentRecords.length}</p><p className="text-xs text-muted-foreground">交易笔数</p></div></div></CardContent></Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle className="text-base">营收趋势</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" name="营收" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} />
                      <Area type="monotone" dataKey="profit" name="利润" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-base">商品毛利排行</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockProfitByProduct.slice(0, 6)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis type="category" dataKey="productName" width={80} className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="profit" name="毛利" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易号</TableHead>
                    <TableHead>订单号</TableHead>
                    <TableHead>门店</TableHead>
                    <TableHead className="text-right">金额</TableHead>
                    <TableHead>支付方式</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>支付时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPaymentRecords.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.transactionNo}</TableCell>
                      <TableCell className="text-primary text-sm">{p.orderNo}</TableCell>
                      <TableCell>{p.storeName}</TableCell>
                      <TableCell className="text-right font-medium">¥{p.amount.toFixed(2)}</TableCell>
                      <TableCell><Badge variant="secondary">微信支付</Badge></TableCell>
                      <TableCell>
                        <Badge variant={p.status === 'success' ? 'default' : 'secondary'}>
                          {p.status === 'success' ? '成功' : '已退款'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{p.paidAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Refunds */}
        <TabsContent value="refunds" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>订单号</TableHead>
                    <TableHead>门店</TableHead>
                    <TableHead className="text-right">退款金额</TableHead>
                    <TableHead>原因</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>申请时间</TableHead>
                    <TableHead>完成时间</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRefunds.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="text-primary text-sm">{r.orderNo}</TableCell>
                      <TableCell>{r.storeName}</TableCell>
                      <TableCell className="text-right font-medium text-status-error">-¥{r.amount.toFixed(2)}</TableCell>
                      <TableCell>{r.reason}</TableCell>
                      <TableCell>
                        <Badge variant={r.status === 'completed' ? 'default' : 'secondary'}>
                          {r.status === 'completed' ? '已完成' : '处理中'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{r.createdAt}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{r.completedAt || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profit by product */}
        <TabsContent value="profit-product" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>商品</TableHead>
                    <TableHead className="text-right">营收</TableHead>
                    <TableHead className="text-right">成本</TableHead>
                    <TableHead className="text-right">毛利</TableHead>
                    <TableHead className="text-right">毛利率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProfitByProduct.map(p => (
                    <TableRow key={p.productName}>
                      <TableCell className="font-medium">{p.productName}</TableCell>
                      <TableCell className="text-right">¥{p.revenue.toFixed(0)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">¥{p.cost.toFixed(0)}</TableCell>
                      <TableCell className="text-right font-medium text-status-success">¥{p.profit.toFixed(0)}</TableCell>
                      <TableCell className="text-right">{p.margin.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profit by store */}
        <TabsContent value="profit-store" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>门店</TableHead>
                    <TableHead className="text-right">订单数</TableHead>
                    <TableHead className="text-right">营收</TableHead>
                    <TableHead className="text-right">成本</TableHead>
                    <TableHead className="text-right">物流</TableHead>
                    <TableHead className="text-right">毛利</TableHead>
                    <TableHead className="text-right">毛利率</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockProfitByStore.map(s => (
                    <TableRow key={s.storeName}>
                      <TableCell className="font-medium">{s.storeName}</TableCell>
                      <TableCell className="text-right">{s.orderCount}</TableCell>
                      <TableCell className="text-right">¥{s.revenue.toFixed(0)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">¥{s.cost.toFixed(0)}</TableCell>
                      <TableCell className="text-right text-muted-foreground">¥{s.logistics.toFixed(0)}</TableCell>
                      <TableCell className="text-right font-medium text-status-success">¥{s.profit.toFixed(0)}</TableCell>
                      <TableCell className="text-right">{s.margin.toFixed(1)}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
