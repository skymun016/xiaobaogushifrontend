import { Order, Product, Store, DashboardStats, OrderTimeline } from '@/types/models';
import {
  OrderStatus, PaymentStatus, AuditStatus, FulfillmentStatus,
  ProcurementAggStatus, PurchaseOrderStatus
} from '@/types/enums';

// ============ Stores ============
export const mockStores: Store[] = [
  { id: 's1', name: '宿迁总店', contactPerson: '张三', phone: '13800138001', address: '江苏省宿迁市宿城区发展大道88号' },
  { id: 's2', name: '宿迁1号店', contactPerson: '李四', phone: '13800138002', address: '江苏省宿迁市宿豫区江山大道1号' },
  { id: 's3', name: '宿迁2号店', contactPerson: '王五', phone: '13800138003', address: '江苏省宿迁市沭阳县上海路10号' },
  { id: 's4', name: '徐州1号店', contactPerson: '赵六', phone: '13800138004', address: '江苏省徐州市云龙区和平路66号' },
  { id: 's5', name: '徐州2号店', contactPerson: '钱七', phone: '13800138005', address: '江苏省徐州市铜山区大学路18号' },
];

// ============ Categories ============
export interface Category {
  id: string;
  name: string;
  parentId?: string;
  sort: number;
  productCount: number;
}

export const mockCategories: Category[] = [
  { id: 'c1', name: '机器', sort: 1, productCount: 3 },
  { id: 'c2', name: '食材', sort: 2, productCount: 3 },
  { id: 'c3', name: '包材', sort: 3, productCount: 2 },
  { id: 'c4', name: '周边', sort: 4, productCount: 2 },
];

// ============ Suppliers ============
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  status: 'active' | 'inactive';
  productCount: number;
  createdAt: string;
}

export const mockSuppliers: Supplier[] = [
  { id: 'sup1', name: '绿源农业', contactPerson: '陈经理', phone: '13900139001', email: 'chen@lvyuan.com', address: '山东省寿光市蔬菜产业园A区', status: 'active', productCount: 3, createdAt: '2025-06-01' },
  { id: 'sup2', name: '鲜果源', contactPerson: '刘总', phone: '13900139002', email: 'liu@xianguoyuan.com', address: '陕西省延安市洛川县果业基地', status: 'active', productCount: 1, createdAt: '2025-07-15' },
  { id: 'sup3', name: '鑫源肉业', contactPerson: '赵主任', phone: '13900139003', email: 'zhao@xinyuan.com', address: '河北省保定市肉联厂', status: 'active', productCount: 1, createdAt: '2025-08-01' },
  { id: 'sup4', name: '北方粮仓', contactPerson: '孙总', phone: '13900139004', email: 'sun@beifang.com', address: '黑龙江省五常市大米产业园', status: 'active', productCount: 1, createdAt: '2025-09-10' },
  { id: 'sup5', name: '蒙源乳业', contactPerson: '周经理', phone: '13900139005', email: 'zhou@mengyuan.com', address: '内蒙古呼和浩特市乳业园区', status: 'active', productCount: 1, createdAt: '2025-10-01' },
  { id: 'sup6', name: '海之鲜', contactPerson: '吴总', phone: '13900139006', email: 'wu@haizhi.com', address: '大连市金州区渔港码头', status: 'inactive', productCount: 1, createdAt: '2025-11-20' },
];

