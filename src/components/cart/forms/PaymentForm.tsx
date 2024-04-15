import { Order } from "@/types/types";
import { useEffect, useState } from "react";
import { paymentMethods } from "@/mock/data";

type PaymentProps = {
  order: Order;
  setOrder: (order: Order) => void;
};

function PaymentForm({ order, setOrder }: PaymentProps) {
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<string>(
    () => {
      const paymentMethod = window.localStorage.getItem("paymentMethod");
      return paymentMethod ?? "";
    }
  );

  useEffect(() => {
    setOrder({
      ...order,
      paymentMethod: paymentMethodSelected,
    });
  }, [paymentMethodSelected]);

  useEffect(() => {
    window.localStorage.setItem("paymentMethod", paymentMethodSelected);
  }, [paymentMethodSelected]);

  return (
    <div>
      <form action="">
        <section>
          <label>Metodo de pago</label>
          <div className="flex justify-around">
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
      <p>Subtotal: {order.subtotal}</p>
      <p>Gastos de envío: {order.delivertyPrice}</p>
      <p>Total: {order.subtotal + (order.delivertyPrice ?? 0)}</p>
    </div>
  );
}

export default PaymentForm;
