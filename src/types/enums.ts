// 订单主状态
export enum OrderStatus {
  PENDING = 'order_pending',
  PROCESSING = 'order_processing',
  COMPLETED = 'order_completed',
  CANCELLED = 'order_cancelled',
}

// 支付状态
export enum PaymentStatus {
  UNPAID = 'pay_unpaid',
  PAYING = 'pay_paying',
  PAID = 'pay_paid',
  FAILED = 'pay_failed',
  REFUNDING = 'pay_refunding',
  REFUNDED = 'pay_refunded',
}

// 审核状态
export enum AuditStatus {
  PENDING = 'audit_pending',
  APPROVED = 'audit_approved',
  REJECTED = 'audit_rejected',
}

// 发货状态（供应商发货 → 用户收货）
export enum ShippingStatus {
  NOT_SHIPPED = 'ship_not_shipped',
  SHIPPED = 'ship_shipped',
  RECEIVED = 'ship_received',
}

// 采购聚合状态
export enum ProcurementAggStatus {
  TO_SPLIT = 'proc_to_split',
  PROCURING = 'proc_procuring',
  READY = 'proc_ready',
  ABNORMAL = 'proc_abnormal',
  CLOSED = 'proc_closed',
}

// 采购单状态
export enum PurchaseOrderStatus {
  CREATED = 'po_created',
  EXPORTED = 'po_exported',
  PRINTED = 'po_printed',
  SENT = 'po_sent',
  RECEIPTED = 'po_receipted',
  ABNORMAL = 'po_abnormal',
  CANCELLED = 'po_cancelled',
}

// 状态标签配置
export const STATUS_CONFIG: Record<string, { label: string; color: 'pending' | 'processing' | 'success' | 'error' | 'cancelled' }> = {
  [OrderStatus.PENDING]: { label: '待处理', color: 'pending' },
  [OrderStatus.PROCESSING]: { label: '处理中', color: 'processing' },
  [OrderStatus.COMPLETED]: { label: '已完成', color: 'success' },
  [OrderStatus.CANCELLED]: { label: '已取消', color: 'cancelled' },
  [PaymentStatus.UNPAID]: { label: '待支付', color: 'pending' },
  [PaymentStatus.PAYING]: { label: '支付中', color: 'processing' },
  [PaymentStatus.PAID]: { label: '支付成功', color: 'success' },
  [PaymentStatus.FAILED]: { label: '支付失败', color: 'error' },
  [PaymentStatus.REFUNDING]: { label: '退款中', color: 'pending' },
  [PaymentStatus.REFUNDED]: { label: '已退款', color: 'cancelled' },
  [AuditStatus.PENDING]: { label: '待审核', color: 'pending' },
  [AuditStatus.APPROVED]: { label: '已通过', color: 'success' },
  [AuditStatus.REJECTED]: { label: '已驳回', color: 'error' },
  [ShippingStatus.NOT_SHIPPED]: { label: '待发货', color: 'pending' },
  [ShippingStatus.SHIPPED]: { label: '已发货', color: 'processing' },
  [ShippingStatus.RECEIVED]: { label: '已收货', color: 'success' },
  [ProcurementAggStatus.TO_SPLIT]: { label: '待拆分', color: 'pending' },
  [ProcurementAggStatus.PROCURING]: { label: '采购中', color: 'processing' },
  [ProcurementAggStatus.READY]: { label: '可出库', color: 'success' },
  [ProcurementAggStatus.ABNORMAL]: { label: '采购异常', color: 'error' },
  [ProcurementAggStatus.CLOSED]: { label: '已关闭', color: 'cancelled' },
  [PurchaseOrderStatus.CREATED]: { label: '已创建', color: 'processing' },
  [PurchaseOrderStatus.EXPORTED]: { label: '已导出', color: 'processing' },
  [PurchaseOrderStatus.PRINTED]: { label: '已打印', color: 'processing' },
  [PurchaseOrderStatus.SENT]: { label: '已发送', color: 'processing' },
  [PurchaseOrderStatus.RECEIPTED]: { label: '已回执', color: 'success' },
  [PurchaseOrderStatus.ABNORMAL]: { label: '采购异常', color: 'error' },
  [PurchaseOrderStatus.CANCELLED]: { label: '已取消', color: 'cancelled' },
};
