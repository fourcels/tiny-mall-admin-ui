import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import React from 'react';
import Layout from '../src/layouts/Layout';
import { styled } from '@mui/material/styles'
import AddIcon from '@mui/icons-material/Add';

function createData(name, count, sort) {
    return { name, count, sort };
}

const rows = [
    createData('水果', 0, 10),
    createData('蔬菜', 2, 9),
    createData('服装', 3, 8),
    createData('鲜花', 4, 7),
    createData('肉蛋', 5, 6),
    createData('肉蛋', 5, 6),
    createData('肉蛋', 5, 6),
    createData('肉蛋', 5, 6),
    createData('肉蛋', 5, 6),
    createData('肉蛋', 5, 6),
    createData('肉蛋', 5, 6),
    createData('肉蛋', 5, 6),
    createData('肉蛋', 5, 6),
];

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
                            <TableCell>序号</TableCell>
                            <TableCell>名称</TableCell>
                            <TableCell align="center">商品数量</TableCell>
                            <TableCell align="center">排序</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow hover key={index}>
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center">{row.count}</TableCell>
                                    <TableCell align="center">{row.sort}</TableCell>
                                    <TableCell align="center">
                                        <Button color="error" variant="text">删除</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
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

function ActionBar() {
    return (
        <Stack direction="row" justifyContent="right">
            <Button startIcon={<AddIcon />} variant="contained">添加新分类</Button>
        </Stack>
    )
}

export default function Category() {
    return (
        <Layout title="分类管理">
            <ActionBar />
            <DataTable sx={{ mt: 2 }} data={rows} />
        </Layout>
    )
}