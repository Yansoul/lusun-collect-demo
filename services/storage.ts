import { Order, OrderStatus, InvoiceInfo } from '../types';

const STORAGE_KEY = 'lusun_orders_v1';

// Seed initial data if empty
const seedData = (): Order[] => [
  {
    id: 'LS-20240107-001',
    projectName: '芦笋官网设计二期',
    amount: 12000,
    status: OrderStatus.PAID,
    details: '设计咨询费',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    invoiceInfo: {
        type: 'GENERAL',
        companyName: '字节跳动科技有限公司',
        taxId: '91110000123456789X',
        email: 'finance@bytedance.com',
        submittedAt: new Date(Date.now() - 86400000).toISOString(),
        sentAt: new Date(Date.now() - 43200000).toISOString()
    }
  },
  {
    id: 'LS-20240108-002',
    projectName: '核心SaaS后台开发',
    amount: 25000,
    status: OrderStatus.PENDING,
    details: '软件开发费',
    createdAt: new Date().toISOString(),
  }
];

export const getOrders = (): Order[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    const initial = seedData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  return JSON.parse(data);
};

export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...orders]));
};

export const updateOrder = (updatedOrder: Order): void => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === updatedOrder.id);
  if (index !== -1) {
    orders[index] = updatedOrder;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }
};

export const getOrderById = (id: string): Order | undefined => {
  const orders = getOrders();
  return orders.find(o => o.id === id);
};

export const createOrder = (projectName: string, amount: number, details: string): Order => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  const newOrder: Order = {
    id: `LS-${dateStr}-${randomSuffix}`,
    projectName,
    amount,
    details,
    status: OrderStatus.PENDING,
    createdAt: new Date().toISOString()
  };
  saveOrder(newOrder);
  return newOrder;
};

// Simulate Admin Action: Confirm Payment
export const adminMarkAsPaid = (orderId: string): void => {
  const order = getOrderById(orderId);
  if (order && order.status === OrderStatus.PENDING) {
    updateOrder({ ...order, status: OrderStatus.PAID });
  }
};

// Simulate Admin Action: Send Invoice
export const adminSendInvoice = (orderId: string): void => {
  const order = getOrderById(orderId);
  if (order && order.invoiceInfo) {
    updateOrder({ 
        ...order, 
        invoiceInfo: {
            ...order.invoiceInfo,
            sentAt: new Date().toISOString()
        } 
    });
  }
};

// Simulate Invoice Submission by Client
export const submitInvoiceInfo = (orderId: string, info: InvoiceInfo): void => {
  const order = getOrderById(orderId);
  if (order) {
    updateOrder({ ...order, invoiceInfo: info });
  }
};

export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};