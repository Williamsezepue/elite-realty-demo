"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type CartType = Record<string, number>;
type FavoritesType = Set<string>;

type ProviderType = {
  cart: CartType;
  favorites: FavoritesType;
  setCart: Dispatch<SetStateAction<CartType>>;
  setFavorites: Dispatch<SetStateAction<FavoritesType>>;
};

const Website = createContext<ProviderType | null>(null);

export function WebsiteProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartType>({});
  const [favorites, setFavorites] = useState<FavoritesType>(new Set());

  return (
    <Website.Provider
      value={{ cart, favorites, setCart, setFavorites }}
    >
      {children}
    </Website.Provider>
  );
}

export function provider() {
  const context = useContext(Website);
  if (!context) {
    throw new Error("provider must be used within a WebsiteProvider");
  }
  return context;
}