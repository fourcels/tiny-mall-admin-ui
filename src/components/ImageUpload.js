import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Stack, Box, Typography, Backdrop, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Image from 'next/image'
import React from 'react';
import apis from '../apis'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';

const STATIC_BASE_URL = process.env.NEXT_PUBLIC_STATIC_BASE_URL


const Input = styled('input')({
    display: 'none',
});

function UploadButton(props) {
    const {
        width,
        height,
        multiple,
        onChange,
    } = props

    return (
        <label htmlFor="upload-file">
            <Input onChange={onChange} accept="image/*" id="upload-file" multiple={multiple} type="file" />

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
                {width >= 100 && (
                    <Typography sx={{ mt: 1 }}>添加图片</Typography>
                )}
            </Box>
        </label>
    )
}

const PreviewImage = styled('img')({
    maxHeight: '80%',
    maxWidth: '80%',
});

function ImageItem(props) {
    const {
        width,
        height,
        url,
        onRemove,
    } = props
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };
    const src = React.useMemo(() => `${STATIC_BASE_URL}/${url}`)
    return (
        <React.Fragment>
            <Box
                sx={(theme) => ({
                    position: 'relative',
                    display: 'flex',
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: theme.shape.borderRadius,
                    overflow: 'hidden',
                    '&:hover .actions': {
                        display: 'flex'
                    }
                })}
            >
                <Image objectFit="cover" width={width} height={height} src={src} />
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    gap={2}
                    className='actions'
                    sx={{
                        display: 'none',
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                        color: '#fff',
                    }}>
                    <Tooltip title="预览">
                        <IconButton
                            size="small"
                            onClick={handleToggle}
                            color="inherit"
                        >
                            <ZoomInIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                        <IconButton
                            onClick={onRemove}
                            size="small"
                            color="inherit"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
            <Backdrop
                unmountOnExit
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={open}
                onClick={handleClose}
            >
                <PreviewImage src={src} />
            </Backdrop>
        </React.Fragment >
    )
}


export default function ImageUpload(props) {
    const {
        width = 120,
        height = 120,
        multiple = false,
        max = 0,
        ...rest
    } = props
    const [images, setImages] = React.useState([])
    const handleChange = async (e) => {
        let files = [...e.target.files]
        if (multiple && max > 0 && files.length + images.length > max) {
            files = files.slice(0, max - images.length)
        }
        files.forEach(async (item) => {
            const { url } = await apis.file.upload(item)
            setImages((value) => [...value, url])
        })
    }
    const showUploadButton = React.useMemo(() => {
        if (multiple) {
            if (max <= 0) {
                return true
            } else {
                return images.length < max
            }
        } else {
            return images.length === 0
        }
    })
    const handleRemove = (i) => {
        images.splice(i, 1)
        setImages([...images])
    }
    return (
        <Box display="inline-flex" gap={2} flexWrap="wrap" {...rest}>
            {images.map((item, i) => (
                <ImageItem onRemove={() => handleRemove(i)} key={i} width={width} height={height} url={item} />
            ))}
            {showUploadButton && (
                <UploadButton onChange={handleChange} width={width} height={height} multiple={multiple} />
            )}
        </Box>
    )
}