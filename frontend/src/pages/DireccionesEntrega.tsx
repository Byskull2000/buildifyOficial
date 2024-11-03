// src/pages/DireccionesEntrega.tsx

import React, { useState, useRef, useEffect } from "react";
import DireccionForm from "../components/DireccionForm";
import Mapa from "../components/Mapa";

interface Ubicacion {
  lat: number;
  lng: number;
}

const DireccionesEntrega: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState<Ubicacion | null>(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement | null>(null);

  const guardarUbicacion = async (nombre: string, direccion: string, telefono: string) => {
    const userStorage = sessionStorage.getItem("user") || localStorage.getItem("user") || null;
    const user = userStorage ? JSON.parse(userStorage) : null;
    const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

    if (coordenadasSeleccionadas) {
      const { lat, lng } = coordenadasSeleccionadas;
      const usuario = user?.id_usuario;
      const data = { nombre, direccion, telefono, lat, lng, usuario };

      console.log("Datos a guardar:", data); // Para verificar el objeto

      try {
        const response = await fetch(`${URL_BACKEND}/api/guardar-direccion-entrega`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorResponse = await response.text(); // Obtener el texto de la respuesta
          throw new Error(`Error al guardar: ${errorResponse}`); // Lanzar el error con el mensaje detallado
        }

        setMensaje("Dirección guardada exitosamente.");
        cerrarFormulario(); // Cerrar formulario después de guardar
      } catch (error) {
        console.error("Error al guardar la dirección:", error); // Registro del error
        setMensaje("Error al guardar la dirección de entrega. Por favor, inténtalo nuevamente.");
      }
    } else {
      setMensaje("Por favor, selecciona una ubicación en el mapa.");
    }
  };

  const agregarUbicacion = (lat: number, lng: number) => {
    setCoordenadasSeleccionadas({ lat, lng });
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setCoordenadasSeleccionadas(null);
    setDireccionSeleccionada("");
    setMensaje(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        cerrarFormulario();
      }
    };

    if (mostrarFormulario) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mostrarFormulario]);

  const userStorage = sessionStorage.getItem("user") || localStorage.getItem("user") || null;
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
        <div ref={formRef} className="flex flex-col items-center space-y-4 w-full max-w-3xl">
          {user && (
            <button
              onClick={cerrarFormulario}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Cerrar
            </button>
          )}

          {mensaje && (
            <p className={`text-center ${mensaje.includes("exitosamente") ? "text-green-500" : "text-red-500"}`}>
              {mensaje}
            </p>
          )}

          {user && (
            <div className="flex flex-col md:flex-row items-start w-full space-y-4 md:space-y-0 md:space-x-4">
              <DireccionForm
                onGuardar={guardarUbicacion}
                coordenadasSeleccionadas={coordenadasSeleccionadas}
                direccion={direccionSeleccionada}
              />
              <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded overflow-hidden">
                <Mapa
                  onUbicacionSeleccionada={agregarUbicacion}
                  onDireccionObtenida={setDireccionSeleccionada}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DireccionesEntrega;
