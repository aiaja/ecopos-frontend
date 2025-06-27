export interface TodaySell {
    sale: number;
    date: string;
}

export const todaySells: TodaySell[] = [
    { sale: 1, date: "2025-12-26" },
    { sale: 2, date: "2027-10-11" },
];

export interface TodayIncome {
    income: number;
    date: string;
}

export const todayIncomes: TodayIncome[] = [
    { income: 1, date: "2025-12-26" },
    { income: 2, date: "2027-10-11" },
];

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

export interface BestSellingProduct {
  product: Product;
  qty: number;
}

export const bestSellingProducts: BestSellingProduct[] = [
  {
    product: {
      id: "18141f6b-daa3-4070-857e-6fbdb7c50265",
      outlet_id: "0c55349f-cbaa-4fb7-a6ef-99db97d53005",
      category_id: "4e9b4f87-6e3d-4cd9-a341-d62557030052",
      name: "Roti Bakar",
      stock: 81,
      is_non_stock: false,
      initial_price: "13000",
      selling_price: "15000",
      unit: "porsi",
      hero_images: "products/nyg3s3sLBG6VoKnnI7nT8MDlE3zaMob9mo5shMDi.jpg",
      created_at: "2025-06-06T14:29:18.000000Z",
      updated_at: "2025-06-26T21:34:40.000000Z",
    },
    qty: 14,
  },
  // Add more products as in the response
];