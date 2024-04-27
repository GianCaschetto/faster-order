import { useEffect, useMemo, useRef, useState } from "react";
import { Extra, Product, ShoppingCart, ShoppingCartItem } from "@/types/types";
import {  schedules } from "@/mock/data";
import MenuNav from "@/components/sections/MenuNav";
import MenuSection from "@/components/sections/MenuSection";
import BackToTop from "@/components/BackToTop";
import CartBadge from "@/components/cart/CartBadge";
import CartSidebar from "@/components/cart/CartSidebar";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { toast } from "react-toastify";
import { useAdmin } from "@/contexts/AdminContext";

function MenuPage() {
  const {adminData} = useAdmin();
  const products = useMemo(() => adminData?.products ?? [], [adminData]);
  const categories = useMemo(() => adminData?.categories ?? [], [adminData]);

  const [cart, setCart] = useState<ShoppingCart>(() => {
    const cartLocalStorage = window.localStorage.getItem("cart");
    return cartLocalStorage
      ? JSON.parse(cartLocalStorage)
      : {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        };
  });
  const [isOpen, setIsOpen] = useState(false);
  //TODO: Hacer que no se buguee el contador
  const [counter, setCounter] = useState(1);
  const [showSideBar, setShowSideBar] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<any>(null);

  const addToCart = (product: Product, extras: Extra[]) => {
    if (!isOpen) {
      toast.error("Lo sentimos, estamos cerrados en este momento");
      return;
    }
    const item: ShoppingCartItem = {
      id: crypto.randomUUID(),
      product,
      quantity: counter,
      extras,
      price:
        (product.price +
          extras.reduce((acc, extra) => acc + extra.price * extra.qty, 0)) *
        counter,
    };
    if (cart.items.length === 0) {
      const newCart: ShoppingCart = {
        items: [item],
        totalItems: 1,
        totalPrice: item.price,
      };
      setCart(newCart);
      setShowSideBar(true);
      window.localStorage.setItem("cart", JSON.stringify(newCart));
      return;
    }
    const newItems = [...cart.items, item];
    const newCart = {
      items: newItems,
      totalItems: newItems.length,
      totalPrice: newItems.reduce((acc, item) => acc + item.price, 0),
    };
    setCart(newCart);
    setShowSideBar(true);
    window.localStorage.setItem("cart", JSON.stringify(newCart));
  };

  useEffect(() => {
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();
    //const minutes = date.getMinutes();

    const today = schedules.find((schedule) => schedule.day === day);

    if (today) {
      if (hour >= today.open && hour < today.close) {
        setIsOpen(true);
      }
    }
  }, []);

  return (
    <div className="min-h-screen md:max-w-5xl max-w-sm  text-center p-4 mx-auto">
      <Header />
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
        <CartSidebar
          showSideBar={showSideBar}
          setShowSideBar={setShowSideBar}
          cart={cart}
          setCart={setCart}
        />
      </main>
      <Footer />
    </div>
  );
}

export default MenuPage;
