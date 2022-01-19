import { AppBar, Backdrop, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ImageList, ImageListItem, ImageListItemBar, Slide, Stack, styled, TextField, Toolbar, Tooltip, Typography } from '@mui/material'

import React from 'react';
import Image from './Image';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import useInfinite from '../hooks/useInfinite';
import apis from '../apis'
import { APIError } from '../errors'
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Loading from './Loading'
import { useConfirm } from 'material-ui-confirm';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import UploadIcon from '@mui/icons-material/Upload';
import { Controller, useForm } from 'react-hook-form';
import useUser from '../hooks/useUser';

const Input = styled('input')({
    display: 'none',
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


function EditButton(props) {
    const {
        data,
        onRefresh,
        ...rest
    } = props
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const { handleSubmit, control } = useForm({
        defaultValues: {
            name: data.name,
        }
    });
    const onSubmit = async (params) => {
        try {
            await apis.image.update(data.id, params)
            setOpen(false)
            onRefresh()
        } catch (error) {
            if (error instanceof APIError) {
                return
            }
            throw error
        }
    }
    return (
        <React.Fragment>
            <IconButton onClick={handleOpen} {...rest}><EditIcon /></IconButton>
            <Dialog
                open={open}
            >
                <DialogTitle>编辑图片</DialogTitle>
                <DialogContent>
                    <Stack>

                        <Controller
                            defaultValue=""
                            name="name"
                            control={control}
                            rules={{ required: '图片名称不能为空' }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    label="名称"
                                    margin="normal"
                                    required
                                    autoFocus
                                    {...field}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                />
                            )}
                        />
                    </Stack>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="error">取消</Button>
                    <Button onClick={handleSubmit(onSubmit)}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

function ImageItem(props) {
    const {
        data,
        width,
        height,
        selected,
        onToggle,
        onFavorite,
        onRemove,
        onRefresh,
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
        <ImageListItem
            sx={{
                width,
                m: 'auto',
                '&:hover .action': {
                    display: 'flex'
                }
            }}
            {...rest}>
            <Image onClick={onToggle} objectFit="cover" width={width} height={height} src={data.url} />
            {selected && <CheckOutlinedIcon sx={{ position: 'absolute', right: 10, top: 10, bgcolor: 'primary.main', color: '#fff', borderRadius: '50%' }} />}
            <Stack className='action' sx={{ position: 'absolute', top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#fff', display: 'none' }}>
                <IconButton color="inherit" onClick={handleOpen} size="small"><ZoomInIcon /></IconButton>
                <IconButton color="inherit" onClick={onRemove} size="small"><DeleteIcon /></IconButton>
                <EditButton onRefresh={onRefresh} data={data} color="inherit" size="small" />
            </Stack>
            <ImageListItemBar
                sx={{ color: '#fff' }}
                title={data.name}
                actionIcon={
                    <IconButton color='inherit' onClick={onFavorite}>
                        {data.is_favorite ? <StarIcon color='warning' /> : <StarBorderIcon />}
                    </IconButton>
                }
            />
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
        </ImageListItem>
    )
}

const IMAGE_WIDTH = 180
const IMAGE_HEIGH = 180
function StandardImageList(props) {
    const {
        data,
        selectedItems,
        onItemToggle,
        onItemRemove,
        onRefresh,
        ...rest
    } = props

    const selectedObject = React.useMemo(() => {
        const obj = selectedItems.reduce((a, b) => ({ ...a, [b.id]: b }), {})
        return obj
    }, [selectedItems])

    const handleItemFavorite = async (data) => {
        try {
            await apis.image.update(data.id, { is_favorite: !data.is_favorite })
            onRefresh()
        } catch (error) {
            if (error instanceof APIError) { return }
            throw error
        }
    }

    const [column, setColumn] = React.useState(6)

    const imageListRef = React.useRef(null)

    const updateDimensions = () => {
        setColumn(parseInt(imageListRef.current.clientWidth / (IMAGE_WIDTH + 4)))
    }

    React.useEffect(() => {
        updateDimensions()
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);
    return (
        <ImageList sx={{ overflow: 'hidden' }} ref={imageListRef} cols={column} {...rest}>
            {data.map((item) => (
                <ImageItem onRefresh={onRefresh} selected={!!selectedObject[item.id]} width={IMAGE_WIDTH} height={IMAGE_HEIGH} data={item} key={item.id} onToggle={() => onItemToggle(item)} onRemove={() => onItemRemove(item)} onFavorite={() => handleItemFavorite(item)} />
            ))}
        </ImageList>
    )
}
const PAGE_SIZE = 25
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

    const { user } = useUser()
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

    const [sentryRef, { rootRef }] = useInfiniteScroll({
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
    const handleRefresh = () => {
        mutate()
    }

    const handleFileChange = async (e) => {
        const files = [...e.target.files]
        try {
            await Promise.all(files.map((item) => (
                apis.image.create(item)
            )))
            handleRefresh()
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
            handleRefresh()
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
                        {user?.role === 1 && <Tooltip title="上传图片">
                            <label>
                                <Input multiple onChange={handleFileChange} accept="image/*" type="file" />
                                <IconButton component="span" color="inherit">
                                    <UploadIcon />
                                </IconButton>
                            </label>
                        </Tooltip>}
                        <Button disabled={selectedItems.length === 0} onClick={handleOK} color="inherit">
                            确定
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box ref={rootRef} sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    <Container>
                        <StandardImageList onRefresh={handleRefresh} onItemRemove={handleItemRemove} selectedItems={selectedItems} onItemToggle={handleItemToggle} m={2} data={list} />
                        {(loading || hasNextPage) && (
                            <Box ref={sentryRef}>
                                <Loading />
                            </Box>
                        )}
                    </Container>
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