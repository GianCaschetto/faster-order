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
      <button onClick={handlePrint}>Print this out!</button>
      <div
        className="rounded-md relative w-72 shadow-2xl p-3 bg-white"
        ref={componentRef}
      >
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
            <div>{orderSelected?.createdAt}</div>
            <div className="font-medium text-sm">
              Subtotal: {orderSelected?.subtotal}
            </div>
            <div className="font-bold text-sm">
              Total:{" "}
              {orderSelected?.subtotal + (orderSelected?.delivertyPrice ?? 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderToPrint;
