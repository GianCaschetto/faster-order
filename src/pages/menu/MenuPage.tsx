import { useEffect, useMemo, useRef, useState } from "react";
import { Extra, Product, ShoppingCart, ShoppingCartItem } from "@/types/types";
import MenuNav from "@/components/sections/MenuNav";
import MenuSection from "@/components/sections/MenuSection";
import BackToTop from "@/components/BackToTop";
import CartBadge from "@/components/cart/CartBadge";
import CartSidebar from "@/components/cart/CartSidebar";
import Footer from "@/components/footer/Footer";
import { toast } from "react-toastify";
import { useAdmin } from "@/contexts/AdminContext";
import { NavLink } from "react-router-dom";

function MenuPage() {
  const { adminData } = useAdmin();
  const products = useMemo(
    () => adminData?.products ?? [],
    [adminData?.products]
  );
  const categories = useMemo(
    () => adminData?.categories ?? [],
    [adminData?.categories]
  );

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

  const [showSideBar, setShowSideBar] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputRef = useRef<any>(null);

  const addToCart = (product: Product, extras: Extra[], counter: number) => {
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
          extras.reduce(
            (acc, extra) => acc + extra.price * (extra.qty ?? 0),
            0
          )) *
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
    const today = new Date();
    const day = today.getDay();
    const hour = today.getHours();
    const minutes = today.getMinutes();

    const currentHour = `${hour}:${minutes}`;
    const currentSchedule = adminData?.schedules?.find(
      (schedule) => schedule.day === day.toString()
    );

    if (currentSchedule?.forced) {
      setIsOpen(true);
    }

    if (currentSchedule) {
      if (
        currentHour >= currentSchedule.open &&
        currentHour <= currentSchedule.close
      ) {
        setIsOpen(true);
      }
    }
  }, [adminData?.schedules]);

  return (
    <div
      className="transition-colors duration-500"
      style={{
        backgroundColor: adminData?.colors?.primary,
        color: adminData?.colors?.secondary,
      }}
    >
      <div
        style={{
          backgroundColor: adminData?.colors?.secondary,
          color: adminData?.colors?.primary,
        }}
        className="w-full p-16 mx-auto text-center"
      >
        <img
          src={adminData?.logo ?? "https://via.placeholder.com/150"}
          alt=""
          className="h-24 object-cover mx-auto"
        />
        <h1
          style={{
            color: adminData?.colors?.primary,
          }}
          className="my-4 text-4xl font-extrabold leading-none tracking-tight  md:text-5xl lg:text-6xl "
        >
          {adminData?.companyName ?? "Tu negocio"}{" "}
        </h1>
        <p>{adminData?.address ?? ""}</p>
      </div>
      <NavLink
        to="/admin-panel"
      >Admin panel</NavLink>
      <div className="min-h-screen md:max-w-6xl max-w-sm  text-center p-4 mx-auto">
        {/* <Header /> */}
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
            addToCart={addToCart}
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
    </div>
  );
}

export default MenuPage;
