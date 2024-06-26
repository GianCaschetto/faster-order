import { useAdmin } from "@/contexts/AdminContext";
import { db } from "@/services/firebase";
import { Product } from "@/types/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import MediaModal from "../media/MediaModal";

function ProductEdit() {
  const [productData, setProductData] = useState<Product>({} as Product);
  const [isOpen, setIsOpen] = useState(false);
  const [imageSelected, setImageSelected] = useState<string | null>(null);
  const navigate = useNavigate();
  const { adminData } = useAdmin();
  const { id } = useParams();

  // Fetch product data
  useEffect(() => {
    (async () => {
      const docRef = doc(db, "admin", "data");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      const product = data?.products.find(
        (product: Product) => product.id === id
      );
      setProductData(product);
    })();
  }, [id]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const { productName, price, categoryId, description } = data;
    if (!productName || !price || !categoryId) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    if (!imageSelected) {
      const updatedProduct: Product = {
        id: productData.id,
        name: productName as string,
        categoryId: categoryId as string,
        description: description as string,
        image: productData.image,
        price: parseFloat(price as string),
      };
      const adminDataRef = doc(db, "admin", "data");
      setDoc(
        adminDataRef,
        {
          products: adminData?.products?.map((product) =>
            product.id === productData?.id ? updatedProduct : product
          ),
        },
        { merge: true }
      )
        .then(() => {
          console.log("Producto actualizado correctamente");
          navigate("/admin-panel/products");
        })
        .catch((error) => {
          console.error("Error al actualizar el producto");
          console.error(error);
        });
      return;
    }

    const updatedProduct: Product = {
      id: productData.id,
      name: productName as string,
      categoryId: categoryId as string,
      description: description as string,
      image: imageSelected,
      price: parseFloat(price as string),
    };
    const adminDataRef = doc(db, "admin", "data");
    setDoc(
      adminDataRef,
      {
        products: adminData?.products?.map((product) =>
          product.id === productData?.id ? updatedProduct : product
        ),
      },
      { merge: true }
    )
      .then(() => {
        console.log("Producto actualizado correctamente");
        navigate("/admin-panel/products");
      })
      .catch((error) => {
        console.error("Error al actualizar el producto");
        console.error(error);
      });
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        <button onClick={() => navigate(-1)}>Atras</button>
        <form onSubmit={handleEdit}>
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
              defaultValue={
                adminData?.categories?.find(
                  (category) => category.id === productData?.categoryId
                )?.id
              }
              id="categoryId"
              className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
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
              className="hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
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
