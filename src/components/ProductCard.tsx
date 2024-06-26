import { useState } from "react";
import { Product } from "@/types/types";
import ProductModal from "./ProductModal";

type ProductCardProps = {
  product: Product;
  addToCart: (product: Product) => void;
};

function ProductCard({ product, addToCart }: ProductCardProps) {
  const [showModal, setShowModal] = useState(false);
  const toggleShowModal = () => setShowModal(!showModal);
  
  return (
    <>
    <article
      onClick={() => setShowModal(true)}
      className=" relative flex flex-row md:space-x-5 space-y-3 md:space-y-0 rounded-xl shadow-black shadow-sm hover:shadow-black hover:shadow-md p-3 w-full md:max-w-3xl mx-auto border border-white bg-white cursor-pointer"
    >
      <div className="w-full md:w-2/3 bg-white flex flex-col justify-between items-start space-y-2 p-3">
        <h3 className="font-black text-gray-800 md:text-3xl text-xl text-start">
          {product.name}
        </h3>
        <p className="md:text-lg text-gray-500 text-base text-start line-clamp-2 h-[50px] md:h-[60px]">
          {product.description}
        </p>
        <p className="text-xl font-black text-gray-800 text-start">
          ${product.price}
        </p>
      </div>
      <div className="w-full md:w-1/3 bg-white grid place-items-center ">
        <img
          src={product.image}
          alt={`${product.name} de faster order`}
          className="rounded-xl h-full w-full object-cover"
        />
      </div>
      
    </article>
    {showModal && (
      <ProductModal product={product} addToCart={addToCart} toggleShowModal={toggleShowModal} />
     )}
     </>
  );
}

export default ProductCard;
