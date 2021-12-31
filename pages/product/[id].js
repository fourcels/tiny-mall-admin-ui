import { AppBar, Box, Button, CircularProgress, Container, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import apis from '../../src/apis';
import CategorySelect from '../../src/components/CategorySelect';
import ImageUpload from '../../src/components/ImageUpload';
import ProductSkuEditor from '../../src/components/ProductSkuEditor';
import useInfo from '../../src/hooks/useInfo';
import PageLayout from '../../src/layouts/PageLayout';


function ProductLabel(props) {
    const {
        title,
        children,
        ...rest
    } = props
    return (
        <Stack direction="row" gap={2} alignItems="center"  {...rest}>
            <Typography>{title}</Typography>
            {children}
        </Stack>
    )
}

function ProductContent({ data }) {
    const { handleSubmit, control, setValue, getValues } = useForm({
        defaultValues: data
    });
    const router = useRouter()
    const onSubmit = async (params) => {
        if (params.category_id === '') {
            params.category_id = 0
        }
        await apis.product.update(data.id, params)
        router.back()
    }
    return (
        <Box>
            <Stack
                direction="row"
                gap={2}
                sx={{
                    '& .MuiTextField-root': { minWidth: 200 },
                }}>
                <Controller
                    defaultValue=""
                    name="name"
                    control={control}
                    rules={{ required: '商品名称不能为空' }}
                    render={({ field: { ref, ...rest }, fieldState }) => (
                        <TextField
                            label="商品名称"
                            required
                            {...rest}
                            inputRef={ref}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                        />
                    )}
                />
                <CategorySelect control={control} />
            </Stack>
            <Controller
                defaultValue=""
                name="desc"
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                        margin="normal"
                        fullWidth
                        label="商品简介"
                        multiline
                        rows={4}
                        {...field}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                    />
                )}
            />
            <Box mt={2}>
                <ProductLabel title="商品图片:">
                    <Typography color="text.secondary">
                        默认显示第一张图，最多可添加10张（长按拖拽图片，可以调整顺序）
                    </Typography>
                </ProductLabel>
                <Controller
                    defaultValue=""
                    name="images"
                    control={control}
                    render={({ field }) => (
                        <ImageUpload
                            mt={2}
                            multiple
                            max={10}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </Box>
            <Box mt={2}>
                <ProductLabel title="商品规格:">
                </ProductLabel>
                <ProductSkuEditor getValues={getValues} setValue={setValue} control={control} mt={2} isMulti={data.attrs} />
            </Box>
            <Toolbar />
            <AppBar
                position="fixed"
                sx={(theme) => ({
                    top: 'auto',
                    bottom: 0,
                    bgcolor: theme.palette.grey[100]
                })}>
                <Container>
                    <Toolbar disableGutters sx={{ justifyContent: 'right' }}>
                        <Button onClick={handleSubmit(onSubmit)} size="large" variant="contained">保存商品</Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    )
}

function formatData(data) {
    for (const key in data) {
        if (data[key] == null) {
            delete data[key]
        }
    }
    return data
}

export default function ProductEdit() {

    const router = useRouter()
    const { id } = router.query
    const { data, loading, isValidating } = useInfo(router.isReady && `/admin/products/${id}`)
    return (
        <PageLayout title="编辑商品">
            {loading ? (
                <Box mt={2} textAlign="center">
                    <CircularProgress size={40} />
                </Box>
            ) : <ProductContent data={formatData(data)} />}

        </PageLayout >
    )
}