import buildifyLogo from "../assets/Buildify.png";
import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Mapa2 from "../components/Mapa2";

const OrderPickup: React.FC = () => {
  const [direcciones, setDirecciones] = useState<string[]>([]);
  const location = useLocation();
  const [materialData, setMaterialData] = useState<any>(null);

  useEffect(() => {
    // Obtener datos desde el estado del router o localStorage
    if (location.state?.material) {
      setMaterialData(location.state.material);
      localStorage.setItem(
        "currentOrderMaterial",
        JSON.stringify(location.state.material)
      );
    } else {
      const savedData = localStorage.getItem("currentOrderMaterial");
      if (savedData) {
        setMaterialData(JSON.parse(savedData));
      } else {
        console.error("No se encontraron datos del material.");
      }
    }
  }, [location.state]);

  useEffect(() => {
    // Configurar direcciones iniciales basadas en los datos dinámicos
    if (materialData?.address) {
      setDirecciones([materialData.address]);
    }
  }, [materialData]);

  const handleDireccionObtenida = (nuevaDireccion: string) => {
    setDirecciones([nuevaDireccion]); // Actualizar dirección en base a la selección
  };

  return (
    <div className="w-full min-h-screen bg-gray-200">
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

      <div className="p-8 mx-auto max-w-7xl bg-white rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6">Pedido</h2>

        {materialData ? (
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Información del Material */}
            <div className="bg-gray-300 p-6 rounded-lg flex items-start">
              <img
                src={
                  materialData.imagenUrl || "https://via.placeholder.com/150"
                }
                alt={materialData.nombre_material}
                className="w-48 h-48 object-cover rounded-lg mr-6"
              />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Información de Material
                </h3>
                <p className="mb-2">
                  <strong>Nombre:</strong> {materialData.nombre_material}
                </p>
                <p className="mb-2">
                  <strong>Precio:</strong> Bs.{materialData.precio_material}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {materialData.estado_material || "No especificado"}
                </p>
              </div>
            </div>

            {/* Información del Vendedor */}
            <div className="bg-gray-300 p-6 rounded-lg flex items-start">
              <img
                src={imgEjemploPerfil}
                alt="Vendedor"
                className="w-48 h-48 object-cover rounded-full mr-6"
              />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Información de Vendedor
                </h3>
                <p className="mb-2">
                  <strong>Nombre:</strong>{" "}
                  {materialData.vendedor || "Vendedor desconocido"}
                </p>
                <p>
                  <strong>Empresa:</strong> Buildify Proveedores
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No se encontraron datos para mostrar.</p>
        )}

        {/* Mapa y Dirección */}
        <div className="grid grid-cols-2 gap-6 items-center">
          <div className="bg-gray-300 h-60 rounded-lg overflow-hidden">
            <Mapa2
              location={
                materialData?.location || { lat: -17.3936, lng: -66.157 }
              }
              onDireccionObtenida={(direccion) =>
                handleDireccionObtenida(direccion)
              }
              className="w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold mb-2">Dirección:</label>
            <input
              type="text"
              value={direcciones[0] || ""}
              readOnly
              className="bg-gray-200 p-3 rounded-md"
            />
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between mt-8">
          <Link
            to="/solicitarTipoEntrega"
            className="bg-gray-400 text-white py-3 px-6 rounded-md text-center hover:bg-gray-500"
          >
            Volver
          </Link>
          <Link
            to="/historialcompras"
            className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600"
          >
            OK
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderPickup;
