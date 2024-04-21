import {
  Category,
  Extras,
  Neighborhood,
  Product,
  Schedule,
} from "@/types/types";

const extras: Extras[] = [
  {
    id: "1",
    available: true,
    title: "Extras",
    items: [
      {
        id: "1",
        name: "Carne",
        available: true,
        price: 2,
        qty: 2,
      },
      {
        id: "2",
        name: "Queso",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "3",
        name: "Tocineta",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "4",
        name: "Cebolla",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "5",
        name: "BBQ",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "6",
        name: "Salsa de la casa",
        available: true,
        price: 1,
        qty: 1,
      },
    ],
  },
  {
    id: "2",
    available: true,
    title: "Extras dulces",
    items: [
      {
        id: "7",
        name: "Chocolate",
        available: true,
        price: 2,
        qty: 2,
      },
      {
        id: "8",
        name: "Fresas",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "9",
        name: "Crema",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "10",
        name: "Caramelo",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "11",
        name: "Nutella",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "12",
        name: "Mermelada",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "13",
        name: "Leche condensada",
        available: true,
        price: 1,
        qty: 1,
      },
      {
        id: "14",
        name: "Galletas",
        available: true,
        price: 1,
        qty: 1,
      }
    ],
  }
];

const categories: Category[] = [
  {
    id: "1",
    name: "Category1",
  },
  {
    id: "2",
    name: "Category2",
  },
  {
    id: "3",
    name: "Category3",
  },
  {
    id: "4",
    name: "Category4",
  },
  {
    id: "5",
    name: "Category5",
  },
  {
    id: "6",
    name: "Category6",
  },
  {
    id: "7",
    name: "Category7",
  },
  {
    id: "8",
    name: "Category8",
  },
  {
    id: "9",
    name: "Category9",
  },
  {
    id: "10",
    name: "Category10",
  },
];

const products: Product[] = [
  {
    id: "1",
    name: "Sushi",
    categoryId: "1",
    description:
      "Pan de batata, carne 150 gramos, queso cheddar, tocineta, cebolla caramelizada, bbq y salsa de la casa",
    extras: ["1"],
    price: 10,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU",
  },
  {
    id: "2",
    name: "Pizza",
    categoryId: "1",
    extras: ["1"],
    description:
      "Pan de batata, carne 150 gramos, queso cheddar, tocineta, cebolla caramelizada, bbq y salsa de la casa",
    price: 20,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU",
  },
  {
    id: "3",
    name: "Hamburguesa",
    description: "Description of product 3",
    categoryId: "1",
    price: 30,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU",
  },
  {
    id: "4",
    name: "Perro Caliente",
    categoryId: "2",
    price: 40,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU",
  },
  {
    id: "5",
    name: "Helado",
    extras: ["1", "2"],
    categoryId: "3",
    price: 50,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU",
  },
  {
    id: "6",
    name: "Panquecas",
    categoryId: "3",
    price: 15,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU",
  },
];

const neighborhoods: Neighborhood[] = [
  { name: "Parral", price: 2 },
  { name: "Trigal", price: 3 },
  { name: "La Granja", price: 4 },
  { name: "La Isabelica", price: 5 },
  { name: "La Quizanda", price: 6 },
];

const paymentMethods = ["efectivo", "zelle", "binance", "pago movil"];

const schedules: Schedule[] = [
  {
    day: 0,
    open: 8,
    close: 20,
  },
  {
    day: 1,
    open: 8,
    close: 20,
  },
  {
    day: 2,
    open: 8,
    close: 20,
  },
  {
    day: 3,
    open: 0,
    close: 20,
  },
  {
    day: 4,
    open: 0,
    close: 23,
  },
  {
    day: 5,
    open: 8,
    close: 20,
  },
  {
    day: 6,
    open: 8,
    close: 20,
  },
];

export {
  categories,
  products,
  neighborhoods,
  paymentMethods,
  schedules,
  extras,
};
