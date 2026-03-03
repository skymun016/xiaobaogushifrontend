import { OrderStatus, PaymentStatus, AuditStatus, ShippingStatus, ProcurementAggStatus } from './enums';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  skuCode: string;
  spec: string;
  unit: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
}

export interface OrderTimeline {
  time: string;
  title: string;
  description?: string;
  operator?: string;
}

// 商品级物流信息
export interface ItemShippingInfo {
  itemId: string;
  trackingNo?: string;
}

// 订单级物流/发货信息
export interface ShippingInfo {
  driverName?: string;
  driverPhone?: string;
  shippingPhotos?: string[];       // 发货时照片URL
  itemTrackings?: ItemShippingInfo[]; // 按商品填写物流单号
  receivePhotos?: string[];         // 用户收货确认照片
  shippedAt?: string;
  receivedAt?: string;
}

export interface Order {
  id: string;
  orderNo: string;
  storeId: string;
  storeName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  auditStatus?: AuditStatus;
  shippingStatus: ShippingStatus;
  procurementStatus: ProcurementAggStatus;
  items: OrderItem[];
  totalSalePrice: number;
  totalCostPrice: number;
  estimatedLogisticsCost: number;
  actualLogisticsCost?: number;
  estimatedProfit: number;
  settlementProfit?: number;
  isApplication: boolean;
  createdAt: string;
  paidAt?: string;
  timeline: OrderTimeline[];
  remark?: string;
  shippingInfo?: ShippingInfo;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  skuCode: string;
  spec: string;
  unit: string;
  barcode: string;
  costPrice: number;
  salePrice: number;
  isOnSale: boolean;
  defaultSupplierId: string;
  defaultSupplierName: string;
  backupSupplierId?: string;
  backupSupplierName?: string;
  imageUrl: string;
  stock: number;
}

export interface Store {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  pendingApplications: number;
  procurementAbnormal: number;
  lowStockItems: number;
}
