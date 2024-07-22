/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { saveAdminData } from "@/services/firebase";
import { Category } from "@/types/types";
import { toast } from "react-toastify";
import MediaModal from "../media/MediaModal";

function CompanyPage() {
  const { adminData: admin } = useAdmin();
  const [isOpenLogo, setIsOpenLogo] = useState(false);
  const [logoSelected, setLogoSelected] = useState<string | null>(null);
  const [iconSelected] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");

  // Initialize state with admin colors
  useEffect(() => {
    if (admin?.colors) {
      setPrimaryColor(admin.colors.primary);
      setSecondaryColor(admin.colors.secondary);
    }
  }, [admin?.colors]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    const { companyName, whatsapp, email, categories, payments, address } =
      data;
    if (
      !companyName ||
      !whatsapp ||
      !categories ||
      !email ||
      !payments ||
      !address
    ) {
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
      address: (address as string) ?? admin?.address,
      logo: logoSelected ?? admin?.logo,
      icon: iconSelected ?? admin?.icon,
      categories: categoriesFormatted,
      paymentMethods: paymentMethods,
      colors: {
        primary: primaryColor,
        secondary: secondaryColor,
      },
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-6 xl:p-8 md:w-4/5 mt-4 mx-auto">
      <div className="flex items-center justify-center p-2">
        <div className="mx-auto w-full max-w-[550px]">
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-4">
            Información de la empresa
          </h2>
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
                htmlFor="address"
                className="mb-3 block text-base font-medium text-[#07074D]"
              >
                Dirección de la empresa
              </label>
              <textarea
                name="address"
                defaultValue={admin?.address ?? ""}
                id="address"
                placeholder="Calle, Ciudad, Estado, País"
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
              <span className="text-gray-500">
                Este campo se muestra en la parte superior del catálogo
              </span>
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
              <span className="text-gray-500">
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
              <span className="text-gray-500">
                Enumere todos los métodos de pago separados por coma (,). Como:
                Pago móvil, Zelle, Transferencia, Efectivo.
              </span>
              <br />
            </div>
            <div className="flex justify-start">
              <div className="mb-5 text-center">
                <div className="flex">
                  <label
                    htmlFor="photo"
                    className="mb-3 block text-base font-medium text-[#07074D]"
                  >
                    Logo de la empresa
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpenLogo(true);
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-pencil ml-2"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                      <path d="M13.5 6.5l4 4" />
                    </svg>
                  </button>
                </div>
                {(admin?.logo && (
                  <img
                    src={logoSelected ?? admin?.logo}
                    alt="logo de la empresa"
                    className="w-auto h-24 object-cover rounded-md drop-shadow-md"
                  />
                ))}

                <MediaModal
                  isOpen={isOpenLogo}
                  onClose={() => setIsOpenLogo(false)}
                  setImageSelected={setLogoSelected}
                />
              </div>
            </div>

            {/* Color Inputs */}
            <div className="flex justify-around">
              <div className="mb-5 flex flex-col justify-center items-center">
                <label
                  htmlFor="primaryColor"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Color primario
                </label>
                <input
                  type="color"
                  name="primaryColor"
                  id="primaryColor"
                  value={primaryColor ?? "#fff"}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
              <div className="mb-5 flex flex-col justify-center items-center">
                <label
                  htmlFor="secondaryColor"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Color secundario
                </label>
                <input
                  type="color"
                  name="secondaryColor"
                  id="secondaryColor"
                  value={secondaryColor ?? "#000"}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="p-1 h-10 w-14 block bg-white border border-gray-200 cursor-pointer rounded-lg disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700"
                />
              </div>
            </div>

            <div className="text-center">
              <button className="group relative h-12 w-48 overflow-hidden rounded-2xl bg-slate-600 text-lg font-bold text-white">
                Guardar
                <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/30"></div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyPage;
