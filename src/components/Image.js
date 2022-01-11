const STATIC_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Image(props) {
    const {
        objectFit,
        src,
        alt = '',
        ...rest
    } = props
    return (
        <img alt={alt} style={{ objectFit }} src={`${STATIC_BASE_URL}/${src}`} {...rest} />
    )
}