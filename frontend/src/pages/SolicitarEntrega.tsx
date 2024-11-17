import buildifyLogo from "../assets/Buildify.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Mapa from "../components/Mapa"; 

const data = [
  {
    id: 1,
    material: {
      name: "Cemento Portland",
      price: 200,  
      quantity: 10,
      image: "https://via.placeholder.com/150",
    },
    seller: {
      name: "Juan Pérez",
      phone: "+591 78912345",
      image: "https://via.placeholder.com/150",
    },
  },
];

const SolicitudEntrega: React.FC = () => {
  const [direccion, setDireccion] = useState("Cochabamba");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""); // Solo letras y espacios
    setNombre(value);
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Solo números
    if (value.length <= 8) setTelefono(value); // Limitar a 8 dígitos
  };

  const handleUbicacionSeleccionada = (lat: number, lng: number) => {
    console.log("Latitud:", lat, "Longitud:", lng); // Solo para depuración
  };

  const handleDireccionObtenida = (nuevaDireccion: string) => {
    setDireccion(nuevaDireccion);
  };

  const handleLimpiar = () => {
    setNombre(""); // Limpiar el nombre
    setTelefono(""); // Limpiar el teléfono
    setDireccion(""); // Limpiar la dirección
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

        {data.map((item) => (
          <div key={item.id} className="mb-10">
            <div className="grid grid-cols-2 gap-6 mb-6">
              
              <div className="bg-gray-300 p-6 rounded-lg flex items-start">
                <img
                  src={item.material.image}
                  alt={item.material.name}
                  className="w-48 h-48 object-cover rounded-lg mr-6" // Imagen de 200x200
                />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Información de Material</h3>
                  <p className="mb-2">
                    <strong>Nombre:</strong> {item.material.name}
                  </p>
                  <p className="mb-2">
                    <strong>Precio:</strong> Bs.{item.material.price}
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {item.material.quantity}
                  </p>
                  <p className="mt-2">
                    <strong>Total:</strong> Bs.{item.material.price * item.material.quantity} {/* Calcular el total */}
                  </p>
                </div>
              </div>

              {/* Seller Info */}
              <div className="bg-gray-300 p-6 rounded-lg flex items-start">
                <img
                  src={item.seller.image}
                  alt={item.seller.name}
                  className="w-48 h-48 object-cover rounded-full mr-6" // Imagen de 200x200
                />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Información de Vendedor</h3>
                  <p className="mb-2">
                    <strong>Nombre:</strong> {item.seller.name}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {item.seller.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 items-start">
      
              <Mapa
                onUbicacionSeleccionada={handleUbicacionSeleccionada}
                onDireccionObtenida={handleDireccionObtenida}
                className="h-48"
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
                  <button className="bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600">
                    Elegir
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-10">
          {/* Envolvemos el botón 'Volver' con un Link */}
          <Link to="/solicitarTipoEntrega">
            <button className="bg-gray-400 text-white py-3 px-6 rounded-md hover:bg-gray-500">
              Volver
            </button>
          </Link>
          <div className="flex space-x-4">
            <button className="bg-red-500 text-white py-3 px-6 rounded-md hover:bg-red-700" onClick={handleLimpiar}>
              Limpiar
            </button>
            <button className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700">
              Enviar solicitud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudEntrega;
