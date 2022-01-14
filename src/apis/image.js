import axios from 'axios';

export async function create(file) {
    var formData = new FormData()
    formData.append("file", file)
    const { data } = await axios.post('/admin/images/', formData)
    return data
}

export async function remove(id) {
    const { data } = await axios.delete(`/admin/images/${id}`)
    return data
}