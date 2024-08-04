import { useAdmin } from "@/contexts/AdminContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Order } from "@/types/types";
import { useNavigate } from "react-router-dom";

type OrderCreatedProps = {
  order: Order;
};

function OrderCreated({ order }: OrderCreatedProps) {
  console.log(order);
  const { adminData } = useAdmin();
  const { tasaBCV, tasaEnParalelo } = useCurrency();
  const navigate = useNavigate();

  const replaceTokens = (message: string) => {
    let newMessage = message;
    newMessage = newMessage.replace(
      "##NUMERO_DE_ORDEN##",
      order.orderNumber?.toString() ?? ""
    );
    newMessage = newMessage.replace(
      "##SUBTOTAL_DE_LA_ORDEN##",
      order.subtotal.toString()
    );
    newMessage = newMessage.replace(
      "##PRECIO_DE_ENTREGA##",
      order.delivertyPrice?.toString() ?? ""
    );
    newMessage = newMessage.replace(
      "##TOTAL_DE_LA_ORDEN##",
      order.total.toString()
    );
    newMessage = newMessage.replace(
      "##NOMBRE_DEL_CLIENTE##",
      order.customer.name
    );
    newMessage = newMessage.replace(
      "##TELEFONO_DEL_CLIENTE##",
      order.customer.phone
    );
    newMessage = newMessage.replace(
      "##DIRECCION_DEL_CLIENTE##",
      order.customer.address ?? ""
    );
    newMessage = newMessage.replace(
      "##BARRIO_DEL_CLIENTE##",
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
    Nota: ${item.note}  
    `;
        return productMessage.trim();
      })
      .join("\n");

    newMessage = newMessage.replace(
      "##DETALLES_DEL_PRODUCTO##",
      productDetails
    );
    newMessage = newMessage.replace(
      "##PRECIO_TOTAL_BS_BCV##",
      (order.total * tasaBCV.price).toFixed(2)
    );
    newMessage = newMessage.replace(
      "##PRECIO_TOTAL_BS_PARALELO##",
      (order.total * tasaEnParalelo).toFixed(2)
    );
    newMessage = newMessage.replace("##METODO_DE_PAGO##", order.paymentMethod);
    newMessage = newMessage.replace("##TIPO_DE_ORDEN##", order.orderType);
    newMessage = newMessage.replace(
      "##PAGINA_SEGUIMIENTO_ORDEN##",
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
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-2/3 mt-4 mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
        Orden creada
      </h2>
      <p className="text-center text-lg text-gray-800">
        Tu número de orden es:{" "}
        <span className="font-semibold">{order.orderNumber}</span>
      </p>
      <div className="flex flex-col justify-center gap-4 mt-4">
        <button
          onClick={() =>
            navigate("/order/" + order.orderNumber, { replace: true })
          }
          className="bg-gray-200 text-gray-800 text-lg font-semibold px-4 py-2 rounded-lg"
        >
          Rastrear Orden
        </button>
        <button
          onClick={sendWhatsapp}
          className="bg-[#25d366] text-white text-lg font-semibold px-4 py-2 rounded-lg"
        >
          Enviar por Whatsapp
        </button>
      </div>
    </div>
  );
}

export default OrderCreated;
