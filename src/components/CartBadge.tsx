import { ShoppingCart } from "@/types/types"
import { ShoppingBag } from "lucide-react";

type CartBadgeProps = {
    cart: ShoppingCart;
    showSideBar: boolean;
    setShowSideBar: (showSideBar: boolean) => void;
}

function CartBadge({ cart, showSideBar, setShowSideBar}: CartBadgeProps) {
  return (
    <div className="fixed bottom-4 right-4">
          <button
            onClick={() => setShowSideBar(!showSideBar)}
            type="button"
            className="relative inline-flex items-center p-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <ShoppingBag size={48} strokeWidth={2} />
            <span className="sr-only">Carrito</span>
            <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900">
              {cart.totalItems}
            </div>
          </button>
        </div>
  )
}

export default CartBadge