import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapaProps {
  onUbicacionSeleccionada: (lat: number, lng: number) => void;
}

// Configuración del icono del marcador
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Mapa: React.FC<MapaProps> = ({ onUbicacionSeleccionada }) => {
  const [ubicacion, setUbicacion] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const nuevaUbicacion = { lat: e.latlng.lat, lng: e.latlng.lng };
        setUbicacion(nuevaUbicacion);
        onUbicacionSeleccionada(nuevaUbicacion.lat, nuevaUbicacion.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[-17.3936, -66.157]}
      zoom={13}
      className="w-80 h-80 rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {ubicacion && <Marker position={[ubicacion.lat, ubicacion.lng]} />}
      <MapEvents />
    </MapContainer>
  );
};

export default Mapa;
