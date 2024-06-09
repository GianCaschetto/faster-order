import { useAdmin } from "@/contexts/AdminContext";
import { useMemo, useState } from "react";

function OrdersHistoryRegister() {
  const { adminData } = useAdmin();
  const [products, setProducts] = useState([{ product: "", quantity: 1, extras: "" }]);
  
  const neighborhoods = useMemo(
    () => adminData?.neighborhoods ?? [],
    [adminData?.neighborhoods]
  );

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { product: "", quantity: 1, extras: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado", products);
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <div>
            Cliente
            <input
              type="text"
              placeholder="Nombre del cliente"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 outline-none"
            />
            <input
              type="text"
              id="phone"
              name="phone"
              placeholder="Telefono"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 outline-none"
            />
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Direccion"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 outline-none"
            />
            <select
              name="neighborhood"
              id="neighborhood"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 outline-none"
            >
              <option value="">Seleccione un barrio</option>
              {neighborhoods?.map((neighborhood) => (
                <option key={neighborhood.name} value={neighborhood.name}>
                  {neighborhood.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="orderType">Tipo de orden</label>
            <select
              name="orderType"
              id="orderType"
              className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 outline-none"
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>

          {/* Product items cart */}
          {products.map((product, index) => (
            <div key={index} className="mt-4 border-t pt-4">
              <div>
                <label htmlFor={`product-${index}`}>Producto</label>
                <select
                  name={`product-${index}`}
                  id={`product-${index}`}
                  value={product.product}
                  onChange={(e) =>
                    handleProductChange(index, "product", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 outline-none"
                >
                  {adminData?.products?.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={`quantity-${index}`}>Cantidad</label>
                <input
                  type="number"
                  name={`quantity-${index}`}
                  id={`quantity-${index}`}
                  value={product.quantity}
                  onChange={(e) =>
                    handleProductChange(index, "quantity", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 outline-none"
                />
              </div>
              <div>
                <label htmlFor={`extras-${index}`}>Extras</label>
                <select
                  name={`extras-${index}`}
                  id={`extras-${index}`}
                  value={product.extras}
                  onChange={(e) =>
                    handleProductChange(index, "extras", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mt-2 outline-none"
                >
                  {adminData?.extras?.map((extra) => (
                    <option key={extra.id} value={extra.id}>
                      {extra.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <button
              type="button"
              onClick={addProduct}
              className="w-full bg-green-500 text-white py-2 rounded-md"
            >
              Agregar Producto
            </button>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrdersHistoryRegister;
