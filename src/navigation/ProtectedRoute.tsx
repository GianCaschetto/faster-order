import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = { children: React.ReactNode };

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { adminUser } = useAuth();
  useEffect(() => {
    if(!adminUser) navigate(routes.home);
  }, [adminUser, navigate]);

  return <>{children}</>;
}
