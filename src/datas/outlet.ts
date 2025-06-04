export interface Outlet {
  id: string;
  outlet_name: string;
  address: string | null;
  phone_number: string | null;
  latitude: string | number | null;
  longitude: string | number | null;
  email: string | null;
  tax: string;
  created_at: string;
  updated_at: string | null;
}

export type UpdateOutletPayload = Pick<
  Outlet, 
  'outlet_name' |
  'address' |
  'phone_number' |
  'tax' |
  'email'
>;

export interface OutletsApiResponse {
  outlets: Outlet[];
  // Mungkin ada metadata lain jika API mengembalikannya
}