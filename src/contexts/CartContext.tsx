// //Cart Context
// import React, { createContext, useContext, useState } from "react";
// import { Product, ShoppingCart, ShoppingCartItem } from "@/types/types";

// type CartContextType = {
//   cart: ShoppingCart;
//   setCart: (cart: ShoppingCart) => void;
//   counter: number;
//   setCounter: (counter: number) => void;
//   addToCart: (product: Product) => void;
//   deleteItem: (item: ShoppingCartItem) => void;
//   showSideBar: boolean;
//   setShowSideBar: (showSideBar: boolean) => void;
// };

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//   const [cart, setCart] = useState<ShoppingCart>(() => {
//     const cartLocalStorage = window.localStorage.getItem("cart");
//     return cartLocalStorage ? JSON.parse(cartLocalStorage) : {};
//   });
//   const [showSideBar, setShowSideBar] = useState(false);
//   const [counter, setCounter] = useState(1);

//   //Delete by item id from cart
//   const deleteItem = (item: ShoppingCartItem) => {
//     const newItems = cart.items.filter((cartItem) => item.id !== cartItem.id);
//     const newCart: ShoppingCart = {
//       items: newItems,
//       totalItems: newItems.length,
//       totalPrice: newItems.reduce(
//         (acc, item) => acc + item.product.price * item.quantity,
//         0
//       ),
//     };
//     setCart(newCart);
//     window.localStorage.setItem("cart", JSON.stringify(newCart));
//   };

//   //Add item to cart
//   const addToCart = (product: Product) => {
//     const item: ShoppingCartItem = {
//       id: crypto.randomUUID(),
//       product,
//       quantity: counter,
//     };
//     if (!cart.items) {
//       const newCart: ShoppingCart = {
//         items: [item],
//         totalItems: 1,
//         totalPrice: product.price * counter,
//       };
//       setCart(newCart);
//       window.localStorage.setItem("cart", JSON.stringify(newCart));
//       return;
//     }
//     const newItems = [...cart.items, item];
//     const newCart = {
//       items: newItems,
//       totalItems: newItems.length,
//       totalPrice: newItems.reduce(
//         (acc, item) => acc + item.product.price * item.quantity,
//         0
//       ),
//     };
//     setCart(newCart);
//     setShowSideBar(true);
//     window.localStorage.setItem("cart", JSON.stringify(newCart));
//   };

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         setCart,
//         counter,
//         setCounter,
//         addToCart,
//         deleteItem,
//         showSideBar,
//         setShowSideBar,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (context === undefined) {
//     throw new Error("useCart must be used within a CartProvider");
//   }
//   return context;
// };

// export default CartProvider;
