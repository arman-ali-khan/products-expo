import * as SecureStore from 'expo-secure-store';

const PRODUCTS_KEY = 'shop_products';
const PIN_KEY = 'shop_pin';

export async function getProducts(): Promise<Product[]> {
  const data = await SecureStore.getItemAsync(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveProducts(products: Product[]): Promise<void> {
  await SecureStore.setItemAsync(PRODUCTS_KEY, JSON.stringify(products));
}

export async function getPinState(): Promise<PinState> {
  const data = await SecureStore.getItemAsync(PIN_KEY);
  return data ? JSON.parse(data) : { isSet: false, pin: '' };
}

export async function savePin(pin: string): Promise<void> {
  await SecureStore.setItemAsync(PIN_KEY, JSON.stringify({ isSet: true, pin }));
}