import { AppBar, Box, Button, Container, FormControlLabel, IconButton, MenuItem, Paper, Stack, Switch, TextField, Toolbar, Typography } from '@mui/material';
import PageLayout from '../../src/layouts/PageLayout';
import ImageUpload from '../../src/components/ImageUpload'
import React from 'react';
import ProductSkuEditor from '../../src/components/ProductSkuEditor'
import { Controller, useForm } from 'react-hook-form';
import CategorySelect from '../../src/components/CategorySelect';
import apis from '../../src/apis';


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
    const [isMulti, setIsMulti] = React.useState(true)
    const { handleSubmit, control, setValue, getValues } = useForm();
    const onSubmit = async (params) => {
        const data = await apis.product.create(params)
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
                    render={({ field, fieldState }) => (
                        <TextField
                            label="商品名称"
                            required
                            {...field}
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