import { useAdmin } from "@/contexts/AdminContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Order } from "@/types/types";
import { useNavigate } from "react-router-dom";

type OrderCreatedProps = {
  order: Order;
};

function OrderCreated({ order }: OrderCreatedProps) {
  const {adminData} = useAdmin();
  const { tasaBCV } =  useCurrency();
  const navigate = useNavigate();
  const msg = `
  ===== Orden =====
  Orden: ${order.id} 
  Contenido de la orden
  ${order.items.map(
    (item) =>
      `
    ${item.quantity} x ${item.product.name}
      ${item.extras?.map(extra => {
        return `Extra: ${extra.qty} x ${extra.name}`
      })}
    Precio: ${item.price}
    `
  )}
  Subtotal: ${order.subtotal}
  Gastos de envío: ${order.delivertyPrice}
  Total: ${order.subtotal + (order.delivertyPrice ?? 0)}

  Total en bs: ${((order.subtotal + (order.delivertyPrice ?? 0)) * tasaBCV.price).toFixed(2)}

  Método de pago: ${order.paymentMethod}

  ===== Detalles del cliente =====
  uid: ${order.customer.uid}
  Nombre: ${order.customer.name}
  Teléfono: ${order.customer.phone}
  Dirección: ${order.customer.address}
  Zona: ${order.customer.neighborhood?.name}
  `;
  const formattedMsg = encodeURIComponent(msg);

  const sendWhatsapp = () => {
    window.open(
      `https://wa.me/+58${adminData?.whatsapp}?text=${formattedMsg}`,
      "_blank"
    );
  };

  return (
    <div className="text-start">
      {/* Show the order */}
      <h1>Orden creada</h1>
      <p>Orden: {order.orderNumber}</p>
      <p>Contenido de la orden</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.product.id}>
            {item.quantity} x {item.product.name}
            {item.extras?.map((extra) => (
              <p key={extra.id}>
                {extra.qty} x {extra.name}: {extra.price}
              </p>
            ))}
            <p>Precio del {item.product.name}: {item.price}</p>
          </li>
        ))}
      </ul>
      <p>Cliente: {order.customer.name}</p>
      <p>Telefono: {order.customer.phone}</p>
      <p>Dirección: {order.customer.address}</p>
      <p>Barrio: {order.customer.neighborhood?.name}</p>
      <p>Estado: {order.status}</p>
      <p>Metodo de pago: {order.paymentMethod}</p>
      <p>Tipo de orden: {order.orderType}</p>
      <p>Subtotal: {order.subtotal}</p>
      <p>Gastos de envío: {order.delivertyPrice}</p>
      <p>Total: {order.subtotal + (order.delivertyPrice ?? 0)}</p>
      <p>
        Total en bs: 
         {(order.subtotal + (order.delivertyPrice ?? 0)) * tasaBCV.price}
      </p>

      <div className="flex flex-col">
        <button onClick={sendWhatsapp}>Envia tu pedido por whatsapp</button>
        <button onClick={() => {
          navigate(`/order/${order.orderNumber}`);
        }}>Rastreo de orden</button>
      </div>
    </div>
  );
}

export default OrderCreated;
