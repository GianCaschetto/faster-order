import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { toast } from "react-toastify";

const GarbagePage = () => {
  const { adminData } = useAdmin();
  const garbage = adminData?.garbage ?? {
    products: [],
    extras: [],
    neighborhoods: [],
  };

  const [selectedTable, setSelectedTable] = useState("neighborhoods");

  const handleRestore = async (type, item) => {
    const updatedGarbage = { ...garbage };

    if (type === "neighborhoods") {
      updatedGarbage.neighborhoods = updatedGarbage.neighborhoods.filter(
        (neighborhood) => neighborhood.id !== item.id
      );
      const updatedNeighborhoods = [...(adminData?.neighborhoods || []), item];
      await setDoc(
        doc(db, "admin", "data"),
        { neighborhoods: updatedNeighborhoods, garbage: updatedGarbage },
        { merge: true }
      );
      toast.success("Zona recuperada correctamente");
    } else if (type === "products") {
      updatedGarbage.products = updatedGarbage.products.filter(
        (product) => product.id !== item.id
      );
      const updatedProducts = [...(adminData?.products || []), item];
      await setDoc(
        doc(db, "admin", "data"),
        { products: updatedProducts, garbage: updatedGarbage },
        { merge: true }
      );
      toast.success("Producto recuperado correctamente");
    } else if (type === "extras") {
      updatedGarbage.extras = updatedGarbage.extras.filter(
        (extraGroup) => extraGroup.id !== item.id
      );
      const updatedExtras = [...(adminData?.extras || []), item];
      await setDoc(
        doc(db, "admin", "data"),
        { extras: updatedExtras, garbage: updatedGarbage },
        { merge: true }
      );
      toast.success("Extra recuperado correctamente");
    }
  };

  const renderTable = () => {
    switch (selectedTable) {
      case "neighborhoods":
        return (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Zonas Eliminadas
            </h3>
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th>Zona</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {garbage.neighborhoods?.length > 0 ? (
                  garbage.neighborhoods.map((neighborhood, index) => (
                    <tr key={index}>
                      <td className="p-3 border">{neighborhood.name}</td>
                      <td className="p-3 border">${neighborhood.price}</td>
                      <td className="p-3 border">
                        <button
                          onClick={() =>
                            handleRestore("neighborhoods", neighborhood)
                          }
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Recuperar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 border" colSpan={3}>
                      No hay zonas eliminadas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case "products":
        return (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Productos Eliminados
            </h3>
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {garbage.products?.length > 0 ? (
                  garbage.products.map((product, index) => (
                    <tr key={index}>
                      <td className="p-3 border">{product.name}</td>
                      <td className="p-3 border">${product.price}</td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleRestore("products", product)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Recuperar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 border" colSpan={3}>
                      No hay productos eliminados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      case "extras":
        return (
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Extras Eliminados
            </h3>
            <table className="w-full text-center">
              <thead>
                <tr className="bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th>Extra</th>
                  <th>Disponible</th>
                  <th>Contenido</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {garbage.extras?.length > 0 ? (
                  garbage.extras.map((extraGroup, groupIndex) => (
                    <tr key={groupIndex}>
                      <td className="p-3 border">{extraGroup.title}</td>
                      <td className="p-3 border">
                        {extraGroup.available ? "Sí" : "No"}
                      </td>
                      <td className="p-3 border">
                        {extraGroup.items.map((extra, index) => (
                          <div key={index}>
                            {extra.name} - {extra.price}
                          </div>
                        ))}
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleRestore("extras", extraGroup)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Recuperar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 border" colSpan={4}>
                      No hay extras eliminados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-2/3 mt-4 mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
        Papelera de Reciclaje
      </h2>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setSelectedTable("neighborhoods")}
          className={`${
            selectedTable === "neighborhoods"
              ? "bg-blue-600"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
        >
          Zonas
        </button>
        <button
          onClick={() => setSelectedTable("products")}
          className={`${
            selectedTable === "products"
              ? "bg-blue-600"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
        >
          Productos
        </button>
        <button
          onClick={() => setSelectedTable("extras")}
          className={`${
            selectedTable === "extras"
              ? "bg-blue-600"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
        >
          Extras
        </button>
      </div>

      {renderTable()}
    </div>
  );
};

export default GarbagePage;
