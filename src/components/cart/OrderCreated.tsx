import React from 'react'

function OrderCreated({order}) {
  return (
    <div className='text-start'>
        {/* Show the order */}
        <h1>Orden creada</h1>
        <p>Orden: {order.id}</p>
        <p>Cliente: {order.customer.name}</p>
        <p>Telefono: {order.customer.phone}</p>
        <p>Dirección: {order.customer.address}</p>
        <p>Barrio: {order.customer.neighborhood?.name}</p>
        <p>Estado: {order.status}</p>
        <p>Metodo de pago: {order.paymentMethod}</p>
        <p>Fecha: {order.createdAt}</p>
        <p>Tipo de orden: {order.orderType}</p>
        <p>Subtotal: {order.subtotal}</p>
        <p>Gastos de envío: {order.delivertyPrice}</p>
        <p>Total: {order.subtotal + (order.delivertyPrice ?? 0)}</p>


    </div>
  )
}

export default OrderCreated