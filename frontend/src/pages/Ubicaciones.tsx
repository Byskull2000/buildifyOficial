import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configuración para íconos personalizados de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const App: React.FC = () => {
  const [coordenadas, setCoordenadas] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);

  const handleMapClick = (lat: number, lng: number) => {
    setCoordenadas({ lat, lng });
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const guardarUbicacion = async () => {
    if (coordenadas) {
      try {
        const response = await fetch(
          "https://tu-usuario.pythonanywhere.com/api/guardar-ubicacion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(coordenadas),
          }
        );

        if (response.ok) {
          alert("¡Ubicación guardada con éxito!");
        } else {
          alert("Hubo un error al guardar la ubicación");
        }
      } catch (error) {
        alert("No se pudo conectar con el servidor");
      }
    } else {
      alert("Primero selecciona una ubicación en el mapa");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        className="px-6 py-3 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition"
        onClick={() => setMostrarMapa(!mostrarMapa)}
      >
        Agregar Ubicación
      </button>
      {mostrarMapa && (
        <MapContainer
          center={[-17.3936, -66.157]}
          zoom={13}
          className="w-full h-96 mt-6 rounded-lg shadow-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <MapEvents />
          {coordenadas && (
            <Marker position={[coordenadas.lat, coordenadas.lng]} />
          )}
        </MapContainer>
      )}
      {coordenadas && (
        <>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Latitud: {coordenadas.lat.toFixed(6)}, Longitud:{" "}
            {coordenadas.lng.toFixed(6)}
          </p>
          <button
            className="mt-4 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            onClick={guardarUbicacion}
          >
            Guardar Ubicación
          </button>
        </>
      )}
    </div>
  );
};

export default App;
