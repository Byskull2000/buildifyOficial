import React, { useState, useEffect } from "react";

interface ImageData {
  id: number;
  data: string;
  filename: string;
}

interface GaleriaProps {
  handleImageClick?: (image: ImageData) => void; // Prop opcional para manejar el clic
}

const ViewGalery: React.FC<GaleriaProps> = ({ handleImageClick }) => {
  const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mainImage, setMainImage] = useState<ImageData | null>(null); // Estado para la imagen principal

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
        setMainImage(data.fotos[0]); // Establecemos la primera imagen como principal
      } catch (error) {
        console.error(error);
        setErrorMessage("Ocurrió un error al cargar la galería.");
      }
    };

    fetchGalleryImages();
  }, []);

  const handleThumbnailClick = (image: ImageData) => {
    setMainImage(image); // Al hacer clic en una miniatura, se actualiza la imagen principal
    if (handleImageClick) {
        handleImageClick(image); // Invocamos handleImageClick si está definida
      }
  };

  return (
    <>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <h2>Galería de Imágenes</h2>

        {/* Imagen principal */}
        {mainImage && (
          <img
            src={`data:image/jpeg;base64,${mainImage.data}`}
            alt={mainImage.filename}
            style={{
              width: "300px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
        )}

        {/* Miniaturas */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            overflowX: "scroll",
            maxWidth: "400px",
          }}
        >
          {galleryImages.map((foto) => (
            <img
              key={foto.id}
              src={`data:image/jpeg;base64,${foto.data}`}
              alt={foto.filename}
              onClick={() => handleThumbnailClick(foto)}  // Actualizamos la imagen principal al hacer clic
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "5px",
                cursor: "pointer",  // Indicamos que es clicable
                border: foto.id === mainImage?.id ? "2px solid blue" : "none",  // Resaltamos la imagen seleccionada
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ViewGalery;