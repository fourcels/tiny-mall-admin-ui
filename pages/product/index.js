import { Button, Card, Chip, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React from 'react';
import Image from 'next/image'
import Layout from '../../src/layouts/Layout';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Link from '../../src/components/Link'

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

function ActionBar() {
    return (
        <Stack direction="row" justifyContent="right">
            <Button component={Link} href="/product/create" startIcon={<AddIcon />} variant="contained">添加新商品</Button>
        </Stack>
    )
}

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

function ProductStatus({ status }) {
    return status ? (
        <Chip size="small" label="售卖中" color="primary" variant="outlined" />
    ) : (
        <Chip size="small" label="已下架" color="error" variant="outlined" />
    )

}

function ProductInfo({ data }) {
    return (
        <Stack direction="row">
            {data.image && <Image mr={1} src={data.image} height={80} width={80} />}
            <Stack justifyContent="center" >
                <Typography>{data.name}</Typography>
            </Stack>
        </Stack>
    )
}

function DataTable(props) {
    const {
        data,
        ...rest
    } = props
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
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
                            <TableCell align="center">状态</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow hover key={index}>
                                    <TableCell>
                                        <ProductInfo data={row} />
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.sku}
                                    </TableCell>
                                    <TableCell align="center">{row.price}</TableCell>
                                    <TableCell align="center">{row.category}</TableCell>
                                    <TableCell align="center">{row.stock}</TableCell>
                                    <TableCell align="center"><ProductStatus status={row.status} /></TableCell>
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
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

export default function Product() {
    return (
        <Layout title="商品管理">
            <ActionBar />
            <FilterBar sx={{ mt: 2 }} />
            <DataTable sx={{ mt: 2 }} data={rows} />
        </Layout>
    )
}