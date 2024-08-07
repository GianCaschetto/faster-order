import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { OrderType } from "@/types/types";
import { useState, useEffect } from "react";

const tokens = {
  "##NUMERO_DE_ORDEN##": "Número de orden",
  "##SUBTOTAL_DE_LA_ORDEN##": "Subtotal de la orden",
  "##TIPO_DE_ORDEN##": "Tipo de orden",
  "##PRECIO_DE_ENTREGA##": "Precio de entrega",
  "##METODO_DE_PAGO##": "Método de pago",
  "##TOTAL_DE_LA_ORDEN##": "Total de la orden",
  "##NOMBRE_DEL_CLIENTE##": "Nombre del cliente",
  "##TELEFONO_DEL_CLIENTE##": "Teléfono del cliente",
  "##DIRECCION_DEL_CLIENTE##": "Dirección del cliente",
  "##BARRIO_DEL_CLIENTE##": "Barrio del cliente",
  "##DETALLES_DEL_PRODUCTO##": "Detalles del producto",
  "##PRECIO_TOTAL_BS_BCV##": "Precio total en bolívares a tasa BCV",
  "##PRECIO_TOTAL_BS_PARALELO##": "Precio total en bolívares a tasa PARALELO",
  "##PAGINA_SEGUIMIENTO_ORDEN##": "Página de seguimiento de orden (enlace)",
};

function OrderMessage() {
  const { adminData } = useAdmin();
  const [orderTypeMessage, setOrderTypeMessage] = useState<OrderType>("delivery");
  const [deliveryMessage, setDeliveryMessage] = useState<string>(
    adminData?.whatsappDeliveryMessage ?? ""
  );
  const [pickupMessage, setPickupMessage] = useState<string>(
    adminData?.whatsappPickupMessage ?? ""
  );
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  useEffect(() => {
    setDeliveryMessage(adminData?.whatsappDeliveryMessage ?? "");
    setPickupMessage(adminData?.whatsappPickupMessage ?? "");
  }, [adminData]);

  const handleDeliveryMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDeliveryMessage(e.target.value);
  };

  const handlePickupMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPickupMessage(e.target.value);
  };

  const handleOrderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrderTypeMessage(e.target.value as OrderType);
  };

  const saveMessageToAdmin = () => {
    if (orderTypeMessage === "delivery") {
      saveAdminData({ whatsappDeliveryMessage: deliveryMessage });
    } else {
      saveAdminData({ whatsappPickupMessage: pickupMessage });
    }
  };

  const handleCopyToken = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedToken(key);
      setTimeout(() => setCopiedToken(null), 2000);
    });
  };

  return (
    <section className="text-black w-5/6 mx-auto">
      <div className="text-center">
        <h3 className="text-3xl font-semibold text-gray-800 text-start mb-4">
          Tokens disponibles
        </h3>
        <ul className="grid md:grid-cols-3 grid-cols-1 gap-4">
          {Object.entries(tokens).map(([key, value]) => (
            <li key={key}>
              <div className="relative mt-6 flex md:w-80 flex-col text-center rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                <div className="p-6">
                  <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                    {value}
                  </h5>
                  <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased">
                    {key}
                  </p>
                </div>
                <div className="p-6 pt-0 text-center mx-auto">
                  <button
                    className="flex hover:scale-105  select-none items-center gap-2 rounded-lg  px-4 text-center align-middle font-sans text-xs font-bold uppercase transition-all disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    data-ripple-dark="true"
                    onClick={() => handleCopyToken(key)}
                  >
                    {copiedToken === key ? "Copiado" : "Copiar"}
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                      <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col justify-start w-fit mt-8">
        <h3 className="text-3xl font-semibold text-gray-800 text-center mb-4">
          Plantilla del mensaje de WhatsApp
        </h3>
        <select
          value={orderTypeMessage}
          onChange={handleOrderTypeChange}
          className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="delivery">Delivery</option>
          <option value="pickup">Pickup</option>
        </select>
      </div>
      <textarea
        className="block p-2.5 h-96 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Escribe el mensaje"
        value={
          orderTypeMessage === "delivery"
            ? deliveryMessage
            : pickupMessage
        }
        onChange={
          orderTypeMessage === "delivery"
            ? handleDeliveryMessageChange
            : handlePickupMessageChange
        }
      />

      <button
        onClick={() => {
          saveMessageToAdmin();
        }}
        className="group relative mt-4 h-12 w-48 overflow-hidden rounded-2xl bg-slate-600 text-lg font-bold text-white"
      >
        Guardar
        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button>
    </section>
  );
}

export default OrderMessage;
