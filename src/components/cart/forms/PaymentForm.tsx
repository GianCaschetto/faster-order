import { useAdmin } from "@/contexts/AdminContext";
import { Order } from "@/types/types";
import { useEffect, useState } from "react";

type PaymentProps = {
  order: Order;
  setOrder: (order: Order) => void;
};

function PaymentForm({ order, setOrder }: PaymentProps) {
  const { adminData } = useAdmin();
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  // const { tasaBCV } = useCurrency();

  const [paymentMethodSelected, setPaymentMethodSelected] =
    useState<string>("");

  useEffect(() => {
    setOrder({
      ...order,
      paymentMethod: paymentMethodSelected,
    });
  }, [paymentMethodSelected]);

  useEffect(() => {
    if (adminData?.paymentMethods) {
      setPaymentMethods(adminData.paymentMethods);
    }
  }, [adminData?.paymentMethods]);

  return (
    <div>
      <form action="" className="mt-6 px-6">
        <section className="flex flex-col text-black">
          <h3 className="text-2xl font-bold text-black">Metodo de pago</h3>
          <div className="flex flex-col overflow-y-auto">
            {paymentMethods.map((method) => (
              <label key={method}>
                <input
                
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethodSelected === method}
                  onChange={(e) => setPaymentMethodSelected(e.target.value)}
                />
                {method}
              </label>
            ))}
          </div>
        </section>
      </form>
      {/* Total */}
      {order.orderType === "delivery" && (
        <div className="text-black">
          <p>Subtotal: {order.subtotal}</p>
          <p>Gastos de envío: {order.delivertyPrice}</p>
          <p>Total: {order.total}</p>
        </div>
      )}

      {order.orderType === "pickup" && (
        <div>
          <p>Total: {parseFloat(order.total.toFixed(2))}</p>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
