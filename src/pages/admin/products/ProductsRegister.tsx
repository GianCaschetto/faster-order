import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { Product } from "@/types/types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MediaModal from "../media/MediaModal";

function ProductsRegister() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const { adminData } = useAdmin();
  const navigate = useNavigate();
  if (!adminData) return;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const { productName, price, categoryId, description } = data;
    if (
      !productName ||
      !price ||
      !categoryId ||
      !imageSelected
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: productName as string,
      categoryId: categoryId as string,
      description: description as string,
      image: imageSelected,
      price: parseFloat(price as string),
    };
    if (adminData.products) {
      saveAdminData({
        ...adminData,
        products: [...adminData.products, newProduct],
      });
      navigate("/admin-panel/products");
      return;
    } else {
      saveAdminData({ ...adminData, products: [newProduct] });
      navigate("/admin-panel/products");
      return;
    }
  };
  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="productName"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Nombre del producto
                </label>
                <input
                  type="text"
                  name="productName"
                  id="productName"
                  placeholder="Nombre del producto"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="price"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Precio (usd)
                </label>
                <input
                  type="number"
                  name="price"
                  min={0}
                  step={0.01}
                  id="price"
                  placeholder="Precio"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="categoryId"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Categoría del producto
            </label>
            <select
              name="categoryId"
              id="categoryId"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            >
              {adminData?.categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <label
              htmlFor="description"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Descripción
            </label>
            <textarea
              name="description"
              id="description"
              placeholder="Descripción del producto"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="photo"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Foto
            </label>
            {imageSelected && (
              <img
                src={imageSelected}
                alt="product"
                className="h-32 object-cover rounded-md"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
              }}
              className="text-black underline hover:text-blue-500 text-sm font-medium mt-2 block"
            >
              Elegir foto
            </button>
            
            <MediaModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              setImageSelected={setImageSelected}
            />
          </div>
          <div>
            <button className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductsRegister;
