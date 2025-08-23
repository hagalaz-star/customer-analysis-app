interface ItemCount {
  cluster_count: number;
  cluster_percentage: number;
  overall_percentage: number;
}

interface TopItems extends ItemCount {
  items: string;
}

interface TopCategory extends ItemCount {
  category: string;
}
interface TopLocation extends ItemCount {
  location: string;
}

interface TopSeason extends ItemCount {
  season: string;
}

interface TopPayment extends ItemCount {
  payment: string;
}

export interface MyDataType {
  cluster_id: number;
  cluster_name: string;
  num_customers: number;
  avg_age: number;
  avg_purchase_amount: number;
  subscription_rate: number;
  dominant_frequency: string;
  marketing_suggestion: string;

  top_items: TopItems[];
  top_categories: TopCategory[];
  top_location: TopLocation[];
  top_season: TopSeason[];
  top_payment: TopPayment[];

  discount_usage_rate: number;
  review_rating_score: number;
}

interface OverallItemStat {
  item: string;
  overall_count: number;
  overall_percentage: number;
}

export interface OverallDataSummary {
  total_unique_items: number;
  total_unique_payment: number;
  total_unique_locations: number;
  total_unique_categories: number;
  overall_items_purchase_rate: OverallItemStat[];
}

export interface CustomerData {
  cluster_segments: MyDataType[];
  overall_data_summary: OverallDataSummary;
}

export interface CustomerProfile {
  Age: number;
  "Purchase Amount (USD)": number;
  "Subscription Status": boolean;
  "Frequency of Purchases": string;
}
