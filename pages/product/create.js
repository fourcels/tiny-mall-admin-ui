import { AppBar, Box, Button, Container, FormControlLabel, IconButton, MenuItem, Paper, Stack, Switch, TextField, Toolbar, Typography } from '@mui/material';
import PageLayout from '../../src/layouts/PageLayout';
import React from 'react';
import ProductSkuEditor, { getDefaultAttr, getDefaultSku } from '../../src/components/ProductSkuEditor'
import { Controller, useForm } from 'react-hook-form';
import CategorySelect from '../../src/components/CategorySelect';
import apis from '../../src/apis';
import { useRouter } from 'next/router';
import ImageSelect from '../../src/components/ImageSelect';


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

export default function ProductCreate() {
    const router = useRouter()
    const [isMulti, setIsMulti] = React.useState(false)
    const { handleSubmit, control, setValue, getValues } = useForm();

    React.useEffect(() => {
        if (isMulti) {
            setValue('attrs', [getDefaultAttr()])
            setValue('skus', undefined)
        } else {
            setValue('attrs', undefined)
            setValue('skus', [getDefaultSku()])
        }
    }, [isMulti, setValue])
    const onSubmit = async (params) => {
        if (params.category_id === '') {
            params.category_id = 0
        }
        await apis.product.create(params)
        router.back()
    }
    const toggleMulti = (event) => {
        setIsMulti(event.target.checked);
    };
    return (
        <PageLayout title="添加新商品">
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
                        默认显示第一张图，最多可添加5张
                    </Typography>
                </ProductLabel>
                <Controller
                    defaultValue={[]}
                    name="images"
                    control={control}
                    render={({ field }) => (
                        <ImageSelect
                            mt={2}
                            multiple
                            max={5}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            </Box>
            <Box mt={2}>
                <ProductLabel title="商品规格:">
                    <FormControlLabel control={<Switch checked={isMulti} onChange={toggleMulti} />} label={<Typography color="text.secondary">启用多规格</Typography>} />
                </ProductLabel>
                <ProductSkuEditor getValues={getValues} setValue={setValue} control={control} mt={2} isMulti={isMulti} />
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
        </PageLayout >
    )
}