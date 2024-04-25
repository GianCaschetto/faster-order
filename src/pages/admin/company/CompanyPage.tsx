import React from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { Category } from "@/types/types";
import { toast } from "react-toastify";

function CompanyPage() {
  const {adminData: admin} = useAdmin();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const { companyName, whatsapp, email, categories } = data;
    if(!companyName || !whatsapp || !categories || !email){
      toast.error("Todos los campos son obligatorios");
      return;
    }
    const categoriesFormatted: Category[] = categories.toString().split(",").map((cat) => {
      return {
        id: crypto.randomUUID(),
        name: cat,
      }
    })
    saveAdminData({...data, categories: categoriesFormatted});
  };
  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px]">
        <form onSubmit={handleSubmit}>
          <div className="-mx-3 flex flex-wrap">
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="companyName"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Nombre de la empresa
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  defaultValue={admin?.companyName ?? ""}
                  placeholder="Nombre de la empresa"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
            <div className="w-full px-3 sm:w-1/2">
              <div className="mb-5">
                <label
                  htmlFor="whatsapp"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Whatsapp
                </label>
                <input
                  type="number"
                  name="whatsapp"
                  maxLength={10}
                  defaultValue={admin?.whatsapp ?? ""}
                  id="whatsapp"
                  placeholder="000 123 4567"
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={admin?.email ?? ""}
              placeholder="tuempresa@domain.com"
              min="0"
              className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="categories"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Categorías del menú
            </label>
            <input
              type="text"
              name="categories"
              defaultValue={admin?.categories?.map((cat) => cat.name).join(", ") ?? ""}
              id="categories"
              placeholder="Hamburguesas, Pizzas, Bebidas, Postres"
              min="0"
              className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            <span>Enumere todas las categorías del menú separadas por coma (,). Como: cat1, cat2, cat3, cat4.</span>
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

export default CompanyPage;
