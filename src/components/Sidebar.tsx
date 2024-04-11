import { ShoppingCart, ShoppingCartItem } from "@/types/types";
import { X } from "lucide-react";

type SidebarProps = {
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
  cart: ShoppingCart;
  setCart: (cart: ShoppingCart) => void;
};

function Sidebar({ showSideBar, setShowSideBar, cart, setCart }: SidebarProps) {
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
        onClick={() => setShowSideBar(false)}
        className={`${
          !showSideBar && "hidden"
        } bg-gray-600/50 min-h-screen w-full fixed top-0 left-0 right-0 backdrop-blur-sm`}
      ></div>
      <aside
        className={`${
          showSideBar ? "w-80" : "w-0"
        } transition-all duration-300 bg-blue-600 min-h-screen fixed top-0 right-0`}
      >
        <div className={`pt-3 ${!showSideBar && "hidden"}`}>
          <button className="mb-14" onClick={() => setShowSideBar(false)}>
            <X color="white" />
          </button>
          <ul>
            {cart.items?.map((item) => (
              <li
                key={item.product.id}
                className="flex justify-between items-center mt-4 text-white"
              >
                <span>
                  <img src={item.product.image} alt="" className="w-28" />
                </span>
                <span>{item.product.name}</span>
                <span>{item.quantity}</span>
                <span>{item.product.price * item.quantity}</span>
                {/* Delete button */}
                <button
                  onClick={() => deleteItem(item)}
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  <X />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
