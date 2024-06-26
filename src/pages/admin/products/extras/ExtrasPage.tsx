import React, { useMemo } from 'react';
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const ExtrasPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminData } = useAdmin();
  const extras = useMemo(() => adminData?.extras || [], [adminData?.extras]);

  const removeExtra = (id: string) => {
    const adminDataRef = doc(db, "admin", "data");
    const updatedExtras = extras.filter((extra) => extra.id !== id);
    setDoc(adminDataRef, { extras: updatedExtras }, { merge: true })
      .then(() => {
        toast.success("Extra eliminado correctamente");
      })
      .catch((error) => {
        toast.error("Error al eliminar el extra");
        console.error(error);
      });
  };



  return (
    <div className="p-4">
      {/* Agregar Extra boton */}
      <div className="flex justify-end py-2">
        <button
          onClick={() => navigate("/admin-panel/products/new-extra")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Agregar Extra
        </button>
      </div>
      {/* Extras Table */}
      <table className="border-collapse w-full">
        <thead>
          <tr>
           
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Título
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Disponible
            </th>
            <th className="p-3 font-bold uppercase bg-gray-200 text-gray-600 border border-gray-300 hidden lg:table-cell">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {extras.map((extra) => (
            <tr key={extra.id} className="bg-white lg:hover:bg-gray-100 flex lg:table-row flex-row lg:flex-row flex-wrap lg:flex-no-wrap mb-10 lg:mb-0">
           
              <td className="w-full lg:w-auto p-3 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Título
                </span>
                {extra.title}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Disponible
                </span>
                {extra.available ? "Sí" : "No"}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800  border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Acciones
                </span>
                <button
                  onClick={() => navigate(`/admin-panel/products/edit-extra/${extra.id}`)}
                  className="text-blue-400 hover:text-blue-600 underline"
                >
                  Editar
                </button>
                <button
                  className="text-red-400 hover:text-red-600 underline pl-6"
                  onClick={() => removeExtra(extra.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExtrasPage;
