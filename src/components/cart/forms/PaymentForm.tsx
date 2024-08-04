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
    <div className="p-6 bg-white rounded-lg shadow-md">
      <form action="">
        <section className="flex flex-col text-black">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Método de pago
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {paymentMethods.map((method) => (
              <label
                key={method}
                className={`flex items-center  justify-between p-4 border-2 rounded-lg cursor-pointer ${
                  paymentMethodSelected === method
                    ? "border-green-600"
                    : "border-gray-300"
                }`}
                onClick={() => setPaymentMethodSelected(method)}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={paymentMethodSelected === method}
                  onChange={(e) => setPaymentMethodSelected(e.target.value)}
                  className="hidden"
                />
                <span className="text-gray-700">{method}</span>
                {paymentMethodSelected === method && (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="green"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                    <path d="M9 12l2 2l4 -4" />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </section>
      </form>

      {/* Total */}
      {order.orderType === "delivery" && (
        <div className="text-black mt-6">
          <p className="text-lg">
            Subtotal: <span className="font-semibold">{order.subtotal}</span>
          </p>
          <p className="text-lg">
            Gastos de envío:{" "}
            <span className="font-semibold">{order.delivertyPrice}</span>
          </p>
          <p className="text-lg">
            Total: <span className="font-semibold">{order.total}</span>
          </p>
        </div>
      )}

      {order.orderType === "pickup" && (
        <div className="text-black mt-6">
          <p className="text-lg">
            Total:{" "}
            <span className="font-semibold">
              {parseFloat(order.total.toFixed(2))}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
