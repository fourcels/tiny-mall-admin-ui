const STATIC_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Image(props) {
    const {
        objectFit,
        src,
        alt = '',
        style,
        ...rest
    } = props
    return (
        <img alt={alt} style={{ verticalAlign: 'middle', objectFit, ...style }} src={`${STATIC_BASE_URL}/${src}`} {...rest} />
    )
}