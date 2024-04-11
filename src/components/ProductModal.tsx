import { Product } from '@/types/types'
import Counter from './Counter'
import React from 'react'

type ProductModalProps = {
    counter: number
    product: Product
    addToCart: (product: Product) => void
    setCounter: React.Dispatch<React.SetStateAction<number>>
    toggleModal: (productId: string) => void
    }

function ProductModal({ counter, product, toggleModal, addToCart, setCounter }: ProductModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center w-full">
        <div className="dark:bg-white dark:text-black bg-black text-white p-4 rounded-lg flex flex-col items-center justify-center w-1/4 h-1/4 relative">
            <div className='flex justify-between w-full'>
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <button onClick={() => toggleModal(product.id)} className="mt-2 bg-red-500 text-white p-2 rounded-lg">
                X
            </button>
            </div>
            <Counter setCounter={setCounter} counter={counter}/>
            <button onClick={() => addToCart(product)} className="ml-4 bg-blue-500 text-white p-2 rounded-lg mt-2">
            Add to cart
            </button>
        </div>
        </div>
    )
}
      

export default ProductModal