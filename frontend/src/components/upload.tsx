
import React, { useState } from 'react';
import axios from 'axios';

interface UploadPhotoProps {
    onUploadSuccess: () => void; // Prop para manejar la subida exitosa
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) {
            setMessage('Por favor, selecciona un archivo.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Imagen subida correctamente');
            onUploadSuccess(); 
            setFile(null); 
        } catch (error) {
            setMessage('Error al subir la imagen.');
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Subir Imagen</h1>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                <button type="submit">Subir</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadPhoto;