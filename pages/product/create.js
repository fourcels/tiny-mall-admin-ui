import { AppBar, Box, Button, Container, IconButton, MenuItem, Paper, Stack, TextField, Toolbar } from '@mui/material';
import PageLayout from '../../src/layouts/PageLayout';
import ImageUpload from '../../src/components/ImageUpload'
import AddIcon from '@mui/icons-material/Add';
import React from 'react';


export default function ProductCreate() {
    const isMulti = React.useState(false)
    return (
        <PageLayout title="添加新商品">
            <Paper sx={{ p: 3 }}>
                <Stack
                    direction="row"
                    gap={2}
                    sx={{
                        '& .MuiTextField-root': { minWidth: 200 },
                    }}>
                    <TextField required label="商品名称" />
                    <TextField select label="商品分类">
                        <MenuItem value="">
                            <em>无</em>
                        </MenuItem>
                        <MenuItem value={1}>水果</MenuItem>
                        <MenuItem value={2}>蔬菜</MenuItem>
                        <MenuItem value={3}>蛋糕</MenuItem>
                    </TextField>
                </Stack>
                <TextField margin="normal" fullWidth label="商品简介" multiline rows={4} />
                <ImageUpload mt={2} multiple />
                <Stack mt={3} direction="row" alignItems="center" flexWrap="wrap" gap={2}>
                    <TextField required label="规格" />
                    <TextField required type="number" label="库存" />
                    <TextField required type="number" label="价格" />
                    <TextField label="商品编码" />
                    <Button startIcon={<AddIcon />}>添加多规格</Button>
                </Stack>
            </Paper>
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