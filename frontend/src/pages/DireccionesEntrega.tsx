import React, { useState } from "react";
import DireccionForm from "../components/DireccionForm";
import Mapa from "../components/Mapa";

interface Ubicacion {
  lat: number;
  lng: number;
}

const DireccionesEntrega: React.FC = () => {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] =
    useState<Ubicacion | null>(null);

  const guardarUbicacion = async (
    nombre: string,
    direccion: string,
    telefono: string
  ) => {
    if (coordenadasSeleccionadas) {
      const { lat, lng } = coordenadasSeleccionadas;
      const data = { nombre, direccion, telefono, lat, lng };

      const response = await fetch(
        "https://SyntaxError404.pythonanywhere.com/api/guardar-direccion-entrega",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Error al guardar");
      }
    } else {
      throw new Error("Coordenadas no seleccionadas");
    }
  };

  const agregarUbicacion = (lat: number, lng: number) => {
    setUbicaciones((prev) => [...prev, { lat, lng }]);
    setCoordenadasSeleccionadas({ lat, lng });
  };

  return (
    <div className="flex flex-col items-center">
      {!mostrarFormulario ? (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          Agregar Ubicación de Entrega
        </button>
      ) : (
        <div className="flex space-x-4">
          <DireccionForm onGuardar={guardarUbicacion} />
          <div>
            <Mapa
              ubicaciones={ubicaciones}
              onUbicacionSeleccionada={agregarUbicacion}
            />
            {coordenadasSeleccionadas && (
              <p className="mt-2 text-gray-700 font-semibold">
                Latitud: {coordenadasSeleccionadas.lat.toFixed(6)}, Longitud:{" "}
                {coordenadasSeleccionadas.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DireccionesEntrega;
