export enum OrderStatus {
  PENDING = 'PENDING',   // Created, waiting for B-end payment
  PAID = 'PAID',         // B-end paid, money in cloud account (Available for withdrawal)
  FINISHED = 'FINISHED'  // Withdrawn to user bank card
}

export type InvoiceType = 'GENERAL' | 'SPECIAL';

export interface InvoiceInfo {
  type: InvoiceType;
  companyName: string;
  taxId: string;
  email: string;
  // Special Invoice Fields
  address?: string;
  phone?: string;
  bankName?: string;
  bankAccount?: string;
  submittedAt: string;
  sentAt?: string; // If present, invoice implies sent
}

export interface Order {
  id: string;
  projectName: string;
  amount: number;
  status: OrderStatus;
  details: string;
  createdAt: string;
  invoiceInfo?: InvoiceInfo;
}

export const BANK_INFO = {
  accountName: "原则科技 (Principles Tech Ltd.)",
  accountNumber: "6222 0210 0109 2200",
  bankName: "招商银行北京分行科技园支行"
};

export const FEES = {
  RATE: 0.065, // 6.5%
  RATE_DISPLAY: "6.5%"
};