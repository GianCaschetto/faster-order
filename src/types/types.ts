import { Timestamp } from "firebase/firestore";

//Category type
export type Category = {
  id: string;
  name: string;
};

//Product type
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  categoryId: string;
  description?: string;
  extras?: string[];
  active: boolean;
};

//Extras Product Type
export type Extras = {
  id: string;
  available: boolean;
  title: string;
  items: Extra[];
  active: boolean;
};

//Extra type
export type Extra = {
  id: string;
  name: string;
  available: boolean;
  price: number;
  qty?: number;
  description?: string;
};

//ShoppingCartItem interface
export interface ShoppingCartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  extras?: Extra[];
  note?: string;
}

//ShoppingCart interface
export interface ShoppingCart {
  items: ShoppingCartItem[];
  totalItems: number;
  totalPrice: number;
}

//Order Type delivery or pickup
export type OrderType = "delivery" | "pickup";

//Order Status
export enum OrderStatus {
  nuevo = "nuevo",
  enProceso = "en proceso",
  enviado = "enviado",
  entregado = "entregado",
  cancelado = "cancelado",
  finalizado = "finalizado",
}

//Order type
export type Order = {
  id?: string;
  customer: CustomerInfo;
  orderType: OrderType;
  items: ShoppingCartItem[];
  subtotal: number;
  status: OrderStatus;
  delivertyPrice?: number;
  paymentMethod: string;
  orderNumber?: number;
  total: number;
  createdAt: Timestamp;
  finishedAt?: Timestamp;
};

//Customer Info type
export type CustomerInfo = {
  uid: string | null;
  name: string;
  phone: string;
  address?: string | null;
  neighborhood?: Neighborhood | null;
};

//Neightborhood type
export type Neighborhood = {
  id: string;
  name: string;
  price: number;
  active: boolean;
};

//TasaBCV type
export type TasaUSD = {
  price: number;
  price_old: number;
  title: string;
};

//Schedule type
export type Schedule = {
  day: string;
  open: string;
  close: string;
  forced: boolean;
};

//Colors Type
export type Colors = {
  primary: string;
  secondary: string;
};

export type Garbage = {
  products: Product[];
  extras: Extras[];
  neighborhoods: Neighborhood[];
};


//AdminData type
export type AdminData = Partial<{
  address: string;
  categories: Category[];
  colors: Colors;
  companyName: string;
  email: string;
  extras: Extras[];
  garbage: Garbage;
  icon: string;
  logo: string;
  neighborhoods: Neighborhood[];
  paymentMethods: string[];
  products: Product[];
  schedules: Schedule[];
  whatsapp: string;
  whatsappDeliveryMessage: string;
  whatsappPickupMessage: string;

}>;

export type ValidMimeTypes = {
  "image/png": [".png"];
  "image/jpeg": [".jpg", ".jpeg"];
  "image/gif": [".gif"];
  "image/svg+xml": [".svg"];
  "image/webp": [".webp"];
  "video/*": [".mp4"];
  "application/pdf": [".pdf"];
};

export type DataChartType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
};

export type mediaRefType = {
  name: string;
  url: string;
};
