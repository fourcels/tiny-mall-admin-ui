import { Box, Button, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React from 'react';
import Layout from '../../src/layouts/Layout';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import Link from '../../src/components/Link';
import { DatePicker } from '@mui/lab';
import { useRouter } from 'next/router';
import useList from '../../src/hooks/useList';
import { format, startOfDay } from 'date-fns'
import { ORDER_STATUS_LABEL } from '../../src/constant';
import { Controller, useForm } from 'react-hook-form';
import { filterQuery, formatDate, validateDate } from '../../src/libs/utils'

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
    return (
        <Paper {...rest}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell width={150}>订单号</TableCell>
                            <TableCell width={150}>商品信息</TableCell>
                            <TableCell align="center" width={100}>金额(元)</TableCell>
                            <TableCell align="center" width={150}>收货人信息</TableCell>
                            <TableCell align="center" width={100}>下单时间</TableCell>
                            <TableCell align="center" width={100}>订单状态</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell>
                                    {row.order_no}
                                </TableCell>
                                <TableCell>
                                    <OrderItems data={row.items} />
                                </TableCell>
                                <TableCell align="center">{row.amount / 100}</TableCell>
                                <TableCell align="center"><OrderAddress data={row.address} /></TableCell>
                                <TableCell align="center">{format(new Date(row.created_at), 'yyyy-MM-dd HH:mm')}</TableCell>
                                <TableCell align="center"><OrderStatus status={row.status} /></TableCell>
                                <TableCell align="center">
                                    <Button component={Link} href={`/order/${row.order_no}`} variant="text">查看</Button>
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

function FilterBar(props) {
    const {
        sx,
        ...rest
    } = props

    const router = useRouter()
    const { handleSubmit, control, reset, getValues } = useForm();
    React.useEffect(() => {
        const {
            order_no = '',
            status = '',
            name = '',
            phone = '',
            start = null,
            end = null
        } = router.query
        reset({
            order_no,
            status,
            name,
            phone,
            start: start && startOfDay(new Date(start)),
            end: end && startOfDay(new Date(end)),
        })
    }, [router.query])
    const onSubmit = async (params) => {
        const query = {
            ...router.query,
            ...params,
            start: formatDate(params.start),
            end: formatDate(params.end),
        }
        router.push({
            pathname: router.pathname,
            query: filterQuery(query),
        }, undefined, { shallow: true })
    }
    const onReset = () => {
        reset({ order_no: '', status: '', name: '', phone: '', start: null, end: null })
    }
    return (
        <Paper sx={{ p: 3, ...sx }} {...rest}>
            <Stack
                sx={{
                    '& .MuiTextField-root': { width: 200 },
                }}
                direction="row" flexWrap="wrap" gap={2}>
                <Controller
                    defaultValue=""
                    name="order_no"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            label="订单号"
                            {...field}
                        />
                    )}
                />
                <Controller
                    defaultValue=""
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            select
                            label="订单状态"
                            {...field}
                        >
                            <MenuItem value="">
                                <em>无</em>
                            </MenuItem>
                            <MenuItem value={1}>待支付</MenuItem>
                            <MenuItem value={2}>待发货</MenuItem>
                            <MenuItem value={3}>待收货</MenuItem>
                            <MenuItem value={4}>退款中</MenuItem>
                            <MenuItem value={10}>交易完成</MenuItem>
                            <MenuItem value={11}>交易取消</MenuItem>
                        </TextField>
                    )}
                />
                <Controller
                    defaultValue=""
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            label="收货人姓名"
                            {...field}
                        />
                    )}
                />
                <Controller
                    defaultValue=""
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            label="收货人手机号"
                            {...field}
                        />
                    )}
                />
                <Controller
                    defaultValue={null}
                    name="start"
                    control={control}
                    rules={{ validate: (v) => validateDate(v) }}
                    render={({ field }) => (
                        <DatePicker
                            label="开始时间"
                            mask="____-__-__"
                            inputFormat='yyyy-MM-dd'
                            shouldDisableDate={(day) => {
                                const end = getValues('end')
                                if (!end) {
                                    return false
                                }
                                return day >= startOfDay(end)
                            }}
                            {...field}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    )}
                />
                <Controller
                    defaultValue={null}
                    name="end"
                    control={control}
                    rules={{ validate: (v) => validateDate(v) }}
                    render={({ field }) => (
                        <DatePicker
                            label="结束时间"
                            mask="____-__-__"
                            inputFormat='yyyy-MM-dd'
                            shouldDisableDate={(day) => {
                                const start = getValues('start')
                                if (!start) {
                                    return false
                                }
                                return day <= startOfDay(start)
                            }}
                            {...field}
                            renderInput={(params) => <TextField {...params} />}
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

export default function Order() {
    const router = useRouter()
    const { page = 1, page_size = 10, ...rest } = router.query

    const { list, total, mutate, loading } = useList(router.isReady && [
        '/admin/orders/',
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
        <Layout title="订单管理" sx={{ minWidth: 800 }}>
            <FilterBar />
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