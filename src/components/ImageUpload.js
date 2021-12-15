import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Stack, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const Input = styled('input')({
    display: 'none',
});

function UploadButton({ width, height, multiple }) {
    return (
        <label htmlFor="upload-file">
            <Input accept="image/*" id="upload-file" multiple={multiple} type="file" />

            <Box sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: { height },
                width: { width },
                color: theme.palette.text.secondary,
                backgroundColor: theme.palette.grey[100],
                borderRadius: theme.shape.borderRadius,
                cursor: 'pointer',
            })}>
                <AddPhotoAlternateOutlinedIcon />
                {width >= 100 && <Typography sx={{ mt: 1 }}>添加图片</Typography>}
            </Box>
        </label>
    )
}


export default function ImageUpload(props) {
    const {
        width = 120,
        height = 120,
        multiple = false,
        ...rest
    } = props
    return (
        <Box display="inline-block" {...rest}>
            <UploadButton width={width} height={height} multiple={multiple} />
        </Box>
    )
}