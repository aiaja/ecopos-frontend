export interface Product {
  id: number;
  category: string;
  name: string;
  sku: string;
  stock: number;
  unit: number;
  initialPrice: number;
  sellingPrice: number;
  netProfit: number;
  type: string;
  nonStock: string;
}

const products: Product[] = [
  {
    id: 123,
    category: "Minuman",
    name: "Es Kopi Susu",
    sku: "MN-001",
    stock: 30,
    unit: 1,
    initialPrice: 8000,
    sellingPrice: 15000,
    netProfit: 7000,
    type: "Stock",
    nonStock: "No",
  },
  {
    id: 234,
    category: "Makanan",
    name: "Roti Bakar Coklat Keju",
    sku: "MK-001",
    stock: 20,
    unit: 1,
    initialPrice: 10000,
    sellingPrice: 18000,
    netProfit: 8000,
    type: "Stock",
    nonStock: "No",
  },
  {
    id: 345,
    category: "Minuman",
    name: "Matcha Latte Panas",
    sku: "MN-002",
    stock: 25,
    unit: 1,
    initialPrice: 9000,
    sellingPrice: 17000,
    netProfit: 8000,
    type: "Stock",
    nonStock: "No",
  },
];

export default products; 
