/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerInfo, Neighborhood, Order, OrderType } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { neighborhoods } from "@/mock/data";

type InfoFormProps = {
  order: Order;
  setOrder: (order: Order) => void;
};

function InfoForm({ order, setOrder }: InfoFormProps) {
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
  });
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>({
    name: "",
    price: 0,
  });

  const nameRef = useRef<any>(null);
  const phoneRef = useRef<any>(null);
  const addressRef = useRef<any>(null);
  const neighborhoodRef = useRef<any>(null);
  

  const handleName = () => {
    setCustomerInfo({
      ...customerInfo,
      name: nameRef.current.value,
    });
  }

  const handlePhone = () => {
    setCustomerInfo({
      ...customerInfo,
      phone: phoneRef.current.value,
    });
  }

  const handleAddress = () => {
    setCustomerInfo({
      ...customerInfo,
      address: addressRef.current.value,
    });
  }

  const handleNeighborhood = () => {
    const neighborhoodSelected = neighborhoods.find((neighborhood: Neighborhood) => neighborhood.name === neighborhoodRef.current.value);
    setNeighborhood(neighborhoodSelected as Neighborhood)
    setCustomerInfo({
      ...customerInfo,
      neighborhood: neighborhoodSelected,
    });
  }

  useEffect(() => {
    setOrder({
      ...order, 
      customer: customerInfo,
      orderType,
      delivertyPrice: neighborhood?.price,
    });
  }, [orderType, customerInfo]);

  return (
    <form action="">
      <section>
        <label>Tipo de orden</label>
        <div className="flex justify-around">
          <div
            className="cursor-pointer"
            onClick={() => setOrderType("delivery")}
          >
            Delivery
          </div>
          <div
            className="cursor-pointer"
            onClick={() => setOrderType("pickup")}
          >
            Pickup
          </div>
        </div>
      </section>
      <section>
        <div>
          {/* Informacion del cliente */}
          <p>Información del cliente</p>
          <div className="flex flex-col">
            <label htmlFor="">Nombre</label>
            <input required type="text" ref={nameRef} onChange={handleName} />
            <label htmlFor="">Teléfono</label>
            <input required type="text" ref={phoneRef} onChange={handlePhone}/>
          </div>
        </div>
        {orderType === "delivery" && (
          <div>
            <p>Información de entrega</p>
            <div className="flex flex-col">
              <label htmlFor="">Dirección</label>
              <input required type="text" ref={addressRef} onChange={handleAddress}/>
              <label htmlFor="">Zona</label>
              <select ref={neighborhoodRef} onChange={handleNeighborhood}>
                <option value="">Selecciona una opción</option>
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood.name} value={neighborhood.name}>
                    {neighborhood.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </section>
    </form>
  );
}

export default InfoForm;
