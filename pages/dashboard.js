import { Box, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Layout from '../src/layouts/Layout';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import React from 'react';
import Link from '../src/components/Link';

function Title(props) {
    return (
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {props.children}
        </Typography>
    );
}

// Generate Sales Data
function createData(time, count) {
    return { time, count };
}

const data = [
    createData('00:00', 0),
    createData('03:00', 300),
    createData('06:00', 600),
    createData('09:00', 800),
    createData('12:00', 1500),
    createData('15:00', 2000),
    createData('18:00', 2400),
    createData('21:00', 2400),
    createData('24:00', undefined),
];

function Chart() {
    return (
        <Paper sx={{ p: 2 }}>
            <Title>今日订单</Title>
            <ResponsiveContainer width="100%" height={240}>
                <LineChart
                    data={data}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="time"
                    />
                    <YAxis
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                            }}
                        >
                            订单数
                        </Label>
                    </YAxis>
                    <Line
                        isAnimationActive={false}
                        type="monotone"
                        dataKey="count"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
}

function createData2(orderNo, itemInfo, amount, userInfo, createdAt, remarks, status) {
    return { orderNo, itemInfo, amount, userInfo, createdAt, remarks, status };
}

const rows = [
    createData2(1, '水果', 10, '测试用户1', '2021-12-16', '', '待发货'),
    createData2(2, '水果', 10, '测试用户2', '2021-12-16', '', '已发货'),
    createData2(3, '水果', 10, '测试用户3', '2021-12-16', '', '售后'),
    createData2(4, '水果', 10, '测试用户4', '2021-12-16', '', '已发货'),
    createData2(5, '水果', 10, '测试用户5', '2021-12-16', '', '待发货'),
    createData2(6, '水果', 10, '测试用户6', '2021-12-16', '', '待发货'),
    createData2(7, '水果', 10, '测试用户7', '2021-12-16', '', '待发货'),
];

function OrderTable(props) {
    const {
        data,
        sx,
        ...rest
    } = props
    return (
        <Paper sx={{ p: 2, ...sx }} {...rest}>
            <Title>最近订单</Title>
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">下单时间</TableCell>
                            <TableCell align="center">商品信息</TableCell>
                            <TableCell align="center">收货人信息</TableCell>
                            <TableCell align="center">订单金额(元)</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell align="center">{row.createdAt}</TableCell>
                                <TableCell align="center">
                                    {row.itemInfo}
                                </TableCell>
                                <TableCell align="center">{row.userInfo}</TableCell>
                                <TableCell align="center">{row.amount}</TableCell>
                                <TableCell align="center">
                                    <Button component={Link} href={`/order/${row.orderNo}`} variant="text">查看详情</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box mt={2}>
                <Button component={Link} href="/order" variant='contained'>查看更多订单</Button>
            </Box>
        </Paper>
    )
}

export default function Dashboard() {
    return (
        <Layout title="概要面板">
            <Chart />
            <OrderTable sx={{ mt: 2 }} data={rows} />
        </Layout>
    )
}