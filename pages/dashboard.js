import { Box, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import Layout from '../src/layouts/Layout';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import React from 'react';
import Link from '../src/components/Link';
import Loading from '../src/components/Loading';
import useList from '../src/hooks/useList';
import { formatDate } from '../src/libs/utils';
import { ORDER_STATUS_LABEL } from '../src/constant'


function Title(props) {
    return (
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
            {props.children}
        </Typography>
    );
}

function Chart() {
    const { list, loading } = useList('/admin/orders/stats')
    return (
        <Paper sx={{ p: 2 }}>
            <Title>订单走势</Title>
            {loading ? <Loading /> : (
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart
                        data={list}
                        margin={{
                            top: 16,
                            right: 16,
                            bottom: 0,
                            left: 24,
                        }}
                    >
                        <Tooltip />
                        <XAxis
                            dataKey="date"
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
                            name="订单数"
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Paper>
    );
}

function OrderItems({ data }) {
    return (
        <Stack>
            {data.map((item, i) => (
                <Box key={i}>
                    <Typography>{item.product_name}</Typography>
                    <Typography color="text.secondary" fontSize="small">{item.product_sku_name}</Typography>
                </Box>
            ))}
        </Stack>
    )
}

function OrderAddress({ data }) {
    return (
        <Stack>
            <Typography>
                {data.name}
            </Typography>
            <Typography color="text.secondary">{data.phone}</Typography>
        </Stack>
    )
}

function OrderStatus({ status }) {
    return (
        <Typography fontWeight={500} component="span">{ORDER_STATUS_LABEL[status]}</Typography>
    )
}

function OrderTable(props) {
    const {
        data,
        sx,
        ...rest
    } = props

    const { list, loading } = useList('/admin/orders/')


    return (
        <Paper sx={{ p: 2, ...sx }} {...rest}>
            <Title>最近订单</Title>
            {loading ? <Loading /> : (
                <TableContainer>
                    <Table stickyHeader sx={{ minWidth: 800 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>下单时间</TableCell>
                                <TableCell>商品信息</TableCell>
                                <TableCell align="center">收货人信息</TableCell>
                                <TableCell align="center">金额(元)</TableCell>
                                <TableCell align="center">状态</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {list.map((row, index) => (
                                <TableRow hover key={index}>
                                    <TableCell>{formatDate(row.created_at, 'yyyy-MM-dd HH:mm')}</TableCell>
                                    <TableCell>
                                        <OrderItems data={row.items} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <OrderAddress data={row.address} />
                                    </TableCell>
                                    <TableCell align="center">{row.amount / 100}</TableCell>
                                    <TableCell align="center">
                                        <OrderStatus status={row.status} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button component={Link} href={`/order/${row.order_no}`} variant="text">查看</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
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
            <OrderTable sx={{ mt: 2 }} />
        </Layout>
    )
}