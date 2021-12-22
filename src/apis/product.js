import axios from 'axios';

export async function create(params) {
    const { data } = await axios.post('/admin/products/', params)
    return data
}