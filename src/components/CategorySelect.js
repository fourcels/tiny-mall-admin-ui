import { MenuItem, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import useList from '../hooks/useList'

export default function (props) {
    const {
        control
    } = props
    const { list } = useList('/admin/categories/all')
    return (
        <Controller
            defaultValue={undefined}
            name="category_id"
            control={control}
            render={({ field, fieldState }) => (
                <TextField
                    select
                    label="商品分类"
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                >
                    <MenuItem value={undefined}>
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