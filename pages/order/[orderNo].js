import { useRouter } from 'next/router';
import PageLayout from '../../src/layouts/PageLayout';
import { Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system';

function OrderLabel(props) {
    const {
        title,
        children,
        ...rest
    } = props
    return (
        <Stack direction="row" {...rest}>
            <Typography width="5em" color="text.secondary">{title}</Typography>
            {children}
        </Stack>
    )
}

function OrderInfo(props) {
    const {
        title,
        children,
        ...rest,
    } = props
    return (
        <Paper {...rest}>
            <Box p={2} borderBottom={1} borderColor="divider">
                <Typography variant='h6'>{title}</Typography>
            </Box>
            <Box p={2}>
                {children}
            </Box>
        </Paper>
    )
}

export default function ProductCreate() {
    const router = useRouter()
    const { orderNo } = router.query
    return (
        <PageLayout title="订单详情">
            <OrderInfo title="订单信息">
                <Stack gap={4} direction="row">
                    <Stack gap={2}>
                        <OrderLabel title="下单人">ABC</OrderLabel>
                        <OrderLabel title="订单号">{orderNo}</OrderLabel>
                        <OrderLabel title="订单金额">¥ 10</OrderLabel>
                        <OrderLabel title="备注">123</OrderLabel>
                    </Stack>
                    <Stack gap={2}>
                        <OrderLabel title="物流方式">快递发货</OrderLabel>
                        <OrderLabel title="订单状态">待发货</OrderLabel>
                        <OrderLabel title="订单时间">2021-12-16 09:36</OrderLabel>
                    </Stack>
                </Stack>
            </OrderInfo>
            <OrderInfo title="收货人信息" sx={{ mt: 2 }}>
                <Stack gap={2}>
                    <OrderLabel title="收货人">高宏</OrderLabel>
                    <OrderLabel title="联系电话">155****0917</OrderLabel>
                    <OrderLabel title="详细地址">浙江省温州市鹿城区</OrderLabel>
                </Stack>
            </OrderInfo>
            <OrderInfo title="商品信息" sx={{ mt: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">商品</TableCell>
                                <TableCell align="center">规格</TableCell>
                                <TableCell align="center">单价(元)</TableCell>
                                <TableCell align="center">数量</TableCell>
                                <TableCell align="center">销售金额</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align="center">测试2</TableCell>
                                <TableCell align="center">abc</TableCell>
                                <TableCell align="center">¥10</TableCell>
                                <TableCell align="center">1</TableCell>
                                <TableCell align="center">¥10</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={3} />
                                <TableCell align="center">合计</TableCell>
                                <TableCell align="center">商品总金额: ¥10</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </OrderInfo>

        </PageLayout>
    )
}