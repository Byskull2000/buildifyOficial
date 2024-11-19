import buildifyLogo from "../assets/Buildify.png";
import camionImage from "../assets/Camion .png"; 
import ubicacionImage from "../assets/Ubicacion.png"; 
import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface Material {
    name: string;
    price: number;
    quantity: number;
    image: string;
    address: string;
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
        },
        seller: {
            name: "Juan Pérez",
            phone: "+591 78912345",
            image: "https://via.placeholder.com/150",
        },
    },
];

const OrderPickup: React.FC = () => {
    const navigate = useNavigate();

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


                        <h3 className="text-2xl font-bold mb-4">Métodos de Envío</h3>


                        <div className="grid grid-cols-2 gap-6 items-center">

                            <button
                                onClick={() => navigate("/solicitudRecoger")}
                                className="flex flex-col items-center bg-yellow-500 text-white py-3 px-4 rounded-lg shadow hover:bg-yellow-600"
                            >
                                <img
                                    src={ubicacionImage}
                                    alt="Ubicación"
                                    className="mb-2 w-10 h-10"
                                />
                                Recoger en el lugar
                            </button>


                            <button
                                onClick={() => navigate("/solicitarEntrega")}
                                className="flex flex-col items-center bg-yellow-500 text-white py-3 px-4 rounded-lg shadow hover:bg-yellow-600"
                            >
                                <img
                                    src={camionImage}
                                    alt="Camión"
                                    className="mb-2 w-10 h-10"
                                />
                                Solicitar entrega
                            </button>
                        </div>
                    </div>
                ))}


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
