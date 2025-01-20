"use client"

import { Button } from "@heroui/button";
import { Badge, Divider, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Image, useDisclosure } from "@heroui/react";
import { ProductType } from "@prisma/client";
import { Bird, Check, ImageOff, ShoppingCart, Trash } from "lucide-react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CartItem {
    id: string,
    type: ProductType,
    image: string,
    title: string,
    quantity: number,
    price: number
}

// Tworzymy kontekst koszyka
const CartContext = createContext<{
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string, type: ProductType) => void;
    getCartItemCount: () => number;
    onOpen: () => void; // Otwórz koszyk
    onOpenChange: () => void; // Zamknij koszyk
} | null>(null);
  
  export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
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
        <CartContext.Provider 
            value={{ 
                cart, 
                addToCart, 
                removeFromCart, 
                getCartItemCount,
                onOpen,
                onOpenChange,
            }}
        >
            {children}
            <CartDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
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
    const { getCartItemCount, onOpen } = useCart();
    const itemCount = getCartItemCount(); // Pobierz liczbę przedmiotów z koszyka

    return (
        <Badge
            size="sm"
            color="primary"
            className="text-white"
            content={itemCount}
        >
            <ShoppingCart
                onClick={()=>{onOpen()}}
                className="cursor-pointer"
            />
        </Badge>
    )
}

export const AddToCartButton = (cartItem: CartItem) => {
    const { addToCart, cart, onOpen } = useCart();
    // Sprawdzamy, czy przedmiot jest już w koszyku
    const isItemInCart = cart.some(
        (item) => item.id === cartItem.id && item.type === cartItem.type
    );

    return (
        <Button
            startContent={isItemInCart ? <Check/> : <ShoppingCart/>}
            color={isItemInCart ? "success" : "primary"}
            onPress={()=>{
                isItemInCart ? onOpen() : addToCart(cartItem)
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

const CartDrawer = ({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: () => void }) => {
    const { cart, removeFromCart } = useCart()
    return (
        <>
            <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                radius="none"
                placement="right"
            >
                <DrawerContent>
                    {(onClose)=>(
                        <>
                            <DrawerHeader>
                                Twój koszyk
                            </DrawerHeader>
                            <Divider/>
                            <DrawerBody>
                                {cart.map((item)=>(
                                    <div key={item.id} className="grid grid-cols-4 gap-4">
                                        <div className="col-span-1">
                                            <Image
                                                radius="none"
                                                fallbackSrc={<ImageOff/>}
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full aspect-square"
                                            />
                                        </div>
                                        <div className="col-span-2 flex flex-col">
                                            <span>{item.title}</span>
                                            <span>{item.price * item.quantity} zł</span>
                                        </div>
                                        <div className="col-span-1 flex justify-end">
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                                onPress={()=>{
                                                    removeFromCart(item.id, item.type)
                                                }}
                                            >
                                                <Trash/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </DrawerBody>
                            <Divider/>
                            <DrawerFooter
                                className="justify-center flex flex-col gap-y-4"
                            >
                                <Button
                                    fullWidth
                                    radius="none"
                                    color="success"
                                    startContent={<ShoppingCart/>}
                                    className="text-white"
                                >
                                    Przejdź do kasy
                                </Button>
                                <Button
                                    variant="light"
                                    size="sm"
                                    onPress={onClose}
                                >
                                    Kontynuuj zakupy
                                </Button>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
                
            </Drawer>
        </>
    )
}
