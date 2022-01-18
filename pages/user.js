import { Button, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React from 'react';
import Layout from '../src/layouts/Layout';
import AddIcon from '@mui/icons-material/Add';
import { formatDate } from '../src/libs/utils'
import { useRouter } from 'next/router';
import useList from '../src/hooks/useList';
import FieldSwitch from '../src/components/FieldSwitch';
import { APIError } from '../src/errors';
import apis from '../src/apis'
import { USER_ROLE_LABEL } from '../src/constant';
import FieldEditor from '../src/components/FieldEditor';

function UserRole({ role }) {
    return (
        <Typography component="span" color={role < 10 ? 'primary.main' : 'inherit'}>{USER_ROLE_LABEL[role]}</Typography>
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

    const handleChangeActive = async (id, is_active) => {
        try {
            await apis.user.update(id, { is_active })
            onRefresh()
        } catch (error) {
            if (error instanceof APIError) {
                return
            }
            throw error
        }
    }

    const handleBalanceEdit = async (id, value) => {
        try {
            await apis.user.update(id, { balance: value })
            onRefresh()
            return true
        } catch (error) {
            if (error instanceof APIError) {
                return false
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
                            <TableCell>用户名</TableCell>
                            <TableCell align="center">是否激活</TableCell>
                            <TableCell align="center">用户类型</TableCell>
                            <TableCell align="center">订单数</TableCell>
                            <TableCell align="center">余额(元)</TableCell>
                            <TableCell align="center">创建时间</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell>
                                    {row.username}
                                </TableCell>
                                <TableCell align="center">
                                    <FieldSwitch onChange={(event) => handleChangeActive(row.id, event.target.checked)} value={row.is_active} />
                                </TableCell>
                                <TableCell align="center">
                                    <UserRole role={row.role} />
                                </TableCell>
                                <TableCell align="center">{row.order_count}</TableCell>
                                <TableCell align="center">
                                    <FieldEditor
                                        onEdit={(value) => handleBalanceEdit(row.id, value * 100)}
                                        value={row.balance / 100}
                                        rules={{
                                            required: '余额不能为空'
                                        }}
                                        type='number'
                                    />
                                </TableCell>
                                <TableCell align="center">{formatDate(row.created_at)}</TableCell>

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

export default function User() {
    const router = useRouter()
    const { page = 1, page_size = 10 } = router.query

    const { list, total, mutate, loading } = useList(router.isReady && [
        '/admin/users/',
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
        <Layout title="用户管理">
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