import { ShoppingCart, ShoppingCartItem } from "@/types/types";

type CartContentProps = {
  cart: ShoppingCart;
  setCart: (cart: ShoppingCart) => void;
  deleteItem: (item: ShoppingCartItem) => void;
};

function CartContent({ cart, deleteItem }: CartContentProps) {
  return (
    <div className="h-full">
      {cart.items?.length > 0 ? (
        <ul className="h-[800px] overflow-y-auto w-full text-black  ">
          {cart.items?.map((item: ShoppingCartItem) => (
            <li key={item.id}>
              <div className="py-2 px-4 flex  hover:bg-gray-100 cursor-pointer border-b border-gray-100">
                <div className="p-2 w-20">
                  <img src={item.product.image} alt="imagen del producto" />
                </div>
                <div className="flex flex-auto flex-col text-start justify-center pl-4 text-lg w-2/3">
                  <div className="font-bold">
                    {item.quantity} x {item.product.name}
                  </div>
                  <div className="truncate">
                    <ul className="text-end">
                      {item.extras?.map((extra) => (
                        <li key={extra.id}>
                          {extra.qty} x {extra.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-col w-18 font-medium items-end">
                  <div
                    onClick={() => deleteItem(item)}
                    className="w-4 h-4 mb-6 hover:bg-red-200 rounded-full cursor-pointer text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="100%"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="feather feather-trash-2 "
                    >
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </div>
                  <div className="text-lg">
                    {(item.product.price +
                      (item.extras?.reduce(
                        (acc, extra) => acc + extra.price * (extra.qty ?? 0),
                        0
                      ) ?? 0)) *
                      item.quantity}
                    $
                  </div>
                </div>
              </div>
              <polyline points="3 6 5 6 21 6"></polyline>
            </li>
            // <li
            //   key={item.id}
            //   className="flex justify-between items-center mt-4 text-white p-2 border-y"
            // >
            //   <span>
            //     <img src={item.product.image} alt="" className="w-28" />
            //   </span>
            //   <div className="flex flex-col w-1/4 justify-start text-start">
            //     <span>
            //       {item.quantity} x {item.product.name}
            //     </span>
            //     <ul className="text-end">
            //       {item.extras?.map((extra) => (
            //         <li key={extra.id}>
            //           {extra.qty} x {extra.name}
            //         </li>
            //       ))}
            //     </ul>
            //     <span>
            //       {(item.product.price +
            //         (item.extras?.reduce(
            //           (acc, extra) => acc + extra.price * (extra.qty ?? 0),
            //           0
            //         ) ?? 0)) *
            //         item.quantity}
            //       $
            //     </span>
            //   </div>
            //   {/* Delete button */}
            //   <button
            //     onClick={() => deleteItem(item)}
            //     className="bg-red-500 text-white p-2 rounded-lg"
            //   >
            //     <X />
            //   </button>
            // </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 ">
          <svg
            fill="#bbb"
            className="w-64 h-64"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M493.973,389.323a8,8,0,0,0,1.974-6.24l-24-208A8,8,0,0,0,464,168H424V152a48,48,0,0,0-96,0H312V128a56,56,0,0,0-112,0v24H184a48,48,0,0,0-96,0v16H48a8,8,0,0,0-7.947,7.083l-24,208A8,8,0,0,0,24,392h98.642l-3.609,39.268A8,8,0,0,0,127,440H384a8,8,0,0,0,7.969-8.7L388.5,392H488A8,8,0,0,0,493.973,389.323ZM376,120a32.036,32.036,0,0,1,32,32v16H368.737l-.768-8.7A8,8,0,0,0,360,152H344A32.036,32.036,0,0,1,376,120Zm-160,8a40,40,0,0,1,80,0v24H216ZM104,152a32,32,0,0,1,64,0H152a8,8,0,0,0-7.967,7.268l-.8,8.732H104ZM32.977,376,55.13,184H88v16a8,8,0,0,0,16,0V184h37.76L124.113,376Zm102.792,48L159.3,168H200v32a8,8,0,0,0,16,0V168h80v32a8,8,0,0,0,16,0V168h40.675l22.588,256ZM387.09,376,370.148,184H408v16a8,8,0,0,0,16,0V184h32.87l22.153,192Z"></path>
            <circle cx="208" cy="232" r="8"></circle>
            <circle cx="96" cy="232" r="8"></circle>
            <circle cx="304" cy="232" r="8"></circle>
            <circle cx="416" cy="232" r="8"></circle>
          </svg>
          <p>Carrito vacío, agrega productos para comenzar a comprar</p>
        </div>
      )}
    </div>
  );
}

export default CartContent;
