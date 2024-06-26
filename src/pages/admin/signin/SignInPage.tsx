import { useAdmin } from "@/contexts/AdminContext";
import { routes } from "@/navigation/routes";
import { forgotPassword, signInAdmin } from "@/services/firebase";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignInPage() {
  const { adminData } = useAdmin();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { email } = Object.fromEntries(formData.entries());
    forgotPassword(email as string);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { email, password } = Object.fromEntries(formData.entries());
    signInAdmin({ email, password })
      .then((user) => {
        if (user) {
          toast.success("Inicio de sesión exitoso!");
          navigate(routes.adminPanel);
        }
      })
      .catch(() => {
        toast.error("Error al iniciar sesión!");
      });
  };

  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen ">
      <NavLink to="/" className="absolute top-10 left-10 flex justify-center items-center ">
        <svg
          className="w-6 h-6 text-black"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-black hover:underline">Atrás</span>
      </NavLink>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/3 container">
        <h1 className="text-2xl font-semibold mb-4 text-black">
          Iniciar Sesión
        </h1>
        {!showForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-600">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="text-blue-500"
              />
              <label className="text-gray-600 ml-2">Recuérdame</label>
            </div>
            <div className="mb-6 text-blue-500">
              <button
              type="button"
                onClick={() => setShowForgotPassword(true)}
                className="hover:underline"
              >
                Olvidaste tu contraseña?
              </button>
            </div>
            <button
              style={{
                backgroundColor: adminData?.colors?.primary ?? "#6B46C1",
                color: adminData?.colors?.secondary ?? "#fff",
              }}
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
            >
              Iniciar sesión
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <label className="block text-gray-600">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
              />
            </div>
            <div className="mb-6 text-blue-500">
              <button
                onClick={() => setShowForgotPassword(false)}
                className="hover:underline"
              >
                Regresar
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
              style={{
                backgroundColor: adminData?.colors?.primary ?? "#6B46C1",
                color: adminData?.colors?.secondary ?? "#fff",
              }}
            >
              Restablecer contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SignInPage;
