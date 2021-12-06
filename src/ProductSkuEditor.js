import { Box } from '@mui/material'
import React from 'react'

function ProdouctSku(props) {
    return (
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
            <TextField required label="规格" />
            <TextField required type="number" label="库存" />
            <TextField required type="number" label="价格" />
            <TextField label="商品编码" />
            <Button startIcon={<AddIcon />}>添加多规格</Button>
        </Stack>
    )
}

function ProductMultiSku(props) {
    const attrs = React.useState([])
    return (
        <Box></Box>
    )
}

export default function ProductSkuEditor(props) {
    const {
        isMulti,
        ...rest
    } = props
    return (
        <Box {...rest}>

        </Box>
    )
}