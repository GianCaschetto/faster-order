import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { NavLink } from "react-router-dom";

function OrdersHistoryPage() {
  const { orders } = useAdmin();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; 
  // const removeOrder = (id: string) => {
  //   const orderRef = doc(db, "orders", id);
  //   deleteDoc(orderRef)
  //     .then(() => {
  //       toast.success("Orden eliminada correctamente");
  //     })
  //     .catch((error) => {
  //       toast.error("Error al eliminar la orden");
  //       console.error(error);
  //     });
  // };

  // Calcular los índices de los elementos de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders?.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil((orders?.length || 0) / itemsPerPage);

  return (
    <div className="p-4">
      {/* Orders Table */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Nombre
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Precio
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Fecha
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Status
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Número de orden
            </th>
          
          </tr>
        </thead>
        <tbody>
          {currentOrders?.map((order) => (
            <tr
              key={order.orderNumber}
              className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0"
            >
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Nombre
                </span>
                {order.customer.name}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Precio
                </span>
                {order.total}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Fecha
                </span>
                {order.createdAt.toDate().toLocaleDateString()}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Status
                </span>
                {order.status}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                <NavLink
                  target="_blank"
                  className="underline text-blue-400 hover:text-blue-600"
                  to={`/order/${order.orderNumber}`}
                >
                  <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase ">
                    Número de orden
                  </span>
                  {order.orderNumber}
                </NavLink>
              </td>

         
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="px-4 py-2 mx-1">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default OrdersHistoryPage;
