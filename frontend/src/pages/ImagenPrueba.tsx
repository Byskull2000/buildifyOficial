import React, { useState} from 'react';


const MAX_SIZE_MB = 5 * 1024 * 1024; 
const MAX_RESOLUTION = 1080;

const ImageUploader: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]); 

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      validateAndAddImages(selectedFiles);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndAddImages(droppedFiles);
  };

  const validateAndAddImages = (selectedFiles: File[]) => {
    const newImages: File[] = [];
    const newPreviews: string[] = [];
    let error = '';

    selectedFiles.forEach((file) => {
      const fileType = file.type;
      const fileSize = file.size;

      
      if (!['image/jpeg', 'image/png'].includes(fileType)) {
        error = 'Formato Incorrecto. Solo se permiten imágenes JPG o PNG.';
      }

      
      if (fileSize > MAX_SIZE_MB) {
        error = `La imagen ${file.name} excede el tamaño máximo de 5MB.`;
      }

      
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const width = image.width;
        const height = image.height;
        if (width !== height || width > MAX_RESOLUTION || height > MAX_RESOLUTION) {
          error = `La imagen ${file.name} debe tener formato 1:1 (cuadrada) y no exceder 1080x1080 píxeles.`;
        }
      };

      
      const existingImage = images.find(img => img.name === file.name);
      if (existingImage) {
        error = `La imagen ${file.name} ya ha sido cargada previamente.`;
      }

      if (!error) {
        newImages.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } else {
        setErrorMessage(error);
      }
    });

    
    if (!error) {
      setImages([...images, ...newImages]);
      setPreviewImages([...previewImages, ...newPreviews]);
      setErrorMessage(''); 
    }
  };

  const handleUploadImages = async () => {
    if (images.length === 0) {
      setErrorMessage('No hay imágenes para subir.');
      return;
    }

    setUploading(true);
    setErrorMessage('');
    setProgress(0);

    const formData = new FormData();
    images.forEach(file => {
      formData.append('file', file); 
    });

    try {
      const response = await fetch('http://localhost:5000/api/upload', { 
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error en la subida de imágenes');
      }

      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            setProgress(100);
            alert('Imágenes subidas exitosamente.');
            setImages([]);
            setPreviewImages([]);
            return 100;
          }
          return prev + 10; 
        });
      }, 500);
    } catch (error) {
      setErrorMessage('Ocurrió un error al subir las imágenes.');
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setUploading(false);
    setProgress(0);
    setErrorMessage('Carga cancelada por el usuario.');
    setImages([]);
    setPreviewImages([]);
    setIsModalOpen(false); 
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setErrorMessage(''); 
    setImages([]); 
    setPreviewImages([]); 
  };

  const toggleGallery = async () => {
    setIsGalleryOpen(!isGalleryOpen);
    if (!isGalleryOpen) {
      
      try {
        const response = await fetch('http://localhost:5000/api/foto'); 
        if (!response.ok) {
          throw new Error('Error al cargar imágenes de la galería.');
        }
        const data = await response.json();
        setGalleryImages(data); 
      } catch (error) {
        setErrorMessage('Ocurrió un error al cargar la galería.');
      }
    }
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginRight: '10px', // Añadir margen derecho para espacio
        }}
      >
        Subir Foto
      </button>

      {/* Botón para abrir la galería */}
      <button
        onClick={toggleGallery}
        style={{
          padding: '10px 20px',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Galería
      </button>

      {/* Modal para subir imágenes */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              width: '500px',
              borderRadius: '10px',
              position: 'relative',
            }}
          >
            <h2>Subir Imágenes</h2>

            {/* Dropzone para arrastrar y soltar */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                border: '2px dashed #ccc',
                padding: '20px',
                cursor: 'pointer',
                textAlign: 'center',
                marginBottom: '10px',
                position: 'relative',
              }}
            >
              Arrastra y suelta tus imágenes aquí
              
              {/* Vista previa de las imágenes dentro de la dropzone */}
              <div style={{ display: 'flex', marginTop: '10px', justifyContent: 'center' }}>
                {previewImages.map((image, index) => (
                  <div key={index} style={{ marginRight: '10px' }}>
                    <img src={image} alt={`preview-${index}`} width={100} height={100} />
                  </div>
                ))}
              </div>
            </div>

            {/* Botón para seleccionar archivos */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageUpload}
                multiple
                style={{ display: 'none' }}
                id="fileInput"
              />
              <label
                htmlFor="fileInput"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                Seleccionar Archivos
              </label>
            </div>

            {/* Mostrar errores */}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

            {/* Progreso de carga */}
            {uploading && (
              <div>
                <progress value={progress} max="100" style={{ width: '100%' }} />
              </div>
            )}

            {/* Botones de acción */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button onClick={handleUploadImages} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                Subir Imágenes
              </button>
              <button onClick={handleCancelUpload} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para galería de imágenes */}
      {isGalleryOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              width: '500px',
              borderRadius: '10px',
              position: 'relative',
            }}
          >
            <h2>Galería de Imágenes</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {galleryImages.map((image, index) => (
                <div key={index} style={{ marginRight: '10px', marginBottom: '10px' }}>
                  <img src={image} alt={`gallery-${index}`} width={100} height={100} />
                </div>
              ))}
            </div>
            <button onClick={toggleGallery} style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px' }}>
              Cerrar Galería
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
