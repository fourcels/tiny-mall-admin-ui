import { Box, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import React from 'react';
import Layout from '../../src/layouts/Layout';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Link from '../../src/components/Link';
import { DateRangePicker, DesktopDatePicker } from '@mui/lab';

function createData(orderNo, itemInfo, amount, userInfo, createdAt, remarks, status) {
    return { orderNo, itemInfo, amount, userInfo, createdAt, remarks, status };
}

const rows = [
    createData(1, '水果', 10, '测试用户1', '2021-12-16', '', '待发货'),
    createData(2, '水果', 10, '测试用户2', '2021-12-16', '', '已发货'),
    createData(3, '水果', 10, '测试用户3', '2021-12-16', '', '售后'),
    createData(4, '水果', 10, '测试用户4', '2021-12-16', '', '已发货'),
    createData(5, '水果', 10, '测试用户5', '2021-12-16', '', '待发货'),
    createData(6, '水果', 10, '测试用户6', '2021-12-16', '', '待发货'),
    createData(7, '水果', 10, '测试用户7', '2021-12-16', '', '待发货'),
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
                            <TableCell>订单号</TableCell>
                            <TableCell>商品信息</TableCell>
                            <TableCell align="center">订单金额(元)</TableCell>
                            <TableCell align="center">收货人信息</TableCell>
                            <TableCell align="center">下单时间</TableCell>
                            <TableCell align="center">备注</TableCell>
                            <TableCell align="center">订单状态</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow hover key={index}>
                                    <TableCell>
                                        {row.orderNo}
                                    </TableCell>
                                    <TableCell>
                                        {row.itemInfo}
                                    </TableCell>
                                    <TableCell align="center">{row.amount}</TableCell>
                                    <TableCell align="center">{row.userInfo}</TableCell>
                                    <TableCell align="center">{row.createdAt}</TableCell>
                                    <TableCell align="center">{row.remarks}</TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">
                                        <Button component={Link} href={`/order/${row.orderNo}`} variant="text">查看详情</Button>
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

function FilterBar(props) {
    const {
        sx,
        ...rest
    } = props

    const [value, setValue] = React.useState([null, null]);

    const handleChange = (newValue) => {
        setValue(newValue);
    };
    return (
        <Paper sx={{ p: 3, ...sx }} {...rest}>
            <Stack
                sx={{
                    '& .MuiTextField-root': { minWidth: 200 },
                }}
                direction="row" flexWrap="wrap" gap={2}>
                <TextField label="订单号" />
                <TextField label="收货人" />

                <TextField select label="订单状态">
                    <MenuItem value="">
                        <em>无</em>
                    </MenuItem>
                    <MenuItem value={2}>待发货</MenuItem>
                    <MenuItem value={3}>待收货</MenuItem>
                    <MenuItem value={6}>退款中</MenuItem>
                    <MenuItem value={7}>已退款</MenuItem>
                    <MenuItem value={8}>已完成</MenuItem>
                </TextField>

                <DateRangePicker
                    startText="开始"
                    endText="结束"
                    inputFormat="yyyy-MM-dd"
                    value={value}
                    onChange={handleChange}
                    renderInput={(startProps, endProps) => (
                        <React.Fragment>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} />
                        </React.Fragment>
                    )}
                />
            </Stack>
            <Stack mt={2} direction="row" gap={2} alignItems="center">
                <Button startIcon={<FilterAltIcon />} variant="contained">筛选</Button>
                <Button startIcon={<ClearAllIcon />} variant="outlined" color="error">重置</Button>
            </Stack>
        </Paper>
    )
}

export default function Order() {
    return (
        <Layout title="订单管理">
            <FilterBar />
            <DataTable sx={{ mt: 2 }} data={rows} />
        </Layout>
    )
}