import { useAdmin } from "@/contexts/AdminContext";
import { Order, OrderStatus } from "@/types/types";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const status = Object.values(OrderStatus).filter((status) =>
  isNaN(Number(status))
);

function OrdersHistoryEdit() {
  const [orderSelected, setOrderSelected] = useState<Order | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { orders } = useAdmin();
  console.log(orderSelected);
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log(data);
  };

  useEffect(() => {
    const newOrderSelected = orders?.find((order) => order.id === id);
    setOrderSelected(newOrderSelected as Order);
  }, [id]);

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        <button onClick={() => navigate(-1)}>Atras</button>
        <form onSubmit={handleEdit}>
          <div className="-mx-3 flex flex-wrap">
            <div id="datosPedido" className="flex flex-col">
              <div className="flex flex-col">
                <label htmlFor="">Estado</label>
                <select name="" id="" className="text-white">
                  {status.map((status) => (
                    <option
                      key={status}
                      value={status}
                      selected={status === orderSelected?.status}
                    >
                      {status}
                    </option>
                  ))}
                </select>
                <label htmlFor="">Fecha</label>
                <input
                  type="text"
                  defaultValue={orderSelected?.createdAt}
                  className="text-white"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrdersHistoryEdit;
