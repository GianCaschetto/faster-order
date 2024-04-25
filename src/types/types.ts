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
};

//Extras Product Type
export type Extras = {
    id: string;
    available: boolean;
    title: string;
    items: Extra[];
}

//Extra type
export type Extra = {
    id: string;
    name: string;
    available: boolean;
    qty: number;
    price: number;
    description?: string;
};

//ShoppingCartItem interface
export interface ShoppingCartItem {
    id: string;
    product: Product;
    quantity: number;
    extras?: Extra[];
    price: number;
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
export type OrderStatus = "pending" | "completed" | "cancelled" | "in-progress";

//Order type
export type Order = {
    id: string;
    customer: CustomerInfo;
    orderType: OrderType;
    items: ShoppingCartItem[];
    subtotal: number;
    status: OrderStatus;
    delivertyPrice?: number;
    paymentMethod: string;
    createdAt: string;
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
    name: string;
    price: number;
};

//TasaBCV type
export type TasaBCV = {
    price: number;
    price_old: number;
    title: string;
  };

//Schedule type
export type Schedule = {
    day: number;
    open: number;
    close: number;
};

//AdminData type
export type AdminData = Partial<{
    companyName: string;
    whatsapp: string;
    email: string;
    categories: Category[];
    products: Product[];
    address: string;
    neighborhood: Neighborhood;
    deliveryPrice: number;
    schedule: Schedule[];
}>;