// ============ Products ============
export const mockProducts: Product[] = [
  { id: 'p1', name: '封口机', categoryId: 'c1', categoryName: '机器', skuCode: 'MC-001', spec: '台式/台', unit: '台', barcode: '6901234560001', costPrice: 680, salePrice: 1280, isOnSale: true, defaultSupplierId: 'sup1', defaultSupplierName: '绿源农业', imageUrl: '', stock: 20 },
  { id: 'p2', name: '制冰机', categoryId: 'c1', categoryName: '机器', skuCode: 'MC-002', spec: '商用/台', unit: '台', barcode: '6901234560002', costPrice: 1500, salePrice: 2980, isOnSale: true, defaultSupplierId: 'sup2', defaultSupplierName: '鲜果源', imageUrl: '', stock: 15 },
  { id: 'p3', name: '果糖机', categoryId: 'c1', categoryName: '机器', skuCode: 'MC-003', spec: '16格/台', unit: '台', barcode: '6901234560003', costPrice: 850, salePrice: 1680, isOnSale: true, defaultSupplierId: 'sup1', defaultSupplierName: '绿源农业', imageUrl: '', stock: 10 },
  { id: 'p4', name: '红茶茶叶', categoryId: 'c2', categoryName: '食材', skuCode: 'FM-001', spec: '500g/袋', unit: '袋', barcode: '6901234560004', costPrice: 35, salePrice: 68, isOnSale: true, defaultSupplierId: 'sup3', defaultSupplierName: '鑫源肉业', imageUrl: '', stock: 200 },
  { id: 'p5', name: '白砂糖', categoryId: 'c2', categoryName: '食材', skuCode: 'FM-002', spec: '25kg/袋', unit: '袋', barcode: '6901234560005', costPrice: 85, salePrice: 128, isOnSale: true, defaultSupplierId: 'sup4', defaultSupplierName: '北方粮仓', imageUrl: '', stock: 300 },
  { id: 'p6', name: '椰浆', categoryId: 'c2', categoryName: '食材', skuCode: 'FM-003', spec: '1L/盒', unit: '盒', barcode: '6901234560006', costPrice: 12, salePrice: 22, isOnSale: true, defaultSupplierId: 'sup5', defaultSupplierName: '蒙源乳业', imageUrl: '', stock: 150 },
  { id: 'p7', name: '一次性杯子', categoryId: 'c3', categoryName: '包材', skuCode: 'PM-001', spec: '500ml*1000个/箱', unit: '箱', barcode: '6901234560007', costPrice: 120, salePrice: 198, isOnSale: true, defaultSupplierId: 'sup1', defaultSupplierName: '绿源农业', imageUrl: '', stock: 80 },
  { id: 'p8', name: '吸管', categoryId: 'c3', categoryName: '包材', skuCode: 'PM-002', spec: '5000支/箱', unit: '箱', barcode: '6901234560008', costPrice: 45, salePrice: 78, isOnSale: true, defaultSupplierId: 'sup6', defaultSupplierName: '海之鲜', imageUrl: '', stock: 60 },
  { id: 'p9', name: '围裙', categoryId: 'c4', categoryName: '周边', skuCode: 'ZB-001', spec: '均码/件', unit: '件', barcode: '6901234560009', costPrice: 15, salePrice: 35, isOnSale: true, defaultSupplierId: 'sup4', defaultSupplierName: '北方粮仓', imageUrl: '', stock: 100 },
  { id: 'p10', name: '品牌贴纸', categoryId: 'c4', categoryName: '周边', skuCode: 'ZB-002', spec: '100张/卷', unit: '卷', barcode: '6901234560010', costPrice: 8, salePrice: 18, isOnSale: false, defaultSupplierId: 'sup3', defaultSupplierName: '鑫源肉业', imageUrl: '', stock: 0 },
];

