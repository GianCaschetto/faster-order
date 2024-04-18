import { useEffect, useState } from "react";
import CartContent from "../CartContent";
import InfoForm from "./InfoForm";
import PaymentForm from "./PaymentForm";
import { ArrowLeft, X } from "lucide-react";
import { Order, ShoppingCart, ShoppingCartItem } from "@/types/types";
import OrderCreated from "../OrderCreated";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import { signInAnonymous } from "@/services/firebase";

type CartStepperFormProps = {
  cart: ShoppingCart;
  deleteItem: (item: ShoppingCartItem) => void;
  setShowSidebar: (showSideBar: boolean) => void;
  setCart: (cart: ShoppingCart) => void;
  currentStep: number;
  setCurrentStep: (currentStep: number) => void;
};

function CartStepperForm({
  cart,
  setCart,
  deleteItem,
  setShowSidebar,
  currentStep,
  setCurrentStep,
}: CartStepperFormProps) {
  const [order, setOrder] = useState<Order>({
    id: crypto.randomUUID(),
    customer: {
      name: "",
      phone: "",
    },
    orderType: "delivery",
    items: [],
    subtotal: 0,
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
    },
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
  };
  
  useEffect(() => {
    setOrder({
      ...order,
      items: cart.items,
      subtotal: cart.totalPrice,
    });
  }, [cart])

  useEffect(()=> {
    if(currentStep === 2){
      signInAnonymous();
    } else if(currentStep === 3) {
      toast.success("Orden creada con exito");
      confetti();
    }
  
  }, [currentStep])

  return (
    <div className="h-screen min-h-screen md:max-w-6xl max-w-sm text-center p-4 mx-auto">
      {/* Steps */}
      <div className="flex justify-center items-center space-x-4">
        {currentStep > 0 && currentStep < 3 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg border w-1/5 hover:bg-blue-700 cursor-pointer`}
          >
            <ArrowLeft />
          </button>
        )}

        {steps.slice(0, steps.length - 1).map((step, index) => (
          <div
            key={index}
            className={`${
              currentStep === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            } px-4 py-2 rounded-lg w-1/5`}
          >
            {step.label}
          </div>
        ))}
        <button
          onClick={() => {
            setShowSidebar(false);
            setCurrentStep(0);
            if(currentStep=== 3){

              setCart({
                items: [],
                totalItems: 0,
                totalPrice: 0,
              });
              window.localStorage.setItem("cart", JSON.stringify({
                items: [],
                totalItems: 0,
                totalPrice: 0,
              }));
            }
          }}
          className="w-1/5 flex justify-center border py-2 hover:bg-red-500"
        >
          <X color="white" />
        </button>
      </div>
      {/* Step content */}
      <div className="">{steps[currentStep].component}</div>

      {/* Next Button */}
      {currentStep !== 3 && (
        <div className="absolute bottom-0 left-0 right-0">
          <button
            type="button"
            onClick={() => {
              if (currentStep === 0 && cart.items.length === 0) {
                toast.info("Agrega productos al carrito");
                setShowSidebar(false);
                return;
              } else if (currentStep === 1 && !checkStep1()) {
                toast.error("Por favor completa los campos");
                return;
              } else if (currentStep === 2 && !checkStep2()) {
                toast.error("Por favor selecciona un metodo de pago");
                return;
              }
              
              
          
              setCurrentStep(currentStep + 1);
            }}
            className={`bg-blue-500 text-white px-4 py-2 rounded-lg w-full border cursor-pointer`}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default CartStepperForm;
