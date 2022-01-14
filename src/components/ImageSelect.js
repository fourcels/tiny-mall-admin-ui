import { AppBar, Backdrop, Box, Button, Dialog, IconButton, Slide, Stack, styled, Toolbar, Tooltip, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';
import React from 'react';
import Image from './Image';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import useInfinite from '../hooks/useInfinite';
import apis from '../apis'
import { APIError } from '../errors'
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Loading from './Loading'
import { useConfirm } from 'material-ui-confirm';

const Input = styled('input')({
    display: 'none',
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function ImageItem(props) {
    const {
        data,
        selected,
        onToggle,
        onRemove,
        ...rest
    } = props
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <Box width={200} {...rest}>
            <Box onClick={onToggle} position="relative">
                <Box sx={{ cursor: 'pointer' }}>
                    <Image objectFit="cover" width={200} height={200} src={data.url} />
                </Box>
                {selected && <CheckOutlinedIcon sx={{ position: 'absolute', right: 10, bottom: 10, bgcolor: 'primary.main', color: '#fff', borderRadius: '50%' }} />}
            </Box>
            <Stack mt={1} alignItems="center" direction="row">
                <Typography flexGrow={1} noWrap>{data.name}</Typography>
                <Box sx={{ whiteSpace: 'nowrap' }} textAlign="center">
                    <Tooltip title="预览">
                        <IconButton onClick={handleOpen} size="small"><ZoomInIcon /></IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                        <IconButton onClick={onRemove} size="small"><DeleteIcon /></IconButton>
                    </Tooltip>
                </Box>
            </Stack>
            <Backdrop
                unmountOnExit
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={open}
                onClick={handleClose}
            >
                <Stack textAlign="center" width="80%" height="80%">
                    <Box flex={1} height={0}>
                        <Image width="100%" height="100%" src={data.url} objectFit="contain" />
                    </Box>
                    <Typography mt={1} color="#fff">{data.name} {`${data.width}x${data.height}`} {Math.round(data.size / 1000)}KB</Typography>
                </Stack>
            </Backdrop>
        </Box>
    )
}


function ImageList(props) {
    const {
        data,
        selectedItems,
        onItemToggle,
        onItemRemove,
        ...rest
    } = props

    const selectedObject = React.useMemo(() => {
        const obj = selectedItems.reduce((a, b) => ({ ...a, [b.id]: b }), {})
        return obj
    }, [selectedItems])
    return (
        <Stack flexWrap="wrap" direction="row" gap={2} {...rest}>
            {data.map((item) => (
                <ImageItem onRemove={() => onItemRemove(item)} selected={!!selectedObject[item.id]} onToggle={() => onItemToggle(item)} key={item.id} data={item} />
            ))}
        </Stack>
    )
}
const PAGE_SIZE = 20
function ImageSelectButton(props) {
    const {
        height,
        width,
        multiple = false,
        onChange,
    } = props
    const [open, setOpen] = React.useState(false);
    const [selectedItems, setSelectedItems] = React.useState([])
    const confirm = useConfirm()
    const {
        loading,
        hasNextPage,
        error,
        list,
        mutate,
        size,
        setSize
    } = useInfinite((pageIndex, previousPageData) => {
        if (!open) {
            return null
        }
        if (previousPageData && !previousPageData.length) {
            return null
        }
        return `/admin/images/?page=${pageIndex + 1}&page_size=${PAGE_SIZE}`
    }, PAGE_SIZE)

    const [sentryRef] = useInfiniteScroll({
        loading,
        hasNextPage,
        onLoadMore: () => setSize(size + 1),
        // When there is an error, we stop infinite loading.
        // It can be reactivated by setting "error" state as undefined.
        disabled: !!error,
        // `rootMargin` is passed to `IntersectionObserver`.
        // We can use it to trigger 'onLoadMore' when the sentry comes near to become
        // visible, instead of becoming fully visible on the screen.
        rootMargin: '0px 0px 400px 0px',
    })

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedItems([])
        setOpen(false);
    };

    const handleItemToggle = (data) => {
        if (multiple) {
            const index = selectedItems.findIndex((item) => item.id === data.id)
            if (index >= 0) {
                selectedItems.splice(index, 1)
            } else {
                selectedItems.push(data)
            }
            setSelectedItems([...selectedItems])
        } else {
            setSelectedItems([data])
        }
    }

    const handleOK = () => {
        const value = selectedItems.map((item) => (item.url))
        onChange?.(multiple ? value : value[0])
        handleClose()
    }
    const handleFileChange = async (e) => {
        const files = [...e.target.files]
        try {
            await Promise.all(files.map((item) => (
                apis.image.create(item)
            )))
            mutate()
        } catch (error) {
            if (error instanceof APIError) { return }
            throw error
        }
    }

    const handleItemRemove = async (data) => {
        try {
            await confirm({ title: `确定删除图片 ${data.name}` })
        } catch {
            return
        }
        try {
            await apis.image.remove(data.id)
            setSelectedItems(selectedItems.filter((item) => item.id !== data.id))
            mutate()
        } catch (error) {
            if (error instanceof APIError) {
                return
            }
            throw error
        }
    }

    return (
        <React.Fragment>
            <Box
                onClick={handleClickOpen}
                sx={(theme) => ({
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
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            添加图片
                        </Typography>
                        <Tooltip title="上传图片">
                            <label>
                                <Input multiple onChange={handleFileChange} accept="image/*" type="file" />
                                <IconButton component="span" color="inherit">
                                    <UploadIcon />
                                </IconButton>
                            </label>
                        </Tooltip>
                        <Button disabled={selectedItems.length === 0} onClick={handleOK} color="inherit">
                            确定
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box flexGrow={1} sx={{ overflowY: 'auto' }}>
                    <ImageList onItemRemove={handleItemRemove} selectedItems={selectedItems} onItemToggle={handleItemToggle} m={2} data={list} />
                    {(loading || hasNextPage) && (
                        <Box ref={sentryRef}>
                            <Loading />
                        </Box>
                    )}
                </Box>
            </Dialog>
        </React.Fragment>
    )
}

function ImagePreviewItem(props) {
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


function ImageSelectSingle(props) {
    const {
        width,
        height,
        value,
        onChange,
        ...rest
    } = props
    const [image, setImage] = React.useState(value)
    const handleChange = async (data) => {
        setImage(data)
        onChange?.(data)
    }
    const handleRemove = () => {
        setImage('')
        onChange?.('')
    }
    return (
        <Box display="inline-flex" gap={2} flexWrap="wrap" {...rest}>
            {image ? (
                <ImagePreviewItem onRemove={handleRemove} width={width} height={height} url={image} />
            ) : (
                <ImageSelectButton onChange={handleChange} width={width} height={height} />
            )}
        </Box>
    )
}

function ImageSelectMulti(props) {
    const {
        width,
        height,
        max,
        value,
        onChange,
        ...rest
    } = props
    const [images, setImages] = React.useState(value)
    const handleChange = async (data) => {
        if (max > 0 && data.length + images.length > max) {
            data = data.slice(0, max - images.length)
        }
        const newImages = [...images, ...data]
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
                <ImagePreviewItem onRemove={() => handleRemove(i)} key={i} width={width} height={height} url={item} />
            ))}
            {showUploadButton && (
                <ImageSelectButton onChange={handleChange} width={width} height={height} multiple />
            )}
        </Box>
    )
}

export default function ImageSelect(props) {
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
                <ImageSelectMulti
                    width={width}
                    height={height}
                    value={value}
                    onChange={onChange}
                    max={max}
                />
            ) : (
                <ImageSelectSingle
                    width={width}
                    height={height}
                    value={value}
                    onChange={onChange}
                />
            )}
        </Box>
    )
}