// ============ Orders ============
const createTimeline = (status: OrderStatus, isApp: boolean): OrderTimeline[] => {
  const base: OrderTimeline[] = [
    { time: '2026-02-25 09:30:00', title: isApp ? '提交申请订货' : '创建订单', description: '门店提交订单', operator: '张三' },
  ];
  if (isApp) {
    base.push({ time: '2026-02-25 10:15:00', title: '审核通过', description: '管理员审核通过申请', operator: '管理员' });
  }
  if (status !== OrderStatus.PENDING) {
    base.push({ time: '2026-02-25 10:30:00', title: '支付成功', description: '微信支付完成' });
    base.push({ time: '2026-02-25 11:00:00', title: '录入物流成本', description: '预估物流成本 ¥50.00', operator: '管理员' });
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
    id: 'o1', orderNo: 'ORD20260225001', storeId: 's1', storeName: '宿迁总店',
    status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID,
    fulfillmentStatus: FulfillmentStatus.NOT_TRANSFERRED, procurementStatus: ProcurementAggStatus.TO_SPLIT,
    items: [
      { id: 'oi1', productId: 'p1', productName: '封口机', skuCode: 'MC-001', spec: '台式/台', unit: '台', quantity: 2, costPrice: 680, salePrice: 1280 },
      { id: 'oi2', productId: 'p4', productName: '红茶茶叶', skuCode: 'FM-001', spec: '500g/袋', unit: '袋', quantity: 5, costPrice: 35, salePrice: 68 },
    ],
    totalSalePrice: 2900, totalCostPrice: 1535, estimatedLogisticsCost: 50,
    estimatedProfit: 1315, isApplication: false,
    createdAt: '2026-02-25 09:30:00', timeline: createTimeline(OrderStatus.PENDING, false),
  },
  {
    id: 'o2', orderNo: 'ORD20260225002', storeId: 's2', storeName: '宿迁1号店',
    status: OrderStatus.PROCESSING, paymentStatus: PaymentStatus.PAID,
    fulfillmentStatus: FulfillmentStatus.PICKING, procurementStatus: ProcurementAggStatus.READY,
    items: [
      { id: 'oi3', productId: 'p5', productName: '白砂糖', skuCode: 'FM-002', spec: '25kg/袋', unit: '袋', quantity: 3, costPrice: 85, salePrice: 128 },
      { id: 'oi4', productId: 'p7', productName: '一次性杯子', skuCode: 'PM-001', spec: '500ml*1000个/箱', unit: '箱', quantity: 2, costPrice: 120, salePrice: 198 },
      { id: 'oi5', productId: 'p8', productName: '吸管', skuCode: 'PM-002', spec: '5000支/箱', unit: '箱', quantity: 1, costPrice: 45, salePrice: 78 },
    ],
    totalSalePrice: 762, totalCostPrice: 420, estimatedLogisticsCost: 25,
    estimatedProfit: 317, isApplication: false,
    createdAt: '2026-02-25 10:15:00', paidAt: '2026-02-25 10:30:00',
    timeline: createTimeline(OrderStatus.PROCESSING, false),
  },
  {
    id: 'o3', orderNo: 'ORD20260224001', storeId: 's1', storeName: '宿迁总店',
    status: OrderStatus.COMPLETED, paymentStatus: PaymentStatus.PAID,
    fulfillmentStatus: FulfillmentStatus.RECEIVED, procurementStatus: ProcurementAggStatus.CLOSED,
    items: [
      { id: 'oi6', productId: 'p6', productName: '椰浆', skuCode: 'FM-003', spec: '1L/盒', unit: '盒', quantity: 10, costPrice: 12, salePrice: 22 },
      { id: 'oi7', productId: 'p9', productName: '围裙', skuCode: 'ZB-001', spec: '均码/件', unit: '件', quantity: 5, costPrice: 15, salePrice: 35 },
    ],
    totalSalePrice: 395, totalCostPrice: 195, estimatedLogisticsCost: 20,
    actualLogisticsCost: 18, estimatedProfit: 180, settlementProfit: 182,
    isApplication: false, createdAt: '2026-02-24 08:00:00', paidAt: '2026-02-24 08:15:00',
    timeline: createTimeline(OrderStatus.COMPLETED, false),
  },
  {
    id: 'o4', orderNo: 'APP20260226001', storeId: 's3', storeName: '宿迁2号店',
    status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID,
    auditStatus: AuditStatus.PENDING,
    fulfillmentStatus: FulfillmentStatus.NOT_TRANSFERRED, procurementStatus: ProcurementAggStatus.TO_SPLIT,
    items: [
      { id: 'oi8', productId: 'p2', productName: '制冰机', skuCode: 'MC-002', spec: '商用/台', unit: '台', quantity: 1, costPrice: 1500, salePrice: 2980 },
    ],
    totalSalePrice: 2980, totalCostPrice: 1500, estimatedLogisticsCost: 0,
    estimatedProfit: 1480, isApplication: true,
    createdAt: '2026-02-26 20:30:00', timeline: createTimeline(OrderStatus.PENDING, true),
    remark: '急需，请优先处理',
  },
  {
    id: 'o5', orderNo: 'APP20260226002', storeId: 's2', storeName: '宿迁1号店',
    status: OrderStatus.PENDING, paymentStatus: PaymentStatus.UNPAID,
    auditStatus: AuditStatus.APPROVED,
    fulfillmentStatus: FulfillmentStatus.NOT_TRANSFERRED, procurementStatus: ProcurementAggStatus.TO_SPLIT,
    items: [
      { id: 'oi9', productId: 'p3', productName: '果糖机', skuCode: 'MC-003', spec: '16格/台', unit: '台', quantity: 1, costPrice: 850, salePrice: 1680 },
      { id: 'oi10', productId: 'p6', productName: '椰浆', skuCode: 'FM-003', spec: '1L/盒', unit: '盒', quantity: 20, costPrice: 12, salePrice: 22 },
    ],
    totalSalePrice: 2120, totalCostPrice: 1090, estimatedLogisticsCost: 0,
    estimatedProfit: 1030, isApplication: true,
    createdAt: '2026-02-26 21:00:00',
    timeline: [
      { time: '2026-02-26 21:00:00', title: '提交申请订货', operator: '李四' },
      { time: '2026-02-27 09:00:00', title: '审核通过', operator: '管理员' },
    ],
  },
  {
    id: 'o6', orderNo: 'ORD20260225003', storeId: 's4', storeName: '徐州1号店',
    status: OrderStatus.CANCELLED, paymentStatus: PaymentStatus.REFUNDED,
    fulfillmentStatus: FulfillmentStatus.NOT_TRANSFERRED, procurementStatus: ProcurementAggStatus.CLOSED,
    items: [
      { id: 'oi11', productId: 'p10', productName: '品牌贴纸', skuCode: 'ZB-002', spec: '100张/卷', unit: '卷', quantity: 10, costPrice: 8, salePrice: 18 },
    ],
    totalSalePrice: 180, totalCostPrice: 80, estimatedLogisticsCost: 10,
    estimatedProfit: 90, isApplication: false,
    createdAt: '2026-02-25 14:00:00',
    timeline: [
      { time: '2026-02-25 14:00:00', title: '创建订单', operator: '王五' },
      { time: '2026-02-25 14:10:00', title: '支付成功' },
      { time: '2026-02-25 16:00:00', title: '申请取消', description: '门店取消订单', operator: '王五' },
      { time: '2026-02-25 16:30:00', title: '已退款', description: '微信原路退款' },
    ],
  },
];

