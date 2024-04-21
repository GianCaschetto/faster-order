import { ShoppingCart, ShoppingCartItem } from '@/types/types';
import { X } from 'lucide-react';

type CartContentProps = {
  cart: ShoppingCart;
  deleteItem: (item: ShoppingCartItem) => void;
};

function CartContent({cart, deleteItem}: CartContentProps) {
  return (
    <div className='h-full'>
    {cart.items?.length > 0 ? (
      <ul className='h-[750px] overflow-y-auto w-full'>
      {cart.items?.map((item: ShoppingCartItem) => (   
          <li
            key={item.id}
            className="flex justify-between items-center mt-4 text-white p-2 border-y"
          >
            <span>
              <img src={item.product.image} alt="" className="w-28" />
            </span>
            <div className='flex flex-col w-1/4 justify-start text-start'>
            <span>{item.quantity} x {item.product.name}</span>
            <ul className='text-end'>
              {item.extras?.map((extra) => (
                <li key={extra.id}>
                  {extra.qty} x {extra.name}
                </li>
              ))}
            </ul>
            <span>{(item.product.price + (item.extras?.reduce((acc, extra) => acc + extra.price * extra.qty, 0) ?? 0)) * item.quantity}$</span>
            </div>
            {/* Delete button */}
            <button
              onClick={() => deleteItem(item)}
              className="bg-red-500 text-white p-2 rounded-lg"
            >
              <X />
            </button>
          </li>
        ))}
      </ul>) : (<div>Carrito vacío</div>)}
      </div>
  )
}

export default CartContent