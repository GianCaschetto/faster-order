import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import MediaModal from "../media/MediaModal";
import { Product } from "@/types/types";

function ProductEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { adminData } = useAdmin();
  const [productData, setProductData] = useState<Product>({} as Product);
  const [isOpen, setIsOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (id && adminData) {
      const currentProduct = adminData.products?.find((product) => product.id === id);
      if (currentProduct) {
        setProductData(currentProduct);
        setSelectedExtras(currentProduct.extras || []);
        setActive(currentProduct.active ?? true);
      } else {
        toast.error("Producto no encontrado");
        navigate("/admin-panel/products");
      }
    }
  }, [id, adminData, navigate]);

  const handleExtrasChange = (extraId: string) => {
    setSelectedExtras((prevSelected) =>
      prevSelected.includes(extraId)
        ? prevSelected.filter((id) => id !== extraId)
        : [...prevSelected, extraId]
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const { productName, price, categoryId, description } = data;

    if (!productName || !price || !categoryId) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const updatedProduct: Product = {
      id: productData.id,
      name: productName as string,
      categoryId: categoryId as string,
      description: description as string,
      image: imageSelected ? imageSelected : productData.image,
      price: parseFloat(price as string),
      extras: selectedExtras,
      active, // Agregar la disponibilidad
    };

    const adminDataRef = doc(db, "admin", "data");
    const updatedProducts = adminData?.products?.map((product) =>
      product.id === updatedProduct.id ? updatedProduct : product
    );

    setDoc(adminDataRef, { products: updatedProducts }, { merge: true })
      .then(() => {
        toast.success("Producto actualizado correctamente");
        navigate("/admin-panel/products");
      })
      .catch((error) => {
        toast.error("Error al actualizar el producto");
        console.error(error);
      });
  };

  useEffect(() => {
    setActive(productData.active);
  }, [productData]);

  if (!productData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white sm:p-6 xl:p-8 ">
        <h2 className="text-2xl font-semibold text-[#07074D] mb-5">Editar producto</h2>
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
                  defaultValue={productData?.name}
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
                  maxLength={10}
                  defaultValue={productData?.price}
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
              value={productData.categoryId} // Aquí configuramos el valor actual
              onChange={(e) => setProductData((prevData) => ({ ...prevData, categoryId: e.target.value }))}
            >
              {adminData?.categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
              defaultValue={productData?.description}
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>

          <div className="mb-5">
           
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={active}
              onChange={() => setActive(!active)}
              className="mr-2"
            />
            <span>¿Disponible? {active ? "✅":"❌"}</span>
          </div>

          <div className="mb-5">
            <label
              htmlFor="extras"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Agregados
            </label>
            {adminData?.extras?.map((extraGroup) => (
              <div key={extraGroup.id} className={`mb-3 ${!extraGroup.available ? 'line-through text-gray-500' : ''}`}>
                <h4 className="mb-2 font-semibold">{extraGroup.title}</h4>
                {extraGroup.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center ${!item.available ? 'line-through text-gray-500' : ''}`}
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
              Foto principal
            </label>
            <div className="w-3/4">
              {productData.image && (
                <img
                  src={imageSelected ? imageSelected : productData.image}
                  alt="product"
                  className="max-w-36 h-auto object-cover rounded-md"
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(true);
              }}
              className="text-black underline hover:text-blue-500 text-sm font-medium mt-2 block"
            >
              Elegir foto principal
            </button>
            <MediaModal
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              setImageSelected={setImageSelected}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductEdit;
