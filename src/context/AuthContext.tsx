import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  orders: Order[];
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: { productId: string; name: string; image: string; price: number; quantity: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered";
  address: string;
  paymentMethod: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<UserProfile, "name" | "email" | "phone">>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  addPaymentMethod: (pm: Omit<PaymentMethod, "id">) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  addOrder: (order: Omit<Order, "id" | "date">) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "shopsmart_user";
const ACCOUNTS_KEY = "shopsmart_accounts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      // Also update in accounts store
      const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
      accounts[user.email] = { ...accounts[user.email], profile: user };
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
    const account = accounts[email];
    if (account && account.password === password) {
      setUser(account.profile);
      return true;
    }
    return false;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
    if (accounts[email]) return false; // already exists

    const profile: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      phone: phone || "",
      createdAt: new Date().toISOString(),
      addresses: [],
      paymentMethods: [],
      orders: [
        // Demo order
        {
          id: `ORD-${Date.now().toString(36).toUpperCase()}`,
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          items: [{ productId: "1", name: "ProSound Wireless Headphones", image: "", price: 149.99, quantity: 1 }],
          total: 162.19,
          status: "shipped",
          address: "123 Main St, New York, NY 10001",
          paymentMethod: "Card ending in 4242",
        },
      ],
    };

    accounts[email] = { password, profile };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    setUser(profile);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<Pick<UserProfile, "name" | "email" | "phone">>) => {
    setUser((prev) => prev ? { ...prev, ...updates } : null);
  }, []);

  const addAddress = useCallback((address: Omit<Address, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newAddr = { ...address, id: crypto.randomUUID() };
      const addresses = address.isDefault
        ? prev.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddr)
        : [...prev.addresses, newAddr];
      return { ...prev, addresses };
    });
  }, []);

  const updateAddress = useCallback((id: string, updates: Partial<Address>) => {
    setUser((prev) => {
      if (!prev) return null;
      let addresses = prev.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a));
      if (updates.isDefault) {
        addresses = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
      }
      return { ...prev, addresses };
    });
  }, []);

  const removeAddress = useCallback((id: string) => {
    setUser((prev) => prev ? { ...prev, addresses: prev.addresses.filter((a) => a.id !== id) } : null);
  }, []);

  const addPaymentMethod = useCallback((pm: Omit<PaymentMethod, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newPm = { ...pm, id: crypto.randomUUID() };
      const methods = pm.isDefault
        ? prev.paymentMethods.map((p) => ({ ...p, isDefault: false })).concat(newPm)
        : [...prev.paymentMethods, newPm];
      return { ...prev, paymentMethods: methods };
    });
  }, []);

  const removePaymentMethod = useCallback((id: string) => {
    setUser((prev) => prev ? { ...prev, paymentMethods: prev.paymentMethods.filter((p) => p.id !== id) } : null);
  }, []);

  const setDefaultPaymentMethod = useCallback((id: string) => {
    setUser((prev) => prev ? { ...prev, paymentMethods: prev.paymentMethods.map((p) => ({ ...p, isDefault: p.id === id })) } : null);
  }, []);

  const addOrder = useCallback((order: Omit<Order, "id" | "date">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newOrder: Order = { ...order, id: `ORD-${Date.now().toString(36).toUpperCase()}`, date: new Date().toISOString() };
      return { ...prev, orders: [newOrder, ...prev.orders] };
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, login, signup, logout, updateProfile,
      addAddress, updateAddress, removeAddress, addPaymentMethod, removePaymentMethod,
      setDefaultPaymentMethod, addOrder,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
