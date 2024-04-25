import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProductsPage() {
  const navigate = useNavigate();
  const { adminData } = useAdmin();
  const products = adminData?.products;

  const removeProduct = (id: string) => {
    const adminDataRef = doc(db, "admin", "data");
    setDoc(adminDataRef, {
      products: adminData?.products?.filter((product) => product.id !== id),
    }, { merge: true })
      .then(() => {
        toast.success("Producto eliminado correctamente");
      })
      .catch((error) => {
        toast.error("Error al eliminar el producto");
        console.error(error);
      });
  }
  

  useEffect(() => {
    if (adminData?.categories?.length === 0) {
      toast.error("Primero debes agregar una categoría para tus productos");
      navigate("/admin-panel/company");
    }
  }, [adminData, navigate]);
  return (
    <div className="p-4">
      {/* Agregar producto boton */}
      <div className="flex justify-end py-2">
        <button
          onClick={() => navigate("/admin-panel/products/new-product")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar producto
        </button>
      </div>
      {/* Products Table */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Imagen
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Nombre
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Precio
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Categoría
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Company name
                </span>
                <img
                  src={product.image}
                  alt="product"
                  className="h-20 w-20 object-cover mx-auto"
                />
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Country
                </span>
                {product.name}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Status
                </span>
                {product.price}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Status
                </span>
                {
                  adminData?.categories?.find(
                    (cat) => cat.id === product.categoryId
                  )?.name
                }
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Actions
                </span>
                <button
                  onClick={() => navigate(`/admin-panel/products/edit-product/${product.id}`)}
                  className="text-blue-400 hover:text-blue-600 underline"
                >
                  Edit
                </button>
                <button className="text-blue-400 hover:text-blue-600 underline pl-6" onClick={()=> removeProduct(product.id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
