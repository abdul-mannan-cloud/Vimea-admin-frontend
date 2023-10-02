import axios from 'axios';

export const addProduct = async (productData) => {
    try {
        console.log('productData check', productData.type);
        const response = await axios.post('http://localhost:3001/addproducts', productData);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