// ============ Purchase Orders ============
export interface PurchaseOrder {
  id: string;
  poNo: string;
  supplierId: string;
  supplierName: string;
  status: PurchaseOrderStatus;
  sourceOrderNos: string[];
  items: { productName: string; skuCode: string; quantity: number; unit: string; costPrice: number }[];
  totalAmount: number;
  eta: string;
  receiptNo?: string;
  abnormalReason?: string;
  createdAt: string;
  timeline: { time: string; title: string; description?: string }[];
}

export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 'po1', poNo: 'PO20260225001', supplierId: 'sup5', supplierName: '蒙源乳业',
    status: PurchaseOrderStatus.RECEIPTED,
    sourceOrderNos: ['ORD20260224001'],
    items: [
      { productName: '椰浆', skuCode: 'FM-003', quantity: 10, unit: '盒', costPrice: 12 },
    ],
    totalAmount: 120, eta: '2026-02-27', receiptNo: 'REC-001',
    createdAt: '2026-02-24 12:00:00',
    timeline: [
      { time: '2026-02-24 12:00:00', title: '采购单创建' },
      { time: '2026-02-24 13:00:00', title: '已导出' },
      { time: '2026-02-24 13:30:00', title: '已发送供应商' },
      { time: '2026-02-26 10:00:00', title: '收到回执', description: 'REC-001' },
    ],
  },
  {
    id: 'po2', poNo: 'PO20260225002', supplierId: 'sup1', supplierName: '绿源农业',
    status: PurchaseOrderStatus.SENT,
    sourceOrderNos: ['ORD20260225002'],
    items: [
      { productName: '一次性杯子', skuCode: 'PM-001', quantity: 2, unit: '箱', costPrice: 120 },
      { productName: '吸管', skuCode: 'PM-002', quantity: 1, unit: '箱', costPrice: 45 },
    ],
    totalAmount: 285, eta: '2026-02-28',
    createdAt: '2026-02-25 14:00:00',
    timeline: [
      { time: '2026-02-25 14:00:00', title: '采购单创建' },
      { time: '2026-02-25 15:00:00', title: '已导出' },
      { time: '2026-02-25 16:00:00', title: '已发送供应商' },
    ],
  },
  {
    id: 'po3', poNo: 'PO20260225003', supplierId: 'sup1', supplierName: '绿源农业',
    status: PurchaseOrderStatus.ABNORMAL,
    sourceOrderNos: ['ORD20260225001'],
    items: [
      { productName: '封口机', skuCode: 'MC-001', quantity: 2, unit: '台', costPrice: 680 },
    ],
    totalAmount: 1360, eta: '2026-02-28',
    abnormalReason: '供应商库存不足，仅能供应1台',
    createdAt: '2026-02-25 14:30:00',
    timeline: [
      { time: '2026-02-25 14:30:00', title: '采购单创建' },
      { time: '2026-02-25 15:00:00', title: '已发送供应商' },
      { time: '2026-02-26 09:00:00', title: '采购异常', description: '供应商库存不足' },
    ],
  },
  {
    id: 'po4', poNo: 'PO20260225004', supplierId: 'sup4', supplierName: '北方粮仓',
    status: PurchaseOrderStatus.RECEIPTED,
    sourceOrderNos: ['ORD20260224001'],
    items: [
      { productName: '围裙', skuCode: 'ZB-001', quantity: 5, unit: '件', costPrice: 15 },
    ],
    totalAmount: 75, eta: '2026-02-27', receiptNo: 'REC-002',
    createdAt: '2026-02-24 12:30:00',
    timeline: [
      { time: '2026-02-24 12:30:00', title: '采购单创建' },
      { time: '2026-02-24 14:00:00', title: '已发送供应商' },
      { time: '2026-02-26 11:00:00', title: '收到回执', description: 'REC-002' },
    ],
  },
];

