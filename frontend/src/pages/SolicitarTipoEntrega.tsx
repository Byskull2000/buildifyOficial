import buildifyLogo from "../assets/Buildify.png";
import camionImage from "../assets/Camion .png";
import ubicacionImage from "../assets/Ubicacion.png";
import imgEjemploPerfil from "../assets/ejemploPerfil.jpg";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const OrderPickup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Intentar cargar datos desde el estado del router
    if (location.state?.material) {
      setData(location.state.material);
      localStorage.setItem(
        "currentOrderMaterial",
        JSON.stringify(location.state.material)
      );
    } else {
      // Intentar cargar desde localStorage si no hay datos en el estado
      const savedData = localStorage.getItem("currentOrderMaterial");
      if (savedData) {
        setData(JSON.parse(savedData));
      }
    }
  }, [location.state]);

  return (
    <div className="w-full min-h-screen bg-gray-200">
      {/* Encabezado con el logo */}
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

      {/* Contenido principal */}
      <div className="p-8 mx-auto max-w-7xl bg-white rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-bold mb-6">Pedido</h2>

        {data ? (
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Información del Material */}
            <div className="bg-gray-300 p-6 rounded-lg flex items-start">
              <img
                src={data.imagenUrl || "https://via.placeholder.com/150"}
                alt={data.nombre_material}
                className="w-48 h-48 object-cover rounded-lg mr-6"
              />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Información de Material
                </h3>
                <p className="mb-2">
                  <strong>Nombre:</strong> {data.nombre_material}
                </p>
                <p className="mb-2">
                  <strong>Precio:</strong> Bs.{data.precio_material}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {data.estado_material || "No especificado"}
                </p>
              </div>
            </div>

            {/* Información del Vendedor */}
            <div className="bg-gray-300 p-6 rounded-lg flex items-start">
              <img
                src={imgEjemploPerfil}
                alt="Imagen por defecto del vendedor"
                className="w-48 h-48 object-cover rounded-full mr-6"
              />
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Información de Vendedor
                </h3>
                <p className="mb-2">
                  <strong>Nombre:</strong>{" "}
                  {data.vendedor || "Vendedor desconocido"}
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

        {/* Métodos de Envío */}
        <h3 className="text-2xl font-bold mb-4">Métodos de Envío</h3>
        <div className="grid grid-cols-2 gap-6 items-center">
          {/* Botón para recoger en el lugar */}
          <button
            onClick={() =>
              navigate("/solicitudRecoger", {
                state: { material: data }, // Aquí aseguramos que se envían los datos del material
              })
            }
            className="flex flex-col items-center bg-yellow-500 text-white py-3 px-4 rounded-lg shadow hover:bg-yellow-600"
          >
            <img
              src={ubicacionImage}
              alt="Ubicación"
              className="mb-2 w-10 h-10"
            />
            Recoger en el lugar
          </button>

          {/* Botón para solicitar entrega */}
          <button
            onClick={() =>
              navigate("/solicitarEntrega", {
                state: { material: data }, // Aquí enviamos los datos del material
              })
            }
            className="flex flex-col items-center bg-yellow-500 text-white py-3 px-4 rounded-lg shadow hover:bg-yellow-600"
          >
            <img src={camionImage} alt="Camión" className="mb-2 w-10 h-10" />
            Solicitar entrega
          </button>
        </div>

        {/* Botón de volver */}
        <div className="flex justify-start mt-8">
          <button
            onClick={() => navigate("/historialcompras")}
            className="bg-gray-400 text-white py-3 px-6 rounded-md hover:bg-gray-500"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPickup;
