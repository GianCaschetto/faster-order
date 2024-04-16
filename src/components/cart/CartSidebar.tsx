import { ShoppingCart, ShoppingCartItem } from "@/types/types";
import CartStepperForm from "./forms/CartStepperForm";
import { useState } from "react";

type SidebarProps = {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
  cart: ShoppingCart;
  setCart: (cart: ShoppingCart) => void;
};

function Sidebar({ showSideBar, setShowSideBar, cart, setCart }: SidebarProps) {
  const [currentStep, setCurrentStep] = useState(0);

  //Delete by item id from cart
  const deleteItem = (item: ShoppingCartItem) => {
    const newItems = cart.items.filter((cartItem) => item.id !== cartItem.id);
    const newCart: ShoppingCart = {
      items: newItems,
      totalItems: newItems.length,
      totalPrice: newItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      ),
    };
    setCart(newCart);
    window.localStorage.setItem("cart", JSON.stringify(newCart));
  };
  return (
    <div>
      <div
        onClick={() => {setShowSideBar(false)
          setCurrentStep(0)
        }}
        className={`${
          !showSideBar && "hidden"
        } bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm`}
      ></div>
      <aside
        className={`${
          showSideBar ? " w-[26rem]" : "w-0"
        } transition-all duration-300 bg-blue-600 min-h-screen fixed top-0 right-0`}
      >
        <div className={`${!showSideBar && "hidden"}`}>
          <CartStepperForm
            cart={cart}
            setCart={setCart}
            deleteItem={deleteItem}
            setShowSidebar={setShowSideBar}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
          />
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
