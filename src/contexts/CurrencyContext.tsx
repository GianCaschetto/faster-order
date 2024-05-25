import { TasaUSD } from "@/types/types";
import { createContext, useContext, useEffect, useState } from "react";

type CurrencyContextType = {
  tasaBCV: TasaUSD;
  tasaEnParalelo: number;
  setTasaBCV: (tasaBCV: TasaUSD) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasaBCV, setTasaBCV] = useState<TasaUSD>({
    price: 0,
    price_old: 0,
    title: "",
  });
  const [tasaEnParalelo, setTasaEnParalelo] = useState<number>(0);

  useEffect(() => {
    fetch("https://pydolarvenezuela-api.vercel.app/api/v1/dollar?page=bcv")
      .then((res) => res.json())
      .then((data) => setTasaBCV(data.monitors.usd));
  }, []);

  useEffect(() => {
    fetch(
      "https://pydolarvenezuela-api.vercel.app/api/v1/dollar/unit/enparalelovzla"
    )
      .then((res) => res.json())
      .then((data) => setTasaEnParalelo(data.price));
  }, []);

  return (
    <CurrencyContext.Provider value={{ tasaBCV, setTasaBCV, tasaEnParalelo }}>
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
