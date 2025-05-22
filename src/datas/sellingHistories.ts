export interface SellingHistory {
    code: string; 
    cashier: string;
    member: string;
    customerNumber: string;
    date: string; 
    grandTotalPrice: number;
    totalPrice: number;
    taxPrice: number;
    totalCost: number;
}

export const sellingHistories: SellingHistory[] = [
    {
        code: "SH001",
        cashier: "Alice",
        member: "Gold",
        customerNumber: "CUST1001",
        date: "2024-06-01",
        grandTotalPrice: 150.00,
        totalPrice: 140.00,
        taxPrice: 10.00,
        totalCost: 100.00
    },
    {
        code: "SH002",
        cashier: "Bob",
        member: "Silver",
        customerNumber: "CUST1002",
        date: "2024-06-02",
        grandTotalPrice: 200.00,
        totalPrice: 180.00,
        taxPrice: 20.00,
        totalCost: 130.00
    },
    {
        code: "SH003",
        cashier: "Charlie",
        member: "Bronze",
        customerNumber: "CUST1003",
        date: "2024-06-03",
        grandTotalPrice: 120.00,
        totalPrice: 110.00,
        taxPrice: 10.00,
        totalCost: 80.00
    }
];