import { db } from "@/services/firebase";
import { AdminData } from "@/types/types";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type AdminContextType = {
    adminData: AdminData | null;
}

const AdminContext = createContext<AdminContextType>({ adminData: null });

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [adminData, setAdminData] = useState<AdminData | null>(null);
    useEffect(() => {
        const adminDataRef = doc(db, "admin", "data");
        const unsubscribe = onSnapshot(adminDataRef, (doc) => {
            setAdminData(doc.data() as AdminData);
        });
    
        return () => unsubscribe();
    }, []);

    return (
        <AdminContext.Provider value={{ adminData }}>
            {children}
        </AdminContext.Provider>
    )
}

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}