// ============ Inventory Records ============
export interface InventoryRecord {
  id: string;
  type: 'in' | 'out';
  docNo: string;
  productName: string;
  skuCode: string;
  quantity: number;
  unit: string;
  operator: string;
  relatedOrderNo?: string;
  createdAt: string;
  remark?: string;
}

export const mockInventoryRecords: InventoryRecord[] = [
  { id: 'inv1', type: 'in', docNo: 'IN20260226001', productName: '椰浆', skuCode: 'FM-003', quantity: 30, unit: '盒', operator: '仓库李', createdAt: '2026-02-26 10:00:00', remark: '采购入库' },
  { id: 'inv2', type: 'in', docNo: 'IN20260226002', productName: '围裙', skuCode: 'ZB-001', quantity: 20, unit: '件', operator: '仓库李', createdAt: '2026-02-26 11:00:00', remark: '采购入库' },
  { id: 'inv3', type: 'out', docNo: 'OUT20260228001', productName: '椰浆', skuCode: 'FM-003', quantity: 10, unit: '盒', operator: '仓库李', relatedOrderNo: 'ORD20260224001', createdAt: '2026-02-28 14:00:00', remark: '订单出库' },
  { id: 'inv4', type: 'out', docNo: 'OUT20260228002', productName: '围裙', skuCode: 'ZB-001', quantity: 5, unit: '件', operator: '仓库李', relatedOrderNo: 'ORD20260224001', createdAt: '2026-02-28 14:30:00', remark: '订单出库' },
  { id: 'inv5', type: 'in', docNo: 'IN20260227001', productName: '封口机', skuCode: 'MC-001', quantity: 5, unit: '台', operator: '仓库李', createdAt: '2026-02-27 09:00:00', remark: '采购入库' },
  { id: 'inv6', type: 'in', docNo: 'IN20260227002', productName: '白砂糖', skuCode: 'FM-002', quantity: 50, unit: '袋', operator: '仓库张', createdAt: '2026-02-27 10:00:00', remark: '采购入库' },
];

