import { Button, IconButton, InputAdornment, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { Controller, useForm } from 'react-hook-form';

function TextPreview(props) {
    const {
        value,
        openEdit,
        ...rest,
    } = props
    return (
        <Stack display="inline-flex" alignItems="center" gap={1} direction="row" {...rest}>
            <Typography>{value}</Typography>
            <Tooltip title="编辑">
                <IconButton onClick={openEdit} size='small' color="primary" ><EditIcon fontSize='inherit' /></IconButton>
            </Tooltip>
        </Stack >
    )
}

function TextEdit(props) {
    const {
        value,
        closeEdit,
        onEdit,
        type,
        rules,
        ...rest,
    } = props
    const { handleSubmit, control } = useForm({
        defaultValues: {
            value
        }
    });
    const onSubmit = async (params) => {
        try {
            const res = await onEdit(params.value)
            if (res) {
                closeEdit()
            }
        } catch (error) { throw error }
    }
    return (
        <Stack display="inline-flex" alignItems="center" direction="row" gap={1}>
            <Controller
                defaultValue=""
                name="value"
                control={control}
                rules={rules}
                render={({ field: { ref, ...rest }, fieldState }) => (
                    <TextField
                        sx={{ width: 120 }}
                        size='small'
                        required
                        autoFocus
                        inputRef={ref}
                        type={type}
                        {...rest}
                        FormHelperTextProps={{
                            sx: {
                                position: 'absolute',
                                bottom: (theme) => (theme.spacing(-3))
                            }
                        }}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
            <Tooltip title="取消">
                <IconButton onClick={closeEdit} size="small" color="error"><CloseIcon fontSize='inherit' /></IconButton>
            </Tooltip>
            <Tooltip title="确定">
                <IconButton onClick={handleSubmit(onSubmit)} size="small" color="primary"><CheckIcon fontSize='inherit' /></IconButton>
            </Tooltip>
        </Stack>
    )
}

export default function (props) {
    const {
        value,
        onEdit,
        type,
        rules,
        ...rest,
    } = props
    const [isEdit, setEdit] = React.useState(false)

    const openEdit = () => {
        setEdit(true)
    }
    const closeEdit = () => {
        setEdit(false)
    }

    return isEdit ? <TextEdit rules={rules} type={type} onEdit={onEdit} closeEdit={closeEdit} value={value} /> : <TextPreview openEdit={openEdit} value={value} />
}