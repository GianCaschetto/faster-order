import React, { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { Category } from "@/types/types";
import { toast } from "react-toastify";
import MediaModal from "../media/MediaModal";

function CompanyPage() {
  const [isOpenLogo, setIsOpenLogo] = useState(false);
  const [isOpenIcon, setIsOpenIcon] = useState(false);
  const [logoSelected, setLogoSelected] = useState<string | null>(null);
  const [iconSelected, setIconSelected] = useState<string | null>(null);

  const { adminData: admin } = useAdmin();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const { companyName, whatsapp, email, categories, payments } = data;
    if (!companyName || !whatsapp || !categories || !email || !payments) {
      toast.error("Todos los campos son obligatorios");
      return;
    }
    const categoriesFormatted: Category[] = categories
      .toString()
      .split(",")
      .filter((cat: string) => cat.trim() !== "")
      .map((cat) => {
        return {
          id:
            admin?.categories?.find((c) => c.name === cat.trim())?.id ??
            crypto.randomUUID(),
          name: cat.trim(),
        };
      });

    const paymentMethods: string[] = payments
      .toString()
      .split(",")
      .filter((payment: string) => payment.trim() !== "");
    saveAdminData({
      ...data,
      logo: logoSelected ?? admin?.logo,
      icon: iconSelected ?? admin?.icon,
      categories: categoriesFormatted,
      paymentMethods: paymentMethods,
    });
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
              htmlFor="photo"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Logo de la empresa
            </label>
            {logoSelected || admin?.logo && (
              <img
                src={logoSelected ?? admin?.logo}
                alt="logo de la empresa"
                className="w-auto h-32 object-cover rounded-md"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setIsOpenLogo(true);
              }}
            >
              Elegir
            </button>
            <MediaModal
              isOpen={isOpenLogo}
              onClose={() => setIsOpenLogo(false)}
              setImageSelected={setLogoSelected}
            />
          </div>
          <div className="mb-5">
            <label
              htmlFor="photo"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Icono del sitio web
            </label>
            {iconSelected || admin?.icon && (
              <img
                src={iconSelected ?? admin?.icon}
                alt="icono delsitio web de la empresa"
                className="w-auto h-32 object-cover rounded-md"
              />
            )}
            <button
              type="button"
              onClick={() => {
                setIsOpenIcon(true);
              }}
            >
              Elegir
            </button>
            <MediaModal
              isOpen={isOpenIcon}
              onClose={() => setIsOpenIcon(false)}
              setImageSelected={setIconSelected}
            />
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
            <textarea
              name="categories"
              defaultValue={
                admin?.categories?.map((cat) => cat.name).join(", ") ?? ""
              }
              id="categories"
              placeholder="Hamburguesas, Pizzas, Bebidas, Postres"
              className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            <span>
              Enumere todas las categorías del menú separadas por coma (,).
              Como: cat1, cat2, cat3, cat4.
            </span>
            <br />
            {admin?.categories && (
              <span className="text-red-500">
                Si edita las categorías, debe editar cada producto para
                asignarle la nueva categoría
              </span>
            )}
          </div>

          <div className="mb-5">
            <label
              htmlFor="payments"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Métodos de pago
            </label>
            <textarea
              name="payments"
              defaultValue={
                admin?.paymentMethods?.map((payment) => payment).join(", ") ??
                ""
              }
              id="payments"
              placeholder="Pago móvil, Zelle, Transferencia, Efectivo"
              className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
            />
            <span>
              Enumere todos los métodos de pago separados por coma (,). Como:
              Pago móvil, Zelle, Transferencia, Efectivo.
            </span>
            <br />
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
