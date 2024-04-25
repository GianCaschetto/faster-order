import { auth, db } from "@/services/firebase";
import { User } from "firebase/auth";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  adminUser: DocumentData | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  adminUser: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [adminUser, setAdminUser] = useState<DocumentData | null>(null);
  useEffect(() => {
    const onSubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return onSubscribe;
  }, [user]);

  useEffect(() => {
    const getAdminUser = async () => {
      if (!user) {
        return;
      } else {
        const adminRef = doc(db, "users", user.uid);
        const adminSnap = await getDoc(adminRef);
        if (adminSnap.data()?.roles.admin) {
          setAdminUser(adminSnap.data() ?? null);
        }
      }
    };
    getAdminUser();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, adminUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
