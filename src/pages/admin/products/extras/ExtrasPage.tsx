import React, { useMemo, useState } from 'react';
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "@/components/ConfirmationModal";
import { Extras } from "@/types/types";

const ExtrasPage: React.FC = () => {
  const navigate = useNavigate();
  const { adminData } = useAdmin();
  const extras = useMemo(() => adminData?.extras || [], [adminData?.extras]);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [extraToDelete, setExtraToDelete] = useState<Extras | null>(null);

  const handleDeleteClick = (extra: Extras) => {
    setExtraToDelete(extra);
    setShowConfirmationModal(true);
  };

  const confirmDelete = () => {
    if (!extraToDelete) return;

    const updatedExtras = extras.filter((extra) => extra.id !== extraToDelete.id);
    const updatedGarbage = {
      ...adminData?.garbage,
      extras: [...(adminData?.garbage?.extras || []), extraToDelete]
    };

    const adminDataRef = doc(db, "admin", "data");
    setDoc(adminDataRef, {
      extras: updatedExtras,
      garbage: updatedGarbage,
    }, { merge: true })
      .then(() => {
        toast.success("Extra eliminado correctamente");
        setShowConfirmationModal(false);
        setExtraToDelete(null);
      })
      .catch((error) => {
        toast.error("Error al eliminar el extra");
        console.error(error);
      });
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
    setExtraToDelete(null);
  };

  return (
    <div className="p-4">
      {/* Agregar Extra botón */}
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
              <td className="w-full lg:w-auto p-3 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Título
                </span>
                {extra.title}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
                <span className="lg:hidden absolute top-0 left-0 bg-blue-200 px-2 py-1 text-xs font-bold uppercase">
                  Disponible
                </span>
                {extra.available ? "Sí" : "No"}
              </td>
              <td className="w-full lg:w-auto p-3 text-gray-800 border border-b text-center block lg:table-cell relative lg:static">
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
                  onClick={() => handleDeleteClick(extra)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          text="¿Estás seguro de que deseas eliminar este extra? Esta acción no se puede deshacer."
        />
      )}
    </div>
  );
};

export default ExtrasPage;
