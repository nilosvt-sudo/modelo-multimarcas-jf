export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  version: string;
  yearFabrication: number;
  yearModel: number;
  price: string;
  fipePrice?: string | null;
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  bodyType: string;
  plateEnd?: string | null;
  doors?: number | null;
  coverImage: string;
  gallery: string; // JSON string array
  features: string; // JSON string array
  description: string;
  isFeatured: boolean;
  badge?: string | null;
  hasInspectionReport: boolean;
  singleOwner: boolean;
  ipvaPaid: boolean;
  status: "available" | "reserved" | "sold";
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: number;
  vehicleId?: number | null;
  vehicleName?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  leadType: "general" | "financing" | "proposal" | "direct_contact";
  message?: string | null;
  entryAmount?: string | null;
  installments?: number | null;
  status: "new" | "in_progress" | "contacted" | "completed" | "lost";
  notes?: string | null;
  createdAt: string;
}

export interface TestDrive {
  id: number;
  vehicleId?: number | null;
  vehicleName: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  preferredDate: string;
  preferredTime: string;
  locationPreference: "dealership" | "home_delivery";
  notes?: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface Appraisal {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  tradeBrand: string;
  tradeModel: string;
  tradeYear: number;
  tradeMileage: number;
  tradeTransmission?: string | null;
  tradeFuel?: string | null;
  tradeColor?: string | null;
  tradeCondition?: string | null;
  hasFinancing?: boolean | null;
  interestedVehicleId?: number | null;
  interestedVehicleName?: string | null;
  photos?: string | null;
  notes?: string | null;
  estimatedValue?: string | null;
  status: "pending" | "in_review" | "evaluated" | "closed";
  createdAt: string;
}

export interface Review {
  id: number;
  authorName: string;
  neighborhood?: string | null;
  rating: number;
  comment: string;
  purchasedVehicle?: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface InventoryFilters {
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  bodyType?: string;
  transmission?: string;
  fuel?: string;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "year_desc" | "km_asc" | "recent";
  featuredOnly?: boolean;
}
