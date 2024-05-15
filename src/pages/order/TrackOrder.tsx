// import { Order } from '@/types/types'

import { useAdmin } from "@/contexts/AdminContext";
import { Order } from "@/types/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

// type TrackOrderType = {
//     order: Order;
// }

function TrackOrder() {
    const [orderSelected, setOrderSelected] = useState<Order | null>(null);
    const {orderNumberParam} = useParams();
    const {orders} = useAdmin();
        console.log(orderNumberParam);

    useEffect(() => {
        if(orders){
            const orderToSearch = orders.find(order => order.orderNumber?.toString() === orderNumberParam);
            setOrderSelected(orderToSearch as Order);
        }
    }, [orders, orderNumberParam])



  return (
    <div>
        Este es el estado de tu orden: {orderSelected?.status}
    </div>
  )
}

export default TrackOrder