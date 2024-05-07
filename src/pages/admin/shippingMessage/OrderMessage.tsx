import { OrderType } from "@/types/types"
import { useState } from "react"

const tokens = {
  
}

function OrderMessage() {
  const [orderTypeMessage, setOrderTypeMessage] = useState<OrderType>("delivery");
  return (
    <section>
      <div className="flex items-center">
      <h1>Order Message</h1>
      <select
        value={orderTypeMessage}
        onChange={(e) => setOrderTypeMessage(e.target.value as OrderType)}
        className="text-white p-2"
      >
        <option value="delivery">Delivery</option>
        <option value="pickup">Pickup</option>
      </select>
      </div>
      <div>
      <span>Tokens disponibles:</span>
      <p><span className="bg-gray-200">{"{order-id}"}</span> - Número de Orden</p>
      </div>
      
    </section>
  )
}

export default OrderMessage