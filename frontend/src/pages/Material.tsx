import Header from "../components/simpleNavBar";
import { useParams } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
const Material = () => {
    const { id } = useParams<{ id: string }>();
    // Ejemplo de datos; estos valores deberían venir del backend.
    const materialData = {
        nombre: "Cemento Coboce 50Kg",
        medida: "Paquete",
        tipoMaterial: "Cemento",
        ubicacion: "Avenida América esq Libertador N200",
        condicion: "Nuevo",
        precio: "Bs. 200",
        descripcion: "Cemento de calidad alemana premmiun"
    };

    return (
        <div className="font-nunito min-h-screen bg-gray-50">
            <Header />
            <div className=" mx-auto p-6">
                <p className="text-gray-600">Material ID: {id}</p>
                <h1 className="font-bold text-2xl text-gray-800 mt-4 mb-6">Detalle de la Publicación</h1>

                <div className="lg:grid lg:grid-cols-2 gap-2">
                    {/* Formulario de Detalles del Material */}
                    <div className="">
                        <div className="space-y-6 bg-white rounded-lg shadow-lg p-8 ml-[5%]">
                            <div>
                                <label className="block font-semibold text-gray-700">Nombre del Material:</label>
                                <p className="text-gray-800 text-lg">{materialData.nombre}</p>
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700">Precio:</label>
                                <p className="text-gray-800 text-lg font-semibold">{materialData.precio}</p>
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700">Tipo de material:</label>
                                <p className="text-gray-800 text-lg">{materialData.tipoMaterial}</p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-gray-700">Medida:</label>
                                    <p className="text-gray-800 text-lg">{materialData.medida}</p>
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700">Condición:</label>
                                    <p className="text-gray-800 text-lg">{materialData.condicion}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700">Descripcion:</label>
                                <p className="text-gray-800 text-lg">{materialData.descripcion}</p>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <label className="block font-semibold text-gray-700">Ubicación:</label>
                                    <p className="text-gray-800 text-lg">{materialData.ubicacion}</p>
                                </div>
                                <div
                                    className="ml-2 p-2 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 hover:cursor-pointer transition-colors duration-300"
                                >
                                    <MdLocationOn className="text-xl text-black" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center space-y-4 bg-slate-50 shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mt-4">Galería</h2>
                        {/* ACA LA GALERIA */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="w-full h-32 bg-gray-200 rounded-lg shadow-md"></div>
                            <div className="w-full h-32 bg-gray-200 rounded-lg shadow-md"></div>
                            <div className="w-full h-32 bg-gray-200 rounded-lg shadow-md"></div>
                            <div className="w-full h-32 bg-gray-200 rounded-lg shadow-md"></div>
                        </div>
                    </div>
                </div>

                <h1 className="font-bold text-2xl text-gray-800 mt-4 mb-6">Publicaciones similares:</h1>
                {/* ACA CARGAR SIMILARES */}
            </div>
        </div>
    );
};

export default Material;
