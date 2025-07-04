export interface ReportHeader {
    outlet_name: string;
    address: string;
    start_date: string;
    end_date: string;
    total_transactions: number;
}

export interface SellingReport {
    id: string;
    cashier_id: string;
    outlet_id: string;
    date: string;
    note: string;
    voucher_id: string | null;
    discout_price: string; // Note: keeping the typo from backend
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
    transaction_details: {
        id: string;
        code: string;
        transaction_id: string;
        product: {
            name: string;
        }
        price: string;
        cost: string;
        qty: string;
        created_at: string;
        updated_at: string;
    }[];
    payment_method: {
        id: string;
        outlet_id: string;
        name: string;
        created_at: string;
        updated_at: string | null;
    };
}

export interface ReportFooter {
    total_cost: string;
    total_gross: string;
    total_net: string;
    total_net_price_after_discount_per_item: string;
    total_net_price_after_discount_selling: string;
    total_discount: string;
    total_discount_per_item: string;
    total_gross_profit: string;
    total_net_profit_before_discount_selling: string;
    total_net_profit_after_discount_selling: string;
    total_qty: number;
}

export interface ReportsData {
    header: ReportHeader;
    sellings: SellingReport[];
    footer: ReportFooter;
}

export interface ReportResponse {
    status: string;
    message: string;
    data: ReportsData;
}

export interface ReportRequest {
    start_date: string;
    end_date: string;
}
