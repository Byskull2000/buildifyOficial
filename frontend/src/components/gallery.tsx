
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Gallery: React.FC = () => {
    const [fotos, setFotos] = useState<any[]>([]);

    const fetchFotos = async () => {
        try {
            const response = await axios.get('/api/galeria');
            setFotos(response.data.fotos);
        } catch (error) {
            console.error('Error al cargar las fotos', error);
        }
    };

    useEffect(() => {
        fetchFotos(); 
    }, []);

    return (
        <div>
            <h2>Galería de Fotos</h2>
            <div className="galeria">
                {fotos.map((foto) => (
                    <img key={foto.id} src={`data:image/jpeg;base64,${foto.data}`} alt={foto.filename} />
                ))}
            </div>
        </div>
    );
};

export default Gallery;