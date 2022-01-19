import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Head from 'next/head';
import Copyright from '../src/components/Copyright';
import apis from '../src/apis'
import { useForm, Controller } from "react-hook-form";
import React from 'react';
import { useRouter } from 'next/dist/client/router';
import PasswordField from '../src/components/PasswordField';


export default function SignIn() {
    const [showPassword, setShowPassword] = React.useState(false)
    const toggleShowPassword = () => setShowPassword(!showPassword)

    const router = useRouter()

    const { handleSubmit, control } = useForm();
    const onSubmit = async (params) => {
        const { access_token } = await apis.auth.token(params)
        localStorage.token = access_token
        router.push('/dashboard')
    }

    return (
        <Container component="main" maxWidth="xs">
            <Head>
                <title>登录</title>
            </Head>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
                                fullWidth
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
                                fullWidth
                                {...field}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        登录
                    </Button>
                </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
    );
}