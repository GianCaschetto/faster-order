import { useAuth } from "@/contexts/AuthContext";
import { routes } from "@/navigation/routes";
import { signInAdmin } from "@/services/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function SignInPage() {
  const { adminUser } = useAuth();
  console.log(adminUser)
  const navigate = useNavigate();
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
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4 text-black">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-600">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
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
            <a href="#" className="hover:underline">
              Olvidaste tu contraseña?
            </a>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignInPage;
