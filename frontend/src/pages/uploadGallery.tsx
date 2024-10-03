
import React from 'react';
import UploadPhoto from '../components/upload';
import Gallery from '../components/gallery';
import axios from 'axios';

const UploadGallery: React.FC = () => {
    const handleUploadSuccess = () => {
        
        console.log('Imagen subida correctamente, actualizar galería si es necesario');
    };

    return (
        <div>
            <h1>Subir Fotos</h1>
            <UploadPhoto onUploadSuccess={handleUploadSuccess} />
            <Gallery />
        </div>
    );
};

export default UploadGallery;