import { db } from "@/services/firebase";
import { Order, OrderStatus } from "@/types/types";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import OrderToPrint from "./OrderToPrint";
import ConfirmationModal from "@/components/ConfirmationModal";

type OrderDetailsProps = {
  orderSelected: Order;
};

// Status is an enum, so we need to filter the values that are not numbers
const status = Object.values(OrderStatus).filter((status) =>
  isNaN(Number(status))
);

const orderStatusColors: { [key: string]: string } = {
  nuevo: "bg-yellow-200",
  "en proceso": "bg-orange-200",
  enviado: "bg-blue-200",
  entregado: "bg-pink-200",
  finalizado: "bg-green-300",
  cancelado: "bg-red-400",
};

function OrderDetails({ orderSelected }: OrderDetailsProps) {
  const [statusSelected, setStatusSelected] = useState<OrderStatus | null>(
    null
  );
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (
      statusSelected &&
      statusSelected !== OrderStatus.finalizado &&
      statusSelected !== OrderStatus.cancelado
    ) {
      updateDoc(doc(db, `orders/${orderSelected.id}`), {
        status: statusSelected,
      });
    }
  }, [statusSelected]);

  const handleStatusChange = (status: OrderStatus) => {
    if (status === OrderStatus.finalizado || status === OrderStatus.cancelado) {
      setPendingStatus(status);
      setShowConfirmationModal(true);
    } else {
      setStatusSelected(status);
    }
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatus) {
      setStatusSelected(pendingStatus);
      updateDoc(doc(db, `orders/${orderSelected.id}`), {
        status: pendingStatus,
      });
      setShowConfirmationModal(false);
    }
  };

  const handleCancelStatusChange = () => {
    setPendingStatus(null);
    setShowConfirmationModal(false);
  };

  return (
    <div className="bg-gray-100 h-full w-full relative">
      <OrderToPrint orderSelected={orderSelected} />
      <div className="fixed right-0 top-48 bg-gray-100 border-y border-l  border-gray-600 bottom-48 text-white text-sm h-auto rounded-lg shadow-lg shadow-gray-600 p-4">
        <ul className="flex flex-col justify-around items-center space-y-2 h-full">
          {status.map((status) => (
            <li key={status} className="w-full">
              <button
                className={`w-full p-4 ${orderStatusColors[status]} hover:bg-opacity-80 rounded-md shadow-md transition-all duration-300 ease-in-out text-black`}
                onClick={() => handleStatusChange(status as OrderStatus)}
              >
                {status.toString().toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={handleConfirmStatusChange}
          onCancel={handleCancelStatusChange}
        />
      )}
    </div>
  );
}

export default OrderDetails;
