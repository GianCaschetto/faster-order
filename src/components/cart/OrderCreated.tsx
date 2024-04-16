import { Order, TasaBCV } from "@/types/types";
import { useEffect, useState } from "react";

type OrderCreatedProps = {
  order: Order;
};

function OrderCreated({ order }: OrderCreatedProps) {
  const [tasaBCV, setTasaBCV] = useState<TasaBCV>({} as TasaBCV);
  const msg = `
  ===== Orden =====
  Orden: ${order.id} 
  Contenido de la orden
  ${order.items.map(
    (item) =>
      `${item.product.name} x ${item.quantity} = ${
        item.product.price * item.quantity
      } `
  )}
  Subtotal: ${order.subtotal}
  Gastos de envío: ${order.delivertyPrice}
  Total: ${order.subtotal + (order.delivertyPrice ?? 0)}

  Total en bs: ${(order.subtotal + (order.delivertyPrice ?? 0)) * tasaBCV.price}

  Método de pago: ${order.paymentMethod}

  ===== Detalles del cliente =====
  Nombre: ${order.customer.name}
  Teléfono: ${order.customer.phone}
  Dirección: ${order.customer.address}
  Zona: ${order.customer.neighborhood?.name}
  `;
  const formattedMsg = encodeURIComponent(msg);

  const sendWhatsapp = () => {
    window.open(
      `https://wa.me/${"584127690327"}?text=${formattedMsg}`,
      "_blank"
    );
  };

  useEffect(() => {
    fetch("https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv")
      .then((response) => response.json())
      .then((data) => setTasaBCV(data.monitors.usd));
  }, []);

  return (
    <div className="text-start">
      {/* Show the order */}
      <h1>Orden creada</h1>
      <p>Orden: {order.id}</p>
      <p>Contenido de la orden</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.product.id}>
            <p>
              {item.product.name} x {item.quantity} ={" "}
              {item.product.price * item.quantity}
            </p>
          </li>
        ))}
      </ul>
      <p>Cliente: {order.customer.name}</p>
      <p>Telefono: {order.customer.phone}</p>
      <p>Dirección: {order.customer.address}</p>
      <p>Barrio: {order.customer.neighborhood?.name}</p>
      <p>Estado: {order.status}</p>
      <p>Metodo de pago: {order.paymentMethod}</p>
      <p>Fecha: {order.createdAt}</p>
      <p>Tipo de orden: {order.orderType}</p>
      <p>Subtotal: {order.subtotal}</p>
      <p>Gastos de envío: {order.delivertyPrice}</p>
      <p>Total: {order.subtotal + (order.delivertyPrice ?? 0)}</p>
      <p>Total en bs: {(order.subtotal + (order.delivertyPrice ?? 0)) * tasaBCV.price}</p>

      <div className="flex flex-col">
        <button onClick={sendWhatsapp}>Envia tu pedido por whatsapp</button>
        <button>Rastreo de orden</button>
      </div>
    </div>
  );
}

export default OrderCreated;
