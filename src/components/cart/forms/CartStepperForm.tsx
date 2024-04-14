import { useState } from "react";
import CartContent from "../CartContent";
import InfoForm from "./InfoForm";
import PaymentForm from "./PaymentForm";
import { ArrowLeft, X } from "lucide-react";
import { Order, ShoppingCart, ShoppingCartItem } from "@/types/types";
import OrderCreated from "../OrderCreated";

type CartStepperFormProps = {
  cart: ShoppingCart;
  deleteItem: (item: ShoppingCartItem) => void;
  setShowSidebar: (showSideBar: boolean) => void;
};

function CartStepperForm({
  cart,
  deleteItem,
  setShowSidebar,
}: CartStepperFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [order, setOrder] = useState<Order>({
    id: crypto.randomUUID(),
    customer: {
      name: "",
      phone: "",
    },
    orderType: "delivery",
    items: cart.items,
    subtotal: cart.totalPrice,
    status: "pending",
    paymentMethod: "",
    createdAt: new Date().toISOString(),
  });

  const steps = [
    {
      label: "Carrito",
      component: <CartContent cart={cart} deleteItem={deleteItem} />,
    },
    {
      label: "Info",
      component: <InfoForm order={order} setOrder={setOrder} />,
    },
    {
      label: "Pago",
      component: <PaymentForm order={order} setOrder={setOrder} />,
    },
    {
      component: <OrderCreated order={order} />,
    }
  ];

  //Check field of step 1 and return true or false
  const checkStep1 = () => {
    if (order.orderType === "pickup") {
      return order.customer.name && order.customer.phone;
    }
    return (
      order.customer.name &&
      order.customer.phone &&
      order.customer.address &&
      order.customer.neighborhood
    );
  };

  const checkStep2 = () => {
    return order.paymentMethod !== "";
  }

  return (
    <div className="min-h-screen md:max-w-6xl max-w-sm text-center p-4 mx-auto relative">
      {/* Steps */}
      <div className="flex justify-center items-center space-x-4">
        <button
          onClick={() => setCurrentStep((prev) => prev - 1)}
          disabled={currentStep === 0}
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg w-full border  `}
        >
          <ArrowLeft />
        </button>
        {steps.slice(0, steps.length - 1).map((step, index) => (
          <div
            key={index}
            className={`${
              currentStep === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } px-4 py-2 rounded-lg`}
          >
            {step.label}
          </div>
        ))}
        <button onClick={() => setShowSidebar(false)}>
          <X color="white" />
        </button>
      </div>
      {/* Step content */}
      <div className="mt-8">{steps[currentStep].component}</div>
  
      {/* Nav control */}
      {currentStep !== 3 && (<div className="absolute bottom-2 left-0 right-0 flex justify-between ">
        <button
          type="button"
          onClick={() => {
            if (currentStep === 0 && cart.items.length === 0) {
              alert("Por favor agrega productos al carrito");
              setShowSidebar(false);
              return;
            } else if (currentStep === 1 && !checkStep1()) {
              alert("Por favor llena todos los campos");
              return;
            } else if (currentStep === 2 && !checkStep2()) {
              console.log("sadf")
              alert("Por favor selecciona un metodo de pago");
              return;
            }
            setCurrentStep((prev) => prev + 1);
          }}
          
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg w-full border cursor-pointer`}
        >
          Siguiente
        </button>
      </div>)}
    
    </div>
  );
}

export default CartStepperForm;
