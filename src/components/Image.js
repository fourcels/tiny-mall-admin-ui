import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const STATIC_BASE_URL = publicRuntimeConfig.API_BASE_URL

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