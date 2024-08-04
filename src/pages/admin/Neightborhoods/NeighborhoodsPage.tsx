import ConfirmationModal from "@/components/ConfirmationModal";
import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { Neighborhood, Garbage } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const NeighborhoodsPage = () => {
  const { adminData } = useAdmin();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
      active: true,
    },
  ]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [neighborhoodToDelete, setNeighborhoodToDelete] = useState<Neighborhood | null>(null);

  const addRow = () => {
    const newRow: Neighborhood = {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
      active: true,
    };
    setNeighborhoods([...neighborhoods, newRow]);
  };

  const handleChange = (e, rowIndex, fieldName) => {
    const updatedRows = [...neighborhoods];
    if (fieldName === "name") {
      updatedRows[rowIndex][fieldName] = e.target.value;
    } else {
      updatedRows[rowIndex][fieldName] = parseFloat(e.target.value);
    }

    setNeighborhoods(updatedRows);
  };

  const handleDelete = (neighborhood: Neighborhood) => {
    setShowConfirmationModal(true);
    setNeighborhoodToDelete(neighborhood);
  };

  const confirmDelete = () => {
    if (neighborhoods.length === 1) {
      toast.error("Debe haber al menos una zona");
      setShowConfirmationModal(false);
      return;
    }

    const updatedRows = neighborhoods.filter(
      (neighborhood) => neighborhood.id !== neighborhoodToDelete?.id
    );

    const updatedGarbage: Garbage = {
      ...adminData?.garbage,
      neighborhoods: [
        ...(adminData?.garbage?.neighborhoods ?? []),
        neighborhoodToDelete!,
      ],
      products: adminData?.garbage?.products ?? [],
      extras: adminData?.garbage?.extras ?? [],
    };

    setNeighborhoods(updatedRows);
    saveAdminData({ ...adminData, neighborhoods: updatedRows, garbage: updatedGarbage });
    setShowConfirmationModal(false);
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
    setNeighborhoodToDelete(null);
  };

  const handleEnterKey = (e, index, fieldName) => {
    if (e.key === "Enter") {
      if (fieldName === "name") {
        document.getElementById(`price-${index}`)?.focus();
      } else {
        const nextIndex = index + 1;
        const nextInput = document.getElementById(`name-${nextIndex}`);
        if (nextInput) {
          nextInput.focus();
        } else {
          addRow();
        }
      }
    }
  };

  const handleSave = () => {
    if (neighborhoods.length === 0) {
      toast.error("No puedes guardar sin datos");
      return;
    }
    if (!neighborhoods.every((neighborhood) => neighborhood.name !== "")) {
      toast.error("No puedes guardar una zona sin nombre");
      return;
    }
    if (!neighborhoods.every((neighborhood) => neighborhood.price >= 0)) {
      toast.error("Precio no válido");
      return;
    }

    saveAdminData({ ...adminData, neighborhoods });
  };

  useEffect(() => {
    if (adminData?.neighborhoods) {
      setNeighborhoods(adminData.neighborhoods);
    }
  }, [adminData?.neighborhoods]);

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 w-2/3 mt-4 mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
        Zonas de entrega
      </h2>
      <table className="mx-auto w-2/3">
        <thead>
          <tr className="bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th>Zona</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          {neighborhoods.map((neighborhood, index) => (
            <tr key={neighborhood.id}>
              <td>
                <input
                  id={`name-${index}`}
                  type="text"
                  className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  defaultValue={neighborhood.name}
                  onChange={(e) => handleChange(e, index, "name")}
                  onKeyDown={(e) => handleEnterKey(e, index, "name")}
                />
              </td>
              <td>
                <input
                  id={`price-${index}`}
                  type="number"
                  className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                  min={0}
                  defaultValue={neighborhood.price}
                  onChange={(e) => handleChange(e, index, "price")}
                  onKeyDown={(e) => handleEnterKey(e, index, "price")}
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => handleDelete(neighborhood)}
                  className=" hover:bg-red-200 rounded-full cursor-pointer text-red-700"
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
          <tr className="text-center">
            <td>
              <button
                onClick={handleSave}
                className="group relative mt-4 h-12 w-48 overflow-hidden rounded-2xl bg-slate-600 text-lg font-bold text-white"
              >
                Guardar datos
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>
            </td>
            <td>
              <button
                className="group relative mt-4 h-12 w-48 overflow-hidden rounded-2xl bg-green-400 text-lg font-bold text-white"
                onClick={addRow}
              >
                Agregar Fila
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-green-200/30"></div>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          text="¿Estás seguro de que quieres eliminar esta zona? Si eliminas esta zona, puedes recuperarla en el apartado de papelera de reciclaje."
        />
      )}
    </div>
  );
};

export default NeighborhoodsPage;
