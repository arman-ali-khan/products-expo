import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const PRODUCTS_KEY = 'shop_products';
const PIN_KEY = 'shop_pin';

// Web fallback implementation using localStorage
const webStore = {
  getItemAsync: async (key: string) => {
    try {
      const value = localStorage.getItem(key);
      return value;
    } catch {
      return null;
    }
  },
  setItemAsync: async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Handle storage errors
    }
  },
};

// Use SecureStore on native platforms, localStorage on web
const store = Platform.OS === 'web' ? webStore : SecureStore;

export async function getProducts(): Promise<Product[]> {
  const data = await store.getItemAsync(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
}

export async function saveProducts(products: Product[]): Promise<void> {
  await store.setItemAsync(PRODUCTS_KEY, JSON.stringify(products));
}

export async function getPinState(): Promise<PinState> {
  const data = await store.getItemAsync(PIN_KEY);
  return data ? JSON.parse(data) : { isSet: false, pin: '' };
}

export async function savePin(pin: string): Promise<void> {
  await store.setItemAsync(PIN_KEY, JSON.stringify({ isSet: true, pin }));
}