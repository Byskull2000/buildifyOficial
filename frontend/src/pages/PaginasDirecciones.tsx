// src/pages/PaginasDirecciones.tsx
import React, { useState, useEffect } from "react";
import DireccionForm from "../components/DireccionForm";
import Mapa from "../components/Mapa";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaTrash, FaEdit, FaTimes } from "react-icons/fa";

interface Direccion {
  id_direccion_entrega: number;
  nombre_destinatario: string;
  direccion: string;
  telefono: string;
  lat: number;
  lng: number;
  esPredeterminada: boolean;
}

const PaginasDirecciones: React.FC = () => {
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [coordenadasSeleccionadas, setCoordenadasSeleccionadas] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [direccionEditable, setDireccionEditable] = useState<Direccion | null>(
    null
  );
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
  const [direccionAEliminar, setDireccionAEliminar] =
    useState<Direccion | null>(null);

  const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;

  // Cargar direcciones del backend al iniciar la página
  useEffect(() => {
    const fetchDirecciones = async () => {
      const response = await fetch(`${URL_BACKEND}/api/direcciones-entrega`);
      const data = await response.json();
      setDirecciones(data);
    };

    fetchDirecciones();
  }, []);

  const agregarDireccion = async (
    nombre: string,
    direccion: string,
    telefono: string
  ) => {
    if (direcciones.length >= 9) {
      alert("No puedes agregar más de 9 direcciones.");
      return;
    }

    const nuevaDireccion = {
      nombre_destinatario: nombre,
      direccion,
      telefono,
      lat: coordenadasSeleccionadas!.lat,
      lng: coordenadasSeleccionadas!.lng,
    };

    try {
      const response = await fetch(
        `${URL_BACKEND}/api/guardar-direccion-entrega`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nuevaDireccion),
        }
      );

      if (!response.ok) throw new Error("Error al guardar la dirección.");

      const data = await response.json();
      setDirecciones([
        ...direcciones,
        { ...nuevaDireccion, id_direccion_entrega: data.id },
      ]);
      setMostrarFormulario(false);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la dirección.");
    }
  };

  const confirmarEliminarDireccion = (direccion: Direccion) => {
    setDireccionAEliminar(direccion);
    setMostrarModalEliminar(true);
  };

  const eliminarDireccion = async () => {
    if (direccionAEliminar) {
      try {
        const response = await fetch(
          `${URL_BACKEND}/api/eliminar-direccion-entrega/${direccionAEliminar.id_direccion_entrega}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Error al eliminar la dirección.");

        setDirecciones(
          direcciones.filter(
            (dir) =>
              dir.id_direccion_entrega !==
              direccionAEliminar.id_direccion_entrega
          )
        );
        setMostrarModalEliminar(false);
        setDireccionAEliminar(null);
      } catch (error) {
        console.error(error);
        alert("Error al eliminar la dirección.");
      }
    }
  };

  const establecerPredeterminado = async (id: number) => {
    try {
      await fetch(
        `${URL_BACKEND}/api/establecer-direccion-predeterminada/${id}`,
        {
          method: "PUT",
        }
      );

      setDirecciones(
        direcciones.map((dir) => ({
          ...dir,
          esPredeterminada: dir.id_direccion_entrega === id,
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Error al establecer la dirección predeterminada.");
    }
  };

  const iniciarEdicion = (direccion: Direccion) => {
    setDireccionEditable(direccion);
    setMostrarFormulario(true);
  };

  const actualizarDireccion = async (
    nombre: string,
    direccion: string,
    telefono: string
  ) => {
    if (direccionEditable) {
      const direccionActualizada = {
        ...direccionEditable,
        nombre_destinatario: nombre,
        direccion,
        telefono,
      };

      try {
        const response = await fetch(
          `${URL_BACKEND}/api/actualizar-direccion-entrega/${direccionEditable.id_direccion_entrega}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(direccionActualizada),
          }
        );

        if (!response.ok) throw new Error("Error al actualizar la dirección.");

        setDirecciones(
          direcciones.map((dir) =>
            dir.id_direccion_entrega === direccionEditable.id_direccion_entrega
              ? direccionActualizada
              : dir
          )
        );
        setDireccionEditable(null);
        setMostrarFormulario(false);
      } catch (error) {
        console.error(error);
        alert("Error al actualizar la dirección.");
      }
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      {/* Botón de salida */}
      <button
        onClick={() => (window.location.href = "/")} // Asumiendo que redirige a la página principal
        className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
      >
        <FaTimes size={16} />
      </button>

      <h1 className="text-center font-bold text-3xl mb-6 text-gray-800">
        Gestionar Direcciones de Entrega
      </h1>

      <div className="flex flex-wrap gap-6 justify-center">
        {direcciones.map((direccion) => (
          <div
            key={direccion.id_direccion_entrega}
            className="w-80 border p-4 rounded-lg shadow-lg bg-white flex"
          >
            <div className="w-1/3 h-32 rounded-lg overflow-hidden mr-4">
              <MapContainer
                center={[direccion.lat, direccion.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                dragging={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url="https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=GCOpKicdylXi0ePsOuiv"
                  attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
                />
                <Marker position={[direccion.lat, direccion.lng]} />
              </MapContainer>
            </div>

            <div className="w-2/3">
              <div className="mb-2 font-semibold">
                Destinatario: {direccion.nombre_destinatario}
              </div>
              <div className="mb-2">Dirección: {direccion.direccion}</div>
              <div className="mb-2">Teléfono: {direccion.telefono}</div>

              <div className="flex mt-2 space-x-2">
                <button
                  onClick={() => iniciarEdicion(direccion)}
                  className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => confirmarEliminarDireccion(direccion)}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <FaTrash />
                </button>
                <button
                  onClick={() =>
                    establecerPredeterminado(direccion.id_direccion_entrega)
                  }
                  className={`px-3 py-1 rounded text-white ${
                    direccion.esPredeterminada ? "bg-green-500" : "bg-gray-500"
                  }`}
                >
                  {direccion.esPredeterminada
                    ? "Predeterminado"
                    : "Predeterminar"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {mostrarFormulario
            ? "Cerrar Formulario"
            : "+ Agregar Nueva Dirección"}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="flex justify-center items-start mt-6">
          <div className="flex flex-col md:flex-row gap-4 bg-gray-200 p-6 rounded-lg shadow-lg">
            <DireccionForm
              onGuardar={
                direccionEditable ? actualizarDireccion : agregarDireccion
              }
              coordenadasSeleccionadas={coordenadasSeleccionadas}
              direccion={
                direccionEditable
                  ? direccionEditable.direccion
                  : direccionSeleccionada
              }
            />

            <Mapa
              onUbicacionSeleccionada={(lat, lng) =>
                setCoordenadasSeleccionadas({ lat, lng })
              }
              onDireccionObtenida={setDireccionSeleccionada}
              className="w-full h-64 md:w-96 md:h-auto rounded-lg shadow"
            />
          </div>
        </div>
      )}

      {mostrarModalEliminar && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-lg font-bold mb-4">¿Estás seguro?</h3>
            <p className="mb-6">¿Deseas eliminar esta dirección de entrega?</p>
            <button
              onClick={eliminarDireccion}
              className="bg-red-500 text-white px-4 py-2 rounded-lg mr-4 hover:bg-red-600"
            >
              Confirmar
            </button>
            <button
              onClick={() => setMostrarModalEliminar(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginasDirecciones;
