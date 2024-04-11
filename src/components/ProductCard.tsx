import React from "react";
import Counter from "./Counter";
import { Product } from "@/types/types";

type ProductCardProps = {
  product: Product;
  addToCart: (product: Product) => void;
  counter: number;
  setCounter: React.Dispatch<React.SetStateAction<number>>
}

function ProductCard({ product, addToCart, counter, setCounter }: ProductCardProps) {
  return (
    <div className="w-full max-w-md  mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
      <div className="max-w-md mx-auto">
        <div
          className="h-[236px]"
          style={{
            backgroundImage: `url(${product.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="p-4 sm:p-6">
          
          <div className="flex flex-row justify-between">
            <p className="font-bold text-gray-700 text-[22px] leading-7 mb-1">
              {product.name}
            </p>
            <p className="text-[17px] font-bold text-[#0FB478]">
              ${product.price}
            </p>
          </div>
          <p className="text-[#7C7C80] font-[15px] mt-6">
            {product.description}
          </p>
          <Counter setCounter={setCounter} counter={counter} />
          <button
            onClick={() => addToCart(product)}
            className="block mt-10 w-full px-4 py-3 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform bg-slate-500 rounded-[14px] hover:bg-slate-700 focus:outline-none focus:ring focus:ring-slate-900 focus:ring-opacity-20"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
