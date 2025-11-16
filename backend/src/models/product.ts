export interface Product {
  _id?: string;
  title: string;
  retailer: string;
  url: string;
  category?: string;
  active?: boolean;
  desired_price?: number;
  last_price?: number;
  created_at?: string;
}
