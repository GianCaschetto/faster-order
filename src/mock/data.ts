import { Category, Product } from "@/types/types";

const categories: Category[] = [
    {
        id: "1",
        name: 'Category1',
    },
    {
        id: "2",
        name: 'Category2',
    },
    {
        id: "3",
        name: 'Category3',
    },
];

const products: Product[] = [
    {
        id: "1",
        name: 'Sushi',
        categoryId: "1",
        price: 10,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU',
    },
    {
        id: "2",
        name: 'Pizza',
        categoryId: "1",
        price: 20,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU',
    },
    {
        id: "3",
        name: 'Hamburguesa',
        description: 'Description of product 3',
        categoryId:"1",
        price: 30,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU',
    },
    {
        id: "4",
        name: 'Perro Caliente',
        categoryId: "2",
        price: 40,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU',
    },
    {
        id: "5",
        name: 'Helado',
        categoryId: "3",
        price: 50,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU',
    },
    {
        id: "6",
        name: 'Panquecas',
        categoryId: "3",
        price: 15,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH68U2DRTD2tSrG6xfxbqcKCMWxGu9i5AejCungBf2E_8rYMYcGFigzOolNBRgoUQxcbQ&usqp=CAU',
    },
];

export { categories, products}