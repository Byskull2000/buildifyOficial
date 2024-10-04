import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button, CircularProgress, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

    const Alert = styled(MuiAlert)(() => ({
    '& .MuiAlert-icon': {
        fontSize: 20,
    },
    }));

    const ImageUploader: React.FC = () => {
        const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
        const [loading, setLoading] = useState(false);
        const [loadingMessage, setLoadingMessage] = useState('');
        const [snackOpen, setSnackOpen] = useState(false);
        const [snackMessage, setSnackMessage] = useState('');
        const [error, setError] = useState<string | null>(null);
        const [open, setOpen] = useState(false);
        const [zoomLevels, setZoomLevels] = useState<number[]>([]);
        const [expandedImage, setExpandedImage] = useState<string | null>(null);
        const [galleryOpen, setGalleryOpen] = useState(false);
        const [images, setImages] = useState<string[]>([]);

    const onDrop = (acceptedFiles: File[]) => {
        const newFiles: File[] = [];

            acceptedFiles.forEach(file => {
                const formatError = validarFormato(file);
                if (formatError) {
                    setError(formatError);
                    return;
                }

            validarDimensiones(file).then(dimensionError => {
                if (dimensionError) {
                    setError(dimensionError);
                } else {
                    newFiles.push(file);
                    setSelectedFiles(prev => [...prev, ...newFiles]);
                    setZoomLevels(prev => [...prev, 1]);
                }
            });
        });
    };

        const validarFormato = (file: File): string | null => {
            const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
            if (!allowedFormats.includes(file.type)) {
                return 'Formato Incorrecto';
            }
            return null;
        };

    const validarDimensiones = (file: File): Promise<string | null> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;

                img.onload = () => {
                    if (img.width !== img.height || img.width > 1080 || img.height > 1080) {
                        resolve('La imagen debe ser cuadrada y de máximo 1080x1080 píxeles');
                    } else {
                        resolve(null);
                    }
                };
            };
            reader.readAsDataURL(file);
        });
    };

    const uploadFiles = async () => {
        setLoading(true);
        setLoadingMessage('Cargando imágenes, por favor espera...');

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('file', file);
        });

        try {
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data);
            setSnackMessage('Imágenes subidas exitosamente.');
            setSnackOpen(true);
            setOpen(false);
            setImages(prev => [...prev, ...selectedFiles.map(file => URL.createObjectURL(file))]);
            setSelectedFiles([]);
            setZoomLevels([]);
        } catch (error) {
            console.error('Error al subir las fotos', error);
            setError('Error al subir las fotos. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => setSnackOpen(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedFiles([]);
        setError(null);
        setZoomLevels([]);
        setExpandedImage(null);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newFiles: File[] = [];

        files.forEach(file => {
            const formatError = validarFormato(file);
            if (formatError) {
                setError(formatError);
                return;
            }

            // Verificar dimensiones de la imagen
            validarDimensiones(file).then(dimensionError => {
                if (dimensionError) {
                    setError(dimensionError);
                } else {
                    newFiles.push(file);
                    setSelectedFiles(prev => [...prev, ...newFiles]);
                    setZoomLevels(prev => [...prev, 1]);
                }
            });
        });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true });

    const handleMouseWheel = (index: number, event: React.WheelEvent<HTMLImageElement>) => {
        event.preventDefault();
        const delta = event.deltaY < 0 ? 0.1 : -0.1;
        setZoomLevels(prev => {
            const newZoomLevels = [...prev];
            newZoomLevels[index] = Math.max(newZoomLevels[index] + delta, 1);
            return newZoomLevels;
        });
    };

    const handleImageClick = (file: File) => {
        setExpandedImage(URL.createObjectURL(file));
    };

    const handleOpenGallery = () => {
        setGalleryOpen(true);
    };

    const handleCloseGallery = () => {
        setGalleryOpen(false);
    };

    const preventDefault = (event: React.MouseEvent<HTMLImageElement>) => {
        event.preventDefault();
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>Subir Imágenes</Button>
            <Button variant="outlined" onClick={handleOpenGallery}>Ver Galería</Button>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Subir Imágenes</DialogTitle>
                <DialogContent>
                    <div 
                        {...getRootProps({ className: 'dropzone' })} 
                        style={{ 
                            border: '2px dashed #ccc', 
                            padding: '20px', 
                            marginBottom: '20px', 
                            textAlign: 'center', 
                            position: 'relative' 
                        }}
                    >
                        <input {...getInputProps()} />
                        
                        {selectedFiles.length === 0 ? (
                            <>
                                <p>Arrastra algunas imágenes aquí, o haz clic para seleccionar imágenes</p>
                                <Button 
                                    variant="contained" 
                                    style={{ 
                                        marginTop: '10px', 
                                        display: 'inline-block' 
                                    }}
                                    onClick={() => document.getElementById('file-upload')?.click()} 
                                >
                                    Seleccionar Imágenes
                                </Button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                                {selectedFiles.map((file, index) => (
                                    <div key={index} style={{ position: 'relative' }}>
                                        <img 
                                            src={URL.createObjectURL(file)} 
                                            style={{ 
                                                width: '100px', 
                                                height: '100px', 
                                                objectFit: 'cover', 
                                                transform: `scale(${zoomLevels[index]})`, 
                                                transition: 'transform 0.2s', 
                                                cursor: 'pointer', 
                                                transformOrigin: 'center' 
                                            }} 
                                            alt="Preview"
                                            onWheel={(e) => handleMouseWheel(index, e)} 
                                            onClick={() => handleImageClick(file)} 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <input 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        onChange={handleFileSelect} 
                        style={{ display: 'none' }} 
                        id="file-upload" 
                    />

                    {/* Mueve el botón "Subir Imágenes" fuera del dropzone */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        {selectedFiles.length > 0 && (
                            <Button variant="contained" onClick={uploadFiles} disabled={loading}>
                                Subir Imágenes
                            </Button>
                        )}
                    </div>

                    {loading && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                            <CircularProgress />
                            <p>{loadingMessage}</p>
                        </div>
                    )}

                    {error && (
                        <Alert severity="error" style={{ marginTop: '20px' }}>
                            {error}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackMessage}
                </Alert>
            </Snackbar>

            {expandedImage && (
                <Dialog open={Boolean(expandedImage)} onClose={() => setExpandedImage(null)} maxWidth="md">
                    <DialogTitle>Imagen Expandida</DialogTitle>
                    <DialogContent>
                        <img 
                            src={expandedImage} 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '80vh', 
                                objectFit: 'contain' 
                            }} 
                            alt="Expanded" 
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setExpandedImage(null)}>Cerrar</Button>
                    </DialogActions>
                </Dialog>
            )}

            <Dialog open={galleryOpen} onClose={handleCloseGallery} maxWidth="md">
                <DialogTitle>Galería</DialogTitle>
                <DialogContent>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '20px' }}>
                        {images.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                style={{ 
                                    width: '100px', 
                                    height: '100px', 
                                    objectFit: 'cover', 
                                    pointerEvents: 'none' 
                                }} 
                                alt={`Gallery ${index}`} 
                                onContextMenu={preventDefault} 
                            />
                        ))}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseGallery}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ImageUploader;
