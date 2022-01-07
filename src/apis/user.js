import axios from 'axios';

export async function update(id, params) {
    const { data } = await axios.patch(`/admin/users/${id}`, params)
    return data
}