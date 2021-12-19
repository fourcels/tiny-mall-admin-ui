import axios from 'axios';

export async function create(params) {
    const { data } = await axios.post('/admin/categories/', params)
    return data
}