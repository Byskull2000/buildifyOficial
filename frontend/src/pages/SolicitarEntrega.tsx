import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import buildifyLogo from "../assets/Buildify.png";
import Mapa from "../components/Mapa";

interface DireccionEntrega {
  id_direccion_entrega: number;
  nombre_destinatario: string;
  descrip_direc_entrega: string;
  telefono: string;
  latitud_entrega: number;
  longitud_entrega: number;
}

const SolicitudEntrega: React.FC = () => {
  const [direccion, setDireccion] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number }>({
    lat: -17.3936,
    lng: -66.157,
  }); // Coordenadas iniciales por defecto
  const [mostrarDirecciones, setMostrarDirecciones] = useState(false);
  const [direcciones, setDirecciones] = useState<DireccionEntrega[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const userStorage = sessionStorage.getItem("user") || localStorage.getItem("user") || null;
  const user = userStorage ? JSON.parse(userStorage) : null;

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setNombre(value);
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 8) setTelefono(value);
  };

  const handleUbicacionSeleccionada = (lat: number, lng: number) => {
    setCoordenadas({ lat, lng });
  };

  const handleDireccionObtenida = (nuevaDireccion: string) => {
    setDireccion(nuevaDireccion);
  };

  const handleLimpiar = () => {
    setNombre("");
    setTelefono("");
    setDireccion("");
    setCoordenadas({ lat: -17.3936, lng: -66.157 }); // Coordenadas iniciales por defecto
    setMensaje(null);
  };

  const handleEnviarSolicitud = () => {
    if (nombre && direccion && telefono && coordenadas) {
      setMensaje("Dirección de entrega registrada correctamente.");
    } else {
      setMensaje("Por favor, llene todos los campos para la entrega.");
    }
  };

  useEffect(() => {
    if (!user) return;

    const fetchDirecciones = async () => {
      try {
        const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
        const response = await fetch(`${URL_BACKEND}/api/direcciones-entrega/${user.id_usuario}`);
        if (response.ok) {
          const data = await response.json();
          setDirecciones(data.data || []);
        } else {
          console.error("Error al obtener las direcciones:", response.statusText);
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      }
    };

    fetchDirecciones();
  }, [user]);

  const seleccionarDireccion = (direccion: DireccionEntrega) => {
    setNombre(direccion.nombre_destinatario);
    setDireccion(direccion.descrip_direc_entrega);
    setTelefono(direccion.telefono);
    setCoordenadas({ lat: direccion.latitud_entrega, lng: direccion.longitud_entrega });
    setMostrarDirecciones(false);
  };

  return (
    <div className="w-full min-h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-white border-b border-gray-300 font-nunito flex justify-between w-full sm:px-4 py-4">
        <Link to="/">
          <div className="flex items-center gap-2 px-2">
            <img
              src={buildifyLogo}
              alt="Logo de Buildify"
              className="h-14 w-14 mr-2 hidden sm:block"
            />
            <h1 className="self-center text-2xl font-black whitespace-nowrap hidden sm:block">
              Buildify
            </h1>
          </div>
        </Link>
      </div>

      {/* Pedido */}
      <div className="p-8 mx-auto max-w-7xl bg-white rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6">Pedido</h2>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-300 p-6 rounded-lg flex items-start">
            <img
              src="https://via.placeholder.com/150"
              alt="Cemento Portland"
              className="w-48 h-48 object-cover rounded-lg mr-6"
            />
            <div>
              <h3 className="font-semibold text-lg mb-2">Información de Material</h3>
              <p className="mb-2">
                <strong>Nombre:</strong> Cemento Portland
              </p>
              <p className="mb-2">
                <strong>Precio:</strong> Bs.200
              </p>
              <p>
                <strong>Cantidad:</strong> 10
              </p>
            </div>
          </div>

          <div className="bg-gray-300 p-6 rounded-lg flex items-start">
            <img
              src="https://via.placeholder.com/150"
              alt="Juan Pérez"
              className="w-48 h-48 object-cover rounded-full mr-6"
            />
            <div>
              <h3 className="font-semibold text-lg mb-2">Información de Vendedor</h3>
              <p className="mb-2">
                <strong>Nombre:</strong> Juan Pérez
              </p>
              <p>
                <strong>Teléfono:</strong> +591 78912345
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 items-start">
          <Mapa
            onUbicacionSeleccionada={handleUbicacionSeleccionada}
            onDireccionObtenida={handleDireccionObtenida}
            className="h-48 z-0"
            lat={coordenadas.lat}
            lng={coordenadas.lng}
          />

          <div className="flex flex-col space-y-4">
            <div>
              <label className="font-semibold mb-1 block">
                Nombre del Destinatario:
              </label>
              <input
                type="text"
                value={nombre}
                onChange={handleNombreChange}
                placeholder="Ingrese el nombre del destinatario"
                className="bg-gray-200 p-3 rounded-md w-full"
              />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Dirección:</label>
              <input
                type="text"
                value={direccion}
                readOnly
                className="bg-gray-200 p-3 rounded-md w-full"
              />
            </div>
            <div>
              <label className="font-semibold mb-1 block">Teléfono:</label>
              <div className="flex items-center">
                <select
                  value="+591"
                  disabled
                  className="bg-gray-200 p-3 rounded-md mr-2 cursor-not-allowed"
                >
                  <option value="+591">+591 (Bolivia)</option>
                </select>
                <input
                  type="text"
                  value={telefono}
                  onChange={handleTelefonoChange}
                  placeholder="Ingrese el teléfono de contacto"
                  className="bg-gray-200 p-3 rounded-md flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center ml-4 mt-6">
            <div className="text-center">
              <p className="text-lg font-semibold mb-4">
                ¿Tiene una dirección de entrega?
              </p>
              <button
                onClick={() => setMostrarDirecciones(true)}
                className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600"
              >
                Elegir
              </button>
            </div>
          </div>
        </div>

        {mensaje && (
          <div
            className={`mt-4 p-3 rounded-md text-center ${
              mensaje.includes("correctamente") ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
            }`}
          >
            {mensaje}
          </div>
        )}

        <div className="flex justify-between mt-10">
          <Link to="/solicitarTipoEntrega">
            <button className="bg-gray-400 text-white py-3 px-6 rounded-md hover:bg-gray-500">
              Volver
            </button>
          </Link>
          <div className="flex space-x-4">
            <button
              className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-700"
              onClick={handleLimpiar}
            >
              Limpiar
            </button>
            <button
              onClick={handleEnviarSolicitud}
              className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700"
            >
              Enviar solicitud
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Direcciones */}
      {mostrarDirecciones && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full z-60 shadow-lg relative">
            <h3 className="text-xl font-bold mb-4">Seleccionar Dirección</h3>
            <ul className="space-y-4">
              {direcciones.map((dir) => (
                <li
                  key={dir.id_direccion_entrega}
                  className="p-4 border rounded-md cursor-pointer hover:bg-gray-100"
                  onClick={() => seleccionarDireccion(dir)}
                >
                  <p>
                    <strong>Nombre:</strong> {dir.nombre_destinatario}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {dir.descrip_direc_entrega}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {dir.telefono}
                  </p>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setMostrarDirecciones(false)}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitudEntrega;
