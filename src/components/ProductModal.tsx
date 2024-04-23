import { useState } from "react";
import { Extra, Product } from "@/types/types";
import Counter from "./Counter";
import React from "react";
import { X } from "lucide-react";
import { extras } from "@/mock/data";

type ProductModalProps = {
  counter: number;
  product: Product;
  addToCart: (product: Product, extras: Extra[]) => void;
  setCounter: React.Dispatch<React.SetStateAction<number>>;
  toggleShowModal: () => void;
};

function ProductModal({
  counter,
  product,
  addToCart,
  setCounter,
  toggleShowModal,
}: ProductModalProps) {
  const productExtras = extras.filter((extra) =>
    product.extras?.includes(extra.id)
  );
  // Estado para rastrear los extras seleccionados y su cantidad
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

  // Manejar cambios en la cantidad de extras
  const handleExtraQuantityChange = (id: string, quantity: number) => {
    const updatedSelectedExtras = selectedExtras.map((extra) =>
      extra.id === id ? { ...extra, qty: quantity } : extra
    );
    setSelectedExtras(updatedSelectedExtras);
  };

  return (
    <div className="z-10 fixed h-screen top-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center py-6">
      <div className=" dark:bg-white dark:text-black bg-slate-900 text-white p-4 flex flex-col lg:w-1/3 w-3/4 h-full relative rounded-xl">
        <div className="flex justify-between items-center w-full">
          <button onClick={toggleShowModal}>
            <X />
          </button>
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-lg"
        />
        <h2 className="text-2xl font-bold text-start my-2">{product.name}</h2>
        <p className="text-sm text-start">{product.description}</p>
        {productExtras.map((extra) => (
          <div key={extra.id} className="my-4 overflow-y-auto">
            <h3 className="text-lg font-bold">{extra.title}</h3>
            {extra.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center mt-1"
              >
                <p>{item.name}</p>
                {/* Input para la cantidad del extra (se muestra solo si el checkbox está seleccionado) */}
                {selectedExtras.some((extra) => extra.id === item.id) && (
                  //TODO: cambiar a un select con options del 1 al 5
                 <select onChange={(e) => handleExtraQuantityChange(item.id, Number(e.target.value))}>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                )}
                {/* Checkbox para seleccionar el extra */}
                <input
                  type="checkbox"
                  checked={selectedExtras.some((extra) => extra.id === item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedExtras([
                        ...selectedExtras,
                        {
                          id: item.id,
                          qty: 1,
                          name: item.name,
                          price: item.price,
                          available: item.available,
                        },
                      ]);
                    } else {
                      setSelectedExtras(
                        selectedExtras.filter((extra) => extra.id !== item.id)
                      );
                    }
                  }}
                />
              </div>
            ))}
          </div>
        ))}
        <div className="flex sm:flex-row flex-col justify-center items-center absolute bottom-0 left-0 right-0 p-8">
          <div className="w-full md:w-1/3">
            <Counter setCounter={setCounter} counter={counter} />
          </div>
          <button
            onClick={() => {
              addToCart(product, selectedExtras);
              toggleShowModal();
            }}
            className="md:ml-4 bg-blue-600 text-white p-2 rounded-lg mt-2 w-full hover:bg-blue-800"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
