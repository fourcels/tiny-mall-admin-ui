import axios from 'axios';
import qs from 'qs';

export async function authenticate(params) {
    const { data } = await axios.post('/users/authenticate', qs.stringify(params))
    return data
}