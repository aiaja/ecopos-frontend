export interface Transaction {
  id: string;
  cashier_id: string;
  outlet_id: string;
  date: string;
  note: string | null;
  voucher_id: string | null;
  discount_price: string;
  code: string;
  payed_money: string;
  money_changes: string;
  total_price: string;
  total_cost: string;
  payment_method_id: string;
  tax: string;
  tax_price: string;
  total_qty: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  outlet_id: string;
  category_id: string;
  name: string;
  stock: number;
  is_non_stock: boolean;
  initial_price: string;
  selling_price: string;
  unit: string;
  hero_images: string | null;
  created_at: string;
  updated_at: string;
}

export interface TransactionHistory {
  id: string;
  code: string;
  transaction_id: string;
  product_id: string;
  price: string;
  cost: string;
  qty: string;
  created_at: string;
  updated_at: string;
  transaction: Transaction;
  product: Product;
}
