import { useAdmin } from "@/contexts/AdminContext";
import { ShoppingCart } from "@/types/types";
import { ShoppingBag } from "lucide-react";

type CartBadgeProps = {
  cart: ShoppingCart;
  showSideBar: boolean;
  setShowSideBar: (showSideBar: boolean) => void;
};

function CartBadge({ cart, showSideBar, setShowSideBar }: CartBadgeProps) {
  const { adminData } = useAdmin();
  return (
    <div className="fixed bottom-4 right-4">
      <button
        style={{
          backgroundColor: adminData?.colors?.secondary,
          color: adminData?.colors?.primary,
        }}
        onClick={() => setShowSideBar(!showSideBar)}
        type="button"
        className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white  rounded-lg  focus:ring-4 focus:outline-none transition-colors duration-300"
      >
        <ShoppingBag size={48} strokeWidth={2} color={`${adminData?.colors?.primary}`} />
        <span className="sr-only">Carrito</span>
        <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
          {cart.totalItems ?? 0}
        </div>
      </button>
    </div>
  );
}

export default CartBadge;
