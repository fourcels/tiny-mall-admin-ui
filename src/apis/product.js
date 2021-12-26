import axios from 'axios';

export async function create(params) {
    const { data } = await axios.post('/admin/products/', params)
    return data
}
export async function update(id, params) {
    const { data } = await axios.patch(`/admin/products/${id}`, params)
    return data
}