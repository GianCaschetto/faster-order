import { useRef, useState } from "react";
import { Product, ShoppingCart, ShoppingCartItem } from "@/types/types";
import { categories, products } from "@/mock/data";
import MenuNav from "@/components/sections/MenuNav";
import MenuSection from "@/components/sections/MenuSection";
import BackToTop from "@/components/BackToTop";
import CartBadge from "@/components/cart/CartBadge";
import Sidebar from "@/components/cart/CartSidebar";


function MenuPage() {
    const [cart, setCart] = useState<ShoppingCart>(() => {
        const cartLocalStorage = window.localStorage.getItem("cart");
        return cartLocalStorage ? JSON.parse(cartLocalStorage) : {};
      });
      const [counter, setCounter] = useState(1);
      const [showSideBar, setShowSideBar] = useState(false);
      const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const inputRef = useRef<any>(null);
    
      const addToCart = (product: Product) => {
        const item: ShoppingCartItem = {
          id: crypto.randomUUID(),
          product,
          quantity: counter,
        };
        if (!cart.items) {
          const newCart: ShoppingCart = {
            items: [item],
            totalItems: 1,
            totalPrice: product.price * counter,
          };
    
          setCart(newCart);
          window.localStorage.setItem("cart", JSON.stringify(newCart));
          return;
        }
        const newItems = [...cart.items, item];
        const newCart: ShoppingCart = {
          items: newItems,
          totalItems: newItems.length,
          totalPrice: newItems.reduce(
            (acc, item) => acc + item.product.price * item.quantity,
            0
          ),
        };
        setCart(newCart);
        setShowSideBar(true);
        window.localStorage.setItem("cart", JSON.stringify(newCart));
      };
  return (
    <main className="mt-16 ">
        {/* Menu nav */}
        <MenuNav
          inputRef={inputRef}
          setFilteredProducts={setFilteredProducts}
          categories={categories}
          products={products}
        />
        {/* Category Section */}
        <MenuSection
          categories={categories}
          products={products}
          counter={counter}
          addToCart={addToCart}
          setCounter={setCounter}
          filteredProducts={filteredProducts}
          inputRef={inputRef}
        />
        <BackToTop />
        {/* Cart Button badge */}
        <CartBadge
          cart={cart}
          showSideBar={showSideBar}
          setShowSideBar={setShowSideBar}
        />
        {/* Sidebar */}
        <Sidebar
          showSideBar={showSideBar}
          setShowSideBar={setShowSideBar}
          cart={cart}
          setCart={setCart}
        />
      </main>
  )
}

export default MenuPage