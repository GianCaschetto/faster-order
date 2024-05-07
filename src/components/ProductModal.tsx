import { useState } from "react";
import { Extra, Extras, Product } from "@/types/types";
import Counter from "./Counter";
import { X } from "lucide-react";

const extras: Extras[] = [
  {
    id: "1",
    available: true,
    title: "Extras",
    items: [
      {
        id: "1",
        name: "Carne",
        available: true,
        price: 2,
        qty: 2,
      },
      {
        id: "2",
        name: "Queso",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "3",
        name: "Tocineta",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "4",
        name: "Cebolla",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "5",
        name: "BBQ",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "6",
        name: "Salsa de la casa",
        available: true,
        price: 1,
        qty: 1,
      },
    ],
  },
  {
    id: "2",
    available: true,
    title: "Extras dulces",
    items: [
      {
        id: "7",
        name: "Chocolate",
        available: true,
        price: 2,
        qty: 2,
      },
      {
        id: "8",
        name: "Fresas",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "9",
        name: "Crema",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "10",
        name: "Caramelo",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "11",
        name: "Nutella",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "12",
        name: "Mermelada",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "13",
        name: "Leche condensada",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "14",
        name: "Galletas",
        available: true,
        price: 1,
        qty: 1,
      },
    ],
  },
];

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
  const productExtras = extras.filter((extra) =>
    product.extras?.includes(extra.id)
  );
  // Estado para rastrear los extras seleccionados y su cantidad
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [counter, setCounter] = useState<number>(1);
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
          className="max-w-64 h-auto object-cover rounded-lg mx-auto"
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
              addToCart(product, selectedExtras, counter);
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
