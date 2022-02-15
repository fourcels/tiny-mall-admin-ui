import { Button, Card, Chip, MenuItem, Paper, Select, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React from 'react';
import Layout from '../../src/layouts/Layout';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Link from '../../src/components/Link'
import { useRouter } from 'next/router';
import useList from '../../src/hooks/useList';
import Image from '../../src/components/Image'
import apis from '../../src/apis'
import FieldEditor from '../../src/components/FieldEditor';
import { useConfirm } from 'material-ui-confirm';
import { Controller, useForm } from 'react-hook-form';
import CategorySelect from '../../src/components/CategorySelect';
import { filterQuery } from '../../src/libs/utils';
import { APIError } from '../../src/errors';
import FieldSwitch from '../../src/components/FieldSwitch';

function FilterBar(props) {
    const {
        sx,
        ...rest
    } = props
    const router = useRouter()
    const { handleSubmit, control, reset } = useForm();
    React.useEffect(() => {
        const { name = '', category_id = '', status = '', sn = '' } = router.query
        reset({ name, category_id, status, sn })
    }, [router.query, reset])
    const onSubmit = async (params) => {
        const query = {
            ...router.query,
            ...params
        }
        router.push({
            pathname: router.pathname,
            query: filterQuery(query),
        }, undefined, { shallow: true })
    }
    const onReset = () => {
        reset({ name: '', category_id: '', status: '', sn: '' })
    }
    return (
        <Paper sx={{ p: 3, ...sx }} {...rest}>
            <Stack
                sx={{
                    '& .MuiTextField-root': { minWidth: 200 },
                }}
                direction="row" flexWrap="wrap" gap={2}>
                <Controller
                    defaultValue=""
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            label="商品名称"
                            {...field}
                        />
                    )}
                />
                <CategorySelect control={control} />
                <Controller
                    defaultValue=""
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            select
                            label="在售状态"
                            {...field}
                        >
                            <MenuItem value="">
                                <em>无</em>
                            </MenuItem>
                            <MenuItem value={true}>上架中</MenuItem>
                            <MenuItem value={false}>已下架</MenuItem>
                        </TextField>
                    )}
                />

                <Controller
                    defaultValue=""
                    name="sn"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            label="商品编码"
                            {...field}
                        />
                    )}
                />
            </Stack>
            <Stack mt={2} direction="row" gap={2} alignItems="center">
                <Button onClick={handleSubmit(onSubmit)} startIcon={<FilterAltIcon />} variant="contained">筛选</Button>
                <Button onClick={onReset} startIcon={<ClearAllIcon />} variant="outlined" color="error">重置</Button>
            </Stack>
        </Paper>
    )
}

function ProductInfo({ data }) {
    return (
        <Stack direction="row" alignItems="center" gap={1}>
            {data.images.length > 0 && <Image src={data.images[0]} height={64} width={64} />}
            <Typography component="span">{data.name}</Typography>
        </Stack>
    )
}

function ProductSkus({ data }) {
    return (
        data.attrs ? (
            <Stack display="inline-flex">
                {data.attrs.map((item, i) => (
                    <Stack key={i} direction="row" alignItems="center" gap={1}>
                        <Typography fontWeight={500}>{item.name}:</Typography>
                        <Typography flex={1}>{item.items.map((item) => item.value).join(', ')}</Typography>
                    </Stack>
                ))}
            </Stack>
        ) : <Typography>{data.skus[0].name}</Typography>
    )
}

function ProductPrice({ data }) {
    const prices = data.map((item) => item.price / 100)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return <Typography>{min === max ? min : `${min} ~ ${max}`}</Typography>
}

function DataTable(props) {
    const {
        loading,
        list,
        total,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        onRefresh,
        ...rest
    } = props

    const handleChangeStatus = async (id, status) => {
        try {
            await apis.product.update(id, { status })
            onRefresh()
        } catch (error) {
            if (error instanceof APIError) {
                return
            }
            throw error
        }
    }

    const confirm = useConfirm()

    const handleDelete = async (data) => {
        try {
            await confirm({ title: `确定删除商品 ${data.name}` })
        } catch {
            return
        }
        try {
            await apis.product.remove(data.id)
            onRefresh()
        } catch (error) {
            if (error instanceof APIError) {
                return
            }
            throw error
        }
    }

    const handleSortEdit = async (id, value) => {
        try {
            await apis.product.update(id, { sort: value })
            onRefresh()
            return true
        } catch (error) {
            if (error instanceof APIError) {
                return false
            }
            throw error
        }
    }

    return (
        <Paper {...rest}>
            <TableContainer sx={{ height: 440 }}>
                <Table stickyHeader sx={{ minWidth: 900 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell width={200}>名称</TableCell>
                            <TableCell width={250}>规格</TableCell>
                            <TableCell align="center" width={120}>价格(元)</TableCell>
                            <TableCell align="center" width={100}>分类</TableCell>
                            <TableCell align="center" width={100}>库存</TableCell>
                            <TableCell align="center" width={200}>排序</TableCell>
                            <TableCell align="center" width={100}>是否在售</TableCell>
                            <TableCell align="center" width={100}>操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row, index) => (
                            <TableRow hover key={row.id}>
                                <TableCell>
                                    <ProductInfo data={row} />
                                </TableCell>
                                <TableCell>
                                    <ProductSkus data={row} />
                                </TableCell>
                                <TableCell align="center">
                                    <ProductPrice data={row.skus} />
                                </TableCell>
                                <TableCell align="center">{row.category ? row.category.name : '-'}</TableCell>
                                <TableCell align="center">{row.attrs ? '-' : row.skus[0].stock}</TableCell>
                                <TableCell align="center">
                                    <FieldEditor
                                        onEdit={(params) => handleSortEdit(row.id, params)}
                                        value={row.sort}
                                        rules={{
                                            required: '排序不能为空',
                                            pattern: {
                                                value: /^\d+$/,
                                                message: '排序必须为整数'
                                            }
                                        }}
                                        type='number'
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <FieldSwitch onChange={(event) => handleChangeStatus(row.id, event.target.checked)} value={row.status} />
                                </TableCell>
                                <TableCell align="center">
                                    <Button component={Link} href={`/product/${row.id}`} variant="text">编辑</Button>
                                    <Button onClick={() => handleDelete(row)} variant="text" color="error">删除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                showFirstButton
                showLastButton
            />
        </Paper>
    )
}

export default function Product() {
    const router = useRouter()
    const { page = 1, page_size = 10, ...rest } = router.query

    const { list, total, mutate, loading } = useList(router.isReady && [
        '/admin/products/',
        { page, page_size, ...rest }
    ])


    const handleChangePage = (event, newPage) => {
        const page = newPage + 1
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                page
            }
        }, undefined, { shallow: true })
    };

    const handleChangeRowsPerPage = (event) => {
        router.push({
            pathname: router.pathname,
            query: {
                ...router.query,
                page: 1,
                page_size: +event.target.value
            }
        }, undefined, { shallow: true })
    };
    const handleRefreh = () => {
        mutate()
    }
    return (
        <Layout title="商品管理">
            <Stack direction="row" justifyContent="right">
                <Button component={Link} href="/product/create" startIcon={<AddIcon />} variant="contained">添加新商品</Button>
            </Stack>
            <FilterBar sx={{ mt: 2 }} />
            <DataTable
                onRefresh={handleRefreh}
                loading={loading}
                list={list}
                total={total}
                page={+page}
                rowsPerPage={+page_size}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                sx={{ mt: 2 }}
            />
        </Layout>
    )
}