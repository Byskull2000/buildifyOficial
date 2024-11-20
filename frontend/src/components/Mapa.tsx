import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface MapaProps {
  onUbicacionSeleccionada: (lat: number, lng: number) => void;
  onDireccionObtenida: (direccion: string) => void;
  className?: string; // Agregado para permitir estilos
  lat?: number; // Coordenada inicial opcional
  lng?: number; // Coordenada inicial opcional
}

// Configuración de los íconos predeterminados para Leaflet
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
  className,
  lat = -17.3936, // Coordenada inicial predeterminada (Cochabamba)
  lng = -66.157,
}) => {
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number }>({
    lat,
    lng,
  });

  // Obtener dirección a partir de coordenadas
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

  // Manejo de eventos en el mapa
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

  // Actualizar la ubicación inicial si las coordenadas cambian
  useEffect(() => {
    if (lat && lng) {
      setUbicacion({ lat, lng });
      obtenerDireccion(lat, lng);
    }
  }, [lat, lng]);

  return (
    <MapContainer
      center={[ubicacion.lat, ubicacion.lng]} // Centrar en la ubicación inicial
      zoom={13}
      className={`w-full h-full rounded-lg ${className}`} // Aplicar className
    >
      <TileLayer
        url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=GCOpKicdylXi0ePsOuiv"
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
      />
      <Marker position={[ubicacion.lat, ubicacion.lng]} />
      <MapEvents />
    </MapContainer>
  );
};

export default Mapa;
