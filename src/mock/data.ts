import { Order, Product, Store, DashboardStats, OrderTimeline } from '@/types/models';
import { OrderStatus, PaymentStatus, AuditStatus, FulfillmentStatus, ProcurementAggStatus } from '@/types/enums';

export const mockStores: Store[] = [
  { id: 's1', name: '朝阳门店', contactPerson: '张三', phone: '13800138001', address: '北京市朝阳区建国路88号' },
  { id: 's2', name: '海淀门店', contactPerson: '李四', phone: '13800138002', address: '北京市海淀区中关村大街1号' },
  { id: 's3', name: '西城门店', contactPerson: '王五', phone: '13800138003', address: '北京市西城区金融街10号' },
];

export const mockProducts: Product[] = [
  { id: 'p1', name: '有机黄瓜', categoryId: 'c1', categoryName: '蔬菜', skuCode: 'VEG-001', spec: '500g/袋', unit: '袋', barcode: '6901234560001', costPrice: 3.5, salePrice: 6.8, isOnSale: true, defaultSupplierId: 'sup1', defaultSupplierName: '绿源农业', imageUrl: '', stock: 200 },
  { id: 'p2', name: '红富士苹果', categoryId: 'c2', categoryName: '水果', skuCode: 'FRT-001', spec: '1kg/袋', unit: '袋', barcode: '6901234560002', costPrice: 8.0, salePrice: 15.9, isOnSale: true, defaultSupplierId: 'sup2', defaultSupplierName: '鲜果源', imageUrl: '', stock: 150 },
  { id: 'p3', name: '散养土鸡蛋', categoryId: 'c3', categoryName: '禽蛋', skuCode: 'EGG-001', spec: '30枚/盒', unit: '盒', barcode: '6901234560003', costPrice: 18.0, salePrice: 32.0, isOnSale: true, defaultSupplierId: 'sup1', defaultSupplierName: '绿源农业', imageUrl: '', stock: 80 },
  { id: 'p4', name: '五花肉', categoryId: 'c4', categoryName: '肉类', skuCode: 'MEAT-001', spec: '500g/份', unit: '份', barcode: '6901234560004', costPrice: 15.0, salePrice: 28.8, isOnSale: true, defaultSupplierId: 'sup3', defaultSupplierName: '鑫源肉业', imageUrl: '', stock: 60 },
  { id: 'p5', name: '东北大米', categoryId: 'c5', categoryName: '粮油', skuCode: 'RICE-001', spec: '5kg/袋', unit: '袋', barcode: '6901234560005', costPrice: 22.0, salePrice: 39.9, isOnSale: true, defaultSupplierId: 'sup4', defaultSupplierName: '北方粮仓', imageUrl: '', stock: 300 },
  { id: 'p6', name: '纯牛奶', categoryId: 'c6', categoryName: '乳品', skuCode: 'MILK-001', spec: '250ml*12', unit: '箱', barcode: '6901234560006', costPrice: 28.0, salePrice: 49.9, isOnSale: true, defaultSupplierId: 'sup5', defaultSupplierName: '蒙源乳业', imageUrl: '', stock: 120 },
  { id: 'p7', name: '小白菜', categoryId: 'c1', categoryName: '蔬菜', skuCode: 'VEG-002', spec: '300g/袋', unit: '袋', barcode: '6901234560007', costPrice: 2.0, salePrice: 4.5, isOnSale: true, defaultSupplierId: 'sup1', defaultSupplierName: '绿源农业', imageUrl: '', stock: 180 },
  { id: 'p8', name: '三文鱼片', categoryId: 'c7', categoryName: '水产', skuCode: 'FISH-001', spec: '200g/盒', unit: '盒', barcode: '6901234560008', costPrice: 35.0, salePrice: 68.0, isOnSale: true, defaultSupplierId: 'sup6', defaultSupplierName: '海之鲜', imageUrl: '', stock: 40 },
];

