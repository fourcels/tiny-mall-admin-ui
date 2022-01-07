import { Switch } from '@mui/material'

export default function FieldSwitch(props) {
    const {
        value,
        onChange,
    } = props
    return (
        <Switch
            checked={value}
            onChange={onChange}
        />
    )

}