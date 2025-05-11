
// Define an interface for products
export interface Product {
    id: number;
    name: string;
    image: string; // Added image property after name
    stock: number;
    price: string;
  }
  
  // Define an interface for orders
export interface Order {
    id: number;
    product: string;
    quantity: number;
    price: number;
  }
  
  // Mock product data
const mockProducts: Product[] = [
    { id: 1, name: "pilmo", image: "/next.svg", stock: 999, price: "10.000" },
    { id: 2, name: "kopop", image: "/next.svg", stock: 13, price: "15.000" },
    { id: 3, name: "apaya", image: "/next.svg", stock: 7000, price: "20.000" },
];
  
  // Mock order data
  const mockOrders: Order[] = []; // Replace with actual order data
  
  export { mockProducts, mockOrders };