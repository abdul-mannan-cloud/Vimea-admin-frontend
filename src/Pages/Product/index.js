import React from 'react'
import NavBar from '../../Components/navbar'
import Sidebar from '../../Components/sidebar'
import AddProduct from '../../resources/addproduct.png'
import { useNavigate } from 'react-router-dom'

const products = [
    { name: 'Product 1', type: 'Type 1', volume: '500ml', price: '$10', img1: 'img1.png', img2: 'img2.png' },
    { name: 'Product 2', type: 'Type 2', volume: '1000ml', price: '$20', img1: 'img3.png', img2: 'img4.png' },  { name: 'Product 1', type: 'Type 1', volume: '500ml', price: '$10', img1: 'img1.png', img2: 'img2.png' },
    { name: 'Product 2', type: 'Type 2', volume: '1000ml', price: '$20', img1: 'img3.png', img2: 'img4.png' },
];

const Products = () => {
    const navigate = useNavigate();
    
    return (
        <div className='flex h-screen'>
            <Sidebar />
            <div className='flex flex-col w-full overflow-auto'>
                <NavBar />
                <div className='pl-4 flex-grow bg-gray-100 flex flex-col items-center space-y-4'>
                <div className='pt-16 pr-16 flex items-end justify-end'>
                        <img src={AddProduct} className='w-100 h-10 mb-4 rounded-lg cursor-pointer' alt='Image 1' onClick={() => navigate('/products/add')} />
                    </div>
                    {products.map((product, index) => (
                        <div key={index} className='border p-4 rounded-lg w-full h-20 flex items-center justify-between'>
                            {/* <div> */}
                                <h2 className='font-bold mb-3'>{product.name}</h2>
                                <p>Type: {product.type}</p>
                                <p>Volume: {product.volume}</p>
                                <p>Price: {product.price}</p>
                            {/* </div> */}
                            {/* <div className='flex flex-col'> */}
                                <img src={product.img1} className='w-24 h-24 mb-2 rounded-lg' alt='Product image 1' />
                                <img src={product.img2} className='w-24 h-24 rounded-lg' alt='Product image 2' />
                            {/* </div> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Products;
