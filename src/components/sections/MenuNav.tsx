import { useAdmin } from "@/contexts/AdminContext";
import { Category, Product } from "@/types/types";
import debounce from "just-debounce-it";

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
  const { adminData } = useAdmin();

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
    <section className="border-y p-2 flex justify-between items-center md:flex-row flex-col ">
      <form action="" className="mr-6 flex justify-center items-center">
      
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            id="table-search-users"
            className="block p-2 pl-10 text-sm rounded-lg w-80 border"
            placeholder="Buscar productos..."
          />
        
        </div>
      </form>
      <nav className="overflow-x-auto md:max-w-4xl max-w-full">
        <ul className="flex gap-4 p-4 w-3/4 max-w-full items-start">
          {categories.map((category) => (
            <li key={category.id}>
              <a
                href={`#${category.name}`}
                style={{
                  backgroundColor: adminData?.colors?.primary,
                  color: adminData?.colors?.secondary,
                }}
                className="p-2 bg-blue-500 rounded-xl hover:bg-blue-700"
              >
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

export default MenuNav;
