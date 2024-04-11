import { Product } from "@/types/types";
import Counter from "./Counter";
import React from "react";
import { X } from "lucide-react";

type ProductModalProps = {
  counter: number;
  product: Product;
  addToCart: (product: Product) => void;
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
  return (
    <div className="z-10 fixed h-screen top-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center py-6">
      <div className="dark:bg-white dark:text-black bg-slate-900 text-white p-4 flex flex-col lg:w-1/3 w-3/4 h-full relative rounded-xl">
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
        <div className="flex sm:flex-row flex-col justify-center items-center absolute bottom-0 left-0 right-0 p-8">
          <div className="w-1/3">
            <Counter setCounter={setCounter} counter={counter} />
          </div>
          <button
            onClick={() => {
              addToCart(product);
              toggleShowModal();
            }}
            className="ml-4 bg-blue-600 text-white p-2 rounded-lg mt-2 w-2/3 hover:bg-blue-800"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
