//Category type
export type Category = {
    id: string;
    name: string;
};

//Product type
export type Product = {
    id: string;
    name: string;
    description?: string;
    price: number;
    image: string;
    categoryId: string;
};

//ShoppingCartItem interface
export interface ShoppingCartItem {
    id: string;
    product: Product;
    quantity: number;
}

//ShoppingCart interface
export interface ShoppingCart {
    items: ShoppingCartItem[];
    totalItems: number;
    totalPrice: number;
}
