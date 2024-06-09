import Button from "@/components/Button";
import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { Neighborhood } from "@/types/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const NeighborhoodsPage = () => {
  const { adminData } = useAdmin();
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([
    {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
    },
  ]);
  const addRow = () => {
    const newRow: Neighborhood = {
      id: crypto.randomUUID(),
      name: "",
      price: 0,
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

  const handleDelete = (id: string) => {
    if (neighborhoods.length === 1) {
      toast.error("Debe haber al menos una zona");
      return;
    }
    const updatedRows = neighborhoods.filter(
      (neighborhood) => neighborhood.id !== id
    );
    setNeighborhoods(updatedRows);
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
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {neighborhoods.map((neighborhood, index) => (
            <tr key={neighborhood.id}>
              <td>
                <input
                  id={`name-${index}`}
                  type="text"
                  className="text-white"
                  defaultValue={neighborhood.name}
                  onChange={(e) => handleChange(e, index, "name")}
                  onKeyDown={(e) => handleEnterKey(e, index, "name")}
                />
              </td>
              <td>
                <input
                  id={`price-${index}`}
                  type="number"
                  className="text-white"
                  min={0}
                  defaultValue={neighborhood.price}
                  onChange={(e) => handleChange(e, index, "price")}
                  onKeyDown={(e) => handleEnterKey(e, index, "price")}
                />
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => handleDelete(neighborhood.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <button onClick={addRow}>Agregar fila</button>
      </table>

      <button
        onClick={handleSave}
        className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-green-500 text-lg font-bold text-white"
      >
        Guardar datos
        <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
      </button>
    </div>
  );
};

export default NeighborhoodsPage;