const createTimeline = (status: OrderStatus, isApp: boolean): { time: string; title: string; description?: string; operator?: string }[] => {
  const base: OrderTimeline[] = [
    { time: '2026-02-25 09:30:00', title: isApp ? '提交申请订货' : '创建订单', description: '门店提交订单', operator: '张三' },
  ];
  if (isApp) {
    base.push({ time: '2026-02-25 10:15:00', title: '审核通过', description: '管理员审核通过申请', operator: '管理员' });
  }
  if (status !== OrderStatus.PENDING) {
    base.push({ time: '2026-02-25 10:30:00', title: '支付成功', description: '微信支付完成' });
    base.push({ time: '2026-02-25 11:00:00', title: '录入物流成本', description: '预估物流成本 ¥15.00', operator: '管理员' });
  }
  if (status === OrderStatus.COMPLETED) {
    base.push({ time: '2026-02-28 14:00:00', title: '拣货完成', operator: '仓库李' });
    base.push({ time: '2026-02-28 16:00:00', title: '已发货', description: '配送员已取货' });
    base.push({ time: '2026-03-01 10:00:00', title: '已签收', description: '门店已确认签收', operator: '张三' });
  }
  return base;
};

export const mockOrders: Order[] = [
  {
    id: 'o1', orderNo: 'ORD20260225001', storeId: 's1', storeName: '朝阳门店',
    status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID,
    fulfillmentStatus: FulfillmentStatus.NOT_TRANSFERRED, procurementStatus: ProcurementAggStatus.TO_SPLIT,
    items: [
      { id: 'oi1', productId: 'p1', productName: '有机黄瓜', skuCode: 'VEG-001', spec: '500g/袋', unit: '袋', quantity: 10, costPrice: 3.5, salePrice: 6.8 },
      { id: 'oi2', productId: 'p2', productName: '红富士苹果', skuCode: 'FRT-001', spec: '1kg/袋', unit: '袋', quantity: 5, costPrice: 8.0, salePrice: 15.9 },
    ],
    totalSalePrice: 147.5, totalCostPrice: 75.0, estimatedLogisticsCost: 15.0,
    estimatedProfit: 57.5, isApplication: false,
    createdAt: '2026-02-25 09:30:00', timeline: createTimeline(OrderStatus.PENDING, false),
  },
  {
    id: 'o2', orderNo: 'ORD20260225002', storeId: 's2', storeName: '海淀门店',
    status: OrderStatus.PROCESSING, paymentStatus: PaymentStatus.PAID,
    fulfillmentStatus: FulfillmentStatus.PICKING, procurementStatus: ProcurementAggStatus.READY,
    items: [
      { id: 'oi3', productId: 'p3', productName: '散养土鸡蛋', skuCode: 'EGG-001', spec: '30枚/盒', unit: '盒', quantity: 3, costPrice: 18.0, salePrice: 32.0 },
      { id: 'oi4', productId: 'p4', productName: '五花肉', skuCode: 'MEAT-001', spec: '500g/份', unit: '份', quantity: 8, costPrice: 15.0, salePrice: 28.8 },
      { id: 'oi5', productId: 'p5', productName: '东北大米', skuCode: 'RICE-001', spec: '5kg/袋', unit: '袋', quantity: 2, costPrice: 22.0, salePrice: 39.9 },
    ],
    totalSalePrice: 406.2, totalCostPrice: 218.0, estimatedLogisticsCost: 25.0,
    estimatedProfit: 163.2, isApplication: false,
    createdAt: '2026-02-25 10:15:00', paidAt: '2026-02-25 10:30:00',
    timeline: createTimeline(OrderStatus.PROCESSING, false),
  },
  {
    id: 'o3', orderNo: 'ORD20260224001', storeId: 's1', storeName: '朝阳门店',
    status: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID,
    fulfillmentStatus: FulfillmentStatus.RECEIVED, procurementStatus: ProcurementAggStatus.CLOSED,
    items: [
      { id: 'oi6', productId: 'p6', productName: '纯牛奶', skuCode: 'MILK-001', spec: '250ml*12', unit: '箱', quantity: 5, costPrice: 28.0, salePrice: 49.9 },
      { id: 'oi7', productId: 'p7', productName: '小白菜', skuCode: 'VEG-002', spec: '300g/袋', unit: '袋', quantity: 20, costPrice: 2.0, salePrice: 4.5 },
    ],
    totalSalePrice: 339.5, totalCostPrice: 180.0, estimatedLogisticsCost: 20.0,
    actualLogisticsCost: 18.0, estimatedProfit: 139.5, settlementProfit: 141.5,
    isApplication: false, createdAt: '2026-02-24 08:00:00', paidAt: '2026-02-24 08:15:00',
    timeline: createTimeline(OrderStatus.COMPLETED, false),
  },
  {
    id: 'o4', orderNo: 'APP20260226001', storeId: 's3', storeName: '西城门店',
    status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID,
    auditStatus: AuditStatus.PENDING,
    fulfillmentStatus: FulfillmentStatus.NOT_TRANSFERRED, procurementStatus: ProcurementAggStatus.TO_SPLIT,
    items: [
      { id: 'oi8', productId: 'p8', productName: '三文鱼片', skuCode: 'FISH-001', spec: '200g/盒', unit: '盒', quantity: 10, costPrice: 35.0, salePrice: 68.0 },
    ],
    totalSalePrice: 680.0, totalCostPrice: 350.0, estimatedLogisticsCost: 0,
    estimatedProfit: 330.0, isApplication: true,
    createdAt: '2026-02-26 20:30:00', timeline: createTimeline(OrderStatus.PENDING, true),
    remark: '周末急需，请优先处理',
  },
  {
    id: 'o5', orderNo: 'APP20260226002', storeId: 's2', storeName: '海淀门店',
    status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID,
    auditStatus: AuditStatus.APPROVED,
    fulfillmentStatus: FulfillmentStatus.NOT_TRANSFERRED, procurementStatus: ProcurementAggStatus.TO_SPLIT,
    items: [
      { id: 'oi9', productId: 'p1', productName: '有机黄瓜', skuCode: 'VEG-001', spec: '500g/袋', unit: '袋', quantity: 15, costPrice: 3.5, salePrice: 6.8 },
      { id: 'oi10', productId: 'p3', productName: '散养土鸡蛋', skuCode: 'EGG-001', spec: '30枚/盒', unit: '盒', quantity: 5, costPrice: 18.0, salePrice: 32.0 },
    ],
    totalSalePrice: 262.0, totalCostPrice: 142.5, estimatedLogisticsCost: 0,
    estimatedProfit: 119.5, isApplication: true,
    createdAt: '2026-02-26 21:00:00',
    timeline: [
      { time: '2026-02-26 21:00:00', title: '提交申请订货', operator: '李四' },
      { time: '2026-02-27 09:00:00', title: '审核通过', operator: '管理员' },
    ],
  },
  {
    id: 'o6', orderNo: 'ORD20260225003', storeId: 's3', storeName: '西城门店',
    status: OrderStatus.CANCELLED, paymentStatus: PaymentStatus.REFUNDED,
    fulfillmentStatus: FulfillmentStatus.NOT_TRANSFERRED, procurementStatus: ProcurementAggStatus.CLOSED,
    items: [
      { id: 'oi11', productId: 'p4', productName: '五花肉', skuCode: 'MEAT-001', spec: '500g/份', unit: '份', quantity: 3, costPrice: 15.0, salePrice: 28.8 },
    ],
    totalSalePrice: 86.4, totalCostPrice: 45.0, estimatedLogisticsCost: 10.0,
    estimatedProfit: 31.4, isApplication: false,
    createdAt: '2026-02-25 14:00:00',
    timeline: [
      { time: '2026-02-25 14:00:00', title: '创建订单', operator: '王五' },
      { time: '2026-02-25 14:10:00', title: '支付成功' },
      { time: '2026-02-25 16:00:00', title: '申请取消', description: '门店取消订单', operator: '王五' },
      { time: '2026-02-25 16:30:00', title: '已退款', description: '微信原路退款' },
    ],
  },
];

