import { useMemo, useState, useEffect } from "react";
import { Extra, Product } from "@/types/types";
import Counter from "./Counter";
import { X } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useImageUrl } from "@/hooks/useImage";
import ImageModal from "./ImageModal";

type ProductModalProps = {
  product: Product;
  addToCart: (product: Product, extras: Extra[], counter: number, note: string) => void;
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
  const { imageUrl } = useImageUrl(product.image);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [counter, setCounter] = useState<number>(1);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [note, setNote] = useState<string>("");

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

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      toggleShowModal();
    }
  };

  // Limpiar los extras seleccionados cuando se abre el modal
  useEffect(() => {
    setSelectedExtras([]);
  }, [product]);

  // Filtrar los extras del producto
  const filteredExtras = useMemo(() => {
    if (product.extras) {
      return productExtras
        .map((extraGroup) => ({
          ...extraGroup,
          items: extraGroup.items.filter((item) =>
            product.extras!.includes(item.id)
          ),
        }))
        .filter((extraGroup) => extraGroup.items.length > 0);
    }
    return [];
  }, [product.extras, productExtras]);

  return (
    <div
      onClick={handleBackgroundClick}
      className="z-10 fixed h-screen top-0 left-0 right-0 bg-black bg-opacity-80 flex justify-center items-center py-6"
    >
      <div className="text-white bg-white px-8 py-4 flex flex-col lg:w-1/3 w-full md:w-3/4 max-w-[90vw] max-h-[90vh] md:max-h-[90vh] relative rounded-xl overflow-y-auto">
        <div className="flex justify-end items-center w-full">
          <button
            onClick={toggleShowModal}
            style={{
              color: adminData?.colors?.secondary,
            }}
          >
            <X size={25} />
          </button>
        </div>
        <img
          src={imageUrl}
          alt={product.name}
          className="object-fit h-64 rounded-lg mx-auto mb-4 cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
        />
        <h2 className="font-black text-gray-800 md:text-3xl text-xl text-start">
          {product.name}
        </h2>
        <p className="md:text-lg text-black text-base text-start h-[50px] md:h-[60px]">
          {product.description}
        </p>
        <div className="flex flex-col flex-grow">
          <div className="overflow-y-auto mb-4">
            {filteredExtras.map((extraGroup) => (
              <div
                key={extraGroup.id}
                className={`mt-6 text-black ${
                  extraGroup.available ? "" : "hidden line-through text-gray-500"
                }`}
              >
                <h4 className="text-lg font-bold my-2 bg-gray-200 text-gray-700">
                  {extraGroup.title}
                </h4>

                <div className="m-4">
                  {extraGroup.items.map((extra) => (
                    <div
                      key={extra.id}
                      className={`grid grid-cols-5 gap-4 py-2 ${
                        !extra.available ? "hidden line-through text-gray-500" : ""
                      }`}
                    >
                      <div className="col-span-3 flex flex-col text-start">
                        <span className="font-bold truncate w-full block">
                          {extra.name}
                        </span>
                        <p className="text-sm truncate w-full block">
                          {extra.description}
                        </p>
                        <span className="text-sm font-semibold">
                          ${extra.price}
                        </span>
                      </div>
                      <div className="col-span-1 flex justify-center items-center">
                        {selectedExtras.some((e) => e.id === extra.id) && (
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={
                              selectedExtras.find((e) => e.id === extra.id)
                                ?.qty || 1
                            }
                            onChange={(e) =>
                              handleExtraQuantityChange(
                                extra.id,
                                Number(e.target.value)
                              )
                            }
                            className="w-12 text-center text-white bg-black rounded-lg"
                            disabled={!extra.available || !extraGroup.available}
                          />
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end items-center">
                        <input
                          type="checkbox"
                          checked={selectedExtras.some(
                            (e) => e.id === extra.id
                          )}
                          onChange={() => handleExtraSelection(extra)}
                          disabled={!extra.available || !extraGroup.available}
                          className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <hr className="col-span-5 my-2 border-t border-dashed" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <textarea
              placeholder="Agrega una nota de observación para el producto"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
        </div>
        <div className="border-t bg-white sticky bottom-0 left-0 right-0 py-4 flex flex-col sm:flex-row justify-center items-center p-4 mt-4">
          <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
            <Counter setCounter={setCounter} counter={counter} />
          </div>
          <button
            onClick={() => {
              addToCart(product, selectedExtras, counter, note);
              toggleShowModal();
            }}
            style={{
              backgroundColor: adminData?.colors?.secondary,
              color: adminData?.colors?.primary,
            }}
            className="sm:ml-4 bg-blue-600 text-white p-2 rounded-lg mt-2 w-full hover:bg-blue-800"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
      {isImageModalOpen && (
        <ImageModal
          imageUrl={imageUrl}
          altText={product.name}
          closeImageModal={() => setIsImageModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ProductModal;
