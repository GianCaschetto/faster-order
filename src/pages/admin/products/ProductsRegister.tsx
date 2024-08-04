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
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [available, setAvailable] = useState(true);

  const { adminData } = useAdmin();
  const navigate = useNavigate();
  if (!adminData) return;

  const handleExtrasChange = (extraId: string) => {
    setSelectedExtras((prevSelected) =>
      prevSelected.includes(extraId)
        ? prevSelected.filter((id) => id !== extraId)
        : [...prevSelected, extraId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const { productName, price, categoryId, description } = data;
    if (!productName) {
      toast.error("El nombre del producto es obligatorio");
      return;
    } else if (!price) {
      toast.error("El precio del producto es obligatorio");
      return;
    } else if (!categoryId) {
      toast.error("La categoría del producto es obligatoria");
      return;
    } else if (!imageSelected) {
      toast.error("La imagen del producto es obligatoria");
      return;
    }

    const newProduct: Product = {
      id: crypto.randomUUID(),
      name: productName as string,
      categoryId: categoryId as string,
      description: description as string,
      image: imageSelected,
      price: parseFloat(price as string),
      extras: selectedExtras,
      active: available,
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
      <div className="mx-auto w-full max-w-[550px] bg-white sm:p-6 xl:p-8">
        <h2 className="text-2xl font-semibold text-[#07074D] mb-6">
          Registrar producto
        </h2>
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
              htmlFor="available"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Disponible
            </label>
            <input
              type="checkbox"
              name="available"
              id="available"
              checked={available}
              onChange={() => setAvailable(!available)}
              className="mr-2"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="extras"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Agregados
            </label>
            {adminData.extras?.map((extraGroup) => (
              <div
                key={extraGroup.id}
                className={`mb-3 ${
                  !extraGroup.available ? "line-through text-gray-500" : ""
                }`}
              >
                <h4 className="mb-2 font-semibold">{extraGroup.title}</h4>
                {extraGroup.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center ${
                      !item.available ? "line-through text-gray-500" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={item.id}
                      name="extras"
                      value={item.id}
                      checked={selectedExtras.includes(item.id)}
                      onChange={() => handleExtrasChange(item.id)}
                      className="mr-2"
                      disabled={!item.available || !extraGroup.available}
                    />
                    <label htmlFor={item.id}>
                      {item.name} - ${item.price}
                    </label>
                  </div>
                ))}
              </div>
            ))}
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
