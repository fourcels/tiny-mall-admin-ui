import { styled } from '@mui/material';

const STATIC_BASE_URL = process.env.NEXT_PUBLIC_STATIC_BASE_URL

const Image = styled('img')({});

export default function (props) {
    const {
        objectFit,
        src,
        ...rest,
    } = props
    return (
        <Image style={{ objectFit }} src={`${STATIC_BASE_URL}/${src}`} {...rest} />
    )
}