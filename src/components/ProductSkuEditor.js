import { Avatar, Box, Button, Chip, Divider, FormControlLabel, IconButton, InputAdornment, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React from 'react'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageUpload from './ImageUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import PriceInput from './PriceInput'


function ProdouctSku(props) {
    const {
        control
    } = props
    return (
        <Stack direction="row" flexWrap="wrap" gap={2}>
            <Controller
                defaultValue=""
                name="skus.0.name"
                control={control}
                rules={{ required: '规格不能为空' }}
                render={({ field, fieldState }) => (
                    <TextField
                        label="规格"
                        required
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
            <Controller
                defaultValue=""
                name="skus.0.price"
                control={control}
                rules={{
                    required: '价格不能为空',
                    min: { value: 0, message: '价格必须大于等于0' },
                }}
                render={({ field, fieldState }) => (
                    <TextField
                        label="价格"
                        required
                        type="number"
                        inputProps={{ min: 0 }}
                        InputProps={{
                            inputComponent: PriceInput
                        }}
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
            <Controller
                defaultValue=""
                name="skus.0.stock"
                control={control}
                rules={{
                    required: '库存不能为空',
                    min: { value: 0, message: '库存必须大于等于0' },
                    pattern: { value: /^\d+$/, message: '库存必须为整数' }
                }}
                render={({ field, fieldState }) => (
                    <TextField
                        label="库存"
                        required
                        type="number"
                        inputProps={{
                            min: 0,
                        }}
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
            <Controller
                defaultValue=""
                name="skus.0.sn"
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                        label="商品编码"
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
        </Stack>
    )
}

function ProductAttrItem(props) {
    const {
        name,
        control,
        handleDeleteItem,
        showDeleteButton = false,
        ...rest
    } = props
    return (
        <Stack gap={2} direction="row" alignItems="center" bgcolor="grey.100" borderRadius={1} py={1} px={2} {...rest}>
            <Controller
                defaultValue=""
                name={`${name}.value`}
                control={control}
                rules={{ required: '规格值不能为空' }}
                render={({ field, fieldState }) => (
                    <TextField
                        label="规格值"
                        size="small"
                        required
                        sx={{ maxWidth: 150 }}
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                            endAdornment: showDeleteButton && (
                                <InputAdornment position="end">
                                    <Tooltip title="删除">
                                        <IconButton onClick={handleDeleteItem} edge="end" color="error"><DeleteIcon /></IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                    />
                )}
            />
            <Controller
                defaultValue=""
                name={`${name}.image`}
                control={control}
                render={({ field }) => (
                    <ImageUpload value={field.value} width={60} height={60} onChange={field.onChange} />
                )}
            />
        </Stack>
    )
}

function ProductAttr(props) {
    const {
        control,
        name,
        handleDelete,
        showDeleteButton = false,
    } = props
    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: `${name}.items`, // unique name for your Field Array,
    })
    const handleAddItem = () => {
        append(getDefaultItem());
    }
    const handleDeleteItem = (i) => {
        remove(i)
    }
    return (
        <Stack>
            <Stack gap={2} direction="row" alignItems="center" justifyContent="space-between">
                <Controller
                    defaultValue=""
                    name={`${name}.name`}
                    control={control}
                    rules={{ required: '规格类型不能为空' }}
                    render={({ field, fieldState }) => (
                        <TextField
                            label="规格类型"
                            size="small"
                            required
                            {...field}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
                {showDeleteButton && <Button color="error" onClick={handleDelete} startIcon={<DeleteIcon />} variant="outlined">删除规格</Button>}
            </Stack>
            <Stack mt={2} gap={2}>
                <Stack direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                    {fields.map((item, i) => (
                        <ProductAttrItem control={control} showDeleteButton={fields.length > 1} key={item.id} name={`${name}.items.${i}`} handleDeleteItem={() => handleDeleteItem(i)} />
                    ))}
                    <Box>
                        <Button onClick={handleAddItem} startIcon={<AddIcon />}>添加规格值</Button>
                    </Box>
                </Stack>
                <Divider sx={{ mb: 2 }} />
            </Stack>
        </Stack>
    )
}

function ProductAttrEditor(props) {
    const {
        control,
        ...rest
    } = props

    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "attrs", // unique name for your Field Array,
    })

    const handleAdd = () => {
        append(getDefaultAttr());
    }
    const handleDelete = (i) => {
        remove(i)
    }

    return (
        <Box {...rest}>
            {fields.map((item, i) => (
                <ProductAttr showDeleteButton={fields.length > 1} control={control} handleDelete={() => handleDelete(i)} data={item} key={item.id} name={`attrs.${i}`} />
            ))}
            <Button onClick={handleAdd} startIcon={<AddIcon />} variant="outlined">添加规格</Button>
        </Box>
    )
}

function cartesian(arr) {
    if (arr.length === 0) return []
    if (arr.length === 1) return arr[0].map(item => [item]);
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
        control,
        getValues,
        sx,
        ...rest
    } = props

    const attrs = useWatch({ name: 'attrs', control })
    const [dataList, rowSpan] = React.useMemo(() => {
        const itemsArr = attrs?.filter((item) => !!item.name)
            .map((item) => item.items.filter((item) => !!item.value)) || []
        const dataList = cartesian(itemsArr)
        const rowSpan = getRowSpan(itemsArr)
        return [dataList, rowSpan]
    }, [attrs])
    const { fields, replace } = useFieldArray({
        name: 'skus',
        control,
    })
    React.useEffect(() => {
        const skus = getValues('skus')
        replace(dataList.map((item) => {
            const name = item.map((item) => item.value).join(',')
            const sku = skus.find((item) => item.name === name)
            return sku || getDefaultSku(name)
        }))
    }, [dataList, getValues])

    return (
        <TableContainer sx={{ maxHeight: 440, ...sx }} component={Paper} {...rest}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {attrs?.map((item, i) => (
                            <TableCell align="center" key={i}>{item.name}</TableCell>
                        ))}
                        <TableCell>价格(元)</TableCell>
                        <TableCell>库存</TableCell>
                        <TableCell>商品编号</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fields.map((item, i) => (
                        <TableRow key={item.id}>
                            {dataList[i]?.map((item2, i2) => (
                                (i % rowSpan[i2] === 0 && <TableCell sx={{ borderRight: 1, borderColor: 'divider' }} align="center" key={i2} rowSpan={rowSpan[i2]}>{item2.value}</TableCell>)
                            ))}
                            <TableCell>
                                <Controller
                                    defaultValue=""
                                    name={`skus.${i}.price`}
                                    control={control}
                                    rules={{
                                        required: '价格不能为空',
                                        min: { value: 0, message: '价格必须大于等于0' },
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            label="价格"
                                            required
                                            size='small'
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            InputProps={{
                                                inputComponent: PriceInput
                                            }}
                                            {...field}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Controller
                                    defaultValue=""
                                    name={`skus.${i}.stock`}
                                    control={control}
                                    rules={{
                                        required: '库存不能为空',
                                        min: { value: 0, message: '库存必须大于等于0' },
                                        pattern: { value: /^\d+$/, message: '库存必须为整数' }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            label="库存"
                                            required
                                            size='small'
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            {...field}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Controller
                                    defaultValue=""
                                    name={`skus.${i}.sn`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <TextField
                                            label="商品编号"
                                            size='small'
                                            {...field}
                                            error={!!fieldState.error}
                                            helperText={fieldState.error?.message}
                                        />
                                    )}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function ProductMultiSku(props) {
    const {
        getValues,
        control
    } = props
    return (
        <Box>
            <ProductAttrEditor control={control} />
            <ProductSkuTable getValues={getValues} control={control} sx={{ mt: 2 }} />
        </Box>
    )
}

export function getDefaultItem() {
    return { value: '', image: '' }
}

export function getDefaultAttr() {
    return { name: '', items: [getDefaultItem()] }
}

export function getDefaultSku(name = '') {
    return { name, price: 1000, stock: 10000, sn: '', image: '' }
}

export default function ProductSkuEditor(props) {
    const {
        isMulti,
        control,
        setValue,
        getValues,
        ...rest
    } = props
    return (
        <Box {...rest}>
            {isMulti ? <ProductMultiSku getValues={getValues} control={control} /> : <ProdouctSku control={control} />}
        </Box>
    )
}