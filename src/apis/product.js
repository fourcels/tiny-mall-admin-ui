import axios from 'axios';

export async function create(params) {
    const { data } = await axios.post('/admin/products/', params)
    return data
}
export async function update(id, params) {
    const { data } = await axios.patch(`/admin/products/${id}`, params)
    return data
}

export async function remove(id) {
    const { data } = await axios.delete(`/admin/products/${id}`)
    return data
}