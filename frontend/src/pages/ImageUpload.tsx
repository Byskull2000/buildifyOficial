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
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [zoomLevels, setZoomLevels] = useState<number[]>([]);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: File[] = [];

    acceptedFiles.forEach((file) => {
      const formatError = validarFormato(file);
      if (formatError) {
        setError(formatError);
        return;
      }

      validarDimensiones(file).then((dimensionError) => {
        if (!dimensionError) {
          newFiles.push(file);
          setSelectedFiles((prev) => [...prev, file]);
          setZoomLevels((prev) => [...prev, 1]);
        } else {
          setError(dimensionError);
        }
      });
    });
  };

  const validarFormato = (file: File): string | null => {
    const allowedFormats = ['image/jpg', 'image/jpeg', 'image/png'];
    return !allowedFormats.includes(file.type) ? 'Formato Incorrecto' : null;
  };

  const validarDimensiones = (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          resolve(img.width === img.height && img.width <= 1080 && img.height <= 1080 ? null : 'La imagen debe ser cuadrada y de máximo 1080x1080 píxeles');
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadFiles = async () => {
    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('file', file);
    });

    try {
      await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackMessage('Imágenes subidas exitosamente.');
      setSnackOpen(true);
      setOpen(false);
      setImages((prev) => [...prev, ...selectedFiles.map((file) => URL.createObjectURL(file))]);
      setSelectedFiles([]);
      setZoomLevels([]);
    } catch (error) {
      console.error('Error al subir las fotos', error);
      setError('Error al subir las fotos. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const uploadToDatabase = async () => {
    setLoading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('file', file);
    });

    try {
      await axios.post('/api/uploadToDatabase', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSnackMessage('Imágenes subidas a la base de datos exitosamente.');
      setSnackOpen(true);
      setOpen(false);
      setImages((prev) => [...prev, ...selectedFiles.map((file) => URL.createObjectURL(file))]);
      setSelectedFiles([]);
      setZoomLevels([]);
    } catch (error) {
      console.error('Error al subir las fotos a la base de datos', error);
      setError('Error al subir las fotos a la base de datos. Intenta de nuevo.');
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
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach((file) => {
      const formatError = validarFormato(file);
      if (!formatError) {
        validarDimensiones(file).then((dimensionError) => {
          if (!dimensionError) {
            setSelectedFiles((prev) => [...prev, file]);
            setZoomLevels((prev) => [...prev, 1]);
          } else {
            setError(dimensionError);
          }
        });
      } else {
        setError(formatError);
      }
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, noClick: true });

  const handleMouseWheel = (index: number, event: React.WheelEvent<HTMLImageElement>) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    setZoomLevels((prev) => {
      const newZoomLevels = [...prev];
      newZoomLevels[index] = Math.max(newZoomLevels[index] + delta, 1);
      return newZoomLevels;
    });
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Subir Imágenes
      </Button>
      <Button variant="outlined" onClick={() => setGalleryOpen(true)}>
        Ver Galería
      </Button>

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
              position: 'relative',
            }}
          >
            <input {...getInputProps()} />
            {selectedFiles.length === 0 ? (
              <>
                <p>Arrastra algunas imágenes aquí, o haz clic para seleccionar imágenes</p>
                <Button
                  variant="contained"
                  style={{ marginTop: '10px', display: 'inline-block' }}
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
                        transformOrigin: 'center',
                      }}
                      alt="Preview"
                      onWheel={(e) => handleMouseWheel(index, e)}
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
          <Button variant="contained" onClick={uploadFiles} disabled={loading || selectedFiles.length === 0}>
            Subir Archivos
          </Button>
          <Button variant="contained" onClick={uploadToDatabase} disabled={loading || selectedFiles.length === 0} style={{ marginLeft: '10px' }}>
            Subir a Base de Datos
          </Button>

          {loading && <CircularProgress style={{ marginTop: '20px' }} />}
          {error && <Alert severity="error" style={{ marginTop: '20px' }}>{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackMessage}
        </Alert>
      </Snackbar>

      {/* Implementación de la galería */}
      <Dialog open={galleryOpen} onClose={() => setGalleryOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Galería de Imágenes</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {images.map((image, index) => (
              <img key={index} src={image} alt="Gallery" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGalleryOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageUploader;
