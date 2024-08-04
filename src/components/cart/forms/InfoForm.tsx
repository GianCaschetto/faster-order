import { useAdmin } from "@/contexts/AdminContext";
import {
  CustomerInfo,
  Neighborhood,
  Order,
  OrderType,
  ShoppingCart,
} from "@/types/types";
import { useEffect, useMemo, useRef, useState } from "react";

type InfoFormProps = {
  cart: ShoppingCart;
  order: Order;
  setOrder: (order: Order) => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: (customerInfo: CustomerInfo) => void;
};

function InfoForm({
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

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const neighborhoodRef = useRef<HTMLSelectElement>(null);

  const handleName = () => {
    setCustomerInfo({
      ...customerInfo,
      name: nameRef.current?.value ?? "",
    });
  };

  const handlePhone = () => {
    const phoneRegex = /^[0-9]{0,10}$/;
    if (!phoneRegex.test(phoneRef.current?.value ?? "")) {
      return;
    }
    setCustomerInfo({
      ...customerInfo,
      phone: phoneRef.current?.value ?? "",
    });
  };

  const handleAddress = () => {
    setCustomerInfo({
      ...customerInfo,
      address: addressRef.current?.value ?? "",
    });
  };

  const handleNeighborhood = () => {
    const neighborhoodSelected = neighborhoods?.find(
      (neighborhood: Neighborhood) =>
        neighborhood.name === neighborhoodRef.current?.value
    );
    setCustomerInfo({
      ...customerInfo,
      neighborhood: neighborhoodSelected,
    });
  };

  useEffect(() => {
    setOrder({
      ...order,
      customer: customerInfo,
      orderType,
      delivertyPrice:
        orderType === "delivery" ? customerInfo.neighborhood?.price ?? 0 : 0,
    });
  }, [orderType, customerInfo, setOrder]);

  useEffect(() => {
    window.localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
  }, [customerInfo]);

  return (
    <form className="mt-6 px-6">
      <h2 className="text-2xl font-bold text-black">Información de contacto</h2>
      <div className="flex justify-around gap-6 text-black my-4">
        <div
          className="flex justify-center items-center group cursor-pointer relative h-12 w-32 overflow-hidden rounded-2xl bg-slate-600 text-lg font-bold text-white"
          onClick={() => setOrderType("delivery")}
        >
          Delivery
          <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
        </div>
        <div
          onClick={() => setOrderType("pickup")}
          className="flex justify-center items-center group cursor-pointer relative h-12 w-32 overflow-hidden rounded-2xl bg-slate-600 text-lg font-bold text-white"
        >
          Pickup
          <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="name" className="text-left text-black mt-1">
          Nombre
        </label>
        <input
          ref={nameRef}
          type="text"
          id="name"
          name="name"
          value={customerInfo.name}
          onChange={handleName}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="phone" className="text-left text-black mt-1">
          Teléfono
        </label>
        <input
          ref={phoneRef}
          type="text"
          id="phone"
          name="phone"
          placeholder="Ej: 4121234567"
          value={customerInfo.phone}
          onChange={handlePhone}
          className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
      </div>
      {orderType === "delivery" && (
        <>
          <div className="flex flex-col">
            <label htmlFor="address" className="text-left text-black mt-1">
              Dirección
            </label>
            <input
              ref={addressRef}
              type="text"
              id="address"
              name="address"
              value={customerInfo.address ?? ""}
              onChange={handleAddress}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div className="flex flex-col text-black mt-1">
            <label htmlFor="neighborhood" className="text-left">
              Zona
            </label>
            <select
              ref={neighborhoodRef}
              name="neighborhood"
              id="neighborhood"
              value={customerInfo.neighborhood?.name}
              onChange={handleNeighborhood}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            >
              <option value="">Seleccione una zona</option>
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
