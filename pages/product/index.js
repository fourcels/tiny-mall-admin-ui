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


function createData(name, sku, price, stock, category, status) {
    return { name, sku, price, stock, category, status };
}

const rows = [
    createData('水果', 'ABC', 100, 10000, '蔬菜', true),
    createData('水果', 'ABC', 100, 10000, '蔬菜', false),
    createData('水果', 'ABC', 100, 10000, '蔬菜', true),
    createData('水果', 'ABC', 100, 10000, '蔬菜', true),
    createData('水果', 'ABC', 100, 10000, '蔬菜', true),
    createData('水果', 'ABC', 100, 10000, '蔬菜', true),
    createData('水果', 'ABC', 100, 10000, '蔬菜', true),
];

function FilterBar(props) {
    const {
        sx,
        ...rest
    } = props
    return (
        <Paper sx={{ p: 3, ...sx }} {...rest}>
            <Stack
                sx={{
                    '& .MuiTextField-root': { minWidth: 200 },
                }}
                direction="row" flexWrap="wrap" gap={2}>
                <TextField label="商品名称" />
                <TextField defaultValue="" select label="商品分类">
                    <MenuItem value="">
                        <em>无</em>
                    </MenuItem>
                    <MenuItem value={1}>水果</MenuItem>
                    <MenuItem value={2}>蔬菜</MenuItem>
                    <MenuItem value={3}>蛋糕</MenuItem>
                </TextField>
                <TextField defaultValue="" select label="商品状态">
                    <MenuItem value="">
                        <em>无</em>
                    </MenuItem>
                    <MenuItem value={1}>售卖中</MenuItem>
                    <MenuItem value={0}>已下架</MenuItem>
                </TextField>
                <TextField label="商品编码" />
            </Stack>
            <Stack mt={2} direction="row" gap={2} alignItems="center">
                <Button startIcon={<FilterAltIcon />} variant="contained">筛选</Button>
                <Button startIcon={<ClearAllIcon />} variant="outlined" color="error">重置</Button>
            </Stack>
        </Paper>
    )
}

function ProductStatus(props) {
    const {
        value,
        onChange,
    } = props
    return (
        <Switch
            checked={value}
            onChange={onChange}
        />
    )

}

function ProductInfo({ data }) {
    return (
        <Stack direction="row">
            {data.images.length > 0 && <Image sx={{ mr: 1 }} src={data.images[0]} height={64} width={64} />}
            <Stack justifyContent="center" >
                <Typography>{data.name}</Typography>
            </Stack>
        </Stack>
    )
}

function ProductSkus({ data }) {
    return (
        data.attrs ? (
            <Stack>
                {data.attrs.map((item, i) => (
                    <Stack key={i} direction="row" gap={1}>
                        <Typography fontWeight={500}>{item.name}:</Typography>
                        <Typography>{item.items.map((item) => item.value).join(', ')}</Typography>
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
            if (error.response) {
                if (error.response.status == 400 || error.response.status == 422) {
                    let message = error.response.data?.detail
                    if (typeof message === 'object') {
                        message = JSON.stringify(message)
                    }
                    notistack.error(message || '参数错误')
                }
            }
            throw error
        }
    }

    return (
        <Paper {...rest}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell >名称</TableCell>
                            <TableCell align="center">规格</TableCell>
                            <TableCell align="center">价格(元)</TableCell>
                            <TableCell align="center">分类</TableCell>
                            <TableCell align="center">库存</TableCell>
                            <TableCell align="center">是否在售</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row, index) => (
                            <TableRow hover key={row.id}>
                                <TableCell>
                                    <ProductInfo data={row} />
                                </TableCell>
                                <TableCell align="center">
                                    <ProductSkus data={row} />
                                </TableCell>
                                <TableCell align="center">
                                    <ProductPrice data={row.skus} />
                                </TableCell>
                                <TableCell align="center">{row.category ? row.category.name : '-'}</TableCell>
                                <TableCell align="center">{row.attrs ? '-' : row.skus[0].stock}</TableCell>
                                <TableCell align="center">
                                    <ProductStatus onChange={(event) => handleChangeStatus(row.id, event.target.checked)} value={row.status} />
                                </TableCell>
                                <TableCell align="center">
                                    <Button variant="text" color="secondary">复制</Button>
                                    <Button variant="text">编辑</Button>
                                    <Button variant="text" color="error">删除</Button>
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
    const { page = 1, page_size = 10 } = router.query

    const { list, total, mutate, loading } = useList(router.isReady && [
        '/admin/products/',
        { page, page_size }
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