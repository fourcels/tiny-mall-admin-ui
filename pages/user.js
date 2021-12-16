import { Button, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React from 'react';
import Layout from '../src/layouts/Layout';
import AddIcon from '@mui/icons-material/Add';

function createData(username, active, role, count, createdAt) {
    return { username, active, role, count, createdAt };
}

const rows = [
    createData('admin', true, true, 0, '2021-12-12'),
    createData('测试用户1', false, false, 2, '2021-12-12'),
    createData('测试用户2', true, false, 3, '2021-12-12'),
    createData('测试用户3', true, false, 4, '2021-12-12'),
    createData('测试用户4', true, false, 0, '2021-12-12'),
    createData('测试用户5', true, false, 0, '2021-12-12'),
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
                            <TableCell align="center">用户名</TableCell>
                            <TableCell align="center">状态</TableCell>
                            <TableCell align="center">用户类型</TableCell>
                            <TableCell align="center">订单数</TableCell>
                            <TableCell align="center">创建时间</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow hover key={index}>
                                    <TableCell align="center">
                                        {row.username}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.active ? <Typography color="primary">正常</Typography> : <Typography color="error">禁用</Typography>}
                                    </TableCell>
                                    <TableCell align="center">
                                        {row.role ? <Typography color="primary">管理员</Typography> : <Typography color="text.secondary">普通用户</Typography>}
                                    </TableCell>
                                    <TableCell align="center">{row.count}</TableCell>
                                    <TableCell align="center">{row.createdAt}</TableCell>

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

export default function User() {
    return (
        <Layout title="用户管理">
            <DataTable data={rows} />
        </Layout>
    )
}