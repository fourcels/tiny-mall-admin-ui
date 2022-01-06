import { useRouter } from 'next/router';
import PageLayout from '../../src/layouts/PageLayout';
import { CircularProgress, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import { Box } from '@mui/system';
import useInfo from '../../src/hooks/useInfo';
import Loading from '../../src/components/Loading';
import { ORDER_STATUS_LABEL } from '../../src/constant';
import { format } from 'date-fns';

function OrderLabel(props) {
    const {
        title,
        children,
        ...rest
    } = props
    return (
        <Stack direction="row" {...rest}>
            <Typography component="span" width="5em" color="text.secondary">{title}</Typography>
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

function OrderContent({ data }) {
    return (
        <Stack>
            <OrderInfo title="订单信息">
                <Stack gap={4} direction="row">
                    <Stack gap={2}>
                        <OrderLabel title="下单人">{data.user.username}</OrderLabel>
                        <OrderLabel title="订单号">{data.order_no}</OrderLabel>
                        <OrderLabel title="订单金额"><Typography component="span" color="warning.main">¥{data.amount / 100}</Typography></OrderLabel>
                        {data.remarks && <OrderLabel title="备注">{data.remarks}</OrderLabel>}
                    </Stack>
                    <Stack gap={2}>
                        <OrderLabel title="物流方式">快递发货</OrderLabel>
                        <OrderLabel title="订单状态">{ORDER_STATUS_LABEL[data.status]}</OrderLabel>
                        <OrderLabel title="订单时间">{format(new Date(data.created_at), 'yyyy-MM-dd HH:mm')}</OrderLabel>
                    </Stack>
                </Stack>
            </OrderInfo>
            <OrderInfo title="收货人信息" sx={{ mt: 2 }}>
                <Stack gap={2}>
                    <OrderLabel title="收货人">{data.address.name}</OrderLabel>
                    <OrderLabel title="联系电话">{data.address.phone}</OrderLabel>
                    <OrderLabel title="详细地址">{data.address.location} {data.address.detail}</OrderLabel>
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
                            {data.items.map((item, i) => (
                                <TableRow key={i}>
                                    <TableCell align="center">{item.product_name}</TableCell>
                                    <TableCell align="center">{item.product_sku_name}</TableCell>
                                    <TableCell align="center">¥{item.price / 100}</TableCell>
                                    <TableCell align="center">{item.num}</TableCell>
                                    <TableCell align="center">¥{item.total_price / 100}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={3} />
                                <TableCell align="center">合计</TableCell>
                                <TableCell align="center"><Typography component="span" color="warning.main">¥{data.amount / 100}</Typography></TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </OrderInfo>
        </Stack>
    )
}

export default function OrderShow() {
    const router = useRouter()
    const { orderNo } = router.query
    const { data, loading } = useInfo(router.isReady && `/admin/orders/${orderNo}`)
    return (
        <PageLayout title="订单详情">
            {loading ? (
                <Loading mt={2} />
            ) : <OrderContent data={data} />}

        </PageLayout>
    )
}