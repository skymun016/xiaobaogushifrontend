import { OrderStatus, PaymentStatus, AuditStatus, FulfillmentStatus, ProcurementAggStatus } from './enums';

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

export interface Order {
  id: string;
  orderNo: string;
  storeId: string;
  storeName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  auditStatus?: AuditStatus;
  fulfillmentStatus: FulfillmentStatus;
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
