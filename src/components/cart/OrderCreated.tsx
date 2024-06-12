import { useAdmin } from "@/contexts/AdminContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Order } from "@/types/types";
import { useNavigate } from "react-router-dom";

type OrderCreatedProps = {
  order: Order;
};

function OrderCreated({ order }: OrderCreatedProps) {
  const { adminData } = useAdmin();
  const { tasaBCV, tasaEnParalelo } = useCurrency();
  const navigate = useNavigate();

  const replaceTokens = (message: string) => {
    let newMessage = message;
    newMessage = newMessage.replace(
      "##ORDER_NUMBER##",
      order.orderNumber?.toString() ?? ""
    );
    newMessage = newMessage.replace(
      "##ORDER_SUBTOTAL##",
      order.subtotal.toString()
    );
    newMessage = newMessage.replace(
      "##ORDER_DELIVERY_PRICE##",
      order.delivertyPrice?.toString() ?? ""
    );
    newMessage = newMessage.replace("##ORDER_TOTAL##", order.total.toString());
    newMessage = newMessage.replace("##CUSTOMER_NAME##", order.customer.name);
    newMessage = newMessage.replace("##CUSTOMER_PHONE##", order.customer.phone);
    newMessage = newMessage.replace(
      "##CUSTOMER_ADDRESS##",
      order.customer.address ?? ""
    );
    newMessage = newMessage.replace(
      "##CUSTOMER_NEIGHBORHOOD##",
      order.customer.neighborhood?.name ?? ""
    );

    // Manejar productos
    const productDetails = order.items
      .map((item) => {
        const productMessage = `
    ${item.quantity} x ${item.product.name}
    ${item.extras
      ?.map((extra) => `Extra: ${extra.qty} x ${extra.name}`)
      .join("\n")}
    `;
        return productMessage.trim();
      })
      .join("\n");

    newMessage = newMessage.replace("##PRODUCT_DETAILS##", productDetails);
    newMessage = newMessage.replace(
      "##TOTAL_PRICE_BS_BCV##",
      (order.total * tasaBCV.price).toFixed(2)
    );
    newMessage = newMessage.replace(
      "##TOTAL_PRICE_BS_PARALELO##",
      (order.total * tasaEnParalelo).toFixed(2)
    );
    newMessage = newMessage.replace(
      "##ORDER_PAYMENTMETHOD##",
      order.paymentMethod
    );
    newMessage = newMessage.replace("##ORDER_ORDERTYPE##", order.orderType);
    newMessage = newMessage.replace(
      "##TRACK_ORDER_PAGE##",
      `${window.location.origin}/order/${order.orderNumber}`
    );
    return newMessage;
  };

  const msg =
    order.orderType === "delivery"
      ? replaceTokens(adminData?.whatsappDeliveryMessage ?? "")
      : order.orderType === "pickup"
      ? replaceTokens(adminData?.whatsappPickupMessage ?? "")
      : `
  ===== Orden =====
  Orden: ${order.orderNumber} 
  Contenido de la orden
  ${order.items.map(
    (item) =>
      `
    ${item.quantity} x ${item.product.name}
      ${item.extras?.map((extra) => {
        return `Extra: ${extra.qty} x ${extra.name}`;
      })}
    Precio: ${item.price}
    `
  )}
  Subtotal: ${order.subtotal}
  Gastos de envío: ${order.delivertyPrice}
  Total: ${order.total}

  Total en bs: ${parseFloat((order.total * tasaBCV.price).toFixed(2))}

  Método de pago: ${order.paymentMethod}

  ===== Detalles del cliente =====
  uid: ${order.customer.uid}
  Nombre: ${order.customer.name}
  Teléfono: ${order.customer.phone}
  Dirección: ${order.customer.address}
  Zona: ${order.customer.neighborhood?.name}

  Rastreo de orden 👇🏻
   ${window.location.origin}/order/${order.orderNumber}
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
            <p>
              Precio del {item.product.name}: {item.price}
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
      <p>Tipo de orden: {order.orderType}</p>
      <p>Subtotal: {order.subtotal}</p>
      <p>Gastos de envío: {order.delivertyPrice}</p>
      <p>Total: {order.total}</p>
      <p>
        Total en bs:
        {(order.total * tasaBCV.price).toFixed(2)}
      </p>

      <div className="flex flex-col">
        <button onClick={sendWhatsapp}>Envia tu pedido por whatsapp</button>
        <button
          onClick={() => {
            navigate(`/order/${order.orderNumber}`);
          }}
        >
          Rastreo de orden
        </button>
      </div>
    </div>
  );
}

export default OrderCreated;
