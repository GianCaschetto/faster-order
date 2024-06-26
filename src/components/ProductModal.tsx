import { useMemo, useState } from "react";
import { Extra, Product } from "@/types/types";
import Counter from "./Counter";
import { X } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

type ProductModalProps = {
  product: Product;
  addToCart: (product: Product, extras: Extra[], counter: number) => void;
  toggleShowModal: () => void;
};

function ProductModal({
  product,
  addToCart,
  toggleShowModal,
}: ProductModalProps) {
  const { adminData } = useAdmin();
  const productExtras = useMemo(
    () => adminData?.extras || [],
    [adminData?.extras]
  );
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [counter, setCounter] = useState<number>(1);

  // Manejar cambios en la cantidad de extras
  const handleExtraQuantityChange = (id: string, quantity: number) => {
    const updatedSelectedExtras = selectedExtras.map((extra) =>
      extra.id === id ? { ...extra, qty: quantity } : extra
    );
    setSelectedExtras(updatedSelectedExtras);
  };

  // Manejar la selección de extras
  const handleExtraSelection = (item: Extra) => {
    if (selectedExtras.some((extra) => extra.id === item.id)) {
      setSelectedExtras(selectedExtras.filter((extra) => extra.id !== item.id));
    } else {
      setSelectedExtras([...selectedExtras, { ...item, qty: 1 }]);
    }
  };

  return (
    <div className="z-10 fixed h-screen top-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center py-6">
      <div
        style={{
          backgroundColor: adminData?.colors?.primary,
        }}
        className="dark:bg-white dark:text-black bg-slate-900 text-white p-4 flex flex-col lg:w-1/3 w-3/4 h-full relative rounded-xl"
      >
        <div className="flex justify-between items-center w-full">
          <button onClick={toggleShowModal}>
            <X />
          </button>
        </div>
        <img
          src={product.image}
          alt={product.name}
          className="max-w-64 h-auto object-cover rounded-lg mx-auto"
        />
        <h2 className="text-2xl font-bold text-start my-2">{product.name}</h2>
        <p className="text-sm text-start">{product.description}</p>
        <div className="flex flex-col flex-grow overflow-hidden">
          <div className="overflow-y-auto">
            {productExtras.map((extra) => (
              <div key={extra.id} className="my-4">
                <h3 className="text-lg font-bold">{extra.title}</h3>
                {extra.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mt-1">
                    <p>{item.name}</p>
                    {selectedExtras.some((extra) => extra.id === item.id) && (
                      <select
                        onChange={(e) =>
                          handleExtraQuantityChange(item.id, Number(e.target.value))
                        }
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </select>
                    )}
                    <input
                      type="checkbox"
                      checked={selectedExtras.some((extra) => extra.id === item.id)}
                      onChange={() => handleExtraSelection(item)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex sm:flex-row flex-col justify-center items-center p-8">
          <div className="w-full md:w-1/3">
            <Counter setCounter={setCounter} counter={counter} />
          </div>
          <button
            onClick={() => {
              addToCart(product, selectedExtras, counter);
              toggleShowModal();
            }}
            className="md:ml-4 bg-blue-600 text-white p-2 rounded-lg mt-2 w-full hover:bg-blue-800"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
