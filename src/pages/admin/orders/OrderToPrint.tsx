import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Order } from "@/types/types";

function OrderToPrint({ orderSelected }: { orderSelected: Order }) {
  const componentRef = useRef<any>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="flex flex-col justify-center items-center h-screen text-gray-900">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable,
          .printable * {
            visibility: visible;
          }
          .printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            padding: 40px;
            box-sizing: border-box;
            background: white;
            font-size: 18px;
          }
        }
      `}</style>
      <div className="printable w-72 p-3 bg-white rounded-md shadow-2xl" ref={componentRef}>
        <div className="py-2">
          <div className="text-center text-xl font-bold">
            ORDEN {orderSelected?.orderNumber}
          </div>
          <div className="text-center text-xs font-bold">
            detalles de la orden
          </div>
        </div>
        <div className="text-center text-xs font-bold mb-1">
          ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        </div>
        <div className="text-xs pl-2">
          <div className="text-xs mb-1">
            Cliente: {orderSelected?.customer.name}
          </div>
          <div className="text-xs mb-1">
            Teléfono: {orderSelected?.customer.phone}
          </div>
          <div className="text-xs mb-1">
            Dirección: {orderSelected?.customer.address}
          </div>
          <div className="text-xs mb-1">
            Zona: {orderSelected?.customer?.neighborhood?.name}
          </div>
          <div className="text-xs mb-1">
            Tipo de orden: {orderSelected?.orderType}
          </div>

          {orderSelected?.orderType === "delivery" && (
            <div className="text-xs mb-1">
              Precio de envío: {orderSelected?.delivertyPrice}
            </div>
          )}

          <div className="text-xs mb-1">
            Método de pago: {orderSelected?.paymentMethod}
          </div>
        </div>
        <div className="border-double border-t-4 border-b-4 border-l-0 border-r-0 border-gray-900 my-3">
          <div className="flex text-sm pt-1 px-1">
            <span className="w-2/6">Producto</span>
            <span className="w-2/6 text-right">Precio</span>
            <span className="w-2/6 text-right">Cantidad</span>
          </div>
          <div className="border-dashed border-t border-b border-l-0 border-r-0 border-gray-900 mt-1 my-2 py-2 px-1">
            {orderSelected.items.map((item) => (
              <div key={item.id} className="flex text-sm">
                <span className="w-2/6">{item.product.name}</span>
                <span className="w-2/6 text-right">{item.price}</span>
                <span className="w-2/6 text-right">{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs">
          <div className="text-right">
            <div>{orderSelected?.createdAt.toDate().toLocaleDateString()}</div>
            <div className="font-medium text-sm">
              Subtotal: {orderSelected?.subtotal}
            </div>
            {orderSelected?.orderType === "delivery" && (
              <div className="font-medium text-sm">
                Precio de envío: {orderSelected?.delivertyPrice}
              </div>
            )}
            <div className="font-bold text-sm">
              Total:{" "}
              {(
                orderSelected?.subtotal + (orderSelected?.delivertyPrice ?? 0)
              ).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
      <button
        className="mb-4 group relative mt-4 p-2 overflow-hidden rounded-2xl bg-slate-600 text-lg font-bold text-white"
        onClick={handlePrint}
      >
        <div className="flex flex-col justify-center items-center">
          {" "}
          Imprimir orden
          <svg
            className="icon icon-tabler icon-tabler-printer"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="white"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
            <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
            <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
          </svg>
        </div>
        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button>
    </div>
  );
}

export default OrderToPrint;