export const mockDashboardStats: DashboardStats = {
  todayOrders: 12,
  todayRevenue: 3580.50,
  pendingOrders: 3,
  pendingApplications: 2,
  procurementAbnormal: 1,
  lowStockItems: 4,
};

export const mockRevenueData = [
  { date: '02-20', revenue: 2800, cost: 1500, profit: 1300 },
  { date: '02-21', revenue: 3200, cost: 1800, profit: 1400 },
  { date: '02-22', revenue: 0, cost: 0, profit: 0 },
  { date: '02-23', revenue: 0, cost: 0, profit: 0 },
  { date: '02-24', revenue: 4100, cost: 2200, profit: 1900 },
  { date: '02-25', revenue: 3580, cost: 1950, profit: 1630 },
  { date: '02-26', revenue: 2900, cost: 1600, profit: 1300 },
];

// 判断当前是否在下单时间内（周一至周五）
export function isOrderTime(): boolean {
  const now = new Date();
  const day = now.getDay();
  return day >= 1 && day <= 5;
}

export function getOrderTimeHint(): string {
  if (isOrderTime()) {
    return '当前为下单时段（周一至周五），可正常下单';
  }
  return '当前为非下单时段，仅可提交申请订货。正式下单时间：周一至周五 00:00-23:59，周六统一发货';
}
