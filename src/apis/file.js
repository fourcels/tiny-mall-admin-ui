import axios from 'axios';

export async function upload(file) {
    var formData = new FormData()
    formData.append("file", file)
    const { data } = await axios.post('/files/upload', formData)
    return data
}