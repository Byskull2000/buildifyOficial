// src/pages/DireccionesEntrega.tsx

import React, { useState } from "react";
import DireccionForm from "../components/DireccionForm";
import Mapa from "../components/Mapa";

interface Ubicacion {
  lat: number;
  lng: number;
}

const DireccionesEntrega: React.FC = () => {

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] =
    useState<Ubicacion | null>(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");

  
  const guardarUbicacion = async (
    nombre: string,
    direccion: string,
    telefono: string
  ) => {
    const userStorage = sessionStorage.getItem("user") || localStorage.getItem("user") || null;
    const user = userStorage ? JSON.parse(userStorage) : null;
    const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
    if (coordenadasSeleccionadas) {
      const { lat, lng } = coordenadasSeleccionadas;
      const usuario = user.id_usuario;
      const data = { nombre, direccion, telefono, lat, lng, usuario};

      try {
        const response = await fetch(
          `${URL_BACKEND}/api/guardar-direccion-entrega`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) throw new Error("Error al guardar");
      } catch (error) {
        throw new Error("Error al guardar la dirección de entrega");
      }
    } else {
      throw new Error("Por favor, selecciona una ubicación en el mapa.");
    }
  };

  const agregarUbicacion = (lat: number, lng: number) => {
    setCoordenadasSeleccionadas({ lat, lng });
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setCoordenadasSeleccionadas(null);
    setDireccionSeleccionada("");
  };

  const userStorage =
  sessionStorage.getItem("user") || localStorage.getItem("user") || null;
const user = userStorage ? JSON.parse(userStorage) : null;
  return (
    <div className="flex flex-col items-center">
      {!mostrarFormulario && user ? (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-4"
        >
          Agregar Ubicación de Entrega
        </button>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          {user &&(
          <button
            onClick={cerrarFormulario}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Cerrar
          </button>
           )}

          {user && (
          <div className="flex space-x-4">
            <DireccionForm
              onGuardar={guardarUbicacion}
              coordenadasSeleccionadas={coordenadasSeleccionadas}
              direccion={direccionSeleccionada}
            />
            <Mapa
              onUbicacionSeleccionada={agregarUbicacion}
              onDireccionObtenida={setDireccionSeleccionada}
            />
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DireccionesEntrega;
