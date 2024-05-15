import { useAdmin } from "@/contexts/AdminContext";
import { Order, OrderStatus } from "@/types/types";
import { useEffect, useState } from "react";
import * as echarts from 'echarts';

function AdminPanel() {
  const [totalSells, setTotalSells] = useState<number>(0.00);
  const [completedOrders, setCompletedOrders] = useState<Order[] | null>(null);
  const {orders} = useAdmin();


  useEffect(()=> {
    if(completedOrders){
      const total = completedOrders.reduce((acc, order) => acc + order.subtotal, 0)
      setTotalSells(total)
    }
  }, [completedOrders])

  useEffect(() => {
    if(orders){
      const completedOrders = orders.filter(order => order.status === OrderStatus.finalizado)
      setCompletedOrders(completedOrders)
    }
  }, [orders])

  return (
    <div className="text-gray-900 h-screen w-full">
      <h1 className="text-3xl font-semibold">Admin Panel</h1>
      <div className="flex">
        <div className="border py-2 px-4 text-center">
          <h2 className="text-2xl font-semibold">Ventas totales</h2>
          <p className="text-lg"> $ {totalSells}</p>
        </div>
        <div className="border py-2 px-4 text-center">
          <h2 className="text-2xl font-semibold">Pedidos totales</h2>
          <p className="text-lg"> {orders?.length}</p>
        </div>
        <div className="border py-2 px-4 text-center">
          <h2 className="text-2xl font-semibold">Pedidos completados</h2>
          <p className="text-lg"> {completedOrders?.length}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
