// src/components/Mapa.tsx

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapaProps {
  onUbicacionSeleccionada: (lat: number, lng: number) => void;
  onDireccionObtenida: (direccion: string) => void;
  className?: string; // Agregado para permitir estilos
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Mapa: React.FC<MapaProps> = ({
  onUbicacionSeleccionada,
  onDireccionObtenida,
  className, // Desestructurar aquí
}) => {
  const [ubicacion, setUbicacion] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const obtenerDireccion = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const direccion = data.display_name || "Dirección no encontrada";
      onDireccionObtenida(direccion);
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
      onDireccionObtenida("No se pudo obtener la dirección");
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const nuevaUbicacion = { lat, lng };
        setUbicacion(nuevaUbicacion);
        onUbicacionSeleccionada(lat, lng);
        obtenerDireccion(lat, lng);
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[-17.3936, -66.157]}
      zoom={13}
      className={`w-full h-full rounded-lg ${className}`} // Aplicar className
    >
      <TileLayer
        url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=GCOpKicdylXi0ePsOuiv"
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
      />
      {ubicacion && <Marker position={[ubicacion.lat, ubicacion.lng]} />}
      <MapEvents />
    </MapContainer>
  );
};

export default Mapa;
