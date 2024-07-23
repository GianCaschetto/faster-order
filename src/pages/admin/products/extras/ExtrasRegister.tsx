import React, { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Extras, Extra } from "@/types/types"; // Asegúrate de ajustar la ruta según tu estructura de proyecto

function ExtrasRegister() {
  const navigate = useNavigate();
  const { adminData } = useAdmin();
  const [title, setTitle] = useState("");
  const [available, setAvailable] = useState(true);
  const [items, setItems] = useState<Extra[]>([
    { id: crypto.randomUUID(), name: "", available: true, price: 0, qty: 1, description: "" },
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleItemChange = (index: number, key: keyof Extra, value: any) => {
    setItems((currentItems) =>
      currentItems.map((item, i) => {
        if (i === index) {
          // Si el key es 'available', asegurarse de que el valor sea booleano
          const updatedValue = key === 'available' ? value === true : value;
          return { ...item, [key]: updatedValue };
        }
        return item;
      })
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: crypto.randomUUID(), name: "", available: true, price: 0, qty: 1, description: "" },
    ]);
  };

  const removeItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newExtra: Extras = {
      id: crypto.randomUUID(),
      title,
      available,
      items,
    };

    const adminDataRef = doc(db, "admin", "data");
    const updatedExtras = adminData?.extras
      ? [...adminData.extras, newExtra]
      : [newExtra];

    setDoc(adminDataRef, { extras: updatedExtras }, { merge: true })
      .then(() => {
        toast.success("Extra creado correctamente");
        navigate("/admin-panel/products/extras");
      })
      .catch((error) => {
        toast.error("Error al crear el extra");
        console.error(error);
      });
  };

  return (
    <div className="p-4 w-2/3 mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black">Agregar Nuevo Extra</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Disponible
          </label>
          <input
            type="checkbox"
            checked={available}
            onChange={(e) => setAvailable(e.target.checked)}
          />
        </div>
        <h3 className="text-xl font-bold mb-2 text-black">Items</h3>
        {items.map((item, index) => (
          <div key={item.id} className="mb-4 p-4 border rounded">
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={item.name}
                onChange={(e) =>
                  handleItemChange(index, "name", e.target.value)
                }
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Precio
              </label>
              <input
                type="number"
                value={item.price}
                onChange={(e) =>
                  handleItemChange(index, "price", parseFloat(e.target.value))
                }
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Descripción
              </label>
              <textarea
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Disponible
              </label>
              <input
                type="checkbox"
                checked={item.available}
                onChange={(e) =>
                  handleItemChange(index, "available", e.target.checked)
                }
                disabled={!available} // Deshabilitar si el grupo no está disponible
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Eliminar Item
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          Agregar Item
        </button>
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Crear Extra
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExtrasRegister;
