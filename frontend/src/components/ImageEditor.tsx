import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../components/getCroppedImg';  // Asegúrate de que esta función está implementada en tu proyecto.

interface ImageEditorPopupProps {
  imageSrc: string;
  onClose: () => void;
  onSave: (editedImage: string) => void;
}

const ImageEditorPopup: React.FC<ImageEditorPopupProps> = ({ imageSrc, onClose, onSave }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onSave(croppedImage);  // Envía la imagen editada al componente principal
    } catch (e) {
      console.error("Error while cropping the image: ", e);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Image</h2>
        
        {/* Componente Cropper para recortar, rotar y hacer zoom */}
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          onCropComplete={handleCropComplete}
        />

        {/* Controles para Zoom y Rotación */}
        <div className="controls">
          <label>Zoom:</label>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />

          <label>Rotation:</label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
          />
        </div>

        {/* Botones de guardar y cerrar */}
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ImageEditorPopup;