import { styled } from '@mui/material';

const Image = styled('img')({});

export default function (props) {
    const {
        objectFit,
        ...rest,
    } = props
    return (
        <Image style={{ objectFit }} {...rest} />
    )
}