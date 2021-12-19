import axios from 'axios';

export default async function (url) {
    const { data } = await axios.get(url)
    return data
};