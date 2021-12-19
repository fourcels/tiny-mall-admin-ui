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
import Loading from '../src/components/Loading';

function DataTable(props) {
    const {
        loading,
        list,
        total,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        ...rest
    } = props

    return (
        <Paper {...rest}>
            <TableContainer sx={{ height: 440 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell >名称</TableCell>
                            <TableCell align="center">商品数量</TableCell>
                            <TableCell align="center">排序</TableCell>
                            <TableCell align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list?.map((row, index) => (
                            <TableRow hover key={index}>
                                <TableCell>
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{row.product_count}</TableCell>
                                <TableCell align="center">{row.sort}</TableCell>
                                <TableCell align="center">
                                    <Button color="error" variant="text">删除</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={total || -1}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}

function CreateButton({ onRefresh }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const { handleSubmit, control } = useForm();
    const onSubmit = async (params) => {
        try {
            await apis.category.create(params)
            setOpen(false)
            onRefresh()
        } catch (error) {
            if (error.response.status === 400) {
                notistack.error(error.response.data?.detail || '参数错误')
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

export default function Category() {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const { list, total, mutate, loading } = useList('/admin/categories/', {
        page: page + 1,
        page_size: rowsPerPage,
    })



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
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
                loading={loading}
                list={list}
                total={total}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                sx={{ mt: 2 }}
            />
        </Layout>
    )
}