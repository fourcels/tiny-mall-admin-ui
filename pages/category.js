import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Modal, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material';
import React from 'react';
import Layout from '../src/layouts/Layout';
import AddIcon from '@mui/icons-material/Add';
import useList from '../src/hooks/useList'
import { Box } from '@mui/system';
import { Controller, useForm } from 'react-hook-form';
import apis from '../src/apis'
import { useSWRConfig } from 'swr';
import notistack from '../src/notistack';
import { useConfirm } from 'material-ui-confirm';
import Link from '../src/components/Link';
import { useRouter } from 'next/router';
import FieldEditor from '../src/components/FieldEditor'
import axios from 'axios';

function CreateButton({ onRefresh }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { handleSubmit, control, reset } = useForm();
    const onSubmit = async (params) => {
        try {
            await apis.category.create(params)
            setOpen(false)
            reset()
            onRefresh()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return
            }
            throw error
        }
    }
    return (
        <React.Fragment>
            <Button onClick={handleOpen} startIcon={<AddIcon />} variant="contained">添加新分类</Button>
            <Dialog
                open={open}
            >
                <DialogTitle>添加新分类</DialogTitle>
                <DialogContent>
                    <Controller
                        defaultValue=""
                        name="name"
                        control={control}
                        rules={{ required: '分类名称不能为空' }}
                        render={({ field, fieldState }) => (
                            <TextField
                                label="分类名称"
                                margin="normal"
                                required
                                autoFocus
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
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
function EditButton({ onRefresh, data }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { handleSubmit, control } = useForm({
        defaultValues: {
            name: data.name,
        }
    });
    const onSubmit = async (params) => {
        try {
            await apis.category.update(data.id, params)
            setOpen(false)
            onRefresh()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return
            }
            throw error
        }
    }
    return (
        <React.Fragment>
            <Button onClick={handleOpen}>编辑</Button>
            <Dialog
                open={open}
            >
                <DialogTitle>编辑商品分类</DialogTitle>
                <DialogContent>
                    <Stack>

                        <Controller
                            defaultValue=""
                            name="name"
                            control={control}
                            rules={{ required: '分类名称不能为空' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="名称"
                                    margin="normal"
                                    required
                                    autoFocus
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
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
    const confirm = useConfirm()

    const handleDelete = async (data) => {
        try {
            await confirm({ title: `确定删除商品分类 ${data.name}` })
        } catch {
            return
        }
        try {
            await apis.category.remove(data.id)
            onRefresh()
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return
            }
            throw error
        }
    }

    const handleSortEdit = async (id, value) => {
        try {
            await apis.category.update(id, { sort: value })
            onRefresh()
            return true
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return false
            }
            throw error
        }
    }

    return (
        <Paper {...rest}>
            <TableContainer sx={{ height: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell >名称</TableCell>
                            <TableCell align="center">商品数量</TableCell>
                            <TableCell width={250} align="center">排序</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list?.map((row, index) => (
                            <TableRow hover key={row.id}>
                                <TableCell>
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">
                                    <Link
                                        href={{
                                            pathname: '/product',
                                            query: {
                                                category_id: row.id
                                            },
                                        }}
                                    >
                                        {row.product_count}
                                    </Link>
                                </TableCell>
                                <TableCell align="center">
                                    <FieldEditor
                                        onEdit={(params) => handleSortEdit(row.id, params)}
                                        value={row.sort}
                                        rules={{
                                            required: '排序不能为空',
                                            pattern: {
                                                value: /^\d+$/,
                                                message: '排序必须为整数'
                                            }
                                        }}
                                        type='number'
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <EditButton onRefresh={onRefresh} data={row} />
                                    <Button color="error" variant="text" onClick={() => handleDelete(row)}>删除</Button>
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

export default function Category() {
    const router = useRouter()
    const { page = 1, page_size = 10 } = router.query

    const { list, total, mutate, loading } = useList(router.isReady && [
        '/admin/categories/',
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
        <Layout title="分类管理">
            <Stack direction="row" justifyContent="right">
                <CreateButton onRefresh={handleRefreh} />
            </Stack>
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