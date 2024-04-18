import { Order } from "@/types/types";
import { useEffect, useState } from "react";
import { paymentMethods } from "@/mock/data";

type PaymentProps = {
  order: Order;
  setOrder: (order: Order) => void;
};

function PaymentForm({ order, setOrder }: PaymentProps) {
  const [paymentMethodSelected, setPaymentMethodSelected] =
    useState<string>("");

  useEffect(() => {
    setOrder({
      ...order,
      paymentMethod: paymentMethodSelected,
    });
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
      {order.orderType === "delivery" && (
        <div>
          <p>Subtotal: {order.subtotal}</p>
          <p>Gastos de envío: {order.delivertyPrice}</p>
          <p>Total: {order.subtotal + (order.delivertyPrice ?? 0)}</p>
        </div>
      )}

      {order.orderType === "pickup" && (
        <div>
          <p>Total: {order.subtotal}</p>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
