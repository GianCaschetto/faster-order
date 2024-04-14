import { Category, Neighborhood, Product } from "@/types/types";

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
    price: 10,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU",
  },
  {
    id: "2",
    name: "Pizza",
    categoryId: "1",
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
  { name: "Trigal", price: 3},
  { name: "La Granja", price: 4 },
  { name: "La Isabelica", price: 5 },
  { name: "La Quizanda", price: 6 },
];

const paymentMethods = ["efectivo", "zelle", "binance", "pago movil"];
export { categories, products, neighborhoods, paymentMethods };
