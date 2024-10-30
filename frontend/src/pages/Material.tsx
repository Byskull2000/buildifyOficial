import { useState, useEffect } from "react";
import Header from "../components/simpleNavBar";
import { useParams } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import material1 from "../assets/material1.png";
import material2 from "../assets/material2.png";
import material3 from "../assets/material3.png";
import material4 from "../assets/material4.png";
import material5 from "../assets/material5.png";
import { MaterialProp } from "../components/Material";
import ListarMateriales from "../components/ListarMateriales";

const Material = () => {
    const { id } = useParams<{ id: string }>();

    // Estado para guardar los datos del material específico
    const [materialData, setMaterialData] = useState<{
        nombre: string;
        medida: string;
        tipoMaterial: string;
        ubicacion: string;
        condicion: string;
        precio: string;
        cantidadDisponible: string;
        descripcion: string;
        unidad: string;
    } | null>(null);

    // Estado para manejar los materiales similares
    const [similares, setSimilares] = useState<MaterialProp[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Cargar datos del material desde el backend
    useEffect(() => {
        const fetchMaterialData = async () => {
            try {
                {console.log('manda')}
                const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
                const response = await fetch(URL_BACKEND + `/api/materiales/${id}`);
                if (!response.ok) {
                    throw new Error("Error al cargar los datos del material");
                }
                {console.log('recibe')}
            
                const data = await response.json();
                {console.log(data.nombre_material)}
                setMaterialData({
                    nombre: data.data.nombre_material,
                    medida: data.data.medida,
                    tipoMaterial: data.data.nombre_tipo_material,
                    ubicacion: data.data.descripcion_direccion_material,
                    condicion: data.data.estado_material,
                    precio: data.data.precio_material,
                    cantidadDisponible: data.data.cantidad_material,
                    descripcion: data.data.descripcion_material,
                    unidad: data.data.tipo_unidad_material
                });
                {console.log('mapeo')}
            } catch (err) {
                setError("Error al cargar los datos del material");
            } finally {
                setLoading(false);
            }
        };
        fetchMaterialData();
    }, [id]);

    // esta lista debe ser reemplazada por la API de recomendados
    useEffect(() => {
        const similares = [
            {
                id_material: 1,
                imagenUrl: material1,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 2,
                imagenUrl: material2,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 3,
                imagenUrl: material3,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 4,
                imagenUrl: material4,
                precio_material: 200,
                nombre_material: "Ladrillos 6 huecos",
            },
            {
                id_material: 5,
                imagenUrl: material5,
                precio_material: 80,
                nombre_material: "Arena lavada",
            },
        ];

        setSimilares(similares);
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>{error}</p>;

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
                                <p className="text-gray-800 text-lg">{materialData?.nombre}</p>
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700">Precio:</label>
                                <p className="text-gray-800 text-lg font-semibold">{materialData?.precio}</p>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-gray-700">Tipo de material:</label>
                                    <p className="text-gray-800 text-lg">{materialData?.tipoMaterial}</p>
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700">Cantidad disponible:</label>
                                    <p className="text-gray-800 text-lg">{materialData?.cantidadDisponible}</p>
                                </div>
                            </div>
                            <div className="grid lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block font-semibold text-gray-700">Medida:</label>
                                    <p className="text-gray-800 text-lg">{materialData?.unidad}</p>
                                </div>
                                <div>
                                    <label className="block font-semibold text-gray-700">Condición:</label>
                                    <p className="text-gray-800 text-lg">{materialData?.condicion}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block font-semibold text-gray-700">Descripcion:</label>
                                <p className="text-gray-800 text-lg">{materialData?.descripcion}</p>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <label className="block font-semibold text-gray-700">Ubicación:</label>
                                    <p className="text-gray-800 text-lg">{materialData?.ubicacion}</p>
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
                <ListarMateriales materiales={similares} />
            </div>
        </div>
    );
};

export default Material;
