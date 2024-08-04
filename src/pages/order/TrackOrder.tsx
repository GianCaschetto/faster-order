import { useAdmin } from "@/contexts/AdminContext";
import { Order } from "@/types/types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const orderStatusColors = {
  nuevo: "bg-yellow-200",
  "en proceso": "bg-orange-200",
  enviado: "bg-blue-200",
  entregado: "bg-pink-200",
  finalizado: "bg-green-300",
  cancelado: "bg-red-400",
};

function TrackOrder() {
  const navigate = useNavigate();
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);
  const { orderNumberParam } = useParams();
  const { orders, adminData } = useAdmin();

  useEffect(() => {
    if (orders) {
      const orderToSearch = orders.find(
        (order) => order.orderNumber?.toString() === orderNumberParam
      );
      setOrderSelected(orderToSearch as Order);
    }
  }, [orders, orderNumberParam]);

  return (
    <div className="min-h-screen flex flex-col items-center ">
      <div>
        {orderSelected ? (
          <div className="max-w-lg mx-auto my-4 p-4 border rounded-lg shadow-md">
            <header className="text-center mb-4">
              <img
                onClick={() => navigate("/")}
                src={adminData?.logo ?? ""}
                className="h-auto w-32 mx-auto hover:cursor-pointer  drop-shadow-xl"
                alt="logo"
              />
              <p className="text-sm text-gray-600 py-4">
                La información reflejada en este apartado puede variar, puedes
                comunicarte vía whatsapp para aclarar dudas.
              </p>
            </header>

            <div
              className={`${
                orderStatusColors[orderSelected.status]
              } text-white font-bold py-4 px-4 w-full mb-4 rounded text-center text-2xl`}
            >
              {orderSelected.status.charAt(0).toUpperCase() +
                orderSelected.status.slice(1)}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-green-600 text-white px-2 py-1 rounded-xl">
                  {orderSelected.orderType.charAt(0).toUpperCase() +
                    orderSelected.orderType.slice(1)}
                </span>
                <div className="text-right">
                  <p className="font-bold">Orden {orderSelected.orderNumber}</p>
                  <p className="text-gray-600">
                    {orderSelected.createdAt.toDate().toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-bold">{orderSelected.customer.name}</p>
                <p className="text-blue-600">
                  <span>{orderSelected.customer.phone}</span>
                </p>
                <p className="text-gray-600">
                  {orderSelected.customer.address},{" "}
                  {orderSelected.customer.neighborhood?.name}
                </p>
              </div>

              {orderSelected.items.map((item, index) => (
                <div key={index} className="mb-4">
                  <p className="font-bold">
                    {item.quantity} x {item.product.name}
                  </p>
                  {item.extras?.map((extra, index) => (
                    <p key={index} className="text-gray-600 ml-2">
                      {extra.qty} x {extra.name}
                    </p>
                  ))}

                  {item.note && (
                    <p className="text-gray-600 ml-2">Nota: {item.note}</p>
                  )}

                  <p className="text-gray-600">${item.price}</p>
                </div>
              ))}

              <div className="border-t pt-4">
                <p className="text-gray-600 mt-2">
                  Método de Pago: {orderSelected.paymentMethod}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span>
                    {orderSelected.orderType.charAt(0).toUpperCase() +
                      orderSelected.orderType.slice(1)}
                  </span>
                  {orderSelected.orderType === "delivery" && (
                    <span>$ {orderSelected.delivertyPrice}</span>
                  )}
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Subtotal</span>
                  <span>$ {orderSelected.subtotal}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span>$ {orderSelected.total}</span>
                </div>
              </div>
              {/* Whatsapp button */}
              <div className="flex justify-center mt-8">
                <a
                  href={`https://wa.me/+58${
                    adminData?.whatsapp
                  }?text=${encodeURIComponent(
                    `Hola, mi número de orden es ${orderSelected.orderNumber}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="animate-bounce bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  Contactar por Whatsapp
                </a>
              </div>
            </div>
          </div>
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
