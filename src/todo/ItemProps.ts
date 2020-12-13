export interface ItemProps {
  id?: string;
  description: string;
  price: string;
  priceEstimation: string;
  ownerUsername: string;
  version: number;
  status: boolean;
  lat: number;
  lng: number;
  photoPath: string;
}
