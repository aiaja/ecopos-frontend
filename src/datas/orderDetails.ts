export interface customerDetails {
    member: string | null;
    note: string | null;
    voucher: string | null;
};

export interface PaymentDetails {
    subTotal: number;
    tax: number;
    total: number;
    moneyChanges: number;
}

export const customerDetails = {
    member: null,
    note: null,
    voucher: null
}

export const paymentDetails = {
    subTotal: 0,
    tax: 0,
    total: 0,
    moneyChanges: 0
}