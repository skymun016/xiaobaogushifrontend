import { create } from 'zustand';
import { CartItem, Product } from '@/types/models';

interface AuthState {
  isLoggedIn: boolean;
  role: 'admin' | 'store' | 'manager' | null;
  userName: string;
  storeName: string;
  login: (role: 'admin' | 'store' | 'manager', userName: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  role: null,
  userName: '',
  storeName: '朝阳门店',
  login: (role, userName) => set({ isLoggedIn: true, role, userName }),
  logout: () => set({ isLoggedIn: false, role: null, userName: '' }),
}));

interface CartState {
  items: CartItem[];
  addItem: (product: Product, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, qty = 1) => set((state) => {
    const existing = state.items.find(i => i.product.id === product.id);
    if (existing) {
      return { items: state.items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i) };
    }
    return { items: [...state.items, { product, quantity: qty }] };
  }),
  removeItem: (productId) => set((state) => ({
    items: state.items.filter(i => i.product.id !== productId)
  })),
  updateQty: (productId, qty) => set((state) => ({
    items: qty <= 0 
      ? state.items.filter(i => i.product.id !== productId)
      : state.items.map(i => i.product.id === productId ? { ...i, quantity: qty } : i)
  })),
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.product.salePrice * i.quantity, 0),
}));
