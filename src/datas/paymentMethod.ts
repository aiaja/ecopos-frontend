export interface PaymentMethod {
    id: string;
    name: string;
}

export const paymentMethods: PaymentMethod[] = [
    {
        id: "1",
        name: "Cash",
    },
    {
        id: "2",
        name: "Debit Card",
    },
    {
        id: "3",
        name: "Credit Card",
    },
    {
        id: "4",
        name: "E-Wallet",
    },
];