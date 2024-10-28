import React, { useState,useEffect } from "react";

interface ImageData {
    id: number;
    data: string; 
    filename: string;
}

const Galeria: React.FC = () => {
    const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    //const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false); 

    // Mostrar la galería
    /*const toggleGallery = async () => {
        setIsGalleryOpen(!isGalleryOpen); 
        if (!isGalleryOpen) {
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
        }
    };*/

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
                backgroundColor: "white",
                padding: "20px",
                width: "800px",
                height: "500px",
                borderRadius: "10px",
                position: "relative",
                margin: "0 auto", // Centra el contenedor de la galería
                marginTop: "50px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
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
                        style={{
                            width: "200px",
                            height: "200px",
                            objectFit: "cover",
                            borderRadius: "5px",
                        }}
                    />
                ))}
            </div>
        </div>
    </>
    );
};

export default Galeria;