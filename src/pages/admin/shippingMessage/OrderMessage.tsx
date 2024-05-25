import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { OrderType } from "@/types/types";
import { useState } from "react";

const tokens = {
  "##ORDER_NUMBER##": "Número de orden",
  "##ORDER_SUBTOTAL##": "Subtotal de la orden",
  "##ORDER_ORDERTYPE##": "Tipo de orden",
  "##ORDER_DELIVERY_PRICE##": "Precio de entrega",
  "##ORDER_PAYMENTMETHOD##": "Método de pago",
  "##ORDER_TOTAL##": "Total de la orden",
  "##CUSTOMER_NAME##": "Nombre del cliente",
  "##CUSTOMER_PHONE##": "Teléfono del cliente",
  "##CUSTOMER_ADDRESS##": "Dirección del cliente",
  "##CUSTOMER_NEIGHBORHOOD##": "Barrio del cliente",
  "##PRODUCT_DETAILS##": "Detalles del producto",
  "##TOTAL_PRICE_BS_BCV##": "Precio total en bolívares a tasa BCV",
  "##TOTAL_PRICE_BS_PARALELO##": "Precio total en bolívares a tasa PARALELO",

};

function OrderMessage() {
  const { adminData } = useAdmin();
  const [orderTypeMessage, setOrderTypeMessage] =
    useState<OrderType>("delivery");
  const [message, setMessage] = useState<string>("");

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleOrderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderTypeMessage(e.target.value as OrderType);
  };

  const saveMessageToAdmin = () => {
    saveAdminData({
      whatsappMessage: message,
    });
  };

  return (
    <section>
      <div className="flex flex-col justify-start ">
        <span>Order Message</span>
        <select
          value={orderTypeMessage}
          onChange={handleOrderTypeChange}
          className="text-white p-2"
        >
          <option value="delivery">Delivery</option>
          <option value="pickup">Pickup</option>
        </select>
      </div>
      <div>
        <span>Tokens disponibles:</span>
        {
          <ul>
            {Object.entries(tokens).map(([key, value]) => (
              <li key={key}>
                {key} - {value}
              </li>
            ))}
          </ul>
        }
      </div>
      <textarea
        className="w-full h-96 p-2 text-white"
        placeholder="Escribe el mensaje"
        onChange={handleMessageChange}
        defaultValue={adminData?.whatsappMessage}
      ></textarea>

      <button onClick={saveMessageToAdmin}>Guardar</button>
    </section>
  );
}

export default OrderMessage;
