/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAdmin } from "@/contexts/AdminContext";
import { auth } from "@/services/firebase";
import {
  CustomerInfo,
  Neighborhood,
  Order,
  OrderType,
  ShoppingCart,
} from "@/types/types";
import { onAuthStateChanged, signInAnonymously, signInWithCustomToken } from "firebase/auth";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

type InfoFormProps = {
  cart: ShoppingCart;
  order: Order;
  setOrder: (order: Order) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (customerInfo: CustomerInfo) => void;
};

function InfoForm({
  // cart,
  customerInfo,
  order,
  setCustomerInfo,
  setOrder,
}: InfoFormProps) {
  const { adminData } = useAdmin();
  const neighborhoods = useMemo(
    () => adminData?.neighborhoods ?? [],
    [adminData?.neighborhoods]
  );
  const [orderType, setOrderType] = useState<OrderType>("delivery");

  const nameRef = useRef<any>(null);
  const phoneRef = useRef<any>(null);
  const addressRef = useRef<any>(null);
  const neighborhoodRef = useRef<any>(null);

  const handleName = () => {
    setCustomerInfo({
      ...customerInfo,
      name: nameRef.current.value,
    });
  };

  const handlePhone = () => {
    //Regex para validar el número de teléfono
    const phoneRegex = /^[0-9]{0,11}$/;
    if (!phoneRegex.test(phoneRef.current.value)) {
      return;
    }
    setCustomerInfo({
      ...customerInfo,
      phone: phoneRef.current.value,
    });
  };

  const handleAddress = () => {
    setCustomerInfo({
      ...customerInfo,
      address: addressRef.current.value,
    });
  };

  const handleNeighborhood = () => {
    const neighborhoodSelected = neighborhoods?.find(
      (neighborhood: Neighborhood) =>
        neighborhood.name === neighborhoodRef.current.value
    );
    setCustomerInfo({
      ...customerInfo,
      neighborhood: neighborhoodSelected,
    });
  };

  // useEffect(() => {
  //   const storedUID = localStorage.getItem("firebaseUID");

  //   if (storedUID) {
  //     // If UID exists in local storage, fetch the user using the UID
  //     signInWithCustomToken(auth, storedUID)
  //       .then(() => {
  //         // User signed in successfully
  //         toast.success("Sesión iniciada correctamente");
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } else {
  //     // If no UID, sign in anonymously
  //     signInAnonymously(auth)
  //       .then((result) => {
  //         // Store the UID in local storage
  //         localStorage.setItem("firebaseUID", result.user.uid);
  //         setCustomerInfo({
  //           ...customerInfo,
  //           uid: result.user.uid,
  //         });
  //         toast.success("Sesión iniciada correctamente por primera vez");
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }

  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setCustomerInfo({
  //         ...customerInfo,
  //         uid: user.uid,
  //       });
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  useEffect(() => {
    setOrder({
      ...order,
      customer: customerInfo,
      orderType,
      delivertyPrice:
        orderType === "delivery" ? customerInfo.neighborhood?.price : 0,
    });
  }, [orderType, customerInfo]);

  useEffect(() => {
    window.localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
  }, [customerInfo]);

  return (
    <form className="mt-6">
      <h2 className="text-2xl font-bold">Información de contacto</h2>
      <div className="flex justify-around">
        <div
          className="cursor-pointer"
          onClick={() => setOrderType("delivery")}
        >
          Delivery
        </div>
        <div className="cursor-pointer" onClick={() => setOrderType("pickup")}>
          Pickup
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="name" className="text-left">
          Nombre
        </label>
        <input
          ref={nameRef}
          type="text"
          id="name"
          name="name"
          value={customerInfo.name}
          onChange={handleName}
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="phone" className="text-left">
          Teléfono
        </label>
        <input
          ref={phoneRef}
          type="text"
          id="phone"
          name="phone"
          value={customerInfo.phone}
          onChange={handlePhone}
          className="p-2 border border-gray-300 rounded-lg"
        />
      </div>
      {orderType === "delivery" && (
        <>
          <div className="flex flex-col">
            <label htmlFor="address" className="text-left">
              Dirección
            </label>
            <input
              ref={addressRef}
              type="text"
              id="address"
              name="address"
              value={customerInfo.address ?? ""}
              onChange={handleAddress}
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="neighborhood" className="text-left">
              Barrio
            </label>
            <select
              ref={neighborhoodRef}
              name="neighborhood"
              id="neighborhood"
              value={customerInfo.neighborhood?.name}
              onChange={handleNeighborhood}
              className="p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Seleccione un barrio</option>
              {neighborhoods?.map((neighborhood) => (
                <option key={neighborhood.name} value={neighborhood.name}>
                  {neighborhood.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </form>
  );
}

export default InfoForm;