// ============ Fulfillment Tasks ============
export interface FulfillmentTask {
  id: string;
  taskNo: string;
  orderNo: string;
  storeName: string;
  status: FulfillmentStatus;
  items: { productName: string; quantity: number; unit: string; picked?: boolean }[];
  operator?: string;
  createdAt: string;
  pickedAt?: string;
  shippedAt?: string;
  receivedAt?: string;
  abnormalReason?: string;
}

export const mockFulfillmentTasks: FulfillmentTask[] = [
  {
    id: 'ft1', taskNo: 'FT20260228001', orderNo: 'ORD20260224001', storeName: '宿迁总店',
    status: FulfillmentStatus.RECEIVED,
    items: [
      { productName: '椰浆', quantity: 10, unit: '盒', picked: true },
      { productName: '围裙', quantity: 5, unit: '件', picked: true },
    ],
    operator: '仓库李', createdAt: '2026-02-28 13:00:00',
    pickedAt: '2026-02-28 14:00:00', shippedAt: '2026-02-28 16:00:00', receivedAt: '2026-03-01 10:00:00',
  },
  {
    id: 'ft2', taskNo: 'FT20260301001', orderNo: 'ORD20260225002', storeName: '宿迁1号店',
    status: FulfillmentStatus.PICKING,
    items: [
      { productName: '白砂糖', quantity: 3, unit: '袋', picked: true },
      { productName: '一次性杯子', quantity: 2, unit: '箱', picked: false },
      { productName: '吸管', quantity: 1, unit: '箱', picked: false },
    ],
    operator: '仓库张', createdAt: '2026-03-01 08:00:00',
  },
  {
    id: 'ft3', taskNo: 'FT20260301002', orderNo: 'ORD20260225001', storeName: '宿迁总店',
    status: FulfillmentStatus.ABNORMAL,
    items: [
      { productName: '封口机', quantity: 2, unit: '台', picked: true },
      { productName: '红茶茶叶', quantity: 5, unit: '袋', picked: true },
    ],
    operator: '仓库李', createdAt: '2026-03-01 09:00:00',
    abnormalReason: '封口机实际到货仅1台，与采购单不符',
  },
];

// ============ Finance Records ============
export interface PaymentRecord {
  id: string;
  orderNo: string;
  storeName: string;
  amount: number;
  method: 'wechat';
  transactionNo: string;
  status: 'success' | 'refunded';
  paidAt: string;
}

export const mockPaymentRecords: PaymentRecord[] = [
  { id: 'pay1', orderNo: 'ORD20260224001', storeName: '宿迁总店', amount: 395, method: 'wechat', transactionNo: 'WX20260224001', status: 'success', paidAt: '2026-02-24 08:15:00' },
  { id: 'pay2', orderNo: 'ORD20260225002', storeName: '宿迁1号店', amount: 762, method: 'wechat', transactionNo: 'WX20260225001', status: 'success', paidAt: '2026-02-25 10:30:00' },
  { id: 'pay3', orderNo: 'ORD20260225003', storeName: '徐州1号店', amount: 180, method: 'wechat', transactionNo: 'WX20260225002', status: 'refunded', paidAt: '2026-02-25 14:10:00' },
];

