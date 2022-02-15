import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Paper, Stack, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
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
import { Controller, useForm } from 'react-hook-form';
import PasswordField from '../src/components/PasswordField';
import useUser from '../src/hooks/useUser';

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

function CreateButton({ onRefresh }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { handleSubmit, control, reset } = useForm({
        defaultValues: {
            username: '',
            password: '',
            role: 10,
        }
    });
    const onSubmit = async (params) => {
        try {
            await apis.user.create(params)
            setOpen(false)
            reset()
            onRefresh()
        } catch (error) {
            if (error instanceof APIError) {
                return
            }
            throw error
        }
    }
    return (
        <React.Fragment>
            <Button onClick={handleOpen} startIcon={<AddIcon />} variant="contained">添加新用户</Button>
            <Dialog
                open={open}
            >
                <DialogTitle>添加新用户</DialogTitle>
                <DialogContent>
                    <Stack>

                        <Controller
                            defaultValue=""
                            name="username"
                            control={control}
                            rules={{ required: '用户名不能为空' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="用户名"
                                    margin="normal"
                                    required
                                    autoFocus
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            defaultValue=""
                            name="password"
                            control={control}
                            rules={{ required: '密码不能为空' }}
                            render={({ field, fieldState }) => (
                                <PasswordField
                                    label="密码"
                                    margin="normal"
                                    required
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                        <Controller
                            defaultValue={10}
                            name="role"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="用户类型"
                                    margin="normal"
                                    required
                                    autoFocus
                                    select
                                    {...field}
                                >
                                    <MenuItem value={2}>管理员</MenuItem>
                                    <MenuItem value={10}>普通用户</MenuItem>
                                </TextField>
                            )}
                        />
                    </Stack>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">取消</Button>
                    <Button onClick={handleSubmit(onSubmit)}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

export default function User() {
    const router = useRouter()
    const { user } = useUser()
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
            {user?.role === 1 && <Stack direction="row" justifyContent="right">
                <CreateButton onRefresh={handleRefreh} />
            </Stack>}
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