import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "./routes";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/Loader";

type ProtectedRouteProps = { children: React.ReactNode };

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const { user, userProfile, loadingUserProfile } = useAuth();

  useEffect(() => {
    if (!loadingUserProfile) {
      if (user?.email !== "ujaptesis@gmail.com") {
        navigate(routes.home);
      }
    }
  }, [userProfile, loadingUserProfile, navigate]);

  if (loadingUserProfile) {
    return <Loader />;
  }

  return <>{children}</>;
}
