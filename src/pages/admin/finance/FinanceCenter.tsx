import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { formatDateWithDay } from '@/lib/utils';
import { mockPaymentRecords, mockRefunds, mockRevenueData, mockProfitByProduct, mockOrders } from '@/mock/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DollarSign, TrendingUp, CreditCard, RotateCcw, ChevronDown, ChevronRight, Store, CalendarIcon, Download, FileSpreadsheet } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { OrderStatus } from '@/types/enums';
import { cn } from '@/lib/utils';

const totalRevenue = mockPaymentRecords.filter(p => p.status === 'success').reduce((s, p) => s + p.amount, 0);
const totalRefund = mockRefunds.reduce((s, r) => s + r.amount, 0);

interface StoreProfitGroup {
  storeName: string;
  storeId: string;
  orderCount: number;
  totalSale: number;
  totalCost: number;
  totalLogistics: number;
  profit: number;
  margin: number;
  orders: {
    orderNo: string;
    status: OrderStatus;
    totalSale: number;
    totalCost: number;
    logistics: number;
    profit: number;
    createdAt: string;
    items: { productName: string; quantity: number; unit: string; salePrice: number; costPrice: number; saleTotal: number; costTotal: number }[];
  }[];
}

function computeStoreProfits(dateFrom?: Date, dateTo?: Date): StoreProfitGroup[] {
  let validOrders = mockOrders.filter(o => o.status !== OrderStatus.CANCELLED);

  if (dateFrom) {
    validOrders = validOrders.filter(o => new Date(o.createdAt) >= dateFrom);
  }
  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    validOrders = validOrders.filter(o => new Date(o.createdAt) <= end);
  }

  const grouped: Record<string, StoreProfitGroup> = {};

  for (const order of validOrders) {
    if (!grouped[order.storeId]) {
      grouped[order.storeId] = {
        storeName: order.storeName, storeId: order.storeId,
        orderCount: 0, totalSale: 0, totalCost: 0, totalLogistics: 0, profit: 0, margin: 0, orders: [],
      };
    }
    const g = grouped[order.storeId];
    const logistics = order.actualLogisticsCost ?? order.estimatedLogisticsCost;
    const profit = order.totalSalePrice - order.totalCostPrice - logistics;
    g.orderCount++;
    g.totalSale += order.totalSalePrice;
    g.totalCost += order.totalCostPrice;
    g.totalLogistics += logistics;
    g.orders.push({
      orderNo: order.orderNo, status: order.status,
      totalSale: order.totalSalePrice, totalCost: order.totalCostPrice,
      logistics, profit, createdAt: order.createdAt,
      items: order.items.map(item => ({
        productName: item.productName, quantity: item.quantity, unit: item.unit,
        salePrice: item.salePrice, costPrice: item.costPrice,
        saleTotal: item.salePrice * item.quantity, costTotal: item.costPrice * item.quantity,
      })),
    });
  }

  return Object.values(grouped).map(g => {
    g.profit = g.totalSale - g.totalCost - g.totalLogistics;
    g.margin = g.totalSale > 0 ? (g.profit / g.totalSale) * 100 : 0;
    return g;
  }).sort((a, b) => b.profit - a.profit);
}

const statusLabel: Record<string, string> = {
  [OrderStatus.PENDING]: '待处理',
  [OrderStatus.PROCESSING]: '处理中',
  [OrderStatus.COMPLETED]: '已完成',
  [OrderStatus.CANCELLED]: '已取消',
};

function DatePicker({ date, onChange, placeholder }: { date?: Date; onChange: (d?: Date) => void; placeholder: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-[150px] justify-start text-left font-normal text-sm", !date && "text-muted-foreground")}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'yyyy-MM-dd') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={onChange} initialFocus className={cn("p-3 pointer-events-auto")} />
      </PopoverContent>
    </Popover>
  );
}

