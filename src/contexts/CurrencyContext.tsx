import { TasaBCV } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";

type CurrencyContextType = {
  tasaBCV: TasaBCV;
  setTasaBCV: (tasaBCV: TasaBCV) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasaBCV, setTasaBCV] = useState<TasaBCV>({
    price: 0,
    price_old: 0,
    title: "",
  });
  useEffect(() => {
    fetch("https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv")
      .then((res) => res.json())
      .then((data) => setTasaBCV(data.monitors.usd));
  }, []);

  return (
    <CurrencyContext.Provider value={{ tasaBCV, setTasaBCV }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
