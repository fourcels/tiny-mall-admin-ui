import axios from 'axios';
import qs from 'qs';

export async function token(params) {
    const { data } = await axios.post('/auth/token', qs.stringify(params))
    return data
}