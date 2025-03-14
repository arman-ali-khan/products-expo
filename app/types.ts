export interface Product {
  id: string;
  name: string;
  buyPrice: string;
  sellPrice: string;
  quantity: string;
  image: string;
  timestamp: number;
}

export interface PinState {
  isSet: boolean;
  pin: string;
}