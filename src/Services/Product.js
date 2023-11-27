import axios from 'axios';

export const addProduct = async (productData) => {
    try {
        console.log('productData check', productData.type);
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/addproducts`, productData);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
