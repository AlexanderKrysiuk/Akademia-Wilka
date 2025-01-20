"use client"

import { Button } from "@heroui/button";
import { Badge } from "@heroui/react";
import { ProductType } from "@prisma/client";
import { Bird, Check, ShoppingCart } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CartItem {
    id: string,
    type: ProductType,
    quantity: number,
}

// Tworzymy kontekst koszyka
const CartContext = createContext<{
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, type: string) => void;
    getCartItemCount: () => number;
  } | null>(null);
  
  export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
  
    // Załaduj koszyk z localStorage po załadowaniu komponentu
    useEffect(() => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
      setCart(savedCart);
    }, []);
  
    const addToCart = (item: CartItem) => {
        const newCart = [...cart];
        const existingItem = newCart.find(
            (cartItem) => cartItem.id === item.id && cartItem.type === item.type
        );
  
        if (existingItem) {
            // Jeśli przedmiot istnieje, wyświetlamy komunikat lub ignorujemy dodanie
            toast.error("Ten kurs już jest w koszyku!");
            return; // Nic nie robimy, jeśli kurs już jest w koszyku
        } else {
            toast.success("Dodano produkt do koszyka!")
            // Jeśli przedmiot nie istnieje, dodajemy go do koszyka
            newCart.push(item);
        }

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
    };
  
    const removeFromCart = (id: string, type: string) => {
      const newCart = cart.filter(
        (cartItem) => cartItem.id !== id || cartItem.type !== type
      );
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    };
  
    const getCartItemCount = (): number => {
      return cart.reduce((total, item) => total + item.quantity, 0);
    };
  
    return (
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, getCartItemCount }}>
        {children}
      </CartContext.Provider>
    );
  };
  
// Custom hook, który umożliwia dostęp do koszyka
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export const CartButton = () => {
    const { getCartItemCount } = useCart();
    const itemCount = getCartItemCount(); // Pobierz liczbę przedmiotów z koszyka

    return (
        <Badge
            size="sm"
            color="primary"
            className="text-white"
            content={itemCount}
        >
            <ShoppingCart/>
        </Badge>
    )
}

export const AddToCartButton = (cartItem: CartItem) => {
    const { addToCart, cart } = useCart();
    // Sprawdzamy, czy przedmiot jest już w koszyku
    const isItemInCart = cart.some(
        (item) => item.id === cartItem.id && item.type === cartItem.type
    );

    return (
        <Button
            startContent={isItemInCart ? <Check/> : <ShoppingCart/>}
            color={isItemInCart ? "success" : "primary"}
            onPress={()=>{
                isItemInCart ? addToCart(cartItem) :
                ()=>{}
            }}    
            className="text-white"
            //onPress={() => {
            //    addToCart(cartItem);
            //}}        
        >
            {isItemInCart ? "Zobacz koszyk" : "Dodaj do koszyka"}
        </Button>
    )
}

