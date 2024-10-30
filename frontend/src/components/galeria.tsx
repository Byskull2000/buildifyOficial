import React, { useState,useEffect } from "react";

interface ImageData {
    id: number;
    data: string; 
    filename: string;
}

interface GaleriaProps {
    handleImageClick?: (image: ImageData) => void; // Prop opcional para manejar el clic
}

const Galeria: React.FC<GaleriaProps> = ({handleImageClick}) => {
    const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");


    useEffect(() => {
        const fetchGalleryImages = async () => {
            try {
                const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
                const response = await fetch(URL_BACKEND + "/api/galeria");
                if (!response.ok) {
                    throw new Error("Error al cargar imágenes de la galería.");
                }
                const data = await response.json();
                setGalleryImages(data.fotos); // Asignamos las imágenes a la galería
            } catch (error) {
                console.error(error);
                setErrorMessage("Ocurrió un error al cargar la galería.");
            }
        };

        fetchGalleryImages();
    }, []);

    return (
        <>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <div
            style={{
                display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    maxHeight: "500px",
                    overflowY: "scroll",
            }}
        >
            <h2>Galería de Imágenes</h2>
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    justifyContent: "center",
                    overflowY: "scroll",
                    maxHeight: "400px",
                }}
            >
                {galleryImages.map((foto) => (
                    <img
                        key={foto.id}
                        src={`data:image/jpeg;base64,${foto.data}`}
                        alt={foto.filename}
                        onClick={() => handleImageClick && handleImageClick(foto)}  // Si se pasa, manejamos el clic
                        style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            cursor: "pointer",  // Añadimos estilo de cursor para indicar que es clicable
                        }}
                    />
                ))}
            </div>
        </div>
    </>
    );
};

export default Galeria;