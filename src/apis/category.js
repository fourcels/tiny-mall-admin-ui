import axios from 'axios';

export async function create(params) {
    const { data } = await axios.post('/admin/categories/', params)
    return data
}
export async function update(id, params) {
    const { data } = await axios.patch(`/admin/categories/${id}`, params)
    return data
}
export async function remove(id) {
    const { data } = await axios.delete(`/admin/categories/${id}`)
    return data
}