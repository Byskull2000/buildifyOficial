import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import getCroppedImg from "./getCroppedImg"; // Esta es una función que tendrás que crear para obtener la imagen recortada.

interface CropImageProps {
    imageSrc: string;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
}

const CropImage: React.FC<CropImageProps> = ({ imageSrc, onCropComplete, onCancel }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropChange = useCallback((crop) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom) => {
        setZoom(zoom);
    }, []);

    const onCropCompleteHandler = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
            onCropComplete(croppedImage);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: "100%", height: 400 }}>
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={onCropChange}
                    onZoomChange={onZoomChange}
                    onCropComplete={onCropCompleteHandler}
                />
            </div>
            <div style={{ width: "100%", marginTop: 20 }}>
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    onChange={(e, zoom) => setZoom(zoom as number)}
                />
            </div>
            <div style={{ marginTop: 20 }}>
                <Button variant="contained" color="primary" onClick={handleCrop}>
                    Recortar
                </Button>
                <Button variant="outlined" color="secondary" onClick={onCancel} style={{ marginLeft: 10 }}>
                    Cancelar
                </Button>
            </div>
        </div>
    );
};

export default CortarImagen;