import { Category, Product } from "@/types/types";
import debounce from "just-debounce-it";
import { Search } from "lucide-react";

type MenuNavProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputRef: any;
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  products: Product[];
};

function MenuNav({
  inputRef,
  setFilteredProducts,
  categories,
  products,
}: MenuNavProps) {
  //Search the item
  const handleSearch = () => {
    const search = inputRef.current.value;
    debouncedFilteredProducts(search);
  };
  //Debounce search (500ms)
  const debouncedFilteredProducts = debounce((search) => {
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  }, 500);

  return (
    <section className="border-y p-4">
      <div className="flex justify-between items-center flex-col md:flex-row">
        <form action="" className="mr-6 flex justify-center items-center">
          <Search />
          <input
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            className="border p-2 rounded-lg ml-2" 
          />
          
        </form>
        <nav className="overflow-x-auto">
          <ul className="flex gap-4 p-4 w-3/4">
            {categories.map((category) => (
              <li key={category.id}>
                <a
                  href={`#${category.name}`}
                  className="p-2 bg-blue-500 rounded-xl hover:bg-blue-700"
                >
                  {category.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default MenuNav;
