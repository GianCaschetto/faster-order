import { useEffect, useState } from "react";
import CartContent from "../CartContent";
import InfoForm from "./InfoForm";
import PaymentForm from "./PaymentForm";
import { ArrowLeft, X } from "lucide-react";
import {
  CustomerInfo,
  Order,
  OrderStatus,
  ShoppingCart,
  ShoppingCartItem,
} from "@/types/types";
import OrderCreated from "../OrderCreated";
import { toast } from "react-toastify";
import confetti from "canvas-confetti";
import { db } from "@/services/firebase";
import { addDoc, collection } from "firebase/firestore";

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
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    const customerInfoLocalStorage =
      window.localStorage.getItem("customerInfo");
    return customerInfoLocalStorage
      ? JSON.parse(customerInfoLocalStorage)
      : ({} as CustomerInfo);
  });
  const [order, setOrder] = useState<Order>({
    customer: customerInfo ?? ({} as CustomerInfo),
    orderType: "delivery",
    items: [],
    subtotal: 0,
    status: OrderStatus.nuevo,
    paymentMethod: "",
    orderNumber: undefined,
    total: 0,
    createdAt: new Date(),
  });

  const steps = [
    {
      label: "Carrito",
      component: <CartContent cart={cart} deleteItem={deleteItem} />,
    },
    {
      label: "Info",
      component: (
        <InfoForm
          order={order}
          setOrder={setOrder}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
        />
      ),
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

  const addOrder = async () => {

    await addDoc(collection(db, "orders"), order);
    toast.success("Orden creada exitosamente");
    confetti();
  };

  // useEffect(() => {
  //   const fetchCustomerInfo = async () => {
  //     const customerInfoRef = doc(db, `users/${auth.currentUser?.uid}`);
  //     const customerInfoSnap = await getDoc(customerInfoRef);
  //     if (customerInfoSnap.exists()) {
  //       setCustomerInfo(customerInfoSnap.data() as CustomerInfo);
  //     } else {
  //       setCustomerInfo({
  //         name: "",
  //         phone: "",
  //         address: null,
  //         neighborhood: null,
  //       } as CustomerInfo);
  //     }
  //   };
  //   fetchCustomerInfo();
  // }, [auth.currentUser?.uid]);

  useEffect(() => {
    setOrder({
      ...order,
      items: cart.items,
      subtotal: parseFloat(cart.totalPrice.toFixed(2)),
    });
  }, [cart]);

  useEffect(() => {
    if (currentStep === 3) {
      setOrder({
        ...order,
        orderNumber: Math.round(Date.now() * Math.random()),
        total: parseFloat(
          (
            parseFloat(cart.totalPrice.toFixed(2)) + (order.delivertyPrice ?? 0)
          ).toFixed(2)
        ),
      });
    }
  }, [currentStep]);

  useEffect(() => {
    if (order.orderNumber) {
      addOrder();
    }
  }, [order.orderNumber]);

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
            if (currentStep === 3) {
              setCart({
                items: [],
                totalItems: 0,
                totalPrice: 0,
              });
              window.localStorage.setItem(
                "cart",
                JSON.stringify({
                  items: [],
                  totalItems: 0,
                  totalPrice: 0,
                })
              );
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
