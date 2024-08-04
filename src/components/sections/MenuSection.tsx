import { Product } from "@/types/types";
import ProductCard from "../ProductCard";
import { useAdmin } from "@/contexts/AdminContext";

function MenuSection({
  categories,
  products,
  addToCart,
  filteredProducts,
  inputRef,
}) {
  const {adminData} = useAdmin();
  return (
    <section className="scroll-smooth">
      {filteredProducts.length > 0 && inputRef.current.value !== "" ? (
        <>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 pt-6">
            {filteredProducts.map((product: Product) => (
                 product.active && (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                  />
                )
            ))}
          </div>
        </>
      ) : (
        <>
          {categories.map((category) => (
            <div key={crypto.randomUUID()} id={category.name} className="py-2">
              <h2
                style={{
                  backgroundColor: adminData?.colors?.secondary,
                  color: adminData?.colors?.primary
                }}
              className="text-4xl font-bold my-4 py-4 rounded-xl text-white">{category.name}</h2>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                {products
                  .filter((product) => product.categoryId === category.id)
                  .map((product: Product) => (
                    product.active && (
                      <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                      />
                    )
                  ))}
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}

export default MenuSection;
