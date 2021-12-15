import { Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, InputAdornment, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageUpload from './ImageUpload';
import ClearIcon from '@mui/icons-material/Clear';


function ProdouctSku(props) {
    return (
        <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
            <TextField required label="规格" />
            <TextField required type="number" label="库存" />
            <TextField required type="number" label="价格" />
            <TextField label="商品编码" />
        </Stack>
    )
}

function ProductAttrItem(props) {
    const {
        handleDeleteItem,
        showDeleteButton = false,
        ...rest
    } = props
    return (
        <Stack direction="row" gap={2} alignItems="center" {...rest}>
            <TextField
                size="small"
                required
                label="规格值"
            />
            <ImageUpload height={48} width={48} />
            {showDeleteButton && <Button onClick={handleDeleteItem} startIcon={<DeleteIcon />} color="error">删除</Button>}
        </Stack>
    )
}

const DEFAULT_ITEM = { name: '', image: '' }
function ProductAttr(props) {
    const {
        handleDelete,
        showDeleteButton = false
    } = props
    const [data, setData] = React.useState([DEFAULT_ITEM])
    const handleAddItem = () => {
        setData([...data, DEFAULT_ITEM])
    }
    const handleDeleteItem = (i) => {
        data.splice(i, 1)
        setData([...data])
    }
    return (
        <Stack>
            <Stack gap={2} direction="row" alignItems="center" justifyContent="space-between">
                <TextField size="small" required label="规格类型" />
                {showDeleteButton && <Button color="error" onClick={handleDelete} startIcon={<DeleteIcon />} variant="outlined">删除规格</Button>}
            </Stack>
            <Stack mt={2} gap={2}>
                {data.map((item, i) => (
                    <ProductAttrItem showDeleteButton={data.length > 1} handleDeleteItem={() => handleDeleteItem(i)} />
                ))}
                <Box>
                    <Button onClick={handleAddItem} startIcon={<AddIcon />}>添加规格值</Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
            </Stack>
        </Stack>
    )
}

const DEFAULT_ATTR = { name: '' }
function ProductAttrEditor(props) {
    const {
        toggleMulti,
        ...rest
    } = props
    const [data, setData] = React.useState([DEFAULT_ATTR])
    const handleAdd = () => {
        setData([...data, DEFAULT_ATTR])
    }
    const handleDelete = (i) => {
        data.splice(i, 1)
        setData([...data])
    }

    return (
        <Box {...rest}>
            {data.map((item, i) => (
                <ProductAttr showDeleteButton={data.length > 1} handleDelete={() => handleDelete(i)} data={item} key={i} />
            ))}
            <Button onClick={handleAdd} startIcon={<AddIcon />} variant="outlined">添加规格</Button>
        </Box>
    )
}

function cartesian(arr) {
    if (arr.length < 2) return arr[0] || [];
    return arr.reduce((previous, current) => {
        let res = [];
        previous.forEach(p => {
            current.forEach(c => {
                let t = [].concat(Array.isArray(p) ? p : [p]);
                t.push(c);
                res.push(t);
            })
        });
        return res;
    })
}

function getRowSpan(arr) {
    const res = []
    let total = arr.reduce((a, b) => (a * b.length), 1)
    arr.forEach((item) => {
        total = parseInt(total) / item.length
        res.push(total)
    })
    return res
}

function ProductSkuTable(props) {
    const {
        sx,
        ...rest
    } = props
    const attrs = [
        { name: '颜色', items: ['红色', '蓝色', '黄色'] },
        { name: '尺寸', items: ['S', 'M', 'L'] },
    ]
    const itemsArr = attrs.map((item) => item.items)
    const dataList = cartesian(itemsArr)
    const rowSpan = getRowSpan(itemsArr)
    console.log(rowSpan)
    return (
        <TableContainer sx={{ maxHeight: 440, ...sx }} component={Paper} {...rest}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {attrs.map((item, i) => (
                            <TableCell align="center" key={i}>{item.name}</TableCell>
                        ))}
                        <TableCell>价格(元)</TableCell>
                        <TableCell>库存</TableCell>
                        <TableCell>商品编号</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataList.map((item, i) => (
                        <TableRow key={i}>
                            {item.map((item2, i2) => (
                                (i % rowSpan[i2] === 0 && <TableCell sx={{ borderRight: 1, borderColor: 'divider' }} align="center" key={i2} rowSpan={rowSpan[i2]}>{item2}</TableCell>)
                            ))}
                            <TableCell>
                                <TextField label="价格" required size='small' type="number" inputProps={{ min: 0 }} />
                            </TableCell>
                            <TableCell>
                                <TextField label="库存" required size='small' type="number" inputProps={{ min: 0 }} />
                            </TableCell>
                            <TableCell>
                                <TextField label="商品编号" size='small' />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function ProductMultiSku(props) {
    return (
        <Box>
            <ProductAttrEditor />
            <ProductSkuTable sx={{ mt: 2 }} />
        </Box>
    )
}

export default function ProductSkuEditor(props) {
    const {
        isMulti,
        ...rest
    } = props
    return (
        <Box {...rest}>
            {isMulti ? <ProductMultiSku /> : <ProdouctSku />}
        </Box>
    )
}