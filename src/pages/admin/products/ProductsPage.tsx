import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useImageUrl } from "@/hooks/useImage";

const ProductRow = ({ product, adminData, removeProduct, navigate }) => {
  const { imageUrl } = useImageUrl(product.image);

  return (
    <tr className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
          Imagen
        </span>
        <img src={imageUrl} alt="product" className="h-20 w-20 object-cover mx-auto" />
      </td>
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
          Nombre
        </span>
        {product.name}
      </td>
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
          Precio
        </span>
        {product.price}
      </td>
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
          Categoría
        </span>
        {
          adminData?.categories?.find(
            (cat) => cat.id === product.categoryId
          )?.name
        }
      </td>
      <td className="w-full lg:w-auto p-3 text-gray-800 text-center border border-b text-center block lg:table-cell relative lg:static">
        <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
          Acciones
        </span>
        <button
          onClick={() => navigate(`/admin-panel/products/edit-product/${product.id}`)}
          className="text-blue-400 hover:text-blue-600 underline"
        >
          Editar
        </button>
        <button className="text-blue-400 hover:text-blue-600 underline pl-6" onClick={()=> removeProduct(product.id)}>
          Eliminar
        </button>
      </td>
    </tr>
  );
}

function ProductsPage() {
  const navigate = useNavigate();
  const { adminData } = useAdmin();
  const products = adminData?.products;
  
  const [sortedProducts, setSortedProducts] = useState(products || []);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortProducts = (column: string) => {
    const sorted = [...(products || [])];
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortDirection("asc");
    }
    setSortColumn(column);

    sorted.sort((a, b) => {
      const aValue = column === "category" ? adminData?.categories?.find(cat => cat.id === a.categoryId)?.name : a[column];
      const bValue = column === "category" ? adminData?.categories?.find(cat => cat.id === b.categoryId)?.name : b[column];
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setSortedProducts(sorted);
  }

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
    setSortedProducts(products || []);
  }, [products]);

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
            <th 
              className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell cursor-pointer"
              onClick={() => sortProducts("name")}
            >
              Nombre {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")} 
            </th>
            <th 
              className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell cursor-pointer"
              onClick={() => sortProducts("price")}
            >
              Precio {sortColumn === "price" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th 
              className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell cursor-pointer"
              onClick={() => sortProducts("category")}
            >
              Categoría {sortColumn === "category" && (sortDirection === "asc" ? "▲" : "▼")}
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              adminData={adminData}
              removeProduct={removeProduct}
              navigate={navigate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
