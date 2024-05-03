import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = { children: React.ReactNode };

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  useEffect(() => {
    if (!userProfile?.roles?.admin && !user) {
      navigate(routes.home);
    }
  }, [user, navigate, userProfile?.roles?.admin]);

  return <>{children}</>;
}
