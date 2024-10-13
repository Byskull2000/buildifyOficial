// src/pages/DireccionesEntrega.tsx

<<<<<<< HEAD
import React, { useState } from 'react';
import DireccionForm from '../components/DireccionForm';
import Mapa from '../components/Mapa';
=======
import React, { useState } from "react";
import DireccionForm from "../components/DireccionForm";
import Mapa from "../components/Mapa";
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b

interface Ubicacion {
  lat: number;
  lng: number;
}

const DireccionesEntrega: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
<<<<<<< HEAD
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState<Ubicacion | null>(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState('');
=======
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] =
    useState<Ubicacion | null>(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b

  const guardarUbicacion = async (nombre: string, direccion: string, telefono: string) => {
    const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
    if (coordenadasSeleccionadas) {
      const { lat, lng } = coordenadasSeleccionadas;
      const data = { nombre, direccion, telefono, lat, lng };

      try {
<<<<<<< HEAD
        const response = await fetch(URL_BACKEND + "/api/guardar-direccion-entrega", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Error al guardar');
      } catch (error) {
        throw new Error('Error al guardar la dirección de entrega');
      }
    } else {
      throw new Error('Por favor, selecciona una ubicación en el mapa.');
=======
        const response = await fetch(
          "https://SyntasError404.pythonanywhere.com/api/guardar-direccion-entrega",
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
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b
    }
  };

  const agregarUbicacion = (lat: number, lng: number) => {
    setCoordenadasSeleccionadas({ lat, lng });
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setCoordenadasSeleccionadas(null);
<<<<<<< HEAD
    setDireccionSeleccionada('');
=======
    setDireccionSeleccionada("");
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b
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
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={cerrarFormulario}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Cerrar
          </button>
          <div className="flex space-x-4">
<<<<<<< HEAD
            <DireccionForm 
              onGuardar={guardarUbicacion} 
              coordenadasSeleccionadas={coordenadasSeleccionadas}
              direccion={direccionSeleccionada}
            />
            <Mapa 
              onUbicacionSeleccionada={agregarUbicacion} 
=======
            <DireccionForm
              onGuardar={guardarUbicacion}
              coordenadasSeleccionadas={coordenadasSeleccionadas}
              direccion={direccionSeleccionada}
            />
            <Mapa
              onUbicacionSeleccionada={agregarUbicacion}
>>>>>>> ac01f1f4fc05a5f3cd580abeb6d11c105b6f9f8b
              onDireccionObtenida={setDireccionSeleccionada}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DireccionesEntrega;
