import { IconButton, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PasswordField = React.forwardRef(function PasswordField(props, ref) {
    const [showPassword, setShowPassword] = React.useState(false)
    const toggleShowPassword = () => setShowPassword(!showPassword)
    return (
        <TextField
            type={showPassword ? 'text' : 'password'}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            onClick={toggleShowPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
            {...props}
        />
    );
});

export default PasswordField