export default function FinanceCenter() {
  const [tab, setTab] = useState('overview');
  const [expandedStores, setExpandedStores] = useState<Set<string>>(new Set());
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const storeProfits = useMemo(() => computeStoreProfits(dateFrom, dateTo), [dateFrom, dateTo]);

  const grandTotal = useMemo(() => ({
    sale: storeProfits.reduce((s, g) => s + g.totalSale, 0),
    cost: storeProfits.reduce((s, g) => s + g.totalCost, 0),
    logistics: storeProfits.reduce((s, g) => s + g.totalLogistics, 0),
    profit: storeProfits.reduce((s, g) => s + g.profit, 0),
    orders: storeProfits.reduce((s, g) => s + g.orderCount, 0),
  }), [storeProfits]);

  const chartData = useMemo(() =>
    storeProfits.map(g => ({
      name: g.storeName,
      售价: g.totalSale,
      成本: g.totalCost,
      物流: g.totalLogistics,
      利润: g.profit,
    }))
  , [storeProfits]);

  const toggleStore = (id: string) => {
    setExpandedStores(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleOrder = (no: string) => {
    setExpandedOrders(prev => { const n = new Set(prev); n.has(no) ? n.delete(no) : n.add(no); return n; });
  };

  const clearDates = () => { setDateFrom(undefined); setDateTo(undefined); };

  const getDateRangeLabel = () => {
    if (dateFrom && dateTo) return `${format(dateFrom, 'yyyy-MM-dd')} 至 ${format(dateTo, 'yyyy-MM-dd')}`;
    if (dateFrom) return `${format(dateFrom, 'yyyy-MM-dd')} 起`;
    if (dateTo) return `至 ${format(dateTo, 'yyyy-MM-dd')}`;
    return '全部时间';
  };

  const exportExcel = async () => {
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = storeProfits.map(g => ({
      '门店': g.storeName,
      '订单数': g.orderCount,
      '售价合计': g.totalSale,
      '成本合计': g.totalCost,
      '物流成本': g.totalLogistics,
      '利润': g.profit,
      '毛利率(%)': Number(g.margin.toFixed(1)),
    }));
    summaryData.push({
      '门店': '合计',
      '订单数': grandTotal.orders,
      '售价合计': grandTotal.sale,
      '成本合计': grandTotal.cost,
      '物流成本': grandTotal.logistics,
      '利润': grandTotal.profit,
      '毛利率(%)': grandTotal.sale > 0 ? Number(((grandTotal.profit / grandTotal.sale) * 100).toFixed(1)) : 0,
    });
    const ws1 = XLSX.utils.json_to_sheet(summaryData);
    ws1['!cols'] = [{ wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 12 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws1, '门店利润汇总');

    // Detail sheet
    const detailData: Record<string, unknown>[] = [];
    for (const g of storeProfits) {
      for (const order of g.orders) {
        for (const item of order.items) {
          detailData.push({
            '门店': g.storeName,
            '订单号': order.orderNo,
            '状态': statusLabel[order.status] || order.status,
            '下单时间': order.createdAt,
            '商品': item.productName,
            '数量': item.quantity,
            '单位': item.unit,
            '售价': item.salePrice,
            '成本': item.costPrice,
            '售价小计': item.saleTotal,
            '成本小计': item.costTotal,
            '商品毛利': item.saleTotal - item.costTotal,
          });
        }
      }
    }
    const ws2 = XLSX.utils.json_to_sheet(detailData);
    ws2['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 8 }, { wch: 20 }, { wch: 12 }, { wch: 6 }, { wch: 6 }, { wch: 8 }, { wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws2, '订单明细');

    XLSX.writeFile(wb, `门店利润报表_${getDateRangeLabel()}.xlsx`);
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;

    const doc = new jsPDF({ orientation: 'landscape' });

    // Title
    doc.setFontSize(16);
    doc.text('Store Profit Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Date Range: ${getDateRangeLabel()}`, 14, 28);

    // Summary table
    const summaryHead = [['Store', 'Orders', 'Revenue', 'Cost', 'Logistics', 'Profit', 'Margin']];
    const summaryBody = storeProfits.map(g => [
      g.storeName, g.orderCount.toString(),
      `¥${g.totalSale.toLocaleString()}`, `¥${g.totalCost.toLocaleString()}`,
      `¥${g.totalLogistics}`, `¥${g.profit.toLocaleString()}`, `${g.margin.toFixed(1)}%`,
    ]);
    summaryBody.push([
      'Total', grandTotal.orders.toString(),
      `¥${grandTotal.sale.toLocaleString()}`, `¥${grandTotal.cost.toLocaleString()}`,
      `¥${grandTotal.logistics.toLocaleString()}`, `¥${grandTotal.profit.toLocaleString()}`,
      grandTotal.sale > 0 ? `${((grandTotal.profit / grandTotal.sale) * 100).toFixed(1)}%` : '0%',
    ]);

    autoTable(doc, {
      head: summaryHead,
      body: summaryBody,
      startY: 34,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [66, 133, 244] },
      foot: [],
    });

    // Detail table on new page
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Order Details', 14, 20);

    const detailHead = [['Store', 'Order No', 'Status', 'Product', 'Qty', 'Price', 'Cost', 'Subtotal', 'Cost Sub', 'Margin']];
    const detailBody: string[][] = [];
    for (const g of storeProfits) {
      for (const order of g.orders) {
        for (const item of order.items) {
          detailBody.push([
            g.storeName, order.orderNo, statusLabel[order.status] || order.status,
            item.productName, `${item.quantity}${item.unit}`,
            `¥${item.salePrice}`, `¥${item.costPrice}`,
            `¥${item.saleTotal}`, `¥${item.costTotal}`,
            `¥${item.saleTotal - item.costTotal}`,
          ]);
        }
      }
    }

    autoTable(doc, {
      head: detailHead,
      body: detailBody,
      startY: 26,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [66, 133, 244] },
    });

    doc.save(`Store_Profit_Report_${getDateRangeLabel()}.pdf`);
  };

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
          <TabsTrigger value="profit-store">门店利润</TabsTrigger>
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
                      <TableCell className="text-muted-foreground text-sm">{formatDateWithDay(p.paidAt)}</TableCell>
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
                      <TableCell className="text-muted-foreground text-sm">{formatDateWithDay(r.createdAt)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{r.completedAt ? formatDateWithDay(r.completedAt) : '-'}</TableCell>
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
        <TabsContent value="profit-store" className="mt-4 space-y-4">
          {/* Date filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium">时间筛选</span>
                <DatePicker date={dateFrom} onChange={setDateFrom} placeholder="开始日期" />
                <span className="text-muted-foreground">至</span>
                <DatePicker date={dateTo} onChange={setDateTo} placeholder="结束日期" />
                {(dateFrom || dateTo) && (
                  <Button variant="ghost" size="sm" onClick={clearDates}>清除</Button>
                )}
                <span className="text-xs text-muted-foreground">
                  {dateFrom || dateTo ? '已筛选' : '显示全部订单'}
                  {storeProfits.length > 0 && ` · ${grandTotal.orders} 笔订单`}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportExcel} disabled={storeProfits.length === 0}>
                    <FileSpreadsheet className="w-4 h-4 mr-1" />Excel
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportPDF} disabled={storeProfits.length === 0}>
                    <Download className="w-4 h-4 mr-1" />PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">订单总数</p><p className="text-xl font-bold">{grandTotal.orders}</p></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">售价合计</p><p className="text-xl font-bold">¥{grandTotal.sale.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">成本合计</p><p className="text-xl font-bold">¥{grandTotal.cost.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">物流合计</p><p className="text-xl font-bold">¥{grandTotal.logistics.toLocaleString()}</p></CardContent></Card>
            <Card><CardContent className="p-3 text-center"><p className="text-xs text-muted-foreground">总利润</p><p className="text-xl font-bold text-status-success">¥{grandTotal.profit.toLocaleString()}</p></CardContent></Card>
          </div>

          {/* Profit comparison chart */}
          {chartData.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">门店利润对比</CardTitle></CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="name" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                      <Legend />
                      <Bar dataKey="售价" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="成本" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="物流" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="利润" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-muted-foreground">毛利 = 售价合计 − 成本合计 − 物流成本（已排除已取消订单）</p>

          {/* Store groups */}
          <div className="space-y-3">
            {storeProfits.length === 0 ? (
              <Card><CardContent className="p-8 text-center text-muted-foreground">
                <Store className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>该时间范围内无订单数据</p>
              </CardContent></Card>
            ) : storeProfits.map(group => {
              const isOpen = expandedStores.has(group.storeId);
              return (
                <Card key={group.storeId}>
                  <div
                    className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleStore(group.storeId)}
                  >
                    {isOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />}
                    <Store className="w-5 h-5 text-primary shrink-0" />
                    <span className="font-semibold">{group.storeName}</span>
                    <Badge variant="secondary" className="ml-1">{group.orderCount} 单</Badge>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground hidden sm:inline">售价 ¥{group.totalSale.toLocaleString()}</span>
                      <span className="text-muted-foreground hidden md:inline">成本 ¥{group.totalCost.toLocaleString()}</span>
                      <span className="text-muted-foreground hidden md:inline">物流 ¥{group.totalLogistics}</span>
                      <span className="font-bold text-status-success">利润 ¥{group.profit.toLocaleString()}</span>
                      <span className="text-muted-foreground">{group.margin.toFixed(1)}%</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div className="border-t">
                      {group.orders.map(order => {
                        const orderOpen = expandedOrders.has(order.orderNo);
                        return (
                          <div key={order.orderNo}>
                            <div
                              className="flex items-center gap-3 px-6 py-3 cursor-pointer hover:bg-muted/30 transition-colors text-sm"
                              onClick={() => toggleOrder(order.orderNo)}
                            >
                              {orderOpen ? <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
                              <span className="text-primary font-mono">{order.orderNo}</span>
                              <Badge variant="secondary" className="text-xs">{statusLabel[order.status] || order.status}</Badge>
                              <span className="text-xs text-muted-foreground hidden sm:inline">{formatDateWithDay(order.createdAt)}</span>
                              <div className="flex-1" />
                              <span className="text-muted-foreground">¥{order.totalSale}</span>
                              <span className="text-muted-foreground">- ¥{order.totalCost}</span>
                              <span className="text-muted-foreground">- ¥{order.logistics}</span>
                              <span className="font-medium text-status-success">= ¥{order.profit}</span>
                            </div>
                            {orderOpen && (
                              <div className="px-8 pb-3">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>商品</TableHead>
                                      <TableHead className="text-right">数量</TableHead>
                                      <TableHead className="text-right">售价</TableHead>
                                      <TableHead className="text-right">成本</TableHead>
                                      <TableHead className="text-right">售价小计</TableHead>
                                      <TableHead className="text-right">成本小计</TableHead>
                                      <TableHead className="text-right">毛利</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {order.items.map((item, i) => (
                                      <TableRow key={i}>
                                        <TableCell>{item.productName}</TableCell>
                                        <TableCell className="text-right">{item.quantity}{item.unit}</TableCell>
                                        <TableCell className="text-right">¥{item.salePrice}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">¥{item.costPrice}</TableCell>
                                        <TableCell className="text-right">¥{item.saleTotal}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">¥{item.costTotal}</TableCell>
                                        <TableCell className="text-right font-medium text-status-success">¥{item.saleTotal - item.costTotal}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
