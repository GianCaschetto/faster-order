import { useEffect, useRef, useState } from "react";
import CartContent from "../CartContent";
import InfoForm from "./InfoForm";
import PaymentForm from "./PaymentForm";
import { X } from "lucide-react";
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
import { auth, db } from "@/services/firebase";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useAdmin } from "@/contexts/AdminContext";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

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
  const { adminData } = useAdmin();
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
    createdAt: Timestamp.now(),
  });
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const steps = [
    {
      label: "Carrito",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M17 17h-11v-14h-2" />
          <path d="M6 5l14 1l-1 7h-13" />
        </svg>
      ),

      component: (
        <CartContent cart={cart} setCart={setCart} deleteItem={deleteItem} />
      ),
    },
    {
      label: "Info",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-user"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
      ),
      component: (
        <InfoForm
          cart={cart}
          order={order}
          setOrder={setOrder}
          customerInfo={customerInfo}
          setCustomerInfo={setCustomerInfo}
        />
      ),
    },
    {
      label: "Pago",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M9 12l2 2l4 -4" />
        </svg>
      ),
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

  const phoneVerifier = async () => {
    if (auth.currentUser?.phoneNumber === `+58${order.customer?.phone}`) {
      console.log(auth.currentUser)
      setCurrentStep(currentStep + 1);
      return;
    } else {
      try {
        if (recaptchaVerifierRef.current) {
          const confirmationResult = await signInWithPhoneNumber(
            auth,
            `+58${order.customer?.phone}`,
            recaptchaVerifierRef.current
          );
          const code = window.prompt("Ingrese el código de verificación");
          if (code) {
            await confirmationResult.confirm(code);
            console.log("Número verificado correctamente");
            toast.success("Número verificado correctamente");
            setCurrentStep(currentStep + 1);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Error al verificar el número");
        console.error(error.message);
        if (recaptchaVerifierRef.current) {
          recaptchaVerifierRef.current.clear(); // Limpiar Recaptcha en caso de error
        }
      }
    }
  };

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "next", {
        size: "invisible",
      });
    }
  }, []);

  useEffect(() => {
    setOrder({
      ...order,
      items: cart.items,
      subtotal: parseFloat(cart.totalPrice.toFixed(2)),
      total: parseFloat(
        (
          parseFloat(cart.totalPrice.toFixed(2)) +
          (order.delivertyPrice ?? customerInfo.neighborhood?.price ?? 0)
        ).toFixed(2)
      ),
    });
  }, [cart, customerInfo.neighborhood?.price]);

  useEffect(() => {
    if (currentStep === 3) {
      setOrder({
        ...order,
        orderNumber: Math.round(Date.now() * Math.random()),
      });
    }
  }, [currentStep]);

  useEffect(() => {
    if (order.orderNumber) {
      addOrder();
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
  }, [order.orderNumber]);

  return (
    <div className="h-screen min-h-screen md:max-w-6xl max-w-sm text-center mx-auto">
      {/* Steps */}
      <div className="flex flex-grow items-center w-full border border-slate-500 ">
        <button
          style={{
            backgroundColor: adminData?.colors?.secondary,
            color: adminData?.colors?.primary,
          }}
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 0 || currentStep === 3}
          className={`  bg-blue-500 text-white px-4 py-6 rounded-lg border-r border-gray-300 hover:bg-blue-700 cursor-pointer`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M5 12l14 0" />
            <path d="M5 12l6 6" />
            <path d="M5 12l6 -6" />
          </svg>
        </button>

        {steps.slice(0, steps.length - 1).map((step, index) => (
          <div
            style={{
              backgroundColor: adminData?.colors?.primary,
              color:
                currentStep === index
                  ? adminData?.colors?.secondary ?? "white"
                  : `${adminData?.colors?.secondary}80` ?? "black",
            }}
            key={index}
            className={`${
              currentStep === index
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-500"
            } px-4 py-2 rounded-lg flex-grow border-r border-gray-300 `}
          >
            <div className="flex flex-col justify-center items-center py-1">
              {step.icon}
              {step.label}
            </div>
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
          className=" flex justify-center py-6 px-4 bg-red-600 hover:bg-red-800"
        >
          <X color="white" />
        </button>
      </div>
      {/* Step content */}
      <div className="h-full">{steps[currentStep].component}</div>

      {/* Next Button */}
      {currentStep !== 3 && (
        <div className="absolute bottom-0 left-0 right-0">
          <button
            id="next"
            type="button"
            style={{
              backgroundColor: adminData?.colors?.secondary,
              color: adminData?.colors?.primary,
            }}
            onClick={() => {
              if (currentStep === 0 && cart.items.length === 0) {
                toast.info("Agrega productos al carrito");
                setShowSidebar(false);
                return;
              } else if (currentStep === 1 && !checkStep1()) {
                toast.error("Por favor completa los campos");
                return;
              } else if (currentStep === 1 && checkStep1()) {
                phoneVerifier();
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
