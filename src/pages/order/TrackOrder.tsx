import { useAdmin } from "@/contexts/AdminContext";
import { Order } from "@/types/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const orderStatusColors = {
    nuevo: "bg-yellow-200",
    "en proceso": "bg-orange-200",
    enviado: "bg-blue-200",
    entregado: "bg-pink-200",
    finalizado: "bg-green-300",
    cancelado: "bg-red-400",
  };

function TrackOrder() {
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);
  const { orderNumberParam } = useParams();
  const { orders } = useAdmin();

  useEffect(() => {
    if (orders) {
      const orderToSearch = orders.find(order => order.orderNumber?.toString() === orderNumberParam);
      setOrderSelected(orderToSearch as Order);
    }
  }, [orders, orderNumberParam]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      
      <div className={`max-w-lg w-full p-6 rounded-lg shadow-lg ${
        orderSelected ? orderStatusColors[orderSelected.status.toLowerCase()] : ""
      } ${!orderSelected && "animate-pulse"
      }`}>
        {orderSelected ? (
          <>
            <div className="mb-4">
              <span className="font-semibold">Número de orden:</span> {orderSelected.orderNumber}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Estado:</span> {orderSelected.status}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-600">
            Cargando información de la orden...
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
