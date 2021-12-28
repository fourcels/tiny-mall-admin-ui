import { AppBar, Button, Container, Toolbar } from '@mui/material';
import { useForm } from 'react-hook-form';
import PageLayout from '../../src/layouts/PageLayout';

export default function ProductEdit() {
    const { handleSubmit, control, setValue, getValues } = useForm();
    const onSubmit = async (params) => {
        if (params.category_id === '') {
            params.category_id = 0
        }
        await apis.product.create(params)
    }
    return (
        <PageLayout title="编辑商品">

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