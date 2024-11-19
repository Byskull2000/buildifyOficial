import buildifyLogo from "../assets/Buildify.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Mapa from "../components/Mapa"; 
interface Material {
  name: string;
  price: number;
  quantity: number;
  image: string;
  address: string;
  location: { lat: number; lng: number };
}

interface Seller {
  name: string;
  phone: string;
  image: string;
}

interface Item {
  id: number;
  material: Material;
  seller: Seller;
}

const data: Item[] = [
  {
    id: 1,
    material: {
      name: "Cemento Portland",
      price: 50, 
      quantity: 10,
      image: "https://via.placeholder.com/150",
      address: "Calle Eliodoro Villazon #128, Cochabamba",
      location: { lat: -17.3936, lng: -66.157 }, // Coordenadas de ejemplo
    },
    seller: {
      name: "Juan Pérez",
      phone: "+591 78912345",
      image: "https://via.placeholder.com/150",
    },
  },
];

const OrderPickup: React.FC = () => {
  const [direccion, setDireccion] = useState<string>(data[0].material.address); 
  const [ubicacion] = useState<{ lat: number; lng: number }>(data[0].material.location); // Ubicación estática

 
  const handleDireccionObtenida = (nuevaDireccion: string) => {
    setDireccion(nuevaDireccion);
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
          <div key={item.id} className="mb-8">
            
            <div className="grid grid-cols-2 gap-6 mb-6">
             
              <div className="bg-gray-300 p-6 rounded-lg flex items-start">
                <img
                  src={item.material.image}
                  alt={item.material.name}
                  className="w-48 h-48 object-cover rounded-lg mr-6"
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
                </div>
              </div>

              
              <div className="bg-gray-300 p-6 rounded-lg flex items-start">
                <img
                  src={item.seller.image}
                  alt={item.seller.name}
                  className="w-48 h-48 object-cover rounded-full mr-6"
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

          
            <div className="grid grid-cols-2 gap-6 items-center">
              <div className="bg-gray-300 h-60 rounded-lg overflow-hidden">
                <Mapa
                  // Pasamos la ubicación estática al mapa sin permitir la modificación
                  onUbicacionSeleccionada={() => {}}
                  onDireccionObtenida={handleDireccionObtenida}
                  className="w-full h-full"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-semibold mb-2">Dirección:</label>
                <input
                  type="text"
                  value={direccion}
                  readOnly
                  className="bg-gray-200 p-3 rounded-md"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-8">
          <Link to="/solicitarTipoEntrega" className="bg-gray-400 text-white py-3 px-6 rounded-md text-center hover:bg-gray-500">
            Volver
          </Link>
          <button className="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPickup;  
