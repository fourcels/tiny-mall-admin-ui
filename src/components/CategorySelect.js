import { MenuItem, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import useList from '../hooks/useList'

export default function (props) {
    const {
        name = 'category_id',
        control
    } = props
    const { list, loading } = useList('/admin/categories/all')
    return (
        <Controller
            defaultValue=""
            name={name}
            control={control}
            render={({ field: { value, ...rest }, fieldState }) => (
                <TextField
                    select
                    label="商品分类"
                    value={loading ? '' : value}
                    {...rest}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                >
                    <MenuItem value="">
                        <em>无</em>
                    </MenuItem>
                    {list?.map((item) => (
                        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}
                </TextField>
            )}
        />
    )
}