export interface RefundRecord {
  id: string;
  orderNo: string;
  storeName: string;
  amount: number;
  reason: string;
  status: 'processing' | 'completed';
  createdAt: string;
  completedAt?: string;
}

export const mockRefunds: RefundRecord[] = [
  { id: 'ref1', orderNo: 'ORD20260225003', storeName: '徐州1号店', amount: 180, reason: '门店取消订单', status: 'completed', createdAt: '2026-02-25 16:00:00', completedAt: '2026-02-25 16:30:00' },
];

// ============ Notification ============
export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'order' | 'procurement' | 'fulfillment' | 'system';
  channel: 'wechat' | 'sms' | 'email';
  content: string;
  enabled: boolean;
}

export const mockNotificationTemplates: NotificationTemplate[] = [
  { id: 'nt1', name: '订单创建通知', type: 'order', channel: 'wechat', content: '您的订单 {orderNo} 已创建，请及时支付。', enabled: true },
  { id: 'nt2', name: '支付成功通知', type: 'order', channel: 'wechat', content: '订单 {orderNo} 支付成功，金额 ¥{amount}。', enabled: true },
  { id: 'nt3', name: '发货通知', type: 'fulfillment', channel: 'wechat', content: '您的订单 {orderNo} 已发货，请注意查收。', enabled: true },
  { id: 'nt4', name: '采购异常通知', type: 'procurement', channel: 'sms', content: '采购单 {poNo} 出现异常：{reason}，请及时处理。', enabled: true },
  { id: 'nt5', name: '库存预警通知', type: 'system', channel: 'email', content: '商品 {productName} 库存低于安全线，当前库存 {stock}。', enabled: false },
];

export interface NotificationLog {
  id: string;
  templateName: string;
  target: string;
  channel: 'wechat' | 'sms' | 'email';
  status: 'sent' | 'failed';
  content: string;
  sentAt: string;
}

export const mockNotificationLogs: NotificationLog[] = [
  { id: 'nl1', templateName: '订单创建通知', target: '宿迁总店-张三', channel: 'wechat', status: 'sent', content: '您的订单 ORD20260225001 已创建，请及时支付。', sentAt: '2026-02-25 09:30:05' },
  { id: 'nl2', templateName: '支付成功通知', target: '宿迁1号店-李四', channel: 'wechat', status: 'sent', content: '订单 ORD20260225002 支付成功，金额 ¥762.00。', sentAt: '2026-02-25 10:30:10' },
  { id: 'nl3', templateName: '采购异常通知', target: '管理员', channel: 'sms', status: 'sent', content: '采购单 PO20260225003 出现异常：供应商库存不足。', sentAt: '2026-02-26 09:01:00' },
  { id: 'nl4', templateName: '发货通知', target: '宿迁总店-张三', channel: 'wechat', status: 'sent', content: '您的订单 ORD20260224001 已发货，请注意查收。', sentAt: '2026-02-28 16:00:05' },
  { id: 'nl5', templateName: '库存预警通知', target: '管理员', channel: 'email', status: 'failed', content: '商品 果糖机 库存低于安全线，当前库存 10。', sentAt: '2026-02-28 08:00:00' },
];

// ============ System Users & Roles ============
export interface SystemUser {
  id: string;
  username: string;
  realName: string;
  role: string;
  phone: string;
  status: 'active' | 'disabled';
  lastLogin: string;
}

export const mockSystemUsers: SystemUser[] = [
  { id: 'u1', username: 'admin', realName: '超级管理员', role: '超级管理员', phone: '13800000001', status: 'active', lastLogin: '2026-03-03 08:30:00' },
  { id: 'u2', username: 'warehouse', realName: '仓库李', role: '仓库管理员', phone: '13800000002', status: 'active', lastLogin: '2026-03-03 07:45:00' },
  { id: 'u3', username: 'finance', realName: '财务王', role: '财务专员', phone: '13800000003', status: 'active', lastLogin: '2026-03-02 17:30:00' },
  { id: 'u4', username: 'procurement', realName: '采购陈', role: '采购专员', phone: '13800000004', status: 'disabled', lastLogin: '2026-02-28 09:00:00' },
];

export interface SystemRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

export const mockSystemRoles: SystemRole[] = [
  { id: 'r1', name: '超级管理员', description: '拥有所有权限', permissions: ['all'], userCount: 1 },
  { id: 'r2', name: '仓库管理员', description: '库存管理、出入库操作、拣货发货', permissions: ['inventory', 'fulfillment'], userCount: 1 },
  { id: 'r3', name: '财务专员', description: '财务报表、收款对账、退款管理', permissions: ['finance'], userCount: 1 },
  { id: 'r4', name: '采购专员', description: '采购单管理、供应商管理', permissions: ['procurement', 'supplier'], userCount: 1 },
];

// ============ Audit Logs ============
export interface AuditLog {
  id: string;
  operator: string;
  action: string;
  target: string;
  detail: string;
  ip: string;
  createdAt: string;
}

export const mockAuditLogs: AuditLog[] = [
  { id: 'al1', operator: '超级管理员', action: '审核通过', target: '申请订货 APP20260226002', detail: '审核通过宿迁1号店的申请订货', ip: '192.168.1.100', createdAt: '2026-02-27 09:00:00' },
  { id: 'al2', operator: '仓库李', action: '入库操作', target: '入库单 IN20260226001', detail: '椰浆入库30盒', ip: '192.168.1.101', createdAt: '2026-02-26 10:00:00' },
  { id: 'al3', operator: '超级管理员', action: '录入物流成本', target: '订单 ORD20260225002', detail: '录入预估物流成本¥25.00', ip: '192.168.1.100', createdAt: '2026-02-25 11:00:00' },
  { id: 'al4', operator: '仓库李', action: '拣货完成', target: '出库任务 FT20260228001', detail: '宿迁总店订单拣货完成', ip: '192.168.1.101', createdAt: '2026-02-28 14:00:00' },
  { id: 'al5', operator: '财务王', action: '退款处理', target: '订单 ORD20260225003', detail: '徐州1号店订单退款¥180.00', ip: '192.168.1.102', createdAt: '2026-02-25 16:30:00' },
];

// ============ Dashboard Stats ============
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

// ============ Finance Report Data ============
export const mockProfitByProduct = [
  { productName: '制冰机', revenue: 8940, cost: 4500, profit: 4440, margin: 49.7 },
  { productName: '封口机', revenue: 5120, cost: 2720, profit: 2400, margin: 46.9 },
  { productName: '果糖机', revenue: 3360, cost: 1700, profit: 1660, margin: 49.4 },
  { productName: '红茶茶叶', revenue: 2720, cost: 1400, profit: 1320, margin: 48.5 },
  { productName: '白砂糖', revenue: 1920, cost: 1275, profit: 645, margin: 33.6 },
  { productName: '一次性杯子', revenue: 1980, cost: 1200, profit: 780, margin: 39.4 },
  { productName: '椰浆', revenue: 1100, cost: 600, profit: 500, margin: 45.5 },
  { productName: '围裙', revenue: 700, cost: 300, profit: 400, margin: 57.1 },
];

export const mockProfitByStore = [
  { storeName: '宿迁总店', orderCount: 5, revenue: 8700, cost: 4500, logistics: 68, profit: 4132, margin: 47.5 },
  { storeName: '宿迁1号店', orderCount: 4, revenue: 7620, cost: 4200, logistics: 50, profit: 3370, margin: 44.2 },
  { storeName: '宿迁2号店', orderCount: 3, revenue: 5960, cost: 3100, logistics: 30, profit: 2830, margin: 47.5 },
  { storeName: '徐州1号店', orderCount: 2, revenue: 4200, cost: 2100, logistics: 40, profit: 2060, margin: 49.0 },
  { storeName: '徐州2号店', orderCount: 1, revenue: 1980, cost: 1050, logistics: 20, profit: 910, margin: 46.0 },
];

// ============ Helpers ============
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
