import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface Mapa2Props {
  location: { lat: number; lng: number }; 
  onDireccionObtenida: (direccion: string) => void; 
  className?: string; 
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Mapa2: React.FC<Mapa2Props> = ({ location, onDireccionObtenida, className }) => {
  const [direccion, setDireccion] = useState<string>("Cargando...");

  useEffect(() => {
    const obtenerDireccion = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
        );
        const data = await response.json();
        const direccionObtenida = data.display_name || "Dirección no encontrada";
        setDireccion(direccionObtenida);
        onDireccionObtenida(direccionObtenida);
      } catch (error) {
        console.error("Error al obtener la dirección:", error);
        setDireccion("No se pudo obtener la dirección");
      }
    };

    obtenerDireccion();
  }, [location, onDireccionObtenida]);

  return (
    <div className={`w-full h-full rounded-lg ${className}`}>
      <MapContainer
        center={[location.lat, location.lng]} 
        zoom={13}
        scrollWheelZoom={false} // No permite zoom con scroll
        className="w-full h-full"
      >
        <TileLayer
          url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=GCOpKicdylXi0ePsOuiv"
          attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
        />
        <Marker position={[location.lat, location.lng]} /> 
      </MapContainer>
      <p className="text-sm mt-2">{direccion}</p>
    </div>
  );
};

export default Mapa2;
