import { db } from "@/services/firebase";
import { AdminData, Order } from "@/types/types";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type AdminContextType = {
  adminData: AdminData | null;
  orders: Order[] | null;
};

const AdminContext = createContext<AdminContextType>({
  adminData: null,
  orders: null,
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const adminDataRef = doc(db, "admin", "data");
    const unsubscribe = onSnapshot(adminDataRef, (doc) => {
      setAdminData(doc.data() as AdminData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unOrdersLenghtSuscribe = onSnapshot(ordersRef, (snapshot) => {
      setOrders(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Order))
      );
    });
    return () => unOrdersLenghtSuscribe();
  }, []);


  return (
    <AdminContext.Provider value={{ adminData, orders }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
