export interface Voucher {
  id: string;
  name: string;
  code: string;
  startDate: string; // ISO format recommended, but can be display string
  expired: string;   // ISO format recommended, but can be display string
}

export const vouchers: Voucher[] = [
    {
        id: "1",
        name: "Pilmo Discount",
        code: "PILMO10",
        startDate: "2025-05-01",
        expired: "2025-05-31",
    },
    {
        id: "2",
        name: "Summer Sale",
        code: "SUMMER25",
        startDate: "2025-06-01",
        expired: "2025-06-30",
    },
    {
        id: "3",
        name: "New User Bonus",
        code: "WELCOME5",
        startDate: "2025-04-15",
        expired: "2025-05-15",
    },
    {
        id: "4",
        name: "Holiday Special",
        code: "HOLIDAY20",
        startDate: "2025-12-01",
        expired: "2025-12-31",
    },
];