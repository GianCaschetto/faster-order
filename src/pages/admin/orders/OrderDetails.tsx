import { db } from "@/services/firebase";
import { Order, OrderStatus } from "@/types/types";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import OrderToPrint from "./OrderToPrint";

type OrderDetailsProps = {
  orderSelected: Order;
};
//Status is an enum, so we need to filter the values that are not numbers
const status = Object.values(OrderStatus).filter((status) =>
  isNaN(Number(status))
);

function OrderDetails({ orderSelected }: OrderDetailsProps) {
  const [statusSelected, setStatusSelected] = useState<OrderStatus | null>(
    null
  );

  useEffect(() => {
    if (statusSelected) {
      updateDoc(doc(db, `orders/${orderSelected.id}`), {
        status: statusSelected,
      });
    }
  }, [statusSelected]);

  return (
    <div className="bg-gray-100 h-full w-full relative">
      <OrderToPrint orderSelected={orderSelected} />

      <div className=" fixed right-0 top-48 bottom-48 text-white text-sm h-auto bg-orange-500 ">
        <ul className="flex flex-col justify-around items-center">
          {status.map((status) => (
            <li className="" key={status}>
              <button
                className="p-4 hover:bg-orange-800"
                onClick={() => {
                  setStatusSelected(status);
                }}
              >
                {status.toString().toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default OrderDetails;
