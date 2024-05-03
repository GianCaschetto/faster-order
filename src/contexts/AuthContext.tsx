import { auth, db } from "@/services/firebase";
import { User } from "firebase/auth";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  userProfile: DocumentData | null;
  loadingUserProfile: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loadingUserProfile: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<DocumentData | null>(null);
  const [loadingUserProfile, setLoadingUserProfile] = useState<boolean>(true);
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setAuthInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (authInitialized) {
      if (user) {
        const getUserProfile = async () => {
          try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            setUserProfile(docSnap.data() as DocumentData);
          } catch (error) {
            console.error("Error getting document:", error);
          } finally {
            setLoadingUserProfile(false);
          }
        };
        getUserProfile();
      }
    } else {
      setUserProfile(null);
      setLoadingUserProfile(false);
    }
  }, [user, authInitialized]);

  if (!authInitialized || loadingUserProfile) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loadingUserProfile }}>
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
