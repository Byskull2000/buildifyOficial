
import React, { useState } from "react";
import Cropper from "react-easy-crop";


interface Foto {
    id: number;
    filename: string;
    data: string; 
}

const MAX_SIZE_MB = 5 * 1024 * 1024; 
const MAX_RESOLUTION = 1024; 
const MAX_IMAGES = 10; 

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
    
    const [rotation, setRotation] = useState(0); // Estado para la rotación en grados
    const [imagenRecortada, setImagenRecortada] = useState<Blob | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imageToEdit, setImageToEdit] = useState<string | null>(null); // Imagen seleccionada para editar



    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            validateAndAddImages(selectedFiles);
        }
    };

    //cargar imagenes en dropzone 
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        validateAndAddImages(droppedFiles);
    };

    const rotateImage = () => {
        const newRotation = (rotation + 90) % 360; // Incrementa la rotación en 90 grados
        setRotation(newRotation); // Actualiza el estado de rotación
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

            if (!["image/jpeg", "image/png"].includes(fileType)) {
                error = "Formato Incorrecto. Solo se permiten imágenes JPG o PNG.";
            }
            if (fileSize > MAX_SIZE_MB) {
                error = `La imagen ${file.name} excede el tamaño máximo de 5MB.`;
            }

            const image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                const width = image.width;
                const height = image.height;

                
                if (width !== height) {
                    error = `La imagen ${file.name} debe tener formato 1:1 (cuadrada).`;
                } else if (width > MAX_RESOLUTION || height > MAX_RESOLUTION) {
                    error = `La imagen ${file.name} no debe exceder 1024x1024 píxeles.`;
                }

                if (!error) {
                    newImages.push(file);
                    newPreviews.push(URL.createObjectURL(file));
                    setErrorMessage(""); 
                } else {
                    setErrorMessage(error);
                }

                setImages([...images, ...newImages]);
                setPreviewImages([...previewImages, ...newPreviews]);
            };
        });
    };

    const createImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };

    
    const getCroppedImg = async (
        imageSrc: string,
        crop: { x: number; y: number; width: number; height: number }
    ) => {
        async function generateHash(input: string) {
            const textEncoder = new TextEncoder();
            const encodedData = textEncoder.encode(input);
            const hashBuffer = await crypto.subtle.digest(
                "SHA-256",
                encodedData
            );
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
            return hashHex;
        }

        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width;
        canvas.height = crop.height;

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180); // Rotar imagen
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
        ctx.restore();

        const timestamp = new Date().toISOString();
        const hash = await generateHash(`${timestamp}`);

        return new Promise<File | null>((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    const fileName = `${hash}.webp`;
                    const file = new File([blob], fileName, {
                        type: "image/webp",
                    });
                    resolve(file);
                } else {
                    resolve(null);
                }
            }, "image/webp");
        });
    };

    const onCropComplete = async (
        croppedArea: { x: number; y: number; width: number; height: number },
        croppedAreaPixels: { x: number; y: number; width: number; height: number }
    ) => {
        console.log("Cropped Area: ", croppedArea);
        setCroppedAreaPixels(croppedAreaPixels);
        if (imageToEdit) {
            const croppedImage = await getCroppedImg(imageToEdit, croppedAreaPixels);
            setImagenRecortada(croppedImage); // Guardar la imagen recortada
        }
    };

    const closeEditModal = () => {
        setIsEditing(false);
        setImageToEdit(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
      };

      

    const handleEditImage = (imageSrc: string) => {
        setImageToEdit(imageSrc); // Seleccionar imagen para editar
        setIsEditing(true);
        setIsModalOpen(true); // Abrir modal para edición
    };

    const saveEditedImage = async () => {
        if (!croppedAreaPixels || !imageToEdit) return;

        try {
            const croppedImage = await getCroppedImg(imageToEdit, croppedAreaPixels);
            if (croppedImage) {
                // Reemplazar la imagen editada en previewImages
                setPreviewImages((prevImages) =>
                    prevImages.map((image) => (image === imageToEdit ? URL.createObjectURL(croppedImage) : image))
                );
    
                // Reemplazar la imagen editada en el estado images
                setImages((prevImages) =>
                    prevImages.map((file, index) => {
                        // Convertir el Blob en un File
                        if (previewImages[index] === imageToEdit) {
                            return new File([croppedImage], file.name, { type: "image/webp" });
                        }
                        return file;
                    })
                );
            }
        } catch (error) {
            console.error("Error recortando la imagen:", error);
        }
        closeEditModal();
    };


    //sube imagenes al servidor
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

    

    //mostrar la galeria
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

    const userStorage =
    sessionStorage.getItem("user") || localStorage.getItem("user") || null;
const user = userStorage ? JSON.parse(userStorage) : null;

    return (
        <div>
            {user && (
            <>
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
            </>
        )}

            {/* Mostrar mensaje de error si hay alguno */}
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

            {/* Mostrar mensaje sobre la imagen recortada */}
            {imagenRecortada ? (<p></p>) : (<p></p>)}

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
                        <h2>Subir y Editar Imágenes</h2>

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
                                {previewImages.map((src, index) => (
                                    <div key={index} style={{ position: "relative", width: "150px", height: "150px" }}>
                                        <img
                                            //key={index}
                                            src={src}
                                            alt={`preview-${index}`}
                                            onDragStart={handleDragStart}
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                objectFit: "cover",
                                                borderRadius: "10px",
                                                margin: "10px",
                                        }}
                                    />

                                        <button
                                        onClick={() => handleEditImage(src)} // Llamada a la función para editar la imagen
                                        style={{
                                            //position: "absolute",
                                            //bottom: "10px",
                                            //left: "10px",
                                            padding: "5px 10px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            //border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            marginTop: "5px", 
                                        }}
                                    >
                                        Editar
                                    </button>
                                    </div>    
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

                    {/* Modal de edición de imagen */}
                    {isEditing && (
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
                                zIndex: 10,
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: "white",
                                    padding: "20px",
                                    width: "80vw",
                                    maxWidth:"800px",
                                    height: "600px",
                                    borderRadius: "10px",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                <h3>Editar Imagen</h3>

                                {imageToEdit && (

                                    <div 
                                        style={{
                                            position:"relative",
                                            width: "100%",
                                            height: "450px",
                                            marginBottom:"20px",  
                                        }}
                                    >

                                    <Cropper
                                        image={imageToEdit}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onZoomChange={setZoom}
                                        onCropComplete={onCropComplete}
                                        rotation={rotation}
                                    />
                                </div>
                                )}

                                {/* Botón para rotar la imagen 90 grados */}
                                {isEditing && (
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                                    <button
                                        onClick={rotateImage}
                                        style={{
                                            padding: "10px 20px",
                                            backgroundColor: "#007bff",
                                            color: "white",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            //margin: "0 20px",
                                            width: "150px",
                                            zIndex: 1002,
                                            //marginBottom: "10px",
                                        }}
                                    >
                                        Rotar
                                    </button>
                                    </div>
                                )}

                                {/* Botón para guardar los cambios del recorte */}
                                <div style={{   
                                                display: "flex", 
                                                justifyContent: "space-between",
                                                position:"absolute", 
                                                bottom: "20px",
                                                left: "20px",
                                                right: "20px",
                                                //marginTop:"20px"   
                                            }}>
                                
                                
                                <button
                                    onClick={saveEditedImage}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#28a745",
                                        color: "white",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        //marginTop: "10px",
                                    }}
                                >
                                    Guardar cambios
                                </button>

                                {/* Botón para cerrar el modal */}
                                <button
                                    onClick={closeEditModal}
                                    style={{
                                        padding: "10px 20px",
                                        backgroundColor: "#dc3545",
                                        color: "white",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        //marginTop: "10px",
                                    }}
                                >
                                    Cancelar
                                </button>
                                </div>
                            </div>
                        </div>
                        )}



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
