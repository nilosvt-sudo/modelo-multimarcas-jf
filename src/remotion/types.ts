export interface CarShowcaseItem {
  id: number;
  brand: string;
  model: string;
  version: string;
  yearFabrication: number;
  yearModel: number;
  price: string;
  fipePrice?: string | null;
  mileage: number;
  transmission: string;
  fuel: string;
  color: string;
  coverImage: string;
  badge?: string;
  hasInspectionReport?: boolean;
  singleOwner?: boolean;
}

export interface CarShowcaseCompositionProps {
  vehicles: CarShowcaseItem[];
  slideDurationInFrames?: number;
}
