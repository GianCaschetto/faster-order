import { db } from "@/services/firebase";
import { AdminData, Order } from "@/types/types";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

type AdminContextType = {
  adminData: AdminData | null;
  totalOrders: number;
  orders: Order[] | null;
};

const AdminContext = createContext<AdminContextType>({
  adminData: null,
  totalOrders: 0,
  orders: null,
});

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => {
    const adminDataRef = doc(db, "admin", "data");
    const unsubscribe = onSnapshot(adminDataRef, (doc) => {
      setAdminData(doc.data() as AdminData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const unOrdersLenghtSuscribe = onSnapshot(ordersRef, (doc) => {
      setOrders(doc.docs.map((doc) => doc.data() as Order));
      setTotalOrders(doc?.docs?.length ?? 0);
    });
    return () => unOrdersLenghtSuscribe();
  }, [totalOrders]);

  return (
    <AdminContext.Provider value={{ adminData, totalOrders, orders }}>
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
