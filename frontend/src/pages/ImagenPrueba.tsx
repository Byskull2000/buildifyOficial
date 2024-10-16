import React, { useState } from "react";

interface Foto {
    id: number;
    filename: string;
    data: string; // Datos de imagen codificados en Base64
}

const MAX_SIZE_MB = 5 * 1024 * 1024; // Tamaño máximo en bytes
const MAX_RESOLUTION = 1024; // Resolución máxima 1024x1024
const MAX_IMAGES = 10; // Máximo de imágenes permitido

const ImageUploader: React.FC = () => {
    const [images, setImages] = useState<File[]>([]);
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [progress, setProgress] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
    const [galleryImages, setGalleryImages] = useState<Foto[]>([]);
    const [showCloseConfirmation, setShowCloseConfirmation] = useState<boolean>(false);

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
        if (images.length + selectedFiles.length > MAX_IMAGES) {
            setErrorMessage(`Solo puedes subir un máximo de ${MAX_IMAGES} imágenes.`);
            return;
        }

        const newImages: File[] = [];
        const newPreviews: string[] = [];
        let error = "";

        selectedFiles.forEach((file) => {
            const fileType = file.type;
            const fileSize = file.size;

            // Validar tipo de archivo
            if (!["image/jpeg", "image/png"].includes(fileType)) {
                error = "Formato Incorrecto. Solo se permiten imágenes JPG o PNG.";
            }

            // Validar tamaño de archivo
            if (fileSize > MAX_SIZE_MB) {
                error = `La imagen ${file.name} excede el tamaño máximo de 5MB.`;
            }

            const image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                const width = image.width;
                const height = image.height;

                // Validar resolución de imagen y formato cuadrado
                if (width !== height) {
                    error = `La imagen ${file.name} debe tener formato 1:1 (cuadrada).`;
                } else if (width > MAX_RESOLUTION || height > MAX_RESOLUTION) {
                    error = `La imagen ${file.name} no debe exceder 1024x1024 píxeles.`;
                }

                if (!error) {
                    newImages.push(file);
                    newPreviews.push(URL.createObjectURL(file));
                    setErrorMessage(""); // Borrar cualquier mensaje de error previo si es válido
                } else {
                    setErrorMessage(error);
                }

                setImages([...images, ...newImages]);
                setPreviewImages([...previewImages, ...newPreviews]);
            };
        });
    };

    const handleUploadImages = async () => {
        if (images.length === 0) {
            setErrorMessage("No hay imágenes para subir.");
            return;
        }

        setUploading(true);
        setErrorMessage("");
        setProgress(0);

        const formData = new FormData();
        images.forEach((file) => {
            formData.append("file", file);
        });

        try {
            const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
            const response = await fetch(URL_BACKEND + "/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error en la subida de imágenes");
            }

            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setUploading(false);
                        setProgress(100);
                        alert("Imágenes subidas exitosamente.");
                        setImages([]);
                        setPreviewImages([]);
                        return 100;
                    }
                    return prev + 10;
                });
            }, 500);
        } catch (error) {
            console.error(error);
            setErrorMessage("Ocurrió un error al subir las imágenes.");
            setUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado de arrastrar imágenes
    };

    const toggleModal = () => {
        setShowCloseConfirmation(true); // Mostrar la confirmación de cierre
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setErrorMessage("");
        setImages([]);
        setPreviewImages([]);
        setShowCloseConfirmation(false); // Ocultar la confirmación
    };

    const toggleGallery = async () => {
        setIsGalleryOpen(!isGalleryOpen);
        if (!isGalleryOpen) {
            try {
                const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
                const response = await fetch(URL_BACKEND + "/api/galeria");
                if (!response.ok) {
                    throw new Error("Error al cargar imágenes de la galería.");
                }
                const data = await response.json();
                setGalleryImages(data.fotos);
            } catch (error) {
                console.error(error);
                setErrorMessage("Ocurrió un error al cargar la galería.");
            }
        }
    };

    return (
        <div>
            <button
                onClick={() => setIsModalOpen(true)}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginRight: "10px",
                }}
            >
                Subir Foto
            </button>

            <button
                onClick={toggleGallery}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Galería
            </button>

            {/* Mostrar mensaje de error si hay alguno */}
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

            {/* Modal para subir imágenes */}
            {isModalOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            width: "900px",
                            height: "560px",
                            borderRadius: "10px",
                            position: "relative",
                        }}
                    >
                        <h2>Subir Imágenes</h2>

                        <button
                            onClick={toggleModal}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer",
                            }}
                        >
                            &times;
                        </button>

                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            style={{
                                border: "2px dashed #ccc",
                                padding: "40px",
                                width: "100%",
                                height: "400px",
                                cursor: "pointer",
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                marginBottom: "10px",
                            }}
                        >
                            {/* Texto que desaparecerá cuando haya imágenes */}
                            {previewImages.length === 0 && (
                                <p style={{ margin: 0 }}>Arrastra y suelta tus imágenes aquí</p>
                            )}

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    flexWrap: "wrap",
                                    gap: "10px",
                                    width: "100%",
                                    height: "100%",
                                    overflow: "auto",
                                }}
                            >
                                {previewImages.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`preview-${index}`}
                                        onDragStart={handleDragStart}
                                        style={{
                                            width: "150px",
                                            height: "150px",
                                            objectFit: "cover",
                                            borderRadius: "10px",
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Botón para seleccionar archivos */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <label
                                htmlFor="fileInput"
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    display: "block",
                                }}
                            >
                                Seleccionar Imágenes
                            </label>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: "none" }}
                            />

                            <button
                                onClick={handleUploadImages}
                                disabled={uploading}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    display: "block",
                                }}
                            >
                                {uploading ? `Subiendo... ${progress}%` : "Subir Imágenes"}
                            </button>
                        </div>

                        {/* Mensaje de error */}
                        {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
                    </div>

                    {/* Modal de confirmación */}
                    {showCloseConfirmation && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        backgroundColor: "white",
                                        padding: "20px",
                                        width: "400px",
                                        borderRadius: "10px",
                                        textAlign: "center",
                                    }}
                                >
                                    <h3 style={{ marginBottom: "20px" }}>¿Estás seguro de que deseas cerrar?</h3>
                                        <p style={{ marginBottom: "30px" }}>Perderás todas las imágenes seleccionadas</p>

                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <button
                                            onClick={closeModal}
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Confirmar
                                        </button>
                                        <button
                                            onClick={() => setShowCloseConfirmation(false)}
                                            style={{
                                                padding: "10px 20px",
                                                backgroundColor: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "5px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Galería de imágenes */}
                {isGalleryOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            width: "800px",
                            height: "500px",
                            borderRadius: "10px",
                            position: "relative",
                        }}
                    >
                        <h2>Galería de Imágenes</h2>

                        <button
                            onClick={toggleGallery}
                            style={{
                                position: "absolute",
                                top: "10px",
                                right: "10px",
                                background: "none",
                                border: "none",
                                fontSize: "18px",
                                cursor: "pointer",
                            }}
                        >
                            &times;
                        </button>

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
                                        border: "0px solid #007bff",
                                        borderRadius: "5px",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default ImageUploader;
