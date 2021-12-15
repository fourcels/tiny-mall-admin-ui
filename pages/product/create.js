import { AppBar, Box, Button, Container, FormControlLabel, IconButton, MenuItem, Paper, Stack, Switch, TextField, Toolbar, Typography } from '@mui/material';
import PageLayout from '../../src/layouts/PageLayout';
import ImageUpload from '../../src/components/ImageUpload'
import React from 'react';
import ProductSkuEditor from '../../src/components/ProductSkuEditor'

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
    const [isMulti, setIsMulti] = React.useState(false)
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
                <TextField required label="商品名称" />
                <TextField defaultValue="" select label="商品分类">
                    <MenuItem value="">
                        <em>无</em>
                    </MenuItem>
                    <MenuItem value={1}>水果</MenuItem>
                    <MenuItem value={2}>蔬菜</MenuItem>
                    <MenuItem value={3}>蛋糕</MenuItem>
                </TextField>
            </Stack>
            <TextField margin="normal" fullWidth label="商品简介" multiline rows={4} />
            <Box mt={2}>
                <ProductLabel title="商品图片:">
                    <Typography color="text.secondary">
                        默认显示第一张图，最多可添加10张（长按拖拽图片，可以调整顺序）
                    </Typography>
                </ProductLabel>
                <ImageUpload mt={2} multiple />
            </Box>
            <Box mt={2}>
                <ProductLabel title="商品规格:">
                    <FormControlLabel control={<Switch checked={isMulti} onChange={toggleMulti} />} label={<Typography color="text.secondary">启用多规格</Typography>} />
                </ProductLabel>
                <ProductSkuEditor mt={2} isMulti={isMulti} />
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
                        <Button size="large" variant="contained">保存商品</Button>
                    </Toolbar>
                </Container>
            </AppBar>
        </PageLayout>
    )
}