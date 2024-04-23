import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = { children: React.ReactNode };

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { adminUser, user } = useAuth();
  useEffect(() => {
    if(!adminUser || !user) navigate(routes.signIn);
  }, [adminUser, navigate, user]);

  return <>{children}</>;
}
