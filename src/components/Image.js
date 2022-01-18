import { styled } from '@mui/material'

const STATIC_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

const Img = styled('img')({
    verticalAlign: 'middle'
})

export default function Image(props) {
    const {
        objectFit,
        src,
        alt = '',
        loading = 'lazy',
        sx,
        ...rest
    } = props
    return (
        <Img alt={alt} sx={{ objectFit, ...sx }} src={`${STATIC_BASE_URL}/${src}`} loading={loading} {...rest} />
    )
}