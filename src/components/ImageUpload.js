import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { Stack, Box, Typography, Backdrop, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';
import apis from '../apis'
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from './Image'


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
        <label>
            <Input onChange={onChange} accept="image/*" multiple={multiple} type="file" />

            <Box sx={(theme) => ({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: { height },
                width: { width },
                border: 1,
                borderColor: 'divider',
                boxSizing: 'content-box',
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
                        visibility: 'visible'
                    }
                })}
            >
                <Image width={width} height={height} src={url} objectFit="cover" />
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    className='actions'
                    sx={{
                        visibility: 'hidden',
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
                <Image width="80%" height="80%" src={url} objectFit="contain" />
            </Backdrop>
        </React.Fragment >
    )
}

function ImageUploadSingle(props) {
    const {
        width,
        height,
        value,
        onChange,
        ...rest
    } = props
    const [image, setImage] = React.useState(value)
    const handleChange = async (e) => {
        let files = [...e.target.files]
        const { url } = await apis.file.upload(files[0])
        setImage(url)
        onChange?.(url)
    }
    const handleRemove = () => {
        setImage('')
        onChange?.('')
    }
    return (
        <Box display="inline-flex" gap={2} flexWrap="wrap" {...rest}>
            {image ? (
                <ImageItem onRemove={handleRemove} width={width} height={height} url={image} />
            ) : (
                <UploadButton onChange={handleChange} width={width} height={height} />
            )}
        </Box>
    )
}

function ImageUploadMulti(props) {
    const {
        width,
        height,
        max,
        value,
        onChange,
        ...rest
    } = props
    const [images, setImages] = React.useState(value)
    const handleChange = async (e) => {
        let files = [...e.target.files]
        if (max > 0 && files.length + images.length > max) {
            files = files.slice(0, max - images.length)
        }
        const urls = await Promise.all(files.map(async (item) => {
            const { url } = await apis.file.upload(item)
            return url
        }));
        const newImages = [...images, ...urls]
        setImages(newImages)
        onChange?.(newImages)
    }
    const handleRemove = (i) => {
        images.splice(i, 1)
        const newImages = [...images]
        setImages(newImages)
        onChange?.(newImages)
    }

    const showUploadButton = React.useMemo(() => {
        if (max <= 0) {
            return true
        } else {
            return images.length < max
        }
    }, [images, max])

    return (
        <Box display="inline-flex" gap={2} flexWrap="wrap" {...rest}>
            {images.map((item, i) => (
                <ImageItem onRemove={() => handleRemove(i)} key={i} width={width} height={height} url={item} />
            ))}
            {showUploadButton && (
                <UploadButton onChange={handleChange} width={width} height={height} multiple />
            )}
        </Box>
    )
}


export default function ImageUpload(props) {
    const {
        width = 120,
        height = 120,
        multiple = false,
        max = 0,
        value,
        onChange,
        ...rest
    } = props
    return (
        <Box {...rest}>
            {multiple ? (
                <ImageUploadMulti
                    width={width}
                    height={height}
                    value={value}
                    onChange={onChange}
                    max={max}
                />
            ) : (
                <ImageUploadSingle
                    width={width}
                    height={height}
                    value={value}
                    onChange={onChange}
                />
            )}
        </Box>
    )
}