import React from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapaProps {
  ubicaciones: { lat: number; lng: number }[];
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

const Mapa: React.FC<MapaProps> = ({
  ubicaciones,
  onUbicacionSeleccionada,
}) => {
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        onUbicacionSeleccionada(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[-17.3936, -66.157]}
      zoom={13}
      className="mapa-cuadrado"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {ubicaciones.map((ubicacion, index) => (
        <Marker key={index} position={[ubicacion.lat, ubicacion.lng]} />
      ))}
      <MapEvents />
    </MapContainer>
  );
};

export default Mapa;
