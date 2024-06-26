import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

function OrdersHistoryPage() {
  //const navigate = useNavigate();
  const { orders } = useAdmin();

  const removeOrder = (id: string) => {
    const adminDataRef = doc(db, "admin", "data");
    setDoc(
      adminDataRef,
      {
        orders: orders?.filter((order) => order.id !== id),
      },
      { merge: true }
    )
      .then(() => {
        toast.success("Orden eliminado correctamente");
      })
      .catch((error) => {
        toast.error("Error al eliminar el orden");
        console.error(error);
      });
  };

  return (
    <div className="p-4">
      {/* Add order button */}
      {/* <div className="flex justify-end py-2">
        <button
          onClick={() => navigate(routes.ordersHistoryRegister)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Orden
        </button>
      </div> */}
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
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
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

              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Acciones
                </span>
                {/* <button
                  onClick={() =>
                    navigate(`/admin-panel/orders-history/edit/${order.id}`)
                  }
                  className="text-blue-400 hover:text-blue-600 underline"
                >
                  Edit
                </button> */}
                <button
                  className="text-red-400 hover:text-red-600"
                  onClick={() => removeOrder(order.id as string)}
                >
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
                    className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 7l16 0" />
                    <path d="M10 11l0 6" />
                    <path d="M14 11l0 6" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrdersHistoryPage;
