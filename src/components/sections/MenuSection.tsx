import { Product } from "@/types/types";
import ProductCard from "../ProductCard";

function MenuSection({
  categories,
  products,
  addToCart,
  counter,
  setCounter,
  filteredProducts,
  inputRef,
}) {
  return (
    <section className="scroll-smooth">
      {filteredProducts.length > 0 && inputRef.current.value !== "" ? (
        <>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 pt-6">
            {filteredProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                counter={counter}
                setCounter={setCounter}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {categories.map((category) => (
            <div key={crypto.randomUUID()} id={category.name} className="py-2">
              <h2 className="text-4xl font-bold my-8">{category.name}</h2>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                {products
                  .filter((product) => product.categoryId === category.id)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      addToCart={addToCart}
                      counter={counter}
                      setCounter={setCounter}
                    